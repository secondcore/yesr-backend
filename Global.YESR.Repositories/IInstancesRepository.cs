using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public interface IInstancesRepository : IGenericRepository<Instance>
    {
        Instance FindByName(string name);

        Instance FindByParams(string name,
                                string desc,
                                string programName,
                                string cardNumberPrefix,
                                int cardNumberSuffixLength,
                                double directReferralBounusPerc,
                                double indirectReferralBonusPerc,
                                double adminFeePerc,
                                double investmentThreshold,
                                int schemeType,
                                string sponsorName,
                                string regionId,
                                string countryId,
                                string globalCurrencyId
            );

    }
}
