using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.MembershipTransactions
{
    /// <summary>
    /// The accumulation reserve transaction keeps track of the funds given to a particular membership when a purchase is made.
    /// </summary>
    public class AccumulationReserve : MembershipTransaction
    {
        public double WalletAmount { get; set; }
        public Purchase Purchase { get; set; }
        public InvestmentUnit InvestmentUnit { get; set; }
    }
}
