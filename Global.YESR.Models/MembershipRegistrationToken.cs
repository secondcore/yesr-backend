using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    // The registration token is used to allow members to refer others online. The referee will have to use this
    // registration token so we know the parent. To make it unique, it is composed of the membership id followed 
    // by a hiphen and a random 8-digit string.
    // Once used, the system will automatically create a new one and send it over to the member so he/she can re-use it.
    public class MembershipRegistrationToken
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public string Token { get; set; }
        public Membership Membership { get; set; }
    }
}
