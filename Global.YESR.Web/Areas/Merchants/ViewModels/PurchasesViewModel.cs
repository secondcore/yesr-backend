using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Web.Areas.Merchants.ViewModels
{
    public class PurchasesViewModel
    {
        public int MerchantId { get; set; }
        public int Page { get; set; }
        public int MaxPage { get; set; }
        public IEnumerable<Purchase> Items { get; set; }
    }
}