using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// There are two possible schemes: Standard and Power. The Standard refers to the linear simple scheme whereas the power scheme refers to the binary matrix scheme. This
    /// class has some features that can be enabled or disabled:
    /// Trading - refers to whether the investment unit trading feature is supported or not
    /// Ownership Change - refers to whether the investment unit can change owner or not
    /// Value Solicitation - refers to whether the investment unit can have its values solicicited i.e. until it becomes fully vested
    /// </summary>
    abstract public class InvestmentScheme
    {
        public const int StandardScheme = 0;
        public const int PowerScheme = 1;

        [Key, DatabaseGenerated((DatabaseGeneratedOption.None))]
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime CreateDate { get; set; }
        // Refers to the number of investment units that must be available, whether in Standards or Power scheme, to trigger a dividend
        public int DividendTrigger { get; set; }

        // Refers to the multiplers of the investment units (refer to the InvestmentUnitsRepository for more information)
        public double OwnDividendCoefficient { get; set; }
        public double ChildrenDividendCoefficient { get; set; }
        public double GrandChildrenDividendCoefficient { get; set; }
        public double OthersDividendCoefficient { get; set; } // Other than Own, Child or Grand Children

        public bool IsTradingAllowed { get; set; }
        public bool IsOwnershipChangeAllowed { get; set; }
        public bool IsValueSolicitationAllowed { get; set; }
    }
}
