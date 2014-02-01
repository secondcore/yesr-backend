using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Models;
using Global.YESR.Models.Yesr;
using Global.YESR.Repositories;
using Global.YESR.Web.ViewModels;

namespace Global.YESR.Web.Helpers
{
    /// <summary>
    /// This class is copied from some MVC project sample on Microsoft site
    /// </summary>
    public static class SessionHelper
    {
        public static User Authenticated
        {
            get
            {
                var actualUser = (User)HttpContext.Current.Session["AuthenticatedUser"];
                if (actualUser == null && HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    var repository = DependencyResolver.Current.GetService(typeof(IUsersRepository)) as IUsersRepository;
                    actualUser = repository.FindByLogin(HttpContext.Current.User.Identity.Name);
                    Authenticated = actualUser;
                }
                return actualUser;
            }
            set
            {
                HttpContext.Current.Session["AuthenticatedUser"] = value;
            }
        }

        public static string TestToken
        {
            get
            {
                var token = (string)HttpContext.Current.Session["TestToken"];
                return token;
            }
            set
            {
                HttpContext.Current.Session["TestToken"] = value;
            }
        }
    }
}