using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models.Invoices;

namespace Global.YESR.Models.MembershipTransactions
{
    /// <summary>
    /// Although the purchase has the membership associated with it (and hence the instance attributes), I think it 
    /// is a good idea to lock the percentages (just like the exchange rate) in each  transaction. This way, if the 
    /// instance attributes changed, each transaction will maintain its own record.
    /// </summary>
    public class Purchase : MembershipTransaction
    {
        public double CashBackPercentage { get; set; }
        public double AdminFeePercentage { get; set; }
        public double ReferralPercentage { get; set; }
        public double IndirectReferralPercentage { get; set; }
        public double AccumulationPercentage { get; set; }

        // Navigational Properties
        public Merchant Merchant { get; set; }
        public MerchantInvoice Invoice { get; set; }
    }
}
