using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class RegionsRepository : GenericRepository<Region>, IRegionsRepository
    {
        protected override IQueryable<Region> DefaultSet
        {
            get
            {
                return _Context.Regions;
            }
        }

        protected override Func<Region, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public RegionsRepository(YContext context) : base(context) { }

        public override Region FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
