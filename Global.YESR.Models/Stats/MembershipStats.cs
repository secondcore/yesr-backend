using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Stats
{
    /// <summary>
    /// Not persisting class
    /// </summary>
    public class MembershipStats
    {
        public int Purchases { get; set; }
        public double PurchasesAmount { get; set; }
        public double CashBackAmount { get; set; }
        public int ReferralBonuses { get; set; }
        public double ReferralBonusesAmount { get; set; }
        public double CashInWallet { get; set; }
        public double NeededCashForNextBond { get; set; }
        public int Bonds { get; set; }
        public int NeededBondsForNextDividend { get; set; }
        public double Dividends { get; set; }
    }
}
