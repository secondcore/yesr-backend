using System.Web.Mvc;

namespace Global.YESR.Web.Areas.Merchants
{
    public class MerchantsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Merchants";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Merchants_default",
                "Merchants/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
