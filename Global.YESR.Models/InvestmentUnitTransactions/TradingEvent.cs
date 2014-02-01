using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.InvestmentUnitTransactions
{
    public class TradingEvent : InvestmentUnitTransaction 
    {
        public Membership TradingPartner { get; set; }
        public InvestmentUnit TradingUnit { get; set; }
    }
}
