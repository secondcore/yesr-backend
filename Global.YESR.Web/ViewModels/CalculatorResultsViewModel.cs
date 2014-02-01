using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Models;
using Global.YESR.Models.Yesr;

namespace Global.YESR.Web.ViewModels
{
    public class CalculatorResultsViewModel
    {
        public Membership Membership { get; set; }
        public TestMembershipPump Pump { get; set; }
    }
}