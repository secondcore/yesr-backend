using System.Web.Mvc;

namespace Global.YESR.Web.Areas.Members
{
	public class MembersAreaRegistration : AreaRegistration
	{
		public override string AreaName
		{
			get
			{
				return "Members";
			}
		}

		// The route requires namespaces so ASP .NET knows what to do to resolve controller name conflicts in the maimn
		// application and areas
		public override void RegisterArea(AreaRegistrationContext context)
		{
			context.MapRoute(
				"Members_default",
				"Members/{controller}/{action}/{id}",
				new { action = "Index", id = UrlParameter.Optional },
				namespaces: new[] { "Global.YESR.Web.Areas.Members.Controllers" }
			);
		}
	}
}