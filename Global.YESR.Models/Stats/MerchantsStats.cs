using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Stats
{
    /// <summary>
    /// Not persisting class
    /// </summary>
    public class MerchantStats
    {
        public int Purchases { get; set; }
        public double PurchasesAmount { get; set; }
        public double CashBackAmount { get; set; }
    }
}
