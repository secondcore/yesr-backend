using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Global.YESR.Models;
using Global.YESR.Models.Stats;

namespace Global.YESR.Web.Areas.Sponsors.ViewModels
{
    public class SponsorDetailViewModel
    {
        public Sponsor Sponsor { get; set; }
        public SponsorStats Stats { get; set; }
    }
}