using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Global.YESR.Web
{
	public class RouteConfig
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			routes.MapHttpRoute(
				name: "DefaultApi",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { id = RouteParameter.Optional }
			);

			// The route requires namespaces so ASP .NET knows what to do to resolve controller name conflicts in the maimn
			// application and areas
			routes.MapRoute(
				name: "Default",
				url: "{controller}/{action}/{id}",
				defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
				namespaces: new[] { "Global.YESR.Web.Controllers" }
			);
		}
	}
}