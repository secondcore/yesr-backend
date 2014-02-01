using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Invoices
{
    public class SponsorInvoice : Invoice
    {
        public Sponsor Sponsor { get; set; }
        public InvestmentUnit InvestmentUnit { get; set; }
    }
}
