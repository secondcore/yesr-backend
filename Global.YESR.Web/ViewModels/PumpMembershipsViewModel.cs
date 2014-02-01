using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Global.YESR.Models;

namespace Global.YESR.Web.ViewModels
{
    public class PumpMembershipsViewModel
    {
        [Display(Name = "Memberships")]
        public int Memberships { get; set; }
        [Display(Name = "Purchases Per Membership")]
        public int PurchasesPerMembership { get; set; }
        [Display(Name = "Days Between Purchases")]
        public int DaysBetweenPurchases { get; set; }
    }
}