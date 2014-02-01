using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.InvestmentSchemes;
using Global.YESR.Models.InvestmentUnitTransactions;
using Global.YESR.Models.Invoices;
using Global.YESR.Models.MemberTransactions;
using Global.YESR.Models.Members;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Models.Payments;
using Global.YESR.Models.Sponsors;
using Global.YESR.Models.Statements;
using Global.YESR.Models.Yesr;

namespace Global.YESR.Repositories
{
    public class YContext : DbContext
    {
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<EligibleSpend> EligibleSpends { get; set; }
        public DbSet<Instance> Instances { get; set; }
        public DbSet<InvestmentScheme> InvestmentSchemes { get; set; }
        public DbSet<InvestmentUnit> InvestmentUnits { get; set; }
        public DbSet<InvestmentUnitTransaction> InvestmentUnitTransactions { get; set; }
        public DbSet<PayoutEvent> PayoutEvents { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceLineItem> InvoiceLineItems { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<MemberType> MemberTypes { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<MemberTransaction> MemberTransactions { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<MembershipRegistrationToken> MembershipRegistrationTokens { get; set; }
        public DbSet<MembershipTransaction> MembershipTransactions { get; set; }
        public DbSet<Merchant> Merchants { get; set; }
        public DbSet<MerchantRegistrationToken> MerchantRegistrationTokens { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Period> Periods { get; set; }
        public DbSet<Receivable> Receivables { get; set; }
        public DbSet<Region> Regions { get; set; }
        public DbSet<Spend> Spends { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }
        public DbSet<SponsorRegistrationToken> SponsorRegistrationTokens { get; set; }
        public DbSet<Statement> Statements { get; set; }
        public DbSet<YESR.Models.TimeZone> TimeZones { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<ConfigurationItem> ConfigurationItems{ get; set; }
        public DbSet<MembershipsPump> MembershipsPumps { get; set; }
        public DbSet<TestMembershipPump> TestMembershipPumps { get; set; }
        public DbSet<TestMembershipDeleter> TestMembershipDeleters { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // For now, turn off all cascade delete on one to many relationships
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

            // Configurations for base classes
            modelBuilder.Configurations.Add(new CountryConfiguration());
            modelBuilder.Configurations.Add(new EligibleSpendConfiguration());
            modelBuilder.Configurations.Add(new InstanceConfiguration());
            modelBuilder.Configurations.Add(new InvestmentUnitConfiguration());
            modelBuilder.Configurations.Add(new InvestmentUnitTransactionConfiguration());
            modelBuilder.Configurations.Add(new PayoutEventConfiguration());
            modelBuilder.Configurations.Add(new InvoiceConfiguration());
            modelBuilder.Configurations.Add(new InvoiceLineItemsConfiguration());
            modelBuilder.Configurations.Add(new MemberConfiguration());
            modelBuilder.Configurations.Add(new MemberTransactionConfiguration());
            modelBuilder.Configurations.Add(new MembershipConfiguration());
            modelBuilder.Configurations.Add(new MembershipRegistrationTokenConfiguration());
            modelBuilder.Configurations.Add(new MembershipTransactionConfiguration());
            modelBuilder.Configurations.Add(new PaymentConfiguration());
            modelBuilder.Configurations.Add(new ReceivableConfiguration());
            modelBuilder.Configurations.Add(new StatementConfiguration());
            modelBuilder.Configurations.Add(new UserConfiguration());
            modelBuilder.Configurations.Add(new RoleConfiguration());
            modelBuilder.Configurations.Add(new GroupConfiguration());
            modelBuilder.Configurations.Add(new ConfigurationItemConfiguration());
            modelBuilder.Configurations.Add(new MerchantRegistrationTokenConfiguration());
            modelBuilder.Configurations.Add(new SponsorRegistrationTokenConfiguration());

            // Configurations for extended classes
            modelBuilder.Configurations.Add(new AccumulationReserveConfiguration());
            modelBuilder.Configurations.Add(new PurchaseConfiguration());
            modelBuilder.Configurations.Add(new CashBackBonusConfiguration());
            modelBuilder.Configurations.Add(new AdminFeeConfiguration());
            modelBuilder.Configurations.Add(new ReferralBonusConfiguration());
            modelBuilder.Configurations.Add(new OwnerChangeConfiguration());
            modelBuilder.Configurations.Add(new PlacementChangeConfiguration());
            modelBuilder.Configurations.Add(new TradingEventConfiguration());
            modelBuilder.Configurations.Add(new MerchantInvoiceConfiguration());
            modelBuilder.Configurations.Add(new SponsorInvoiceConfiguration());
            modelBuilder.Configurations.Add(new MerchantMemberConfiguration());
            modelBuilder.Configurations.Add(new SponsorMemberConfiguration());
            modelBuilder.Configurations.Add(new ProfileUpdateConfiguration());
            modelBuilder.Configurations.Add(new MemberPaymentConfiguration());
            modelBuilder.Configurations.Add(new MemberStatementConfiguration());
            modelBuilder.Configurations.Add(new MerchantStatementConfiguration());
            modelBuilder.Configurations.Add(new SponsorStatementConfiguration());

            //modelBuilder.Entity<Member>().Property(p => p.FirstName).HasMaxLength(30).IsRequired();
            //modelBuilder.Entity<Member>().Property(p => p.LastName).HasMaxLength(30).IsRequired();

            //modelBuilder.Entity<Security>().ToTable("Securities");
            //modelBuilder.Entity<Stock>().ToTable("Securities_Stock");
            //modelBuilder.Entity<MutualFund>().ToTable("Securities_MutualFund");

            //modelBuilder.Entity<WatchList>()
            //    .HasMany(w => w.Securities).WithMany()
            //    .Map(map => map.ToTable("WatchListSecurity")
            //                    .MapRightKey("SecurityId")
            //                    .MapLeftKey("WatchListId"));
        }
    }

    internal class CountryConfiguration : EntityTypeConfiguration<Country>
    {
        public CountryConfiguration()
        {
            HasRequired(l => l.Region).WithMany().Map(c => c.MapKey("RegionId"));
            HasRequired(l => l.Currency).WithMany().Map(c => c.MapKey("CurrencyId"));
        }
    }

    internal class EligibleSpendConfiguration : EntityTypeConfiguration<EligibleSpend>
    {
        public EligibleSpendConfiguration()
        {
            // Indicate that this has a compund key consisting of two keys
            HasKey(k => new {k.MerchantId, k.SpendId});
            //HasRequired(l => l.Merchant).WithMany(d => d.EligibleSpends).Map(c => c.MapKey("MerchantId"));
            //HasRequired(l => l.Spend).WithMany().Map(c => c.MapKey("SpendId"));
        }
    }

    internal class InstanceConfiguration : EntityTypeConfiguration<Instance>
    {
        public InstanceConfiguration()
        {
            HasRequired(l => l.Country).WithMany().Map(c => c.MapKey("CountryId"));
            HasRequired(l => l.Sponsor).WithMany().Map(c => c.MapKey("SponsorId"));
            HasRequired(l => l.InvestmentScheme).WithMany().Map(c => c.MapKey("InvestmentSchemeId"));
            HasRequired(l => l.GlobalPivotCurrency).WithMany().Map(c => c.MapKey("GlobalPivotCurrencyId"));
        }
    }

    internal class InvestmentUnitConfiguration : EntityTypeConfiguration<InvestmentUnit>
    {
        public InvestmentUnitConfiguration()
        {
            HasRequired(l => l.InvestmentScheme).WithMany().Map(c => c.MapKey("InvestmentSchemeId"));
            HasRequired(l => l.Membership).WithMany().Map(c => c.MapKey("MembershipId"));
            HasRequired(l => l.Sponsor).WithMany().Map(c => c.MapKey("SponsorId"));
            HasOptional(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
            HasOptional(l => l.SponsorInvoice).WithMany().Map(c => c.MapKey("SponsorInvoiceId"));
            HasOptional(l => l.PayoutEvent).WithMany().Map(c => c.MapKey("PayoutEventId"));
            HasOptional(l => l.Parent).WithMany().Map(c => c.MapKey("ParentId"));
            HasOptional(l => l.LeftChild).WithMany().Map(c => c.MapKey("LeftChildId"));
            HasOptional(l => l.RightChild).WithMany().Map(c => c.MapKey("RightChildId"));
        }
    }

    internal class InvestmentUnitTransactionConfiguration : EntityTypeConfiguration<InvestmentUnitTransaction>
    {
        public InvestmentUnitTransactionConfiguration()
        {
            HasRequired(l => l.InvestmentUnit).WithMany().Map(c => c.MapKey("InvestmentUnitId"));
            HasRequired(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
        }
    }

    internal class PayoutEventConfiguration : EntityTypeConfiguration<PayoutEvent>
    {
        public PayoutEventConfiguration()
        {
            Property(p => p.PayDate).IsOptional();
        }
    }

    internal class InvoiceConfiguration : EntityTypeConfiguration<Invoice>
    {
        public InvoiceConfiguration()
        {
            HasOptional(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
        }
    }

    internal class InvoiceLineItemsConfiguration : EntityTypeConfiguration<InvoiceLineItem>
    {
        public InvoiceLineItemsConfiguration()
        {
            HasRequired(l => l.Invoice).WithMany().Map(c => c.MapKey("InvoiceId"));
        }
    }

    internal class MemberConfiguration : EntityTypeConfiguration<Member>
    {
        public MemberConfiguration()
        {
            HasOptional(l => l.CitizenshipCountry).WithMany().Map(c => c.MapKey("CitizenshipCountryId"));
            HasOptional(l => l.ResidenceCountry).WithMany().Map(c => c.MapKey("ResidenceCountryId"));
            HasRequired(l => l.PreferredContact).WithMany().Map(c => c.MapKey("PreferredContactId"));
            HasRequired(l => l.PreferredCurrency).WithMany().Map(c => c.MapKey("PreferredCurrencyId"));
            HasRequired(l => l.PreferredLanguage).WithMany().Map(c => c.MapKey("PreferredLanguageId"));
            HasRequired(l => l.PreferredTimeZone).WithMany().Map(c => c.MapKey("PreferredTimeZoneId"));
            HasRequired(l => l.EnrollmentChannel).WithMany().Map(c => c.MapKey("EnrollmentChannelId"));
            HasRequired(l => l.Type).WithMany().Map(c => c.MapKey("MemberTypeId"));
        }
    }

    internal class MembershipConfiguration : EntityTypeConfiguration<Membership>
    {
        public MembershipConfiguration()
        {
            Property(p => p.MembershipNumber).IsRequired();
            Property(p => p.SuspendedDate).IsOptional();
            Property(p => p.TerminatedDate).IsOptional();
            HasRequired(l => l.Member).WithMany().Map(c => c.MapKey("MemberId"));
            HasRequired(l => l.Instance).WithMany().Map(c => c.MapKey("InstanceId"));
            HasOptional(l => l.Parent).WithMany().Map(c => c.MapKey("ParentId"));
        }
    }

    internal class MembershipTransactionConfiguration : EntityTypeConfiguration<MembershipTransaction>
    {
        public MembershipTransactionConfiguration()
        {
            // Define the discriminator column via the mapping
            // Otherwise EF will create a new column called 'Discriminator' which will store the Type (i.e. Purchase, Fulfillment) in the field
            // Anyway,....this did not work!!!
            //Map(m =>
            //        {
            //            m.ToTable("MembershipTransactions");
            //            m.Requires("TransactionType").HasValue(0);
            //        })
            //    .Map<Purchase>(m =>
            //                        {
            //                            m.Requires("TransactionType").HasValue(1);
            //                        })
            //    .Map<Fulfillment>(m =>
            //                            { 
            //                                m.Requires("TransactionType").HasValue(2);
            //                            });

            HasRequired(l => l.Membership).WithMany().Map(c => c.MapKey("MembershipId"));
            HasRequired(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
            HasOptional(l => l.Currency).WithMany().Map(c => c.MapKey("CurrencyId"));
        }
    }

    internal class MembershipRegistrationTokenConfiguration : EntityTypeConfiguration<MembershipRegistrationToken>
    {
        public MembershipRegistrationTokenConfiguration()
        {
            HasRequired(l => l.Membership).WithMany().Map(c => c.MapKey("MembershipId"));
        }
    }

    internal class MerchantRegistrationTokenConfiguration : EntityTypeConfiguration<MerchantRegistrationToken>
    {
        public MerchantRegistrationTokenConfiguration()
        {
            HasRequired(l => l.Merchant).WithMany().Map(c => c.MapKey("MerchantId"));
        }
    }

    internal class SponsorRegistrationTokenConfiguration : EntityTypeConfiguration<SponsorRegistrationToken>
    {
        public SponsorRegistrationTokenConfiguration()
        {
            HasRequired(l => l.Sponsor).WithMany().Map(c => c.MapKey("SponsorId"));
        }
    }

    internal class MemberTransactionConfiguration : EntityTypeConfiguration<MemberTransaction>
    {
        public MemberTransactionConfiguration()
        {
            HasRequired(l => l.Member).WithMany().Map(c => c.MapKey("MemberId"));
            HasRequired(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
        }
    }

    internal class PaymentConfiguration : EntityTypeConfiguration<Payment>
    {
        public PaymentConfiguration()
        {
            HasRequired(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
        }
    }

    internal class ReceivableConfiguration : EntityTypeConfiguration<Receivable>
    {
        public ReceivableConfiguration()
        {
            HasRequired(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
        }
    }

    internal class StatementConfiguration : EntityTypeConfiguration<Statement>
    {
        public StatementConfiguration()
        {
            HasRequired(l => l.Period).WithMany().Map(c => c.MapKey("PeriodId"));
        }
    }

    internal class UserConfiguration : EntityTypeConfiguration<User>
    {
        public UserConfiguration()
        {
            HasRequired(l => l.Group).WithMany().Map(c => c.MapKey("GroupId"));
            HasMany(t => t.Roles).WithMany(a => a.Users).Map(c =>
                                                        {
                                                            c.ToTable("UserRoles");
                                                            c.MapLeftKey("RoleId"); // Refers to the class being configured
                                                            c.MapRightKey("UserId");
                                                        });
        }
    }

    internal class RoleConfiguration : EntityTypeConfiguration<Role>
    {
        public RoleConfiguration()
        {
        }
    }

    internal class GroupConfiguration : EntityTypeConfiguration<Group>
    {
        public GroupConfiguration()
        {
        }
    }

    internal class ConfigurationItemConfiguration : EntityTypeConfiguration<ConfigurationItem>
    {
        public ConfigurationItemConfiguration()
        {
            HasRequired(l => l.User).WithMany(l => l.ConfigurationItems).Map(c => c.MapKey("UserId"));
        }
    }

    // Configurations for Extended Classes
    //TODO: Extended classes of the same base cannot share the same column names!!!
    internal class AccumulationReserveConfiguration : EntityTypeConfiguration<AccumulationReserve>
    {
        public AccumulationReserveConfiguration()
        {
            HasRequired(l => l.Purchase).WithMany().Map(c => c.MapKey("AccumulationReservePurchaseId"));
            HasOptional(l => l.InvestmentUnit).WithMany().Map(c => c.MapKey("InvestmentUnitId"));
        }
    }

    internal class AdminFeeConfiguration : EntityTypeConfiguration<AdminFee>
    {
        public AdminFeeConfiguration()
        {
            HasRequired(l => l.Purchase).WithMany().Map(c => c.MapKey("AdminFeePurchaseId"));
        }
    }

    internal class CashBackBonusConfiguration : EntityTypeConfiguration<CashBackBonus>
    {
        public CashBackBonusConfiguration()
        {
            HasRequired(l => l.Purchase).WithMany().Map(c => c.MapKey("CashBackBonusPurchaseId"));
        }
    }

    internal class PurchaseConfiguration : EntityTypeConfiguration<Purchase>
    {
        public PurchaseConfiguration()
        {
            HasRequired(l => l.Merchant).WithMany().Map(c => c.MapKey("MerchantId"));
            HasRequired(l => l.Invoice).WithMany().Map(c => c.MapKey("MerchantInvoiceId"));
        }
    }

    internal class ReferralBonusConfiguration : EntityTypeConfiguration<ReferralBonus>
    {
        public ReferralBonusConfiguration()
        {
            HasRequired(l => l.Beneficiary).WithMany().Map(c => c.MapKey("BeneficiaryId"));
            HasRequired(l => l.Purchase).WithMany().Map(c => c.MapKey("ReferralBonusPurchaseId"));
        }
    }

    internal class OwnerChangeConfiguration : EntityTypeConfiguration<OwnerChange>
    {
        public OwnerChangeConfiguration()
        {
            HasRequired(l => l.NewMembership).WithMany().Map(c => c.MapKey("NewMembershipId"));
            HasRequired(l => l.OldMembership).WithMany().Map(c => c.MapKey("OldMembershipId"));
        }
    }

    internal class PlacementChangeConfiguration : EntityTypeConfiguration<PlacementChange>
    {
        public PlacementChangeConfiguration()
        {
            HasRequired(l => l.NewLeftChild).WithMany().Map(c => c.MapKey("NewLeftChildId"));
            HasRequired(l => l.NewRightChild).WithMany().Map(c => c.MapKey("NewRightChildId"));
            HasRequired(l => l.NewParent).WithMany().Map(c => c.MapKey("NewParentId"));
            HasRequired(l => l.OldLeftChild).WithMany().Map(c => c.MapKey("OldLeftChildId"));
            HasRequired(l => l.OldRightChild).WithMany().Map(c => c.MapKey("OldRightChildId"));
            HasRequired(l => l.OldParent).WithMany().Map(c => c.MapKey("OldParentId"));
        }
    }

    internal class TradingEventConfiguration : EntityTypeConfiguration<TradingEvent>
    {
        public TradingEventConfiguration()
        {
            HasRequired(l => l.TradingPartner).WithMany().Map(c => c.MapKey("TradingPartnerId"));
            HasRequired(l => l.TradingUnit).WithMany().Map(c => c.MapKey("TradingUnitId"));
        }
    }

    internal class MerchantInvoiceConfiguration : EntityTypeConfiguration<MerchantInvoice>
    {
        public MerchantInvoiceConfiguration()
        {
            HasRequired(l => l.Merchant).WithMany().Map(c => c.MapKey("MerchantId"));
        }
    }

    internal class SponsorInvoiceConfiguration : EntityTypeConfiguration<SponsorInvoice>
    {
        public SponsorInvoiceConfiguration()
        {
            HasRequired(l => l.Sponsor).WithMany().Map(c => c.MapKey("SponsorId"));
        }
    }

    internal class MerchantMemberConfiguration : EntityTypeConfiguration<MerchantMember>
    {
        public MerchantMemberConfiguration()
        {
            HasRequired(l => l.Merchant).WithMany().Map(c => c.MapKey("MerchantId"));
        }
    }

    internal class SponsorMemberConfiguration : EntityTypeConfiguration<SponsorMember>
    {
        public SponsorMemberConfiguration()
        {
            HasRequired(l => l.Sponsor).WithMany().Map(c => c.MapKey("SponsorId"));
        }
    }

    internal class ProfileUpdateConfiguration : EntityTypeConfiguration<ProfileUpdate>
    {
        public ProfileUpdateConfiguration()
        {
            HasOptional(l => l.NewCountry).WithMany().Map(c => c.MapKey("NewCountryId"));
            HasOptional(l => l.OldCountry).WithMany().Map(c => c.MapKey("OldCountryId"));
        }
    }

    internal class MemberPaymentConfiguration : EntityTypeConfiguration<MemberPayment>
    {
        public MemberPaymentConfiguration()
        {
            HasRequired(l => l.Member).WithMany().Map(c => c.MapKey("MemberId"));
        }
    }

    internal class MemberStatementConfiguration : EntityTypeConfiguration<MemberStatement>
    {
        public MemberStatementConfiguration()
        {
            HasRequired(l => l.Member).WithMany().Map(c => c.MapKey("MemberId"));
        }
    }

    internal class MerchantStatementConfiguration : EntityTypeConfiguration<MerchantStatement>
    {
        public MerchantStatementConfiguration()
        {
            HasRequired(l => l.Merchant).WithMany().Map(c => c.MapKey("MerchantId"));
        }
    }

    internal class SponsorStatementConfiguration : EntityTypeConfiguration<SponsorStatement>
    {
        public SponsorStatementConfiguration()
        {
            HasRequired(l => l.Sponsor).WithMany().Map(c => c.MapKey("SponsorId"));
        }
    }

    /*** Initializer ****/
    /// <summary>
    /// Only the primitive types! The ones that contain navigational properties do not work well. Well...they do 
    /// but we have to load them either via 'Include' or expliciyly via 'Reference' or 'Collection'.
    /// </summary>
    public class DropCreateDatabaseAlwaysWithSeedData : DropCreateDatabaseAlways<Global.YESR.Repositories.YContext>
    {
        protected override void Seed(YContext context)
        {
            try
            {
                context.Groups.Add(new Group() { Id = Group.Yesr, Name = Group.Yesr, Description = "Yesr User. It can be admins, employess or officers."});
                context.Groups.Add(new Group() { Id = Group.Members, Name = Group.Members, Description = "Yesr Member Users"});
                context.Groups.Add(new Group() { Id = Group.Merchants, Name = Group.Merchants, Description = "Yesr Merchant Users" });
                context.Groups.Add(new Group() { Id = Group.Sponsors, Name = Group.Sponsors, Description = "Yesr Sponsor Users" });

                context.MemberTypes.Add(new MemberType() { Id = MemberType.Regular, Name = MemberType.Regular });
                context.MemberTypes.Add(new MemberType() { Id = MemberType.Founding, Name = MemberType.Founding });
                context.MemberTypes.Add(new MemberType() { Id = MemberType.Yesr, Name = MemberType.Yesr });
                context.MemberTypes.Add(new MemberType() { Id = MemberType.Merchant, Name = MemberType.Merchant });
                context.MemberTypes.Add(new MemberType() { Id = MemberType.Sponsor, Name = MemberType.Sponsor });

                context.Channels.Add(new Channel() { Id = Channel.Web, Name = Channel.Web });
                context.Channels.Add(new Channel() { Id = Channel.Form, Name = Channel.Form });

                context.Contacts.Add(new Contact() { Id = Contact.None, Name = Contact.None });
                context.Contacts.Add(new Contact() { Id = Contact.Email, Name = Contact.Email });
                context.Contacts.Add(new Contact() { Id = Contact.Sms, Name = Contact.Sms });

                context.Languages.Add(new Language() { Id = "EN", Name = "English" });
                context.Languages.Add(new Language() { Id = "AR", Name = "Arabic" });

                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -12, Name = "GMT -12" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -11, Name = "GMT -11" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -10, Name = "GMT -10" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -9, Name = "GMT -9" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -8, Name = "GMT -8" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -7, Name = "GMT -7" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -6, Name = "GMT -6" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -5, Name = "GMT -5" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -4, Name = "GMT -4" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -3, Name = "GMT -3" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -2, Name = "GMT -2" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = -1, Name = "GMT -1" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 0, Name = "GMT" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 1, Name = "GMT +1" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 2, Name = "GMT +2" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 3, Name = "GMT +3" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 4, Name = "GMT +4" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 5, Name = "GMT +5" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 6, Name = "GMT +6" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 7, Name = "GMT +7" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 8, Name = "GMT +8" });
                context.TimeZones.Add(new YESR.Models.TimeZone() { Id = 9, Name = "GMT +9" });

                context.InvestmentSchemes.Add(new StandardScheme()
                {
                    Id = InvestmentScheme.StandardScheme,
                    CreateDate = DateTime.Today,
                    DividendTrigger = 50, // It should be 50 at least
                    OwnDividendCoefficient = 25, // Usually 25% of 100 DHS which is the price of the YBond
                    ChildrenDividendCoefficient = 20, // Usually 50% of the own coefficient
                    GrandChildrenDividendCoefficient = 15,// Usually 50% of the children coefficient
                    OthersDividendCoefficient = 10,// Usually 50% of the children coefficient
                    IsTradingAllowed = false,
                    IsOwnershipChangeAllowed = false,
                    IsValueSolicitationAllowed = false
                });
                context.InvestmentSchemes.Add(new PowerScheme()
                {
                    Id = InvestmentScheme.PowerScheme, 
                    CreateDate = DateTime.Today,
                    DividendTrigger = 50,
                    OwnDividendCoefficient = 0, // Not applicable
                    ChildrenDividendCoefficient = 0, // Not applicable
                    GrandChildrenDividendCoefficient = 0, // Not applicable
                    OthersDividendCoefficient = 0, // Not Applicable
                    IsTradingAllowed = false, 
                    IsOwnershipChangeAllowed = false, 
                    IsValueSolicitationAllowed = false
                });

                Sponsor sponsor = new NationalBonds()
                                      {
                                          Name = "National Bonds",
                                          IsSponsorPayMember = true,
                                          PurchasesQualifyForRefund = 50,
                                          RefundPercentage = 25,
                                          ManagementFeePercentage = 5,
                                          Rating = 10,
                                          CurrentCounter = 0,
                                          GlobalCounter = 0,
                                          CurrentInvoiceCounter = 0,
                                          AcquisitionDate = DateTime.Now
                                      };
                context.Sponsors.Add(sponsor);

                context.Merchants.Add(new Merchant() { Name = "Carrefour", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/carrefour.png", Rating = 7, TotalDiscount = 10, CashBackDiscount = 1.5, IsOnline = false, AcquisitionDate = DateTime.Now, Category = "Grocery", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "Spinneys", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/spinneys.png", Rating = 8, TotalDiscount = 8, CashBackDiscount = 2, IsOnline = false, AcquisitionDate = DateTime.Now, Category = "Grocery", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "LuLu", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/lulu.png", Rating = 6, TotalDiscount = 7, CashBackDiscount = 1.5, IsOnline = false, AcquisitionDate = DateTime.Now, Category = "Grocery", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "Qanz", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/qnaz.png", Rating = 5, TotalDiscount = 9, CashBackDiscount = 1, IsOnline = false, AcquisitionDate = DateTime.Now, Category = "Clothing", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "Damas", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/damas.png", Rating = 4, TotalDiscount = 10, CashBackDiscount = 1, IsOnline = false, AcquisitionDate = DateTime.Now, Category = "Jewelry", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "Give a Night", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/giveanight.png", Rating = 4, TotalDiscount = 10, CashBackDiscount = 1, IsOnline = true, AcquisitionDate = DateTime.Now, Category = "Hotels", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "Flora Queen", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/floraqueen.png", Rating = 4, TotalDiscount = 10, CashBackDiscount = 1, IsOnline = true, AcquisitionDate = DateTime.Now, Category = "Flowers", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "Perfume Emporium", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/perfumeemporium.png", Rating = 4, TotalDiscount = 10, CashBackDiscount = 1, IsOnline = true, AcquisitionDate = DateTime.Now, Category = "Beauty", CurrentInvoiceCounter = 0 });
                context.Merchants.Add(new Merchant() { Name = "Ticket Network", Description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum", ImageUrl = "~/content/images/ticketnetwork.png", Rating = 4, TotalDiscount = 10, CashBackDiscount = 1, IsOnline = true, AcquisitionDate = DateTime.Now, Category = "Tickets", CurrentInvoiceCounter = 0 });
                
                context.Spends.Add(new Spend() { Id = "01", Name = "Food"});
                context.Spends.Add(new Spend() { Id = "02", Name = "Beverage" });

                Currency uaeCurrency = new Currency() {Id = "AED", Symbol = "AE", Name = "Dirham Emarati", Rate = 3.67};
                Currency usdCurrency = new Currency() {Id = "USD", Symbol = "$", Name = "United States Dollars", Rate = 1.00};
                Currency lebCurrency = new Currency() { Id = "LEB", Symbol = "LB", Name = "Lebanese Pound", Rate = 1500 };
                Currency saCurrency = new Currency() { Id = "SAR", Symbol = "SR", Name = "Saudi Ryal", Rate = 3.67 };
                Currency egCurrency = new Currency() { Id = "EGY", Symbol = "EG", Name = "Egyptian Jeneh", Rate = 7 };

                context.Currencies.Add(uaeCurrency);
                context.Currencies.Add(usdCurrency);
                context.Currencies.Add(lebCurrency);
                context.Currencies.Add(saCurrency);
                context.Currencies.Add(egCurrency);

                Region region = new Region() {Id = "ME", Name = "Middle East"};
                context.Regions.Add(region);

                Country country = new Country();
                country.Id = "UAE";
                country.Name = "United Arab Emirates";
                country.Region = region;
                country.Currency = uaeCurrency;
                context.Countries.Add(country);

                country = new Country();
                country.Id = "LEB";
                country.Name = "Lebanon";
                country.Region = region;
                country.Currency = lebCurrency;
                context.Countries.Add(country);

                country = new Country();
                country.Id = "SAR";
                country.Name = "Saudi Arabia";
                country.Region = region;
                country.Currency = saCurrency;
                context.Countries.Add(country);

                country = new Country();
                country.Id = "EGY";
                country.Name = "Egypt";
                country.Region = region;
                country.Currency = egCurrency;
                context.Countries.Add(country);

                context.Roles.Add(new Role() { Id = Role.Admins, Description = Role.Admins });
                context.Roles.Add(new Role() {Id = Role.IT, Description = Role.IT});
                context.Roles.Add(new Role() {Id = Role.Marketing, Description = Role.Marketing});
                context.Roles.Add(new Role() {Id = Role.Officers, Description = Role.Officers});
                context.Roles.Add(new Role() {Id = Role.SupportAgents, Description = Role.SupportAgents});

                /*
                 * we cannot add users because the password will not be encryted and will fail the model validation
                User adminUser = new User() {Email = "admin@yesrgroup.com", Login = "admin", Name = "Yesr Admin", Password = "adminadmin", PhotoUrl = ""};
                adminUser.Roles.Add(adminRole);
                context.Users.Add(adminUser);
                */

                base.Seed(context);
            }
            catch (DbEntityValidationException ex)
            {
                foreach (var EVE in ex.EntityValidationErrors)
                {
                    Console.WriteLine(EVE);
                }
            }
        }
    }
}