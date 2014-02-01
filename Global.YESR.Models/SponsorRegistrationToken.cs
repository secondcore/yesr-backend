using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    // The registration token is used to track sponsor users registrations.To make it unique, it is composed of the merchant id followed 
    // by a hiphen and a random 8-digit string.
    // Once used, the system will automatically create a new one and send it over to the merchant so he/she can re-use it.
    public class SponsorRegistrationToken
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public string Token { get; set; }
        public Sponsor Sponsor { get; set; }
    }
}
