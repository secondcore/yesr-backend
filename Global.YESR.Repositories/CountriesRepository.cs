using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class CountriesRepository : GenericRepository<Country>, ICountriesRepository
    {
        protected override IQueryable<Country> DefaultSet
        {
            get
            {
                return _Context.Countries
                    .Include("Region")
                    .Include("Currency");
            }
        }

        protected override Func<Country, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public CountriesRepository(YContext context) : base(context) { }

        public override Country FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
