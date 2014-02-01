using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class InvestmentSchemesRepository : GenericRepository<InvestmentScheme>, IInvestmentSchemesRepository
    {
        protected override IQueryable<InvestmentScheme> DefaultSet
        {
            get
            {
                return _Context.InvestmentSchemes;
            }
        }

        protected override Func<InvestmentScheme, object> DefaultOrderBy
        {
            get
            {
                return x => x.Id;
            }
        }

        public InvestmentSchemesRepository(YContext context) : base(context) { }

        public override InvestmentScheme FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
