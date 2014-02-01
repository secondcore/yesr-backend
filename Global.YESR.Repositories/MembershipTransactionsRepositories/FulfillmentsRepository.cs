using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public class FulfillmentsRepository : GenericRepository<Fulfillment>, IFulfillmentsRepository
    {
        protected override IQueryable<Fulfillment> DefaultSet
        {
            get
            {
                return _Context.MembershipTransactions.Include("Period").Include("Membership").Include("Currency").OfType<Fulfillment>();
            }
        }

        protected override Func<Fulfillment, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public FulfillmentsRepository(YContext context) : base(context) { }
    }
}
