using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Stats
{
    /// <summary>
    /// Not persisting class
    /// </summary>
    public class MonthlyIntegerDataPoint
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Value0 { get; set; }
        public int Value1 { get; set; }
        public int Value2 { get; set; }
        public int Value3 { get; set; }
        public int Value4 { get; set; }
        public int Value5 { get; set; }
    }
}
