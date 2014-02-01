using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Global.YESR.Models;
using Global.YESR.Models.Stats;

namespace Global.YESR.Web.Areas.Merchants.ViewModels
{
    public class MerchantDetailViewModel
    {
        public Merchant Merchant { get; set; }
        public MerchantStats Stats { get; set; }
    }
}