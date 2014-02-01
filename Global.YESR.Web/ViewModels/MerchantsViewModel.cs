using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Global.YESR.Models;

namespace Global.YESR.Web.ViewModels
{
    public class MerchantsViewModel
    {
        public int Page { get; set; }
        public int MaxPage { get; set; }
        public IEnumerable<Merchant> Items { get; set; }
    }
}