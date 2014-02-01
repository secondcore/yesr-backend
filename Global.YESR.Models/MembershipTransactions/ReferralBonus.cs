using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.MembershipTransactions
{
    /// <summary>
    /// The referral bonus transaction keeps track the bonuses given to a particular membership (as beneficiary) when a purchase is made. 
    /// </summary>
    public class ReferralBonus : MembershipTransaction
    {
        public Membership Beneficiary { get; set; }
        public Purchase Purchase { get; set; }
    }
}
