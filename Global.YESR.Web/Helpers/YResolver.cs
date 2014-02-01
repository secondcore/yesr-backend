using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Runtime.Remoting.Messaging;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Repositories;
using Global.YESR.Repositories.InvestmentUnitTransactionsRepositories;
using Global.YESR.Repositories.MembershipTransactionsRepositories;
using Microsoft.Practices.Unity;

namespace Global.YESR.Web.Helpers
{
    public class YResolver : IDependencyResolver
    {
        private readonly UnityContainer _container;
 
        public YResolver()
        {
            _container = new UnityContainer();

            // Singleton Instance to register
            // It is important to have a singleton context!!
            // Well I read this is not a good idea! The singleton cause many problems in heavy load. The recommendation is to 
            //YContext context = new YContext();
            //_container.RegisterInstance(context);

            // It is important to create a the DbContext per web request. This is the recommended approach. In Unity ID, we implement the 
            // PerCallContextLifeTimeManager to force this. Please see notes below.
            // TODO: Perhaps I should consider my context to implement the IUnitOfWork. So the code below becomes:
            //_container.RegisterType<IUnitOfWork, YContext>(
            //            new PerCallContextLifeTimeManager(),
            //            new InjectionConstructor());
            // TODO: Also I am still not sure where to call Dispose on the DbContext
            _container.RegisterType<DbContext, YContext>(
                        new PerCallContextLifeTimeManager(),
                        new InjectionConstructor());

            // Repositories registration
            _container.RegisterType<IInstancesRepository, InstancesRepository>();
            _container.RegisterType<IEnrollmentsRepository, EnrollmentsRepository>();
            _container.RegisterType<IPurchasesRepository, PurchasesRepository>();
            _container.RegisterType<ICashBackBonusesRepository, CashBackBonusesRepository>();
            _container.RegisterType<IAdminFeesRepository, AdminFeesRepository>();
            _container.RegisterType<IAccumulationReservesRepository, AccumulationReservesRepository>();
            _container.RegisterType<IReferralBonusesRepository, ReferralBonusesRepository>();
            _container.RegisterType<IMemberTypesRepository, MemberTypesRepository>();
            _container.RegisterType<IMerchantsRepository, MerchantsRepository>();
            _container.RegisterType<ISponsorsRepository, SponsorsRepository>();
            _container.RegisterType<IAdminFeesRepository, AdminFeesRepository>();
            _container.RegisterType<IAccumulationReservesRepository, AccumulationReservesRepository>();
            _container.RegisterType<ICashBackBonusesRepository, CashBackBonusesRepository>();
            _container.RegisterType<IFulfillmentsRepository, FulfillmentsRepository>();
            _container.RegisterType<IPurchasesRepository, PurchasesRepository>();
            _container.RegisterType<IReferralBonusesRepository, ReferralBonusesRepository>();
            _container.RegisterType<IMembersRepository, MembersRepository>();
            _container.RegisterType<IMembershipsRepository, MembershipsRepository>();
            _container.RegisterType<IChannelsRepository, ChannelsRepository>();
            _container.RegisterType<IContactsRepository, ContactsRepository>();
            _container.RegisterType<ICountriesRepository, CountriesRepository>();
            _container.RegisterType<ICurrenciesRepository, CurrenciesRepository>();
            _container.RegisterType<ILanguagesRepository, LanguagesRepository>();
            _container.RegisterType<IInvoicesRepository, InvoicesRepository>();
            _container.RegisterType<IPayoutEventsRepository, PayoutEventsRepository>();
            _container.RegisterType<IInvestmentSchemesRepository, InvestmentSchemesRepository>();
            _container.RegisterType<IRegionsRepository, RegionsRepository>();
            _container.RegisterType<ITimeZonesRepository, TimeZonesRepository>();
            _container.RegisterType<IInvestmentUnitsRepository, InvestmentUnitsRepository>();
            _container.RegisterType<IDividendBonusesRepository, DividendBonusesRepository>();
            _container.RegisterType<IPeriodsRepository, PeriodsRepository>();
            _container.RegisterType<IConfigurationItemsRepository, ConfigurationItemsRepository>();
            _container.RegisterType<IRolesRepository, RolesRepository>();
            _container.RegisterType<IGroupsRepository, GroupsRepository>();
            _container.RegisterType<IUsersRepository, UsersRepository>();
            _container.RegisterType<IYesrRepository, YesrRepository>();

            //Register all controller type found in current assembly to the Unity container will be able to resolve them
            foreach (Type controllerType in (from t in Assembly.GetExecutingAssembly().GetTypes() where typeof(IController).IsAssignableFrom(t) select t))
            {
                _container.RegisterType(controllerType);
            }
        }

        public object GetService(Type serviceType)
        {
            //
            //  Unity "Resolve" method throws exception so we need to wrap it up with non throwing method (like MVC expects)
            //
            return TryGetService(serviceType);
        }

        public object TryGetService(Type serviceType)
        {
            try
            {
                return _container.Resolve(serviceType);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            //
            //  Unity "Resolve" method throws exception so we need to wrap it up with non throwing method (like MVC expects)
            //
            return TryGetServices(serviceType);
        }

        public IEnumerable<object> TryGetServices(Type serviceType)
        {
            try
            {
                return _container.ResolveAll(serviceType);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }

    // Unity Life Time Manager to allow the DbContext to created per web request
    public class PerCallContextLifeTimeManager : LifetimeManager
    {
        // Each instance of LifetimeManager should use a unique key rather than a constant.
        // Otherwise if you have more than one object registered with PerCallContextLifeTimeManager, 
        // they're sharing the same key to access CallContext, and you won't get your expected object back.
        private string _key = string.Format("PerCallContextLifeTimeManager_{0}", Guid.NewGuid());

        // If ASP.Net does its thread-swap then the only thing taken across to the new thread through CallContext is the current HttpContext - 
        // anything else you store in CallContext will be gone. This means under heavy load the code above could have unintended results - and I 
        // imagine it would be a real pain to track down why!
        public override object GetValue()
        {
            HttpContext httpContext = HttpContext.Current;
            if (httpContext != null)
                return httpContext.Items[_key];
            else
                return null;
        }

        public override void SetValue(object newValue)
        {
            HttpContext httpContext = HttpContext.Current;
            if (httpContext != null)
                httpContext.Items[_key] = newValue;
        }

        public override void RemoveValue()
        {
            HttpContext httpContext = HttpContext.Current;
            if (httpContext != null)
                httpContext.Items[_key] = null;
        }

        // This was my first implementation but then I saw people talking about the above so I replaced it.
        //public override object GetValue()
        //{
        //    return CallContext.GetData(_key);
        //}

        //public override void SetValue(object newValue)
        //{
        //    CallContext.SetData(_key, newValue);
        //}

        //public override void RemoveValue()
        //{
        //    CallContext.FreeNamedDataSlot(_key);
        //}
    }
}