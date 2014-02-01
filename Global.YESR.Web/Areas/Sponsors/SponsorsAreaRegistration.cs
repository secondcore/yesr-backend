﻿using System.Web.Mvc;

namespace Global.YESR.Web.Areas.Sponsors
{
    public class SponsorsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Sponsors";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Sponsors_default",
                "Sponsors/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
