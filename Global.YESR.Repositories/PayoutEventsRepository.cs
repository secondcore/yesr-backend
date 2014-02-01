using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Invoices;

namespace Global.YESR.Repositories
{
    public class PayoutEventsRepository : GenericRepository<PayoutEvent>, IPayoutEventsRepository
    {
        protected override IQueryable<PayoutEvent> DefaultSet
        {
            get
            {
                return _Context.PayoutEvents;
            }
        }

        protected override Func<PayoutEvent, object> DefaultOrderBy
        {
            get
            {
                return x => x.CreateDate;
            }
        }

        public PayoutEventsRepository(YContext context) : base(context) { }

        public override PayoutEvent FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        // There should be only once in the system at any given time
        public PayoutEvent FindByActive(DateTime transactionDate)
        {
            var payoutevent = (from c in _Context.PayoutEvents
                               where c.IsPaid == false
                               select c).SingleOrDefault();

            if (payoutevent == null)
            {
                //TODO: Due to a bug in EF, dates must have values....they cannot be null.
                payoutevent = new PayoutEvent() { CreateDate = DateTime.Now, IsPaid = false, PayDate = transactionDate };
                _Context.PayoutEvents.Add(payoutevent);
            }

            return payoutevent;
        }
    }
}
