using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.Members;

namespace Global.YESR.Repositories
{
    public class UsersRepository : GenericRepository<User>, IUsersRepository
    {
        protected override IQueryable<User> DefaultSet
        {
            get
            {
                return _Context.Users
                    .Include("Roles")
                    .Include("ConfigurationItems")
                    .Include("Group");
            }
        }

        protected override Func<User, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public UsersRepository(YContext context)
            : base(context)
        {
        }

        public override User FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public User FindByLogin(string login)
        {
            var query = (from i in DefaultSet
                         where (i.Login == login)
                         select i).SingleOrDefault();

            return query;
        }
    }
}
