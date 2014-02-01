using System.Web.Mvc;

namespace Global.YESR.Web.Areas.Yesr
{
    public class YesrAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Yesr";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Yesr_default",
                "Yesr/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
