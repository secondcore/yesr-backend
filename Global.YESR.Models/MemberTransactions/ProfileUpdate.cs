using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.MemberTransactions
{
    public class ProfileUpdate : MemberTransaction
    {
        public String OldEmail { get; set; }
        public String NewEmail { get; set; }
        public String OldFirstName { get; set; }
        public String NewFirstName { get; set; }
        public String OldLastName { get; set; }
        public String NewLastName { get; set; }
        public String OldAddress1 { get; set; }
        public String NewAddress1 { get; set; }
        public String OldAddress2 { get; set; }
        public String NewAddress2 { get; set; }
        public String OldCity { get; set; }
        public String NewCity { get; set; }
        public String OldPostalCode { get; set; }
        public String NewPostalCode { get; set; }
        public Country OldCountry { get; set; }
        public Country NewCountry { get; set; }
    }
}
