using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.InvestmentUnitTransactions;
using Global.YESR.Models.Invoices;
using Global.YESR.Models.Stats;
using Global.YESR.Repositories.Utilities;

namespace Global.YESR.Repositories
{
    public class InvestmentUnitsRepository : GenericRepository<InvestmentUnit>, IInvestmentUnitsRepository
    {
        private ISponsorsRepository _sponsorsRepository = null;
        private IInvoicesRepository _invoicesRepository = null;
        private IPayoutEventsRepository _payoutEventsRepository = null;

        protected override IQueryable<InvestmentUnit> DefaultSet
        {
            get
            {
                return _Context.InvestmentUnits
                    .Include("Membership")
                    //.Include("Membership.Member")
                    .Include("Sponsor")
                    .Include("InvestmentScheme")
                    .Include("SponsorInvoice")
                    .Include("PayoutEvent")
                    .Include("Parent")
                    .Include("LeftChild")
                    .Include("RightChild");
            }
        }

        protected override Func<InvestmentUnit, object> DefaultOrderBy
        {
            get
            {
                return x => x.CreateDate;
            }
        }

        public InvestmentUnitsRepository(YContext context, ISponsorsRepository spnRep, IInvoicesRepository invRep, IPayoutEventsRepository peRep)
            : base(context)
        {
            _sponsorsRepository = spnRep;
            _invoicesRepository = invRep;
            _payoutEventsRepository = peRep;
        }

        public override InvestmentUnit FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public InvestmentUnit ProcessByMembership(DateTime transactionDate, Membership membership, Period period, double accAmount, double thresholdValue)
        {
            InvestmentUnit invUnit = FindByMembership(transactionDate, membership, accAmount);
            double leftOver = invUnit.Amount - thresholdValue;
            if (leftOver >= 0)
            {
                string sponsorReferenceNumber = _sponsorsRepository.Purchase(transactionDate, membership, period);
                invUnit.Period = period;
                invUnit.PurchaseDate = transactionDate;
                invUnit.IsPurchased = true;
                invUnit.PayoutEvent = _payoutEventsRepository.FindByActive(transactionDate);
                invUnit.SponsorReference = sponsorReferenceNumber;
                invUnit.Amount = thresholdValue;

                //Create a new investment unit with the amount being the left over (to seed the newly created unit)
                AddByMembership(transactionDate, membership, leftOver);
            }

            _Context.SaveChanges();

            // Determine the dividends if any (but after we have indicayted that the Investment Unit is purchased!!)
            if (invUnit.Period != null)
                ManageDividend(transactionDate,  invUnit);

            return invUnit;
        }

        public List<MonthlyDataPoint> RetrieveMonthlyTotalBondAmountsBySponsor(int id)
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT Year(iu.PurchaseDate) as Year, Month(iu.PurchaseDate) as Month, " +
                " SUM (Amount) as Value0 " + 
                " FROM InvestmentUnits iu " + 
                " WHERE iu.SponsorReference <> '' " + 
                " AND iu.SponsorId = " + id + 
                " GROUP BY Year(iu.PurchaseDate), Month(iu.PurchaseDate) " +
                " ORDER BY Year(iu.PurchaseDate), Month(iu.PurchaseDate) "
                ).ToList();
        }

        /* P R I V A T E  M E T H O D S */
        private InvestmentUnit FindByMembership(DateTime transactionDate, Membership membership, double accAmount)
        {
            var currentInvestmentUnit = (from i in DefaultSet
                                         where (i.Membership.Id == membership.Id && i.SponsorReference == "" && i.Period == null)
                                         orderby i.Id descending
                                         select i).FirstOrDefault();

            if (currentInvestmentUnit == null)
                currentInvestmentUnit = AddByMembership(transactionDate, membership, accAmount);
            else
                currentInvestmentUnit.Amount += accAmount;

            return currentInvestmentUnit;
        }

        private InvestmentUnit AddByMembership(DateTime transactionDate, Membership membership, double initialAmount)
        {
            _Context.Entry(membership.Instance).Reference(x => x.Sponsor).Load();
            _Context.Entry(membership).Reference(x => x.InvestmentScheme).Load();
            var currentSponsorInvoice = (SponsorInvoice)null;
            if (!membership.Instance.Sponsor.IsSponsorPayMember && !membership.IsTest)
                currentSponsorInvoice  = _invoicesRepository.FindBySponsor(transactionDate, membership.Instance.Sponsor);
            var currentInvestmentUnit = new InvestmentUnit();
            currentInvestmentUnit.Amount = initialAmount;
            currentInvestmentUnit.CreateDate = transactionDate;
            currentInvestmentUnit.PurchaseDate = currentInvestmentUnit.CreateDate; // TODO: Due to a bug in EF
            currentInvestmentUnit.IsPurchased = false; 
            currentInvestmentUnit.Membership = membership;
            currentInvestmentUnit.InvestmentScheme = membership.InvestmentScheme;
            currentInvestmentUnit.Sponsor = membership.Instance.Sponsor;
            currentInvestmentUnit.SponsorReference = "";
            currentInvestmentUnit.SponsorInvoice = currentSponsorInvoice;
            _Context.InvestmentUnits.Add(currentInvestmentUnit);
            _Context.SaveChanges();

            return currentInvestmentUnit;
        }

        /// <summary>
        /// I opted to create dividend bonuses as I go alog instead of a scheduler. 
        /// 
        /// </summary>
        /// <param name="transactionDate"></param>
        /// <param name="invUnit"></param>
        private void  ManageDividend(DateTime transactionDate, InvestmentUnit invUnit)
        {
            if (invUnit.Period == null)
                throw new Exception("NULL Period in invUnit");

            // Get the latest dividend bonus transaction
            var latestDividend = _Context.Database.SqlQuery<DividendIdentifier>(
                " SELECT TOP 1 iut.Id, iut.TransactionDate " +
                " FROM InvestmentUnitTransactions iut, InvestmentUnits ius, Memberships m" +
                " WHERE iut.InvestmentUnitId = ius.Id " +
                " AND ius.MembershipId = m.Id " +
                " AND ius.MembershipId = " + invUnit.Membership.Id +
                " ORDER BY iut.TransactionDate DESC "
                ).FirstOrDefault();


            DateTime mostRecentDividendDate = DateTime.Now;
            if (latestDividend == null)
                mostRecentDividendDate = mostRecentDividendDate.AddYears(-30);
            else
                mostRecentDividendDate = latestDividend.TransactionDate;

            // Make sure we load the membership member
            _Context.Entry(invUnit.Membership).Reference(x => x.Member).Load();

            // Construct the SQL statments

            var allSql =" select count(*) as count  " +
                        " from InvestmentUnits iu, PayoutEvents ev, Memberships mems " +
                        " where iu.PayoutEventId is not null " +
                        " and iu.PayoutEventId = ev.Id " +
                        " and ev.IsPaid = 0 " +
                        " and iu.SponsorReference <> '' " +
                        " and iu.MembershipId = mems.id " +
                        " and mems.Id <= " + invUnit.Membership.Id +
                        " and iu.PurchaseDate > '" + mostRecentDividendDate.ToString("yyyy-MM-dd") + "'";

            var ownSql = " select count(*) as count " +
                         " from InvestmentUnits iu, PayoutEvents ev, Memberships mems " +
                         " where iu.PayoutEventId is not null " +
                         " and iu.PayoutEventId = ev.Id " +
                         " and ev.IsPaid = 0 " +
                         " and iu.SponsorReference <> '' " +
                         " and iu.MembershipId = mems.id " +
                         " and mems.Id  = " + invUnit.Membership.Id +
                         " and iu.PurchaseDate > '" + mostRecentDividendDate.ToString("yyyy-MM-dd") + "'";

            var childrenSql = " select count(*) as count  " +
                            " from InvestmentUnits iu, PayoutEvents ev, Memberships mems " +
                            " where iu.PayoutEventId is not null " +
                            " and iu.PayoutEventId = ev.Id " +
                            " and ev.IsPaid = 0 " +
                            " and iu.SponsorReference <> '' " +
                            " and iu.MembershipId = mems.id " +
                            " and mems.Id IN (SELECT Id From Memberships WHERE ParentId = " + invUnit.Membership.Id + ") " +
                            " and iu.PurchaseDate > '" + mostRecentDividendDate.ToString("yyyy-MM-dd") + "'";

            var grandChildrenSql = " select count(*) as count  " +
                                   " from InvestmentUnits iu, PayoutEvents ev, Memberships mems " +
                                   " where iu.PayoutEventId is not null " +
                                   " and iu.PayoutEventId = ev.Id " +
                                   " and ev.IsPaid = 0 " +
                                   " and iu.SponsorReference <> '' " +
                                   " and iu.MembershipId = mems.id " +
                                   " and mems.Id IN (SELECT Id From Memberships WHERE ParentId IN (SELECT Id From Memberships WHERE ParentId = " +
                                   invUnit.Membership.Id + ")) " +
                                   " and iu.PurchaseDate > '" + mostRecentDividendDate.ToString("yyyy-MM-dd") + "'";

            // Count the number of purchased IUs for this membership since the last dividend bonus transaction 
            var allPurchasedIus = _Context.Database.SqlQuery<DividendCounter>(allSql).FirstOrDefault();

            // Count the number of purchased IUs for this membership since the last dividend bonus transaction 
            var thisMembershipPurchasedIus = _Context.Database.SqlQuery<DividendCounter>(ownSql).FirstOrDefault();
            
            // count the number of IUs for this membership's member's children since the last dividend bonus transaction 
            var thisMembershipChildrenPurchasedIus =
                _Context.Database.SqlQuery<DividendCounter>(childrenSql).FirstOrDefault();

            // count the number of IUs for this membership's member's grand children since the last dividend bonus transaction 
            var thisMembershipGrandChildrenPurchasedIus =
                _Context.Database.SqlQuery<DividendCounter>(grandChildrenSql).FirstOrDefault();

            // If the total IUs equals of exceeds the scheme's dividend trigger, create a dividend transaction
            // MKA - 14 July 2012 - Based on a meeting with Hisham and Abed - please refer to the InvestmentScheme
            //var totalCount =
            //    ((thisMembershipPurchasedIus != null) ? thisMembershipPurchasedIus.Count : 0) +
            //    ((thisMembershipChildrenPurchasedIus != null) ? thisMembershipChildrenPurchasedIus.Count : 0) +
            //    ((thisMembershipGrandChildrenPurchasedIus != null) ? thisMembershipGrandChildrenPurchasedIus.Count : 0);
            var allCount = ((allPurchasedIus != null) ? allPurchasedIus.Count : 0);
            var ownCount = ((thisMembershipPurchasedIus != null) ? thisMembershipPurchasedIus.Count : 0);
            var childrenCount = ((thisMembershipChildrenPurchasedIus != null) ? thisMembershipChildrenPurchasedIus.Count : 0);
            var grandChildrenCount = ((thisMembershipGrandChildrenPurchasedIus != null) ? thisMembershipGrandChildrenPurchasedIus.Count : 0);
            var othersCount = allCount - (ownCount + childrenCount + grandChildrenCount);

            // Compute the dividend:
            // This member's IUs * 50 DHS + Children members' IUs * 25 + Grand children members' IUs * 12.5
            // The actual dividend coefficients (i.e. 50, 25 and 12.50) are configurable in the scheme!!!
            double dividentAmount = 0;
            if (allCount >= invUnit.InvestmentScheme.DividendTrigger)
            {
                var ownAmount = ownCount * invUnit.InvestmentScheme.OwnDividendCoefficient;
                var childrenAmount = childrenCount * invUnit.InvestmentScheme.ChildrenDividendCoefficient;
                var gChildrenAmount = grandChildrenCount * invUnit.InvestmentScheme.GrandChildrenDividendCoefficient;
                var othersAmount = othersCount * invUnit.InvestmentScheme.OthersDividendCoefficient;

                _Context.Entry(invUnit.Membership).Reference(x => x.Instance).Load();
                _Context.Entry(invUnit.Membership.Instance).Reference(x => x.Country).Load();
                _Context.Entry(invUnit.Membership.Instance.Country).Reference(x => x.Currency).Load();

                //TODO - perhaps invoke the DividendBonuesRepository instead
                // Insert the dividend transaction
                DividendBonus bonus = new DividendBonus();
                bonus.TransactionDate = transactionDate;
                bonus.Period = invUnit.Period;
                bonus.InvestmentUnit = invUnit;
                bonus.Amount = ownAmount + childrenAmount + gChildrenAmount;
                bonus.OwnAmount = ownAmount;
                bonus.ChildrenAmount = childrenAmount;
                bonus.GrandChildrenAmount = gChildrenAmount;
                bonus.ExchangeRate = 1;
                bonus.GlobalExchangeRate = GetExchangeRates(invUnit.Membership.Instance.Country.Currency,
                                                            invUnit.Membership.Instance.GlobalPivotCurrency);
                _Context.InvestmentUnitTransactions.Add(bonus);

                // Now if the sponsor is to pay the member, invoice them for this inv unit
                if (invUnit.Sponsor.IsSponsorPayMember &&  !invUnit.Membership.IsTest)
                {
                    // Insert the managemenmt fee transaction (applicable only of the sponsor is configurd to pay the member)
                    ManagementFee fee = new ManagementFee();
                    fee.TransactionDate = transactionDate;
                    fee.Period = invUnit.Period;
                    fee.InvestmentUnit = invUnit;
                    // Calculate the management fee i.e a percentage of the dividend bonus
                    fee.Amount = bonus.Amount*((invUnit.Sponsor.ManagementFeePercentage)/100);
                    fee.ExchangeRate = 1;
                    fee.GlobalExchangeRate = GetExchangeRates(invUnit.Membership.Instance.Country.Currency,
                                                                invUnit.Membership.Instance.GlobalPivotCurrency);
                    _Context.InvestmentUnitTransactions.Add(fee);

                    var invoiceAmount = bonus.Amount + fee.Amount;
                    _invoicesRepository.FindBySponsor(transactionDate, invUnit, invUnit.Sponsor, invUnit.Period, invUnit.Sponsor.InvoiceNumber, invoiceAmount, 0);
                    invUnit.Sponsor.CurrentInvoiceCounter++;
                }

                _Context.SaveChanges();
            }
        }

        private double GetExchangeRates(Currency transactionCurrency, Currency GlobalCurrency)
        {
            if (transactionCurrency.Id == GlobalCurrency.Id)
                return 1.00;
            else
            {
                if (transactionCurrency.Rate != 0)
                    return (GlobalCurrency.Rate * 1) / transactionCurrency.Rate;
                else
                    return 0;
            }
        }
    }

    class DividendIdentifier
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
    }

    class DividendCounter
    {
        public int Count { get; set; }
    }
}
