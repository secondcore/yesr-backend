using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.InvestmentUnitTransactions
{
    /// <summary>
    /// The investment unit bonus transaction keeps track of the bonuses awarded to a particular membership when an investment Unit becomes fully vested.
    /// </summary>
    public class DividendBonus : InvestmentUnitTransaction
    {
        public double OwnAmount { get; set; }
        public double ChildrenAmount { get; set; }
        public double GrandChildrenAmount { get; set; }
    }
}
