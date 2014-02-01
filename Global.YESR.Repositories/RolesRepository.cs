using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.Members;

namespace Global.YESR.Repositories
{
    public class RolesRepository : GenericRepository<Role>, IRolesRepository
    {
        protected override IQueryable<Role> DefaultSet
        {
            get
            {
                return _Context.Roles
                    .Include("Users");
            }
        }

        protected override Func<Role, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public RolesRepository(YContext context)
            : base(context)
        {
        }

        public override Role FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public Role FindByName(string name)
        {
            var query = (from i in DefaultSet
                         where (i.Name == name)
                         select i).SingleOrDefault();

            return query;
        }
    }
}
