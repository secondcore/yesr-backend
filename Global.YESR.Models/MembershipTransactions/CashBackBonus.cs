using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.MembershipTransactions
{
    /// <summary>
    /// The cash back bonus transaction keeps track the bonuses given to a particular membership when a purchase is made. 
    /// </summary>
    public class CashBackBonus : MembershipTransaction
    {
        public Purchase Purchase { get; set; }
    }
}
