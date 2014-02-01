using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// Each member may undergo several changes. We are recording these in transactions. Some of the possible membership transactions:
    /// Profile Update - recorded when a member changes any of his/her profile items such as name, email or address
    /// 
    /// The transaction date is adjusted per the member time zone and it does determine the 'Period' entity. Since we use monthly calendar, the actual month can be inferred from the date.  
    /// </summary>
    abstract public class MemberTransaction
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime TransactionDate { get; set; }
        public Period Period { get; set; }
        public Member Member { get; set; }
    }
}
