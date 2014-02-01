using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Invoices
{
    public class MerchantInvoice : Invoice
    {
        public Merchant Merchant { get; set; }
    }
}
