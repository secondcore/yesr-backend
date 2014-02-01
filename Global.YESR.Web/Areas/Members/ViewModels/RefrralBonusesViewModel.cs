using System.Collections.Generic;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Web.Areas.Members.ViewModels
{
	public class ReferralBonusesViewModel
	{
		public int MembershipId { get; set; }
		public int Page { get; set; }
		public int MaxPage { get; set; }
		public IEnumerable<ReferralBonus> Items { get; set; }
	}
}