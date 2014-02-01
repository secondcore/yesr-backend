using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories
{
    public interface IMembersRepository : IGenericRepository<Member>
    {
        Member CreateMember(MemberDto memberDto);
        List<KeyIntegerValueDataPoint> RetrieveMembersDistributionByCity();
        List<KeyIntegerValueDataPoint> RetrieveMembersDistributionByCitizenshipCountry();
        List<KeyIntegerValueDataPoint> RetrieveMembersDistributionByEnrollmentChannel();
    }
}