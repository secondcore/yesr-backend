using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.InvestmentUnitTransactions;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Repositories.MembershipTransactionsRepositories;

namespace Global.YESR.Repositories.InvestmentUnitTransactionsRepositories
{
    public class DividendBonusesRepository : GenericRepository<DividendBonus>, IDividendBonusesRepository
    {
        protected override IQueryable<DividendBonus> DefaultSet
        {
            get
            {
                return _Context.InvestmentUnitTransactions.Include("Period").Include("InvestmentUnit.Membership").Include("InvestmentUnit.Sponsor").Include("InvestmentUnit.InvestmentScheme").OfType<DividendBonus>();
            }
        }

        protected override Func<DividendBonus, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public DividendBonusesRepository(YContext context)
            : base(context)
        {
        }
    }
}
