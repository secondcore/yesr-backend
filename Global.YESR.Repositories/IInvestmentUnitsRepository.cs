using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories
{
    public interface IInvestmentUnitsRepository : IGenericRepository<InvestmentUnit>
    {
        InvestmentUnit ProcessByMembership(DateTime transactionDate, Membership membership, Period period, double accAmount, double thresholdValue);
        List<MonthlyDataPoint> RetrieveMonthlyTotalBondAmountsBySponsor(int id);
    }
}
