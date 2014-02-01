using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.Members;
using Global.YESR.Models.Stats;

namespace Global.YESR.Repositories
{
    public class MembersRepository : GenericRepository<Member>, IMembersRepository
    {
        private IChannelsRepository _channelsRepository = null;
        private IContactsRepository _contactsRepository = null;
        private ILanguagesRepository _languagesRepository = null;
        private ICurrenciesRepository _currenciesRepository = null;
        private ITimeZonesRepository _timeZonesRepository = null;
        private IMemberTypesRepository _memberTypesRepository = null;
        private IMerchantsRepository _merchantsRepository = null;
        private ISponsorsRepository _sponsorsRepository = null;
        private ICountriesRepository _countriesRepository = null;

        protected override IQueryable<Member> DefaultSet
        {
            get
            {
                return _Context.Members
                    .Include("CitizenshipCountry")
                    .Include("EnrollmentChannel")
                    .Include("PreferredContact")
                    .Include("PreferredLanguage")
                    .Include("PreferredCurrency")
                    .Include("ResidenceCountry")
                    .Include("PreferredTimeZone")
                    .Include("Type")
                    .Include("Parent");
            }
        }

        protected override Func<Member, object> DefaultOrderBy
        {
            get
            {
                return x => x.LastName;
            }
        }

        public MembersRepository(YContext context, IChannelsRepository chnRep, IContactsRepository contRep, ILanguagesRepository langRep, ICurrenciesRepository currRep, ITimeZonesRepository tzRep, IMemberTypesRepository memtRep, IMerchantsRepository mercRep, ISponsorsRepository spnRep, ICountriesRepository cntrRep) : base(context)
        {
            _channelsRepository = chnRep;
            _contactsRepository = contRep;
            _languagesRepository = langRep;
            _currenciesRepository = currRep;
            _timeZonesRepository = tzRep;
            _memberTypesRepository = memtRep;
            _merchantsRepository = mercRep;
            _sponsorsRepository = spnRep;
            _countriesRepository = cntrRep;
        }

        public override Member FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public Member CreateMember(MemberDto memberDto)
        {
            Member member = null;

            try
            {
                // Find the enrollment channel
                Channel channel = _channelsRepository.FindById(memberDto.EnrollmentChannel);
                if (channel == null)
                    throw new Exception("Enrollment Channel [" + memberDto.EnrollmentChannel + "] does not exist!!");

                // Find the preferred contact
                Contact contact = _contactsRepository.FindById(memberDto.PrefContact);
                if (contact == null)
                    throw new Exception("Preferred Contact [" + memberDto.PrefContact + "] does not exist!!");

                // Find the preferred language
                Language language = _languagesRepository.FindById(memberDto.PrefLanguage);
                if (language == null)
                    throw new Exception("Preferred Language [" + memberDto.PrefLanguage + "] does not exist!!");

                // Find the preferred currency
                Currency currency = _currenciesRepository.FindById(memberDto.PrefCurrency);
                if (currency == null)
                    throw new Exception("Preferred Currency [" + memberDto.PrefCurrency + "] does not exist!!");

                // Find the preferred time zone
                Global.YESR.Models.TimeZone timeZone = _timeZonesRepository.FindById(memberDto.PrefTimeZone);
                if (timeZone == null)
                    throw new Exception("Preferred Time Zone [" + memberDto.PrefTimeZone + "] does not exist!!");

                // Find the member type
                MemberType memberType = _memberTypesRepository.FindById(memberDto.PrefMemberType);
                if (memberType == null)
                    throw new Exception("Preferred Member Type [" + memberDto.PrefMemberType + "] does not exist!!");

                // Find the merchant
                Merchant merchant = _merchantsRepository.FindById(memberDto.MerchantId);
                //if (merchant == null)
                //throw new Exception("Merchant [" + merchantId + "] does not exist!!");

                // Find the sponsor
                Sponsor sponsor = _sponsorsRepository.FindById(memberDto.SponsorId);
                //if (sponsor == null)
                //throw new Exception("Sponsor [" + sponsorId + "] does not exist!!");

                // Find the Member residence country
                Country residenceCountry = _countriesRepository.FindById(memberDto.Country);
                if (residenceCountry == null)
                    throw new Exception("Residence Country [" + memberDto.Country + "] does not exist!!");

                // Find the Member citizenship country
                Country nationalCountry = _countriesRepository.FindById(memberDto.CitizenshipCountry);
                if (nationalCountry == null)
                    throw new Exception("Citizenship Country [" + memberDto.CitizenshipCountry + "] does not exist!!");

                // Make sure that the member is unique in national id and citizienship country
                member = FindMemberByNationalId(memberDto.NationalId, nationalCountry);
                if (member == null)
                {
                    member = CreateMember(memberType, merchant, sponsor);

                    // Update an existing member
                    member.FirstName = memberDto.FirstName;
                    member.LastName = memberDto.LastName;
                    member.Email = memberDto.Email;
                    member.City = memberDto.City;
                    member.Postal = memberDto.Postal;
                    member.LandPhone = memberDto.LandPhone;
                    member.MobilePhone = memberDto.MobilePhone;
                    member.NationalId = memberDto.NationalId; // Must not be updated
                    member.MemberSince = memberDto.CreateDate; // Must not be updated
                    member.CitizenshipCountry = nationalCountry; 
                    member.EnrollmentChannel = channel;
                    member.PreferredContact = contact;
                    member.PreferredLanguage = language;
                    member.PreferredCurrency = currency;
                    member.ResidenceCountry = residenceCountry;
                    member.PreferredTimeZone = timeZone;
                    member.Type = memberType;
                    _Context.Members.Add(member);
                }
                else
                {
                    // Update an existing member
                    member.FirstName = memberDto.FirstName;
                    member.LastName = memberDto.LastName;
                    member.Email = memberDto.Email;
                    member.City = memberDto.City;
                    member.Postal = memberDto.Postal;
                    member.LandPhone = memberDto.LandPhone;
                    member.MobilePhone = memberDto.MobilePhone;
                    member.CitizenshipCountry = nationalCountry;
                    member.EnrollmentChannel = channel;
                    member.PreferredContact = contact;
                    member.PreferredLanguage = language;
                    member.PreferredCurrency = currency;
                    member.ResidenceCountry = residenceCountry;
                    member.PreferredTimeZone = timeZone;
                }

                _Context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return member;
        }

        public List<KeyIntegerValueDataPoint> RetrieveMembersDistributionByCity()
        {
            return _Context.Database.SqlQuery<KeyIntegerValueDataPoint>(
                    " SELECT City as Identifier, count(*) as Value FROM Members GROUP BY City "
                    ).ToList();
        }

        public List<KeyIntegerValueDataPoint> RetrieveMembersDistributionByCitizenshipCountry()
        {
            return _Context.Database.SqlQuery<KeyIntegerValueDataPoint>(
                    " SELECT cntrs.Name as Identifier, count(*) as Value FROM Members m, Countries cntrs WHERE m.CitizenshipCountryId = cntrs.Id GROUP BY cntrs.Name "
                    ).ToList();
        }

        public List<KeyIntegerValueDataPoint> RetrieveMembersDistributionByEnrollmentChannel()
        {
            return _Context.Database.SqlQuery<KeyIntegerValueDataPoint>(
                    " SELECT chn.Name as Identifier, count(*) as Value FROM Members m, Channels chn WHERE m.EnrollmentChannel_Id = chn.Id GROUP BY chn.Name "
                    ).ToList();
        }

        /* P R I V A T E  M E T H O D S */
        private Member FindMemberByNationalId(string id, Country nationalCountry)
        {
            return (from m in _Context.Members
                        where (m.NationalId == id && m.CitizenshipCountry.Id == nationalCountry.Id)
                        select m).SingleOrDefault();
        }

        private static Member CreateMember(MemberType type, Merchant merchant, Sponsor sponsor)
        {
            if (type.Id == MemberType.Merchant && merchant == null)
                throw new Exception("Illegal to create a member of type [" + type.Name + "] without a valid merchant!!");

            if (type.Id == MemberType.Sponsor && sponsor == null)
                throw new Exception("Illegal to create a member of type [" + type.Name + "] without a valid sponsor!!");

            if (type.Id == MemberType.Regular)
                return new RegularMember();
            else if (type.Id == MemberType.Founding)
                return new FoundingMember();
            else if (type.Id == MemberType.Merchant)
            {
                MerchantMember member = new MerchantMember();
                member.Merchant = merchant;
                return member;
            }
            else if (type.Id == MemberType.Sponsor)
            {
                SponsorMember member = new SponsorMember();
                member.Sponsor = sponsor;
                return member;
            }
            else if (type.Id == MemberType.Yesr)
                return new YesrMember();
            else
                return new RegularMember();
        }
    }
}
