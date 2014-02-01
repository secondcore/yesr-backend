using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public interface IPurchasesRepository : IGenericRepository<Purchase>
    {
        Purchase Purchase(DateTime transactionDate, Membership membership, Merchant merchant, Currency currency, double amount, double[] rates);
        List<MonthlyDataPoint> RetrieveMonthlyAverageSpendsByMerchant(int id);
        List<MonthlyDataPoint> RetrieveMonthlyAverageSpendsByMembership(int id);
        List<MonthlyDataPoint> RetrieveMonthlyAverageSpends();
        List<MonthlyDataPoint> RetrieveMonthlyTotalSpendsByMerchant(int id);
        List<MonthlyDataPoint> RetrieveMonthlyTotalSpendsByMembership(int id);
        List<MonthlyDataPoint> RetrieveMonthlyTotalSpends();
        DoubleDataPoint RetrieveAverageSpend();
    }
}
