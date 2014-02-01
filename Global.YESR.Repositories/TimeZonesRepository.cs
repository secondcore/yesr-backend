using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class TimeZonesRepository : GenericRepository<Global.YESR.Models.TimeZone>, ITimeZonesRepository
    {
        protected override IQueryable<Global.YESR.Models.TimeZone> DefaultSet
        {
            get
            {
                return _Context.TimeZones;
            }
        }

        protected override Func<Global.YESR.Models.TimeZone, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public TimeZonesRepository(YContext context)
            : base(context)
        {
        }

        public override Global.YESR.Models.TimeZone FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
