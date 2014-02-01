using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;

namespace Global.YESR.Repositories
{
    public class InstancesRepository : GenericRepository<Instance>, IInstancesRepository
    {
        private ISponsorsRepository _sponsorsRepository = null;
        private ICountriesRepository _countriesRepository = null;
        private IRegionsRepository _regionsRepository = null;
        private IInvestmentSchemesRepository _investmentSchemesRepository = null;
        private ICurrenciesRepository _currenciesRepository = null;

        protected override IQueryable<Instance> DefaultSet
        {
            get
            {
                return _Context.Instances
                    .Include("InvestmentScheme")
                    .Include("Sponsor")
                    .Include("Country")
                    .Include("GlobalPivotCurrency");
            }
        }

        protected override Func<Instance, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public InstancesRepository(YContext context, 
                                ISponsorsRepository spnRep,
                                ICountriesRepository cntrsRep,
                                IRegionsRepository regRep,
                                IInvestmentSchemesRepository invSchRep,
                                ICurrenciesRepository currRep)
            : base(context)
        {
            _sponsorsRepository = spnRep;
            _countriesRepository = cntrsRep;
            _regionsRepository = regRep;
            _investmentSchemesRepository = invSchRep;
            _currenciesRepository = currRep;
        }

        public override Instance FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            // Explicit load the country currency
            _Context.Entry(query.Country).Reference(l => l.Currency);

            return query;
        }
        
        public Instance FindByName(string name)
        {
            var query = (from i in DefaultSet
                         where i.Name == name
                         select i).SingleOrDefault();

            // Explicit load the country currency
            _Context.Entry(query.Country).Reference(l => l.Currency);

            return query;
        }

        public Instance FindByParams(string name,
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
                                    )
        {
            Instance instance = null;

            try
            {
                Currency globalCurrency = _currenciesRepository.FindById(globalCurrencyId);
                if (globalCurrency == null)
                    throw new Exception("Global currency [" + globalCurrencyId + "] not valid!");

                InvestmentScheme scheme = _investmentSchemesRepository.FindById(schemeType);
                if (scheme == null)
                    throw new Exception("Scheme [" + schemeType + "] not valid!");

                Sponsor sponsor = _sponsorsRepository.FindByName(sponsorName);
                if (sponsor == null)
                    throw new Exception("Sponsor [" + sponsorName + "] not valid!");

                Country country = _countriesRepository.FindById(countryId);
                if (country == null)
                {
                    country = new Country();
                    country.Id = "UAE";
                    country.Name = "United Arab Emirates";
                    country.Region = _regionsRepository.FindById(regionId);
                    country.Currency = _currenciesRepository.FindById("AED");
                    _Context.Countries.Add(country);
                }

                instance = new Instance();
                instance.Name = name;
                instance.Description = desc;
                instance.ProgramName = programName;
                instance.CardNumberPrefix = cardNumberPrefix;
                instance.CardNumberSuffixLength = cardNumberSuffixLength;
                instance.DirectReferralBonusPercentage = directReferralBounusPerc;
                instance.IndirectReferralBonusPercentage = indirectReferralBonusPerc;
                instance.AdminFeePercentage = adminFeePerc;
                instance.InvestmentThreshold = investmentThreshold;
                instance.InvestmentScheme = scheme;
                instance.Country = country;
                instance.Sponsor = sponsor;
                instance.GlobalPivotCurrency = globalCurrency;
                _Context.Instances.Add(instance);

                _Context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Create Instance caused an expection: " + e.Message);
            }

            return instance;
        }
    }
}
