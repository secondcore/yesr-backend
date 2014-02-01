using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories
{
    public interface IMerchantsRepository : IGenericRepository<Merchant>
    {
        Merchant FindByName(string name);
        Merchant FindByRegistrationToken(string token);
        MerchantStats RetrieveMerchantStats(int id);
        void CreateRegistrationTokens();
        void CreateRegistrationToken(int id);
        Merchant IsRegistrationTokenValid(string token);
        List<KeyIntegerValueDataPoint> RetrieveMerchantsDistributionByType();
        List<KeyIntegerValueDataPoint> RetrieveMerchantsDistributionByTotalDiscount();
        List<KeyIntegerValueDataPoint> RetrieveMerchantsDistributionByCashDiscount();
    }
}
