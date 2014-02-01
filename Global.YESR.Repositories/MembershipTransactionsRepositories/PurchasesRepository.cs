using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public class PurchasesRepository : GenericRepository<Purchase>, IPurchasesRepository
    {
        private IPeriodsRepository _periodsRepository = null;
        private IInvoicesRepository _invoicesRepository = null;

        protected override IQueryable<Purchase> DefaultSet
        {
            get
            {
                return _Context.MembershipTransactions.Include("Period").Include("Membership").Include("Currency").Include("Merchant").OfType<Purchase>();
            }
        }

        protected override Func<Purchase, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public PurchasesRepository(YContext context, IPeriodsRepository perRep, IInvoicesRepository invRep) : base(context)
        {
            _periodsRepository = perRep;
            _invoicesRepository = invRep;
        }

        public Purchase Purchase(DateTime transactionDate, Membership membership, Merchant merchant, Currency currency, double amount, double[] rates)
        {
            DateTime purchaseDate = transactionDate.AddHours(membership.Member.PreferredTimeZone.Id);
            Period period = _periodsRepository.FindByDate(transactionDate);
            Member member = membership.Member;
            Instance instance = membership.Instance;

            Purchase purchase = new Purchase();
            purchase.TransactionDate = purchaseDate;
            purchase.Period = period;
            purchase.Merchant = merchant;
            purchase.Amount = amount;
            purchase.ExchangeRate = rates[0];
            purchase.GlobalExchangeRate = rates[1];
            purchase.Membership = membership;
            purchase.Currency = currency;
            purchase.CashBackPercentage = merchant.CashBackDiscount;
            purchase.AdminFeePercentage = instance.AdminFeePercentage;
            purchase.ReferralPercentage = instance.DirectReferralBonusPercentage;
            purchase.IndirectReferralPercentage = instance.IndirectReferralBonusPercentage;
            purchase.AccumulationPercentage = merchant.TotalDiscount - purchase.AdminFeePercentage - purchase.ReferralPercentage - purchase.IndirectReferralPercentage;
            purchase.Invoice = _invoicesRepository.FindByMerchant(transactionDate, merchant);
            _Context.MembershipTransactions.Add(purchase);
            _Context.SaveChanges();

            // TODO: Determine if the invoice needs to go out. 
            // Perhaps we can base this on the date or the first of the month. 
            // Or this can be an external scheduler that cuts the invoice and creates a new one
            // The invoice amount is the sum of all invoiced purchases's:
            // 1. Admin Fee Percentage 
            // 2. Direct and Indirect Referral Percentage
            // 3. Accumulation Reserve Percentage

            return purchase;
        }

        public List<MonthlyDataPoint> RetrieveMonthlyAverageSpendsByMerchant(int id)
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT " +
                " YEAR(p.TransactionDate) as Year, " +
                " MONTH(p.TransactionDate) as Month, " +
                " AVG(p.Amount) as Value0, " +
                " AVG(ar.Amount) as Value1, " +
                " AVG(rb.Amount) as Value2, " +
                " AVG(cb.Amount) as Value3 " +
                " FROM Memberships m, MembershipTransactions p, MembershipTransactions ar, MembershipTransactions rb, MembershipTransactions cb  " +
                " WHERE p.Discriminator = 'Purchase' " +
                " AND p.MembershipId = m.id " +
                " AND p.MerchantId = " + id +
                " AND ar.Discriminator = 'AccumulationReserve' " +
                " AND ar.AccumulationReservePurchaseId = p.Id " +
                " AND rb.Discriminator = 'ReferralBonus' " +
                " AND rb.ReferralBonusPurchaseId = p.Id " +
                " AND cb.Discriminator = 'CashBackBonus' " +
                " AND cb.CashBackBonusPurchaseId = p.Id " +
                " GROUP BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) " +
                " ORDER BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) "
                ).ToList();
        }

        public List<MonthlyDataPoint> RetrieveMonthlyAverageSpendsByMembership(int id)
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT " +
                " YEAR(p.TransactionDate) as Year, " +
                " MONTH(p.TransactionDate) as Month, " +
                " AVG(p.Amount) as Value0, " +
                " AVG(ar.Amount) as Value1, " +
                " AVG(rb.Amount) as Value2, " +
                " AVG(cb.Amount) as Value3 " +
                " FROM Memberships m, MembershipTransactions p, MembershipTransactions ar, MembershipTransactions rb, MembershipTransactions cb  " +
                " WHERE p.Discriminator = 'Purchase' " +
                " AND p.MembershipId = m.id " +
                " AND p.MembershipId = " + id +
                " AND ar.Discriminator = 'AccumulationReserve' " +
                " AND ar.AccumulationReservePurchaseId = p.Id " +
                " AND rb.Discriminator = 'ReferralBonus' " +
                " AND rb.ReferralBonusPurchaseId = p.Id " +
                " AND cb.Discriminator = 'CashBackBonus' " +
                " AND cb.CashBackBonusPurchaseId = p.Id " +
                " GROUP BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) " +
                " ORDER BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) "
                ).ToList();
        }

        public List<MonthlyDataPoint> RetrieveMonthlyAverageSpends()
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT " +
                " YEAR(p.TransactionDate) as Year, " +
                " MONTH(p.TransactionDate) as Month, " +
                " AVG(p.Amount) as Value0, " +
                " AVG(ar.Amount) as Value1, " +
                " AVG(rb.Amount) as Value2, " +
                " AVG(cb.Amount) as Value3 " +
                " FROM Memberships m, MembershipTransactions p, MembershipTransactions ar, MembershipTransactions rb, MembershipTransactions cb  " +
                " WHERE p.Discriminator = 'Purchase' " +
                " AND p.MembershipId = m.id " +
                " AND ar.Discriminator = 'AccumulationReserve' " +
                " AND ar.AccumulationReservePurchaseId = p.Id " +
                " AND rb.Discriminator = 'ReferralBonus' " +
                " AND rb.ReferralBonusPurchaseId = p.Id " +
                " AND cb.Discriminator = 'CashBackBonus' " +
                " AND cb.CashBackBonusPurchaseId = p.Id " +
                " GROUP BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) " +
                " ORDER BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) "
                ).ToList();
        }

        public List<MonthlyDataPoint> RetrieveMonthlyTotalSpendsByMerchant(int id)
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT " +
                " YEAR(p.TransactionDate) as Year, " +
                " MONTH(p.TransactionDate) as Month, " +
                " SUM(p.Amount) as Value0, " +
                " SUM(ar.Amount) as Value1, " +
                " SUM(rb.Amount) as Value2, " +
                " AVG(cb.Amount) as Value3 " +
                " FROM Memberships m, MembershipTransactions p, MembershipTransactions ar, MembershipTransactions rb, MembershipTransactions cb  " +
                " WHERE p.Discriminator = 'Purchase' " +
                " AND p.MembershipId = m.id " +
                " AND p.MerchantId = " + id +
                " AND ar.Discriminator = 'AccumulationReserve' " +
                " AND ar.AccumulationReservePurchaseId = p.Id " +
                " AND rb.Discriminator = 'ReferralBonus' " +
                " AND rb.ReferralBonusPurchaseId = p.Id " +
                " AND cb.Discriminator = 'CashBackBonus' " +
                " AND cb.CashBackBonusPurchaseId = p.Id " +
                " GROUP BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) " +
                " ORDER BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) "
                ).ToList();
        }

        public List<MonthlyDataPoint> RetrieveMonthlyTotalSpendsByMembership(int id)
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT " +
                " YEAR(p.TransactionDate) as Year, " +
                " MONTH(p.TransactionDate) as Month, " +
                " SUM(p.Amount) as Value0, " +
                " SUM(ar.Amount) as Value1, " +
                " SUM(rb.Amount) as Value2, " +
                " AVG(cb.Amount) as Value3 " +
                " FROM Memberships m, MembershipTransactions p, MembershipTransactions ar, MembershipTransactions rb, MembershipTransactions cb  " +
                " WHERE p.Discriminator = 'Purchase' " +
                " AND p.MembershipId = m.id " +
                " AND p.MembershipId = " + id + 
                " AND ar.Discriminator = 'AccumulationReserve' " +
                " AND ar.AccumulationReservePurchaseId = p.Id " +
                " AND rb.Discriminator = 'ReferralBonus' " +
                " AND rb.ReferralBonusPurchaseId = p.Id " +
                " AND cb.Discriminator = 'CashBackBonus' " +
                " AND cb.CashBackBonusPurchaseId = p.Id " +
                " GROUP BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) " +
                " ORDER BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) "
                ).ToList();
        }

        public List<MonthlyDataPoint> RetrieveMonthlyTotalSpends()
        {
            return _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT " +
                " YEAR(p.TransactionDate) as Year, " +
                " MONTH(p.TransactionDate) as Month, " +
                " SUM(p.Amount) as Value0, " +
                " SUM(ar.Amount) as Value1, " +
                " SUM(rb.Amount) as Value2, " +
                " AVG(cb.Amount) as Value3 " +
                " FROM Memberships m, MembershipTransactions p, MembershipTransactions ar, MembershipTransactions rb, MembershipTransactions cb  " +
                " WHERE p.Discriminator = 'Purchase' " +
                " AND p.MembershipId = m.id " +
                " AND ar.Discriminator = 'AccumulationReserve' " +
                " AND ar.AccumulationReservePurchaseId = p.Id " +
                " AND rb.Discriminator = 'ReferralBonus' " +
                " AND rb.ReferralBonusPurchaseId = p.Id " +
                " AND cb.Discriminator = 'CashBackBonus' " +
                " AND cb.CashBackBonusPurchaseId = p.Id " +
                " GROUP BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) " +
                " ORDER BY YEAR(p.TransactionDate), MONTH(p.TransactionDate) "
                ).ToList();
        }

        public DoubleDataPoint RetrieveAverageSpend()
        {
            return _Context.Database.SqlQuery<DoubleDataPoint>(
                    " SELECT avg(p.Amount) as Value " + 
                    " FROM MembershipTransactions p, Memberships m " + 
                    " WHERE p.MembershipId = m.Id " + 
                    " AND p.Discriminator = 'Purchase' "
                    ).FirstOrDefault();
        }
    }
}
