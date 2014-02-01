using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Payments
{
    public class MemberPayment : Payment
    {
        public Member Member { get; set; }
    }
}
