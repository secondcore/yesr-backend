using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Models
{
    /// <summary>
    /// Each membership may undergo several changes. We are recording these in transactions. Some of the possible membership transactions:
    /// Accumulation Fund - recorded when a membership receives an accumulation fund from purchases that can be used to purchase an investment unit
    /// Cashback Bonus - recorded when a membership receives a cash back bonus from purchases 
    /// Referral Bonus - recorded when a membership receives a referral bonus from referral membership purchases 
    /// Enrollment - recorded upon the creation of a membership
    /// Purchase - recorded when a purchase takes place
    /// Fulfillment - recorded when a membership fulfillment (i.e. actual card) becomes necessary to ship out to member
    /// 
    /// The transaction date is adjusted per the member time zone and it does determine the 'Period' entity. Since we use monthly calendar, the actual month can be inferred from the date.  
    /// </summary>
    abstract public class MembershipTransaction
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime TransactionDate { get; set; }
        public double Amount { get; set; }
        // To the instance Pivot currency
        public double ExchangeRate { get; set; }
        // To the global Pivot currency
        public double GlobalExchangeRate { get; set; }
        public Currency Currency { get; set; }
        public Period Period { get; set; }
        public Membership Membership { get; set; }
    }
}
