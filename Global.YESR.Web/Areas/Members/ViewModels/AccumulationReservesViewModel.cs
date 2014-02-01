using System.Collections.Generic;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Web.Areas.Members.ViewModels
{
	public class AccumulationReservesViewModel
	{
		public int MembershipId { get; set; }
		public int Page { get; set; }
		public int MaxPage { get; set; }
		public IEnumerable<AccumulationReserve> Items { get; set; }
	}
}