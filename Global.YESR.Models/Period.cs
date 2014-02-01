using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// The YESR period is based on a monthly calendar. I singled it out in a seperate model class because the definition might change. It should be included in every transaction 
    /// where time matters. 
    /// 
    /// It has two flavors:
    /// Gregorian
    /// Hijri
    /// </summary>
    public class Period
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string Name { get; set; }
    }
}
