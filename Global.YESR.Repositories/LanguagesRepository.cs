using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class LanguagesRepository : GenericRepository<Language>, ILanguagesRepository
    {
        protected override IQueryable<Language> DefaultSet
        {
            get
            {
                return _Context.Languages;
            }
        }

        protected override Func<Language, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public LanguagesRepository(YContext context) : base(context) { }

        public override Language FindById(string id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }
    }
}
