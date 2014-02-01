using System.Web.Mvc;
using Global.YESR.Web.ActionFilters;

namespace Global.YESR.Web
{
	public class FilterConfig
	{
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			filters.Add(new HandleErrorAttribute());
			filters.Add(new LogAttribute());
		}
	}
}