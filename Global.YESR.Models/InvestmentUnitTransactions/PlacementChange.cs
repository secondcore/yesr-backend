using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.InvestmentUnitTransactions
{
    public class PlacementChange : InvestmentUnitTransaction 
    {
        public InvestmentUnit OldParent { get; set; }
        public InvestmentUnit OldLeftChild { get; set; }
        public InvestmentUnit OldRightChild { get; set; }
        public InvestmentUnit NewParent { get; set; }
        public InvestmentUnit NewLeftChild { get; set; }
        public InvestmentUnit NewRightChild { get; set; }
    }
}
