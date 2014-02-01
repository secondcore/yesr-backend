using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Dtos;

namespace Global.YESR.Repositories
{
    public interface IConfigurationItemsRepository : IGenericRepository<ConfigurationItem>
    {
        ConfigurationItem FindByKeyAndValue(string key, string value);
    }
}