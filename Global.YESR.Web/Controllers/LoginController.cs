using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Global.YESR.Models;
using Global.YESR.Repositories;
using Global.YESR.Web.Helpers;
using Global.YESR.Web.ViewModels;

namespace Global.YESR.Web.Controllers
{
    public class LoginController : Controller
    {
        private IUsersRepository _usersRepository;
        private IMembershipsRepository _membershipsRepository;
        private IConfigurationItemsRepository _configurationItemsRepository;
        private IGroupsRepository _groupsRepository;
        private IMerchantsRepository _merchantsRepository;
        private ISponsorsRepository _sponsorsRepository;

        public LoginController(IUsersRepository usrRep, IMembershipsRepository memsRep, IConfigurationItemsRepository cfgRep, IGroupsRepository grpRep, IMerchantsRepository merRep, ISponsorsRepository spnRep)
        {
            _usersRepository = usrRep;
            _membershipsRepository = memsRep;
            _configurationItemsRepository = cfgRep;
            _groupsRepository = grpRep;
            _merchantsRepository = merRep;
            _sponsorsRepository = spnRep;
        }

        public ActionResult LogOn()
        {
            return View();
        }

        // Remote call from the viewer to validate the model membership number against the database
        // WARNING: The parameter name i.e. membershipNumber must match the model property name!!!
        public JsonResult VerifyMembershipNumber(string membershipNumber)
        {
            var result = false;
            var membership = _membershipsRepository.FindByMembershipNumber(membershipNumber);

            if (membership != null)
                result = true;
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // Remote call from the viewer to validate the model merchant code against the database
        // WARNING: The parameter name i.e. merchantCode must match the model property name!!!
        public JsonResult VerifyMerchantCode(string merchantCode)
        {
            var result = false;
            var merchant = _merchantsRepository.IsRegistrationTokenValid(merchantCode);

            if (merchant != null)
                result = true;

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // Remote call from the viewer to validate the model sponsor code against the database
        // WARNING: The parameter name i.e. sponsorCode must match the model property name!!!
        public JsonResult VerifySponsorCode(string sponsorCode)
        {
            var result = false;
            var sponsor = _sponsorsRepository.IsRegistrationTokenValid(sponsorCode);

            if (sponsor != null)
                result = true;

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        // Remote call from the viewer to validate the model yesr code against the database
        // WARNING: The parameter name i.e. sponsorCode must match the model property name!!!
        public JsonResult VerifyYesrCode(string yesrCode)
        {
            var result = false;
            // TODO: For now, validate locally
            if (yesrCode == "YLFM1990")
                result = true;

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult LogOn(LogOnViewModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                var actualUser = _usersRepository.FindByLogin(model.UserName);
                if (actualUser == null)
                {
                    //user not exists
                    ModelState.AddModelError("", "The user name provided is incorrect.");
                }
                else
                {
                    string hashedPassword = PasswordHelper.GetHashedPassword(model.Password);

                    if (!actualUser.Password.Equals(hashedPassword))
                    {
                        //password not valid
                        ModelState.AddModelError("", "The password provided is incorrect.");
                    }
                    else
                    {
                        FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);

                        SessionHelper.Authenticated = actualUser;

                        //TODO: Probably there is no need for redirect
                        // We should look up the user's group and redirect accordingly
                        /*
                        if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                            && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                        {
                            return Redirect(returnUrl);
                        }
                        else
                        {
                            // TODO: Must redirect to the members area
                            return RedirectToAction("Index", "Home");
                        }
                        */
                        if (actualUser.Group.Id == Group.Members)
                        {
                            return RedirectToAction("Index", "Home", new { area = "Members" });
                        }
                        else if (actualUser.Group.Id == Group.Merchants)
                        {
                            return RedirectToAction("Index", "Home", new { area = "Merchants" });
                        }
                        else if (actualUser.Group.Id == Group.Sponsors)
                        {
                            return RedirectToAction("Index", "Home", new { area = "Sponsors" });
                        }
                        else if (actualUser.Group.Id == Group.Yesr)
                        {
                            return RedirectToAction("Index", "Home", new { area = "Yesr" });
                        }
                        else
                        {
                            return RedirectToAction("Index", "Home");
                        }
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public ActionResult LogOff()
        {
            SessionHelper.Authenticated = null;
            FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Home");
        }

        public ActionResult MembersRegister()
        {
            return View();
        }

        [HttpPost]
        public ActionResult MembersRegister(MembersRegistrationViewModel model)
        {
            ModelState.Remove("Password");
            if (ModelState.IsValid)
            {
                // Make sure that the provided membership number has not been already registered
                var memItem = _configurationItemsRepository.FindByKeyAndValue(
                                                                ConfigurationItem.MembershipNumber,
                                                                model.MembershipNumber);
                if (memItem == null)
                {
                    var newUser = CreateUser(model.Password, Group.Members, model.UserName, model.Name, model.Email, ConfigurationItem.MembershipNumber, model.MembershipNumber);

                    if (newUser != null)
                    {
                        FormsAuthentication.SetAuthCookie(newUser.Login, false /* createPersistentCookie */);

                        SessionHelper.Authenticated = newUser;

                        return RedirectToAction("Index", "Home", new { area = "Members" });
                    }
                    else
                    {
                        ModelState.AddModelError("", "A user with this Login or Email exists yet.");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "This membership number has already been registered.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public ActionResult MerchantsRegister()
        {
            return View();
        }

        [HttpPost]
        public ActionResult MerchantsRegister(MerchantsRegistrationViewModel model)
        {
            ModelState.Remove("Password");
            if (ModelState.IsValid)
            {
                // Make sure that the provided merchant code has not been already registered
                var memItem = _configurationItemsRepository.FindByKeyAndValue(
                    ConfigurationItem.MerchantCode,
                    model.MerchantCode);
                if (memItem == null)
                {
                    var merchant = _merchantsRepository.FindByRegistrationToken(model.MerchantCode);
                    if (merchant != null)
                    {
                        var newUser = CreateUser(model.Password, Group.Merchants, model.UserName, model.Name,
                                                 model.Email, ConfigurationItem.MerchantCode, model.MerchantCode);

                        if (newUser != null)
                        {
                            FormsAuthentication.SetAuthCookie(newUser.Login, false /* createPersistentCookie */);

                            SessionHelper.Authenticated = newUser;

                            // Create a new merchant registration token
                            _merchantsRepository.CreateRegistrationToken(merchant.Id);
                            return RedirectToAction("Index", "Home", new {area = "Merchants"});
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("", "A merchant could not be found!");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "A user with this Login or Email exists yet.");
                }
            }
            else
            {
                ModelState.AddModelError("", "This merchant code has already been registered.");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public ActionResult SponsorsRegister()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SponsorsRegister(SponsorsRegistrationViewModel model)
        {
            ModelState.Remove("Password");
            if (ModelState.IsValid)
            {
                // Make sure that the provided sponsor code has not been already registered
                var memItem = _configurationItemsRepository.FindByKeyAndValue(
                                                                ConfigurationItem.SponsorCode,
                                                                model.SponsorCode);
                if (memItem == null)
                {
                    var sponsor = _sponsorsRepository.FindByRegistrationToken(model.SponsorCode);
                    if (sponsor != null)
                    {
                        var newUser = CreateUser(model.Password, Group.Sponsors, model.UserName, model.Name, model.Email,
                                                 ConfigurationItem.SponsorCode, model.SponsorCode);

                        if (newUser != null)
                        {
                            FormsAuthentication.SetAuthCookie(newUser.Login, false /* createPersistentCookie */);

                            SessionHelper.Authenticated = newUser;

                            // Create a new sponsor registration token
                            _sponsorsRepository.CreateRegistrationToken(sponsor.Id);
                            return RedirectToAction("Index", "Home", new {area = "Sponsors"});
                        }
                        else
                        {
                            ModelState.AddModelError("", "A user with this Login or Email exists yet.");
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("", "A sponsor could not be found!");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "This sponsor code has already been registered.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public ActionResult YesrRegister()
        {
            return View();
        }

        [HttpPost]
        public ActionResult YesrRegister(YesrRegistrationViewModel model)
        {
            ModelState.Remove("Password");
            if (ModelState.IsValid)
            {
                // Allow as many YESR users to sign up with the same YESR code
                var newUser = CreateUser(model.Password, Group.Yesr, model.UserName, model.Name, model.Email, ConfigurationItem.YesrCode, model.YesrCode);

                if (newUser != null)
                {
                    FormsAuthentication.SetAuthCookie(newUser.Login, false /* createPersistentCookie */);

                    SessionHelper.Authenticated = newUser;

                    return RedirectToAction("Index", "Home", new { area = "Yesr" });
                }
                else
                {
                    ModelState.AddModelError("", "A user with this Login or Email exists yet.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [Authorize]
        public ActionResult ChangePassword()
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        public ActionResult ChangePassword(ChangePasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                string hashedNewPassword = PasswordHelper.GetHashedPassword(model.NewPassword);
                string hashedOldPassword = PasswordHelper.GetHashedPassword(model.OldPassword);

                var actualUser = SessionHelper.Authenticated;

                if (actualUser.Password.Equals(hashedOldPassword))
                {
                    actualUser.Password = hashedNewPassword;
                    _usersRepository.Modify(actualUser);

                    return RedirectToAction("ChangePasswordSuccess");
                }
                else
                {
                    ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public ActionResult ChangePasswordSuccess()
        {
            return View();
        }

        // P R I V A T E  M E T H O D S
        private User CreateUser(string password, string group, string userName, string name, string email, string itemKey, string itemValue)
        {
            string hashedPassword = PasswordHelper.GetHashedPassword(password);

            // Pick up the group
            Group groupObject = _groupsRepository.FindById(group);
            if (groupObject == null)
                return null;

            var key = ConfigurationItem.MembershipNumber;

            if (groupObject.Id == Group.Members)
                key = ConfigurationItem.MembershipNumber;
            else if (groupObject.Id == Group.Merchants)
                key = ConfigurationItem.MerchantCode;
            else if (groupObject.Id == Group.Sponsors)
                key = ConfigurationItem.SponsorCode;
            else if (groupObject.Id == Group.Yesr)
                key = ConfigurationItem.YesrCode;

            // Attempt to register the user
            User newUser = new User();
            newUser.Login = userName;
            newUser.Name = userName;
            newUser.Password = hashedPassword;
            newUser.Email = email;
            newUser.Group = groupObject;


            ConfigurationItem item = new ConfigurationItem();
            item.Key = key;
            item.Value = itemValue;
            newUser.ConfigurationItems.Add(item);
            _usersRepository.Add(newUser);

            if (newUser != null && newUser.Id != 0)
                return newUser;
            else
                return null;
        }
    }
}
