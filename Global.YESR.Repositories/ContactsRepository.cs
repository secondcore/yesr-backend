using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class ContactsRepository : GenericRepository<Contact>, IContactsRepository
    {
        protected override IQueryable<Contact> DefaultSet
        {
            get
            {
                return _Context.Contacts;
            }
        }

        protected override Func<Contact, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public ContactsRepository(YContext context) : base(context) { }

        public override Contact FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
