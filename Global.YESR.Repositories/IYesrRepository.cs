using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Global.YESR.Models;
using Global.YESR.Models.Stats;
using Global.YESR.Models.Yesr;

namespace Global.YESR.Repositories
{
    public interface IYesrRepository : IGenericRepository<MembershipsPump>
    {
        YesrStats RetrieveYesrStats();
        List<MonthlyDataPoint> RetrieveMonthlyStatsByMembership(int id, string currency);

        TestMembershipPump RetrieveTestMembershipPumpByToken(string token);

        // These are threaded methods. They deliver their payload to a local thread
        Thread PumpMemberships(int memberships, int purchasesPerMembership, int daysBetweenPurchases);
        Thread PumpTestMembership(string name, int expectedReferrals, double avgMonthlySpend, int years);
        Thread DeleteTestMembership(string token);

        // These are method pairs: the first one is a request by the web role while the second one is a process by the worker role
        void PumpMemberships(int memberships, int purchasesPerMembership, int daysBetweenPurchases, bool ignore);
        void ProcessPumpMemberships(int pumpId);
        void PumpTestMembership(string token, int expectedReferrals, double avgMonthlySpend, int years, bool ignore);
        void ProcessPumpTestMembership(int pumpId);
        void DeleteTestMembership(string token, bool ignore);
        void ProcessDeleteTestMembership(int pumpId);
    }
}
