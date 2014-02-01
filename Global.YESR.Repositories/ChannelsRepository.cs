using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class ChannelsRepository : GenericRepository<Channel>, IChannelsRepository
    {
        protected override IQueryable<Channel> DefaultSet
        {
            get
            {
                return _Context.Channels;
            }
        }

        protected override Func<Channel, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public ChannelsRepository(YContext context) : base(context) { }

        public override Channel FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
