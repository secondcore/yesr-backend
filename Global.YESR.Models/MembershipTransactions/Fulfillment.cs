using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.MembershipTransactions
{
    public class Fulfillment : MembershipTransaction
    {
        public string Tier { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}
