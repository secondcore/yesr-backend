using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// A very important model class! It defines how the YESR instance is to behave via controlling several configurable items:
    /// Bonus Percentages
    /// Admin Fee Percentage
    /// Threshold
    /// Investment Sheme
    /// Sponsor
    /// Country
    /// Pivot Currency
    /// 
    /// The Instance is a glue model class that allows us to enable and disable features and control the YESR run-time behavior. It can also be thought of as a YESR program!!!
    /// </summary>
    public class Instance
    {
        public int Id { get; set;}
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ProgramName { get; set; }
        public string CardNumberPrefix { get; set; }
        public int CardNumberSuffixLength { get; set; }
        public int CurrentMembershipCounter { get; set; }
        public double DirectReferralBonusPercentage { get; set; }
        public double IndirectReferralBonusPercentage { get; set; }
        public double AdminFeePercentage { get; set; }

        // Refers to the amount (whether it is dollar amount or miles or whatever) that will trigger an investment unit purchase
        public double InvestmentThreshold { get; set; }
	    // Refers to the investment scheme which will be enforced
	    public InvestmentScheme InvestmentScheme { get; set; }
	    // Refers to the sponsor which will be enforced
        public Sponsor Sponsor { get; set; }
	    // Refers to the country in which this instance operates in and its local pivot currency
        public Country Country { get; set; }
        // Refers to the global pivot currency
        public Currency GlobalPivotCurrency { get; set; }
    }
}
