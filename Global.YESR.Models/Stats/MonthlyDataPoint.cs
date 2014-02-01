using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Stats
{
    /// <summary>
    /// Not persisting class
    /// </summary>
    public class MonthlyDataPoint
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public double Value0 { get; set; }
        public double Value1 { get; set; }
        public double Value2 { get; set; }
        public double Value3 { get; set; }
        public double Value4 { get; set; }
        public double Value5 { get; set; }
    }
}
