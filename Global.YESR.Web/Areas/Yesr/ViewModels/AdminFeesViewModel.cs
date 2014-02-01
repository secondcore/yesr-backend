using System.Collections.Generic;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Web.Areas.Yesr.ViewModels
{
	public class AdminFeesViewModel
	{
		public int MembershipId { get; set; }
		public int Page { get; set; }
		public int MaxPage { get; set; }
		public IEnumerable<AdminFee> Items { get; set; }
	}
}