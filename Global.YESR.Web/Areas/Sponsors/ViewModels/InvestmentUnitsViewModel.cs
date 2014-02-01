using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Web.Areas.Sponsors.ViewModels
{
    public class InvestmentUnitsViewModel
    {
        public int SponsorId { get; set; }
        public int Page { get; set; }
        public int MaxPage { get; set; }
        public IEnumerable<InvestmentUnit> Items { get; set; }
    }
}