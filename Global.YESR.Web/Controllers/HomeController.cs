using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Repositories;
using Global.YESR.Web.ActionFilters;
using Global.YESR.Web.Areas.Members.ViewModels;
using Global.YESR.Web.Helpers;
using Global.YESR.Web.ViewModels;
using Global.YESR.Models.Yesr;

namespace Global.YESR.Web.Controllers
{
    public class HomeController : Controller
    {
        private IMembershipsRepository _membershipsRepository;
        private IInstancesRepository _instancesRepository;
        private ISponsorsRepository _sponsorsRepository;
        private IYesrRepository _yesrRepository;

        public HomeController(IMembershipsRepository memsRep, IInstancesRepository insRep, ISponsorsRepository spnsRep, IYesrRepository yesRep)
        {
            _membershipsRepository = memsRep;
            _instancesRepository = insRep;
            _sponsorsRepository = spnsRep;
            _yesrRepository = yesRep;
        }

        // Remote call from the viewer to validate the model test token against the database
        // WARNING: The parameter name i.e. token must match the model property name!!!
        public JsonResult VerifyTestToken(string token)
        {
            var result = false;
            var membership = _membershipsRepository.FindByTestToken(token);

            if (membership == null)
                result = true;

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Index()
        {
            ViewBag.Message = "Kick start serious saving today with YESR!";

            return View();
        }

        public ActionResult Benefits()
        {
            return View(_instancesRepository.FindById(1));
        }

        public ActionResult Sponsor()
        {
            return View(_sponsorsRepository.FindById(1));
        }

        //[CustomAuthorization(Users = "aboudank,john,sally")]
        public ActionResult About()
        {
            return View();
        }

        // About Article
        public ActionResult SavingsInnovationArticle()
        {
            return View();
        }

        // About Article
        public ActionResult TakeOffArticle()
        {
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "We would love to hear from you!";

            return View();
        }

        [Authorize]
        public ActionResult EnrollmentsMonitor()
        {
            return View();
        }

        [Authorize]
        public ActionResult BondsMonitor()
        {
            return View();
        }

        [Authorize]
        public ActionResult PurchasesMonitor()
        {
            return View();
        }

        [Authorize]
        public ActionResult EfficiencyMonitor()
        {
            return View();
        }

        //[Authorize]
        public ActionResult PumpMemberships()
        {
            return View();
        }

        [HttpPost]
        public ActionResult PumpMemberships(PumpMembershipsViewModel model)
        {
            if (ModelState.IsValid)
            {
                //Thread started =  _yesrRepository.PumpMemberships(model.Memberships, model.PurchasesPerMembership, model.DaysBetweenPurchases);
                //if (started == null)
                //    ModelState.AddModelError("", "There is already a running pump!!!");
                //else
                //    return RedirectToAction("Index", "Home", new { area = "" });

                _yesrRepository.PumpMemberships(model.Memberships, model.PurchasesPerMembership, model.DaysBetweenPurchases, true);
            }
            else
            {
                ModelState.AddModelError("", "Something is wrong!");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //[Authorize]
        public ActionResult PumpTestMembership()
        {
            return View();
        }

        [HttpPost]
        public ActionResult PumpTestMembership(PumpTestMembershipViewModel model)
        {
            if (ModelState.IsValid)
            {
                //Thread started =  _yesrRepository.PumpMemberships(model.Memberships, model.PurchasesPerMembership, model.DaysBetweenPurchases);
                //if (started == null)
                //    ModelState.AddModelError("", "There is already a running pump!!!");
                //else
                //    return RedirectToAction("Index", "Home", new { area = "" });

                _yesrRepository.PumpTestMembership(model.Token, model.Referrals, model.AverageMonthlySpend, model.Years, true);
            }
            else
            {
                ModelState.AddModelError("", "Something is wrong!");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //[Authorize]
        public ActionResult Calculator()
        {
            var testToken = SessionHelper.TestToken;

            // Alaways re-query 
            var pumps = new List<TestMembershipPump>();
            var pump = (TestMembershipPump) null;
            if (testToken != null)
                pump = _yesrRepository.RetrieveTestMembershipPumpByToken(testToken);
            if (pump != null)
                pumps.Add(pump);

            // Set default values in the model
            var model = new CalculatorViewModel()
            {
                Token = "",
                Referrals = 10,
                AverageMonthlySpend = 2500,
                Years = 1,
                Pumps = pumps
            };

            return View(model);
        }

        [HttpPost]
        public ActionResult Calculator(CalculatorViewModel model)
        {
            if (ModelState.IsValid)
            {
                //Thread started =  _yesrRepository.PumpMemberships(model.Memberships, model.PurchasesPerMembership, model.DaysBetweenPurchases);
                //if (started == null)
                //    ModelState.AddModelError("", "There is already a running pump!!!");
                //else
                //    return RedirectToAction("Index", "Home", new { area = "" });

                // Store in session
                SessionHelper.TestToken = model.Token;
                _yesrRepository.PumpTestMembership(model.Token, model.Referrals, model.AverageMonthlySpend, model.Years, true);
                return RedirectToAction("Calculator", "Home", new { area = "" });
            }
            else
            {
                ModelState.AddModelError("", "Something is wrong!");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public ActionResult CalculatorResults()
        {
            var testToken = SessionHelper.TestToken;
            if (testToken != null)
            {
                var membership = _membershipsRepository.FindByTestToken(testToken);
                var pump = _yesrRepository.RetrieveTestMembershipPumpByToken(testToken);
                if (pump != null)
                {
                    CalculatorResultsViewModel model = new CalculatorResultsViewModel();
                    model.Membership = membership;
                    model.Pump = pump;
                    return View(model);
                }
            }

            return RedirectToAction("Calculator", "Home", new { area = "" });
        }
    }
}
