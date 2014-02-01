using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;
using Global.YESR.Models.Members;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Repositories;
using Global.YESR.Repositories.Helpers;

namespace Global.YESR.ConsoleApp
{
    public class Program
    {
        private static void Main(string[] args)
        {
            DateTime startTime = DateTime.Now;
            var initialMemberships = 10;
            var initialPurchasesPerMembership = 30;
            var initialDaysBetweenPurchases = 20;

            var memberships = 5000;
            var purchasesPerMembership = 75;
            var daysBetweenPurchases = 10;

            if (0 == 1)
            {
                var seeder = new DatabaseSeeder();
                seeder.CreateInitialData();
                seeder.CreateTransactions(initialMemberships, initialPurchasesPerMembership, initialDaysBetweenPurchases);
            } 
            else if (0 == 1)
            {
                var seeder = new DatabaseSeeder(false);
                seeder.DisplayTransactionDates();
            }
            else if (0 == 0)
            {
                var seeder = new DatabaseSeeder(false);
                seeder.CreateTransactions(memberships, purchasesPerMembership, daysBetweenPurchases);
            }
            else if (0 == 1)
            {
                var seeder = new DatabaseSeeder(false);
                seeder.CreateCountries();            
            }
            else if (0 == 1)
            {
                var seeder = new DatabaseSeeder();
            }
            else if (0 == 1)
            {
                var seeder = new DatabaseSeeder(false);
                seeder.PumpMembershipsViaThreads(memberships, purchasesPerMembership, daysBetweenPurchases);
            }
            else if (0 == 1)
            {
                var seeder = new DatabaseSeeder(false);
                seeder.CreateTestMembership("mytesttoken" + Guid.NewGuid(), 1, 5000, 1);
            }
            else if (0 == 1)
            {
                var context = new YContext();
                IYesrRepository yesrRepository = new YesrRepository(context);
                yesrRepository.RetrieveMonthlyStatsByMembership(22, "AED");
            }

            Console.WriteLine("Completed " + memberships + " memberships at " + DateTime.Now + "! Each has a max of " + purchasesPerMembership + " purchases with " + daysBetweenPurchases + " max days between purchases. The process took: " + DateTime.Now.Subtract(startTime).TotalMinutes + " minutes.");
            Console.ReadLine();
        }
    }
}
