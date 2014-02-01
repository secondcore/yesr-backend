using Global.YESR.Models;
using Global.YESR.Models.Stats;

namespace Global.YESR.Web.Areas.Members.ViewModels
{
	public class MembershipDetailViewModel
	{
		public Membership Membership { get; set; }
		public MembershipStats Stats { get; set; }
	}
}