using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// A membership has a reference to its member (a member may have multiple memberships). The instance links up the membership to a specific instance.
    /// </summary>
    public class Membership
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string MembershipNumber { get; set; }
        public DateTime CreateDate { get; set; }
	    public DateTime ModifyDate { get; set; }
        public DateTime LastActivityDate { get; set; }
        //TODO: Due to a bug in EF, dates must have values...so we added flags to reflect the true status
        public bool IsTerminated { get; set; }
        public bool IsSuspended { get; set; }
        public bool IsTest { get; set; }
        public string TestToken { get; set; }
        public DateTime TerminatedDate { get; set; }
	    public DateTime SuspendedDate { get; set; }
        public Member Member { get; set; }
        public InvestmentScheme InvestmentScheme { get; set; }
        public Instance Instance { get; set; }
        /// The Parent property refers to the membership who referred this membership
        public Membership Parent { get; set; }
    }
}
