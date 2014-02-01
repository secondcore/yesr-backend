using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.InvestmentUnitTransactions
{
    /// <summary>
    /// The owner change transaction keeps track of the changes to the owner.
    /// </summary>
    public class OwnerChange : InvestmentUnitTransaction
    {
        public Membership OldMembership { get; set; }
        public Membership NewMembership { get; set; }
    }
}
