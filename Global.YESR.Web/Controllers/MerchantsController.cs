using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Repositories;
using Global.YESR.Web.ViewModels;

namespace Global.YESR.Web.Controllers
{
    public class MerchantsController : Controller
    {
        private readonly IMerchantsRepository _merchantsRepository;

        // Ioc Injection via the Unity Resolver - please refer to Global.aspx start up code
        public MerchantsController(IMerchantsRepository merRep)
        {
            _merchantsRepository = merRep;
        }

        public ActionResult Index(int page = 1, int count = 10)
        {
            var merchants = _merchantsRepository.GetAll(page, count, x => x.Rating, true);
            var maxPage = Math.Max((int) Math.Ceiling((double) _merchantsRepository.CountAll()/count), 1);
            MerchantsViewModel model = new MerchantsViewModel()
            {
                Page = page,
                MaxPage = maxPage,
                Items = merchants.Select(x => x)
            };
            return View(model);
        }

        [Authorize]
        public ActionResult Edit(int id)
        {
            return View("Edit", _merchantsRepository.FindById(id));
        }

        public ActionResult Detail(int id)
        {
            return View("Detail", _merchantsRepository.FindById(id));
        }

        /// <summary>
        /// This attribute (ChildActionOnly) prevents the controller from servicing BestMerchant on its own as in:
        /// http://site/merchants/BestMerchant
        /// </summary>
        /// <returns></returns>
        [ChildActionOnly]
        public PartialViewResult BestMerchant()
        {
            return PartialView("_BestMerchant", _merchantsRepository.FindById(2));
        }
    }
}
