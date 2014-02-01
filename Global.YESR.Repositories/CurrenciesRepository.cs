using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class CurrenciesRepository : GenericRepository<Currency>, ICurrenciesRepository
    {
        protected override IQueryable<Currency> DefaultSet
        {
            get
            {
                return _Context.Currencies;
            }
        }

        protected override Func<Currency, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public CurrenciesRepository(YContext context) : base(context) { }

        public override Currency FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
