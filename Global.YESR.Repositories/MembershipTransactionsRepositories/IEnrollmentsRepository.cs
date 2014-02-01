using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public interface IEnrollmentsRepository : IGenericRepository<Enrollment>
    {
        Enrollment Enroll(Membership membership);
    }
}
