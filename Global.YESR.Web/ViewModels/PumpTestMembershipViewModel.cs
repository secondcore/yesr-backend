using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Global.YESR.Web.ViewModels
{
    public class PumpTestMembershipViewModel
    {
        [Remote("VerifyTestToken", "Home", ErrorMessage = "Sorry...this test token is already taken!")]
        public string Token { get; set; }
        [Display(Name = "Number of Referrals you are likely to bring aboard")]
        public int Referrals { get; set; }
        [Display(Name = "Average Monthly Spend")]
        public double AverageMonthlySpend { get; set; }
        [Display(Name = "Number of Years")]
        public int Years { get; set; }
    }
}