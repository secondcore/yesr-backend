using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories
{
    public interface IMembershipsRepository : IGenericRepository<Membership>
    {
        Membership FindByMembershipNumber(string number);
        Membership FindByRandom();
        Membership FindByTestToken(string token);

        Membership CreateMembership(MemberDto memberDto, int parentId, int instanceId, DateTime createDate);
        Membership CreateMembership(MemberDto memberDto, int parentId, int instanceId, DateTime createDate, bool test, string token);
        Purchase Purchase(int membershipId, int merchantId, double amount, string currencyId);
        Purchase Purchase(DateTime transactionDate, int membershipId, int merchantId, double amount, string currencyId);

        MembershipStats RetrieveMembershipStats(int id);
        void CreateRegistrationToken(int id);
        Membership IsRegistrationTokenValid(string token);

        List<Membership> RetrieveChildMemberships(int id);
        List<MonthlyIntegerDataPoint> RetrieveMonthlyEnrollmentsByMerchant(int id);
        List<MonthlyDataPoint> RetrieveMonthlyCashDiscountVsReferralBonusByMerchant(int id);
    }
}
