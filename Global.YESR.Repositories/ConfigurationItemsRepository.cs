using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.Members;

namespace Global.YESR.Repositories
{
    public class ConfigurationItemsRepository : GenericRepository<ConfigurationItem>, IConfigurationItemsRepository
    {
        protected override IQueryable<ConfigurationItem> DefaultSet
        {
            get
            {
                return _Context.ConfigurationItems
                    .Include("User");
            }
        }

        protected override Func<ConfigurationItem, object> DefaultOrderBy
        {
            get
            {
                return x => x.Key;
            }
        }

        public ConfigurationItemsRepository(YContext context)
            : base(context)
        {
        }

        public override ConfigurationItem FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public ConfigurationItem FindByKeyAndValue(string key, string value)
        {
            var query = (from i in DefaultSet
                         where (i.Key == key && i.Value == value)
                         select i).SingleOrDefault();

            return query;
        }
    }
}
