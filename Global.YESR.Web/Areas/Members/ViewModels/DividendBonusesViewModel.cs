using System.Collections.Generic;
using Global.YESR.Models.InvestmentUnitTransactions;

namespace Global.YESR.Web.Areas.Members.ViewModels
{
	public class DividendBonusesViewModel
	{
		public int MembershipId { get; set; }
		public int Page { get; set; }
		public int MaxPage { get; set; }
		public IEnumerable<DividendBonus> Items { get; set; }
	}
}