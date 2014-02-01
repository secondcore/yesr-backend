using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Invoices;

namespace Global.YESR.Repositories
{
    public interface IPayoutEventsRepository : IGenericRepository<PayoutEvent>
    {
        PayoutEvent FindByActive (DateTime transactionDate);
    }
}
