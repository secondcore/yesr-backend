using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Yesr
{
    public class MembershipsPump
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime CompleteDate { get; set; }
        public int Memberships { get; set; }
        public int PurchasesPerMembership { get; set; }
        public int DaysBetweenPurchases{ get; set; }
        public bool IsCompleted { get; set; }
    }
}
