using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Repositories.MembershipTransactionsRepositories;
using Global.YESR.Repositories.Utilities;

namespace Global.YESR.Repositories.Helpers
{
    public class DatabaseSeeder
    {
        private YContext _context;
        private IChannelsRepository _channelsRepository;
        private IContactsRepository _contactsRepository;
        private ICountriesRepository _countriesRepository;
        private ICurrenciesRepository _currenciesRepository;
        private IInstancesRepository _instancesRepository;
        private ILanguagesRepository _languagesRepository;
        private IInvoicesRepository _invoicesRepository;
        private IInvestmentSchemesRepository _investmentSchemesRepository;
        private IRegionsRepository _regionsRepository;
        private IMembershipsRepository _membershipsRepository;
        private IMembersRepository _membersRepository;
        private ISponsorsRepository _sponsorsRepository;
        private ITimeZonesRepository _timeZonesRepository;
        private IMemberTypesRepository _memberTypesRepository;
        private IMerchantsRepository _merchantsRepository;
        private IInvestmentUnitsRepository _investmentUnitsRepository;
        private IPeriodsRepository _periodsRepository;
        private IEnrollmentsRepository _enrollmentsRepository = null;
        private IPurchasesRepository _purchasesRepository = null;
        private ICashBackBonusesRepository _cashBackBonusesRepository = null;
        private IAdminFeesRepository _adminFeesRepository = null;
        private IAccumulationReservesRepository _accumulationReservesRepository = null;
        private IReferralBonusesRepository _referralBonusesRepository = null;
        private IPayoutEventsRepository _payoutEventsRepository = null;
        private IYesrRepository _yesrRepository = null;

        private string[] _channels = {"Web", "Form"};
        private string[] _contacts = {"None", "Email", "Sms"};
        private string[] _currencies = {"AED", "USD", "SAR", "LEB", "EGY"};
        private string[] _languages = {"EN"};
        private int[] _timeZones = {1,2,3,4,5,6,7,8,9,0,-1,-2,-3,-4,-5,-6,-7,-8,-9};
        private string[] _memberTypes = {"Regular", "Founding"};
        private int[] _parentIds = {-1, 0};
        //private string[] _countries = {"UAE", "LEB", "SAR", "EGY"};
        //private string[] _cities = {"Dubai", "Sharjah", "Beirut", "Cairo", "Jeddah"};
        private string[] _countries = { "UAE" };
        private string[] _cities = { "Dubai", "Sharjah", "Abou Dhabi", "Ajman", "Fujaira"};
        private string[] _merchants = { "Carrefour", "Spinneys", "Loulou", "Qanz", "Damas", "Give a Night", "Flora Queen", "Perfume Emporium", "Ticket Network" };

        public DatabaseSeeder()
        {
            Database.SetInitializer(new DropCreateDatabaseAlwaysWithSeedData());
        }

        public DatabaseSeeder(bool ignore)
        {
        }

        public void PrepareRepositories(bool initialize = false)
        {
            // Kick the model creation process if not already created (hence force is false). In other words, do 
            // not wait on any database activities. Without this, nothing happens unless some context activities take
            // place.
            _context = new YContext();
            if (initialize)
            {
                // Kick the model creation process if not already created (hence force is false). In other words, do 
                // not wait on any database activities. Without this, nothing happens unless some context activities take
                // place.
                _context.Database.Initialize(force: false);
            }

            _timeZonesRepository = new TimeZonesRepository(_context);
            _channelsRepository = new ChannelsRepository(_context);
            _contactsRepository = new ContactsRepository(_context);
            _regionsRepository = new RegionsRepository(_context);
            _countriesRepository = new CountriesRepository(_context);
            _currenciesRepository = new CurrenciesRepository(_context);
            _languagesRepository = new LanguagesRepository(_context);
            _merchantsRepository = new MerchantsRepository(_context);
            _memberTypesRepository = new MemberTypesRepository(_context);
            _investmentSchemesRepository = new InvestmentSchemesRepository(_context);
            _invoicesRepository = new InvoicesRepository(_context);
            _periodsRepository = new PeriodsRepository(_context);
            _sponsorsRepository = new SponsorsRepository(_context, _invoicesRepository);
            _payoutEventsRepository = new PayoutEventsRepository(_context);
            _investmentUnitsRepository = new InvestmentUnitsRepository(_context, _sponsorsRepository, _invoicesRepository, _payoutEventsRepository);
            _instancesRepository = new InstancesRepository(_context, _sponsorsRepository, _countriesRepository, _regionsRepository, _investmentSchemesRepository, _currenciesRepository);
            _membersRepository = new MembersRepository(_context, _channelsRepository, _contactsRepository, _languagesRepository, _currenciesRepository, _timeZonesRepository, _memberTypesRepository, _merchantsRepository, _sponsorsRepository, _countriesRepository);
            _enrollmentsRepository = new EnrollmentsRepository(_context, _periodsRepository);
            _purchasesRepository = new PurchasesRepository(_context, _periodsRepository, _invoicesRepository);
            _cashBackBonusesRepository = new CashBackBonusesRepository(_context);
            _adminFeesRepository = new AdminFeesRepository(_context);
            _accumulationReservesRepository = new AccumulationReservesRepository(_context, _investmentUnitsRepository);
            _referralBonusesRepository = new ReferralBonusesRepository(_context);
            _membershipsRepository = new MembershipsRepository(_context, _membersRepository, _enrollmentsRepository, _purchasesRepository, _cashBackBonusesRepository, _adminFeesRepository, _accumulationReservesRepository, _referralBonusesRepository, _instancesRepository, _merchantsRepository, _investmentUnitsRepository, _periodsRepository, _currenciesRepository);
            _yesrRepository = new YesrRepository(_context);
        }

        public void CreateInitialData()
        {
            PrepareRepositories(true);

            // Create Registration Tokens for all Merchants
            _merchantsRepository.CreateRegistrationTokens();

            // Create Registration Tokens for all Sponsors
            _sponsorsRepository.CreateRegistrationTokens();

            // Seed the National Bonds Instance
            Instance instance = _instancesRepository.FindByParams(
                "UAE - Northern Emirates",
                "YESR Proram targeting the residents of the UAE Northern Emirates!!!",
                "YESR Savings",
                "971002",
                10,
                0.5,
                0.5,
                2,
                100,
                0,
                "National Bonds",
                "ME",
                "UAE",
                "AED"
                );

            // Seed the Yesr Membership
            MemberDto memberDto = new MemberDto()
                                      {
                                          EnrollmentChannel = "Web",
                                          PrefContact = "None",
                                          PrefCurrency = "AED",
                                          PrefLanguage = "EN",
                                          PrefTimeZone = 4,
                                          PrefMemberType = "Yesr",
                                          NationalId = "999-999-999-99999",
                                          CitizenshipCountry = "UAE",
                                          FirstName = "Yesr",
                                          LastName = "Program",
                                          Email = "yesr@yesrgroup.com",
                                          LandPhone = "97145551212",
                                          MobilePhone = "971505551212",
                                          City = "Dubai",
                                          Country = "UAE",
                                          Postal = "99999",
                                          MerchantId = -1,
                                          SponsorId = -1
                                      };

            Membership membership = CreateMembership(memberDto, -2, "UAE - Northern Emirates", DateTime.Now);

            // Seed the Merchant Memberships
            // CARREFOUR
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-CRF8988",
                                CitizenshipCountry = "UAE",
                                FirstName = "Carrefour",
                                LastName = "Program",
                                Email = "info@carrefour.com",
                                LandPhone = "97145551313",
                                MobilePhone = "971505551313",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 1,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // SPINNEYS
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-SPN777",
                                CitizenshipCountry = "UAE",
                                FirstName = "Spinneys",
                                LastName = "Program",
                                Email = "info@spinneys.com",
                                LandPhone = "97145551414",
                                MobilePhone = "971505551414",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 2,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // LOULOU
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-LLO777",
                                CitizenshipCountry = "UAE",
                                FirstName = "Loulou",
                                LastName = "Program",
                                Email = "info@loulou.com",
                                LandPhone = "97145551515",
                                MobilePhone = "971505551515",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 3,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // QANZ
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-QNZ777",
                                CitizenshipCountry = "UAE",
                                FirstName = "Qanz",
                                LastName = "Program",
                                Email = "info@qanz.com",
                                LandPhone = "97145551616",
                                MobilePhone = "971505551616",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 4,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // DAMAS
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-DMS777",
                                CitizenshipCountry = "UAE",
                                FirstName = "Damas",
                                LastName = "Program",
                                Email = "info@damas.com",
                                LandPhone = "97145551616",
                                MobilePhone = "971505551616",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 5,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // GIVE A NIGHT
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-GAN777",
                                CitizenshipCountry = "UAE",
                                FirstName = "Give a Night",
                                LastName = "Program",
                                Email = "info@giveanight.com",
                                LandPhone = "9714555666",
                                MobilePhone = "971505557777",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 6,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // FLORA QUEEN
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-FLQ655",
                                CitizenshipCountry = "UAE",
                                FirstName = "Flora Queen",
                                LastName = "Program",
                                Email = "info@floraqueen.com",
                                LandPhone = "97145558923",
                                MobilePhone = "971505558764",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 7,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // PERFUME EMPORIUM
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-PEM987",
                                CitizenshipCountry = "UAE",
                                FirstName = "Perfume Emporium",
                                LastName = "Program",
                                Email = "info@perefumeemporium.com",
                                LandPhone = "97145558868",
                                MobilePhone = "971505559999",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 8,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // TICKET NETWORK
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Merchant",
                                NationalId = "999-999-999-TKN987",
                                CitizenshipCountry = "UAE",
                                FirstName = "Ticket Network",
                                LastName = "Program",
                                Email = "info@ticketnetwork.com",
                                LandPhone = "97145558989",
                                MobilePhone = "971505550009",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = 9,
                                SponsorId = -1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            // Seed the Sponsor Membership
            memberDto = new MemberDto()
                            {
                                EnrollmentChannel = "Web",
                                PrefContact = "None",
                                PrefCurrency = "AED",
                                PrefLanguage = "EN",
                                PrefTimeZone = 4,
                                PrefMemberType = "Sponsor",
                                NationalId = "999-999-999-77777",
                                CitizenshipCountry = "UAE",
                                FirstName = "National Bonds",
                                LastName = "Program",
                                Email = "info@nbs.com",
                                LandPhone = "97145551414",
                                MobilePhone = "971505551414",
                                City = "Dubai",
                                Country = "UAE",
                                Postal = "99999",
                                MerchantId = -1,
                                SponsorId = 1
                            };

            membership = CreateMembership(memberDto, 1/* assume yesr */, "UAE - Northern Emirates", DateTime.Now);

            _context.Dispose();
        }

        public void CreateTransactions(int memberships = 100, int maxPurchasesPerMembership = 20, int maxDaysBetweenPurchases = 30) 
        {
            for (int i=0; i < memberships; i++)
            {
                PrepareRepositories(false);

                // Get a new date from now for a year
                TimeSpan timeSpan = DateTime.Now.AddDays(365) - DateTime.Now;
                TimeSpan newSpan = new TimeSpan(new Random(i).Next(0, (int)timeSpan.TotalDays), 0, 0, 0);
                DateTime newDate = DateTime.Now + newSpan;
                Membership iMembership = CreateMembership(CreateMemberDto(), -1, "UAE - Northern Emirates", newDate);
                Console.WriteLine("{0}", iMembership.MembershipNumber);

                // Accumulate purchases against the new membership with purchase dates after the create date
                DateTime purchaseDate = newDate;
                for (int j = 0; j < new Random(i).Next(0, maxPurchasesPerMembership); j++)
                {
                    purchaseDate = purchaseDate.AddDays(new Random(j).Next(0, maxDaysBetweenPurchases));
                    var rndMerchant = new Random();
                    Purchase iPurchase = CreatePurchase(iMembership, purchaseDate, _merchants[rndMerchant.Next(_merchants.Length)], Utils.GenerateRandomAmount(), "AED");
                    Console.Write(".");
                }
                
                Console.WriteLine("");
                _context.Dispose();
            }
        }

        public void CreateTestMembership(string token, int expectedReferrals, double averageMonthlySpend, int years)
        {
            PrepareRepositories(false);

            // Create a membership - mark it with a test token i.e. pump.TestToken
            DateTime createDate = DateTime.Now;
            Membership iMembership = CreateTestMembership(CreateMemberDto(), -1, "UAE - Northern Emirates", createDate, token);
            Console.WriteLine("Primary {0}", iMembership.MembershipNumber);
            List<Membership> childMemberships = new List<Membership>();
            for (int i=0; i < expectedReferrals; i++)
            {
                // Create its children and mark them with the parent token +  "-child"
                Membership cMembership = CreateTestMembership(CreateMemberDto(), iMembership.Id, "UAE - Northern Emirates", createDate, token + "-child-" + i);
                childMemberships.Add(cMembership);
                Console.WriteLine("Child {0}", cMembership.MembershipNumber);
            }

            _context.Dispose();

            // Every month after the create date, create a purchase for the children and the primary membership
            DateTime purchaseDate = createDate;
            for (int i = 0; i < (years * 12); i++)
            {
                purchaseDate = purchaseDate.AddMonths(1);
                var rndMerchant = new Random(DateTime.Now.Millisecond);
                foreach (Membership cMembership in childMemberships)
                {
                    PrepareRepositories(false);
                    Purchase cPurchase = CreatePurchase(cMembership, purchaseDate,
                                                        _merchants[rndMerchant.Next(_merchants.Length)],
                                                        averageMonthlySpend, "AED");
                    Console.Write(".");
                    _context.Dispose();
                }

                PrepareRepositories(false);
                Purchase iPurchase = CreatePurchase(iMembership, purchaseDate,
                                                    _merchants[rndMerchant.Next(_merchants.Length)],
                                                    averageMonthlySpend, "AED");
                Console.WriteLine("*");
                _context.Dispose();
            }
        }

        public void DisplayTransactionDates()
        {
            for (int i = 0; i < 10; i++)
            {
                // Get a new date from now for a year
                TimeSpan timeSpan = DateTime.Now.AddDays(365) - DateTime.Now;
                TimeSpan newSpan = new TimeSpan(new Random(i).Next(0, (int)timeSpan.TotalDays), 0, 0, 0);
                DateTime newDate = DateTime.Now + newSpan;
                Console.WriteLine("Total Days in span: " + (int)timeSpan.TotalDays + " - Create Date: " + newDate.ToString("dd MMM yyyy"));

                // Accumulate purchases against the new membership with purchase dates after the create date
                DateTime purchaseDate = newDate;
                for (int j = 0; j < new Random(i).Next(0, 10); j++)
                {
                    purchaseDate = purchaseDate.AddDays(new Random(j).Next(0, 30));
                    Console.WriteLine("Purchase Date: " + purchaseDate.ToString("dd MMM yyyy"));
                }
            }
        }

        public void CreateCountries()
        {
            PrepareRepositories(false);

            Currency lebCurrency = new Currency() { Id = "LEB", Symbol = "LB", Name = "Lebanese Pound", Rate = 1500 };
            _context.Currencies.Add(lebCurrency);
            Currency saCurrency = new Currency() { Id = "SAR", Symbol = "SR", Name = "Saudi Ryal", Rate = 3.67 };
            _context.Currencies.Add(saCurrency);
            Currency egCurrency = new Currency() { Id = "EGY", Symbol = "EG", Name = "Egyptian Jeneh", Rate = 7 };
            _context.Currencies.Add(egCurrency);

            Country country = new Country();
            country.Id = "LEB";
            country.Name = "Lebanon";
            country.Currency = lebCurrency;
            _context.Countries.Add(country);

            country = new Country();
            country.Id = "SAR";
            country.Name = "Saudi Arabia";
            country.Currency = saCurrency;
            _context.Countries.Add(country);

            country = new Country();
            country.Id = "EGY";
            country.Name = "Egypt";
            country.Currency = egCurrency;
            _context.Countries.Add(country);

            _context.SaveChanges();

            Console.WriteLine("");
            _context.Dispose();
        }

        public void PumpMembershipsViaThreads(int memberships = 100, int maxPurchasesPerMembership = 20, int maxDaysBetweenPurchases = 30)
        {
            PrepareRepositories(false);
            Thread started =_yesrRepository.PumpMemberships(memberships, maxDaysBetweenPurchases, maxDaysBetweenPurchases);
            if (started == null)
                Console.WriteLine("There is already one running pump!!");
            else
            {
                // Wait (block the caller) until the thread terminates
                started.Join();
            }
        }

        private Membership CreateMembership(MemberDto memberDto, int parentId, string instanceName, DateTime createDate)
        {
            Membership membership = null;
            Instance instance = _instancesRepository.FindByName(instanceName);
            if (instance != null)
            {
                if (parentId == -1)
                    parentId = _membershipsRepository.FindByRandom().Id;

                memberDto.CreateDate = createDate;
                membership = _membershipsRepository.CreateMembership(memberDto, parentId, instance.Id, createDate);
//                if (membership != null)
//                    Console.WriteLine("A membership created! Membership Number: {0}", membership.MembershipNumber);
            }

            return membership;
        }

        private Membership CreateTestMembership(MemberDto memberDto, int parentId, string instanceName, DateTime createDate, string token)
        {
            Membership membership = null;
            Instance instance = _instancesRepository.FindByName(instanceName);
            if (instance != null)
            {
                if (parentId == -1)
                    parentId = _membershipsRepository.FindByRandom().Id;

                memberDto.CreateDate = createDate;
                membership = _membershipsRepository.CreateMembership(memberDto, parentId, instance.Id, createDate, true, token);
                //                if (membership != null)
                //                    Console.WriteLine("A membership created! Membership Number: {0}", membership.MembershipNumber);
            }

            return membership;
        }

        private Purchase CreatePurchase(Membership membership, DateTime transactionDate, string merchantName, double amt, string currencyId)
        {
            Purchase purchase = null;
            Merchant merchant = _merchantsRepository.FindByName(merchantName);
            if (merchant != null)
            {
                purchase = _membershipsRepository.Purchase(transactionDate, membership.Id, merchant.Id, amt, currencyId);

//                if (purchase != null)
//                    Console.WriteLine("A purchase created! Transaction Id: {0}", purchase.Id);
            }

            return purchase;
        }

        private MemberDto CreateMemberDto()
        {
            //Get the culture property of the thread.
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            //Create TextInfo object.
            TextInfo textInfo = cultureInfo.TextInfo;

            Random rnd = new Random();
            MemberDto dto = new MemberDto();
            dto.EnrollmentChannel = _channels[rnd.Next(_channels.Length)];
            dto.PrefContact = _contacts[rnd.Next(_contacts.Length)];
            dto.PrefCurrency = _currencies[rnd.Next(_currencies.Length)];
            dto.PrefLanguage = _languages[rnd.Next(_languages.Length)];
            dto.PrefTimeZone = _timeZones[rnd.Next(_timeZones.Length)];
            dto.PrefMemberType = _memberTypes[rnd.Next(_memberTypes.Length)];
            dto.NationalId = Utils.GenerateRandomName(3) + "-" + Utils.GenerateRandomName(3) + "-" + Utils.GenerateRandomName(3) + "-" + Utils.GenerateRandomName(5);
            dto.CitizenshipCountry = _countries[rnd.Next(_countries.Length)];
            dto.FirstName = textInfo.ToTitleCase(Utils.GenerateRandomName(8).ToLower());
            dto.LastName = textInfo.ToTitleCase(Utils.GenerateRandomName(12).ToLower());
            dto.Email = dto.FirstName + "." + dto.LastName + "@gmail.com";
            dto.LandPhone = "97104" + Utils.GenerateRandomNumber(7);
            dto.MobilePhone = "97150" + Utils.GenerateRandomNumber(7);
            dto.City = _cities[rnd.Next(_cities.Length)];
            dto.Country = _countries[rnd.Next(_countries.Length)];
            dto.Postal = "99999";
            dto.MerchantId = -1;
            dto.SponsorId = -1;
            return dto;
        }
    }
}
