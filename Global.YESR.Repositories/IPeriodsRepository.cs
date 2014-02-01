using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public interface IPeriodsRepository : IGenericRepository<Period>
    {
        Period FindByYearAndMonth(int year, int month);
        Period FindByDate(DateTime date);
    }
}
