using System.Collections.Generic;
using Global.YESR.Models;

namespace Global.YESR.Web.Areas.Members.ViewModels
{
	public class InvestmentUnitsViewModel
	{
		public int MembershipId { get; set; }
		public int Page { get; set; }
		public int MaxPage { get; set; }
		public IEnumerable<InvestmentUnit> Items { get; set; }
	}
}