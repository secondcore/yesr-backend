using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class MemberTypesRepository : GenericRepository<MemberType>, IMemberTypesRepository
    {
        protected override IQueryable<MemberType> DefaultSet
        {
            get
            {
                return _Context.MemberTypes;
            }
        }

        protected override Func<MemberType, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public MemberTypesRepository(YContext context) : base(context) { }

        public override MemberType FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
