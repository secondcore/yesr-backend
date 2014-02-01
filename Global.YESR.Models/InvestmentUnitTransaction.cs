using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// The investment unit may undergo several changes. We are recording these in transactions. Some of the possible investment unit transactions:
    /// Dividend Bonus - happens when an investment unit becomes fully vested
    /// Owner Change - if this feature is enabled, owners can change
    /// Placement Change - investment unit may be placed manually in the matrix! This transaction records the placement change  
    /// Trading Event -  - if this feature is enabled, members will be able to use the YESR platform to trade actual commodities using YESR Investment Units
    ///
    /// The transaction date is adjusted per the member time zone and it does determine the 'Period' entity. Since we use monthly calendar, the actual month can be inferred from the date.  
    /// </summary>
    abstract public class InvestmentUnitTransaction
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public double Amount { get; set; }
        // To the Pivotal currency
        public double ExchangeRate { get; set; }
        // To the Global Pivotal currency
        public double GlobalExchangeRate { get; set; }
        public DateTime TransactionDate { get; set; }
        public Period Period { get; set; }
        public InvestmentUnit InvestmentUnit { get; set; }
    }
}
