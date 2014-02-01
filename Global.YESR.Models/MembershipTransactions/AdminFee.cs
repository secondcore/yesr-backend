using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.MembershipTransactions
{
    /// <summary>
    /// The admin fee transaction keeps track the bonuses given to a particular membership when a purchase is made. 
    /// </summary>
    public class AdminFee : MembershipTransaction
    {
        public Purchase Purchase { get; set; }
    }
}
