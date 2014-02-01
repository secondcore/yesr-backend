using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Invoices;
using Global.YESR.Models.Members;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Models.Stats;
using Global.YESR.Repositories.MembershipTransactionsRepositories;
using Global.YESR.Repositories.Utilities;

namespace Global.YESR.Repositories
{
    public class MembershipsRepository : GenericRepository<Membership>, IMembershipsRepository
    {
        private IMembersRepository _membersRepository = null;
        private IEnrollmentsRepository _enrollmentsRepository = null;
        private IPurchasesRepository _purchasesRepository = null;
        private ICashBackBonusesRepository _cashBackBonusesRepository = null;
        private IAdminFeesRepository _adminFeesRepository = null;
        private IAccumulationReservesRepository _accumulationReservesRepository = null;
        private IReferralBonusesRepository _referralBonusesRepository = null;
        private IInstancesRepository _instancesRepository = null;
        private IMerchantsRepository _merchantsRepository = null;
        private IInvestmentUnitsRepository _investmentUnitsRepository = null;
        private IPeriodsRepository _periodsRepository = null;
        private ICurrenciesRepository _currenciesRepository = null;

        protected override IQueryable<Membership> DefaultSet
        {
            get
            {
                return _Context.Memberships
                    .Include("Member.PreferredTimeZone")
                    .Include("Parent")
                    .Include("Instance.Country.Currency");
            }
        }

        protected override Func<Membership, object> DefaultOrderBy
        {
            get
            {
                return x => x.MembershipNumber;
            }
        }

        public MembershipsRepository(YContext context, 
                                     IMembersRepository membersRep,
                                     IEnrollmentsRepository enrRep,
                                     IPurchasesRepository purRep,
                                     ICashBackBonusesRepository cbRep,
                                     IAdminFeesRepository afRep,
                                     IAccumulationReservesRepository accResRep,
                                     IReferralBonusesRepository refRep,
                                     IInstancesRepository instRep,
                                     IMerchantsRepository merchRep,
                                     IInvestmentUnitsRepository invUnitRep,
                                     IPeriodsRepository perRep,
                                     ICurrenciesRepository currRep)
            : base(context)
        {
            _membersRepository = membersRep;
            _enrollmentsRepository = enrRep;
            _purchasesRepository = purRep;
            _cashBackBonusesRepository = cbRep;
            _adminFeesRepository = afRep;
            _accumulationReservesRepository = accResRep;
            _referralBonusesRepository = refRep;
            _periodsRepository = perRep;
            _instancesRepository = instRep;
            _merchantsRepository = merchRep;
            _investmentUnitsRepository = invUnitRep;
            _periodsRepository = perRep;
            _currenciesRepository = currRep;
        }


        public override Membership FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public Membership FindByMembershipNumber(string number)
        {
            var query = (from i in DefaultSet
                         where i.MembershipNumber == number
                         select i).SingleOrDefault();

            return query;
        }

        public Membership FindByRandom()
        {
            int max = _Context.Memberships.Count();

            Random rnd = new Random();
            int numberToSkip = rnd.Next(0, max - 1);

            var memberships = (from c in _Context.Memberships
                               where c.MembershipNumber != "9710020000000000"
                               orderby c.Id
                               select c).Skip(numberToSkip).Take(1);

            if (memberships != null)
                return memberships.ToArray()[0];
            else
                return null;
        }

        public Membership FindByTestToken(string token)
        {
            var query = (from i in DefaultSet
                         where i.TestToken == token
                         select i).SingleOrDefault();

            return query;
        }

        public Membership CreateMembership(Models.Dtos.MemberDto memberDto, int parentId, int instanceId, DateTime createDate)
        {
            return CreateMembership(memberDto, parentId, instanceId, createDate, false, "");
        }

        public Membership CreateMembership(Models.Dtos.MemberDto memberDto, int parentId, int instanceId, DateTime createDate, bool test, string token)
        {
            Membership membership = null;
            Member member = null;

            try
            {
                if (token != "")
                {
                    membership = FindByTestToken(token);
                    if (membership != null)
                        throw new Exception("Token [" + token + "] is already taken!!!");
                }

                member = _membersRepository.CreateMember(memberDto);
                if (member == null)
                    throw new Exception("The member could not be created!!");

                Instance instance = _instancesRepository.FindById(instanceId);
                if (instance == null)
                    throw new Exception("Instance [" + instanceId + "] does not exist!!");

                Membership parent = FindById(parentId);

                membership = new Membership();
                membership.CreateDate = createDate;
                membership.Instance = instance;
                membership.LastActivityDate = createDate;
                membership.ModifyDate = createDate;
                //TODO: without setting those two date values, I am getting a datetime2 error
                //TODO: Due to a bug in EF, dates must have values....they cannot be null.
                membership.SuspendedDate = createDate;
                membership.TerminatedDate = createDate;
                membership.IsTerminated = false;
                membership.IsSuspended = false;
                membership.IsTest = test;
                membership.TestToken = token;
                membership.Member = member;
                membership.Instance = instance;
                membership.Parent = parent;
                // Cash the scheme in membership just in case we need to switch it
                membership.InvestmentScheme = instance.InvestmentScheme; 
                membership.MembershipNumber = GenerateMembershipNumber(instance);
                _Context.Memberships.Add(membership);
                _Context.SaveChanges();
                
                CreateRegistrationToken(membership);

                // Create an enrollment transaction
                _enrollmentsRepository.Enroll(membership);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return membership;
        }

        public Purchase Purchase(int membershipId, int merchantId, double amount, string currencyId)
        {
            return Purchase(DateTime.Now, membershipId, merchantId, amount, currencyId);
        }

        public Purchase Purchase(DateTime transactionDate, int membershipId, int merchantId, double amount, string currencyId)
        {
            Purchase purchase = null;

            try
            {
                Membership membership = FindById(membershipId);
                if (membership == null)
                    throw new Exception("Membership [" + membershipId + "] does not exist!!");

                Merchant merchant = _merchantsRepository.FindById(merchantId);
                if (merchant == null)
                    throw new Exception("Merchant [" + merchantId + "] does not exist!!");

                Currency currency = _currenciesRepository.FindById(currencyId);
                if (currency == null)
                    throw new Exception("Currency [" + currencyId + "] does not exist!!");

                Instance instance = membership.Instance;
                double[] rates = GetExchangeRates(currency, instance.Country.Currency, instance.GlobalPivotCurrency);

                //Create a purchase transaction
                purchase = _purchasesRepository.Purchase(transactionDate, membership, merchant, currency, amount, rates);

                //Create a cash back bonus transaction
                _cashBackBonusesRepository.Purchase(purchase);

                //Create an admin fee transaction
                _adminFeesRepository.Purchase(purchase);

                //Create an accumulation reserve transaction
                _accumulationReservesRepository.Purchase(purchase);

                //Create a referral bonus transaction for the parent (if any)
                _referralBonusesRepository.Purchase(purchase);

                //Create a referral bonus transaction for the grand parent (if any)
                _referralBonusesRepository.Purchase(purchase, true);

                // Indicate the membership's last activity date
                membership.LastActivityDate = transactionDate;

                _Context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return purchase;
        }

        public MembershipStats RetrieveMembershipStats(int id)
        {
            MembershipStats stats = new MembershipStats();

            try
            {
                Membership membership = FindById(id);
                if (membership == null)
                    throw new Exception("Membership [" + id + "] does not exist!!");

                stats.Purchases = 20;
                stats.PurchasesAmount = 20000;
                stats.CashBackAmount = 200;
                stats.ReferralBonuses = 41;
                stats.ReferralBonusesAmount = 150;
                stats.CashInWallet = 120;
                stats.NeededCashForNextBond = 80;
                stats.Bonds = 30;
                stats.NeededBondsForNextDividend = 23;
                stats.Dividends = 1100;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return stats;
        }

        public void CreateRegistrationToken(int id)
        {
            Membership membership = FindById(id);
            if (membership != null)
            {
                CreateRegistrationToken(membership);
                // TODO: Send an email to the member letting him know that the registration token changed
            }
        }

        public Membership IsRegistrationTokenValid(string token)
        {
            var lastToken = (from i in _Context.MembershipRegistrationTokens
                             orderby i.CreateDate descending
                             select i).FirstOrDefault();

            if (lastToken != null && lastToken.Token == token)
                return lastToken.Membership;
            else
                return null;
        }

        public List<Membership> RetrieveChildMemberships(int id)
        {
            return (from c in _Context.Memberships
                               where c.Parent.Id == id
                               orderby c.Id
                               select c).ToList();
        }

        public List<MonthlyIntegerDataPoint> RetrieveMonthlyEnrollmentsByMerchant(int id)
        {
            return _Context.Database.SqlQuery<MonthlyIntegerDataPoint>(
                " SELECT " + 
                " YEAR(m.CreateDate) as Year,  " + 
                " MONTH(m.CreateDate) as Month,  " + 
                " Count(*) as Value0 " + 
                " FROM Memberships m  " +  
                " WHERE m.ParentId IN (select m2.Id from Members m1, Memberships m2 where m1.MemberTypeId = 'Merchant' and m1.MerchantId = " + id + " and m2.MemberId = m1.Id)  " + 
                " GROUP BY YEAR(m.CreateDate), MONTH(m.CreateDate) " +
                " ORDER BY YEAR(m.CreateDate), MONTH(m.CreateDate)  "
                    ).ToList();
        }

        public List<MonthlyDataPoint> RetrieveMonthlyCashDiscountVsReferralBonusByMerchant(int id)
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
            " SELECT t1.Year, t1.Month, " + 
            " t1.CashBackAmount as Value0,  " +
            " isnull(t2.ReferralBonusAmount, 0) as Value1  " +
            " FROM " +
            " ( " +
            " select YEAR(p.TransactionDate) as Year, MONTH(p.TransactionDate) as Month,  " +
            " sum(cb.Amount) as CashBackAmount " +
            " from Memberships m, MembershipTransactions p, MembershipTransactions cb  " +
            " where p.Discriminator = 'Purchase' " +
            " and p.MembershipId = m.id " +
            " and p.MerchantId = " + id + 
            " and cb.Discriminator = 'CashBackBonus' " +
            " and cb.CashBackBonusPurchaseId = p.Id " +
            " group by YEAR(p.TransactionDate), MONTH(p.TransactionDate) " +
            " ) t1 " +
            " LEFT OUTER JOIN " +
            " ( " +
            " select YEAR(rb.TransactionDate) as Year, MONTH(rb.TransactionDate) as Month, " + 
            " sum(rb.Amount) as ReferralBonusAmount " +
            " from Memberships m, MembershipTransactions rb " +
            " where rb.Discriminator = 'ReferralBonus' " +
            " and rb.BeneficiaryId = m.Id " +
            " and m.Id = (select m2.Id from Members m1, Memberships m2 where m1.MemberTypeId = 'Merchant' and m1.MerchantId = " + id + " and m2.MemberId = m1.Id) " +
            " group by YEAR(rb.TransactionDate), MONTH(rb.TransactionDate) " +
            " ) t2 " +
            " ON t1.Year = t2.year and t1.Month = t2.Month " +
            " order by t1.Year, t1.Month "
            ).ToList();
        }

        /* P R I V A T E  M E T H O D S */

        private void CreateRegistrationToken(Membership membership)
        {
            MembershipRegistrationToken token = new MembershipRegistrationToken();
            token.CreateDate = DateTime.Now;
            token.Membership = membership;
            token.Token = membership.Id + "-" + Utils.GenerateRandomNumber(8);
            _Context.MembershipRegistrationTokens.Add(token);
            _Context.SaveChanges();
        }

        private string GenerateMembershipNumber(Instance instance)
        {
            int currentCounter = instance.CurrentMembershipCounter;
            string cardNumber = instance.CardNumberPrefix + Utils.PadString("" + currentCounter, instance.CardNumberSuffixLength);

            // Increment the instance current membership counter
            //TODO: We must guard against multiple threads changing the counter!!!
            instance.CurrentMembershipCounter = instance.CurrentMembershipCounter + 1;

            try
            {
                // Save the instance
                _Context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("GenerateMembershipNumber failed: " + e.Message);
            }

            return cardNumber;
        }

        private double [] GetExchangeRates(Currency transactionCurrency, Currency instanceCurrency, Currency GlobalCurrency)
        {
            double[] rates = new double[2];

            if (transactionCurrency.Id == instanceCurrency.Id)
                rates[0] = 1.00;
            else
            {
                if (transactionCurrency.Rate != 0)
                    rates[0] = (instanceCurrency.Rate * 1) / transactionCurrency.Rate;
                else
                    rates[0] = 0;
            }

            if (transactionCurrency.Id == GlobalCurrency.Id)
                rates[1] = 1.00;
            else
            {
                if (transactionCurrency.Rate != 0)
                    rates[1] = (GlobalCurrency.Rate * 1) / transactionCurrency.Rate;
                else
                    rates[1] = 0;
            }

            return rates;
        }
    }
}
