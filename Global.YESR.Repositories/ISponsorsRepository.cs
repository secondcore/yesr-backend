using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories
{
    public interface ISponsorsRepository : IGenericRepository<Sponsor>
    {
        Sponsor FindByName(string name);
        Sponsor FindByRegistrationToken(string token);
        string Purchase(DateTime transactionDate, Membership membership, Period period);
        SponsorStats RetrieveSponsorStats(int id);
        void CreateRegistrationTokens();
        void CreateRegistrationToken(int id);
        Sponsor IsRegistrationTokenValid(string token);
    }
}
