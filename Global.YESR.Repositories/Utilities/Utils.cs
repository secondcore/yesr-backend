using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Repositories.Utilities
{
    public static class Utils
    {
        public static double GenerateRandomAmount(double max = 3500)
        {
            Random rnd = new Random(DateTime.Now.Millisecond);
            double range = rnd.NextDouble();
            double rndValue = range * max;
            return rndValue;
        }

        public static string GenerateRandomName(int nLength)
        {
            char[] chars = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
            int charsNo = 26;
            int length = nLength;
            Random rnd = new Random(DateTime.Now.Millisecond);
            String rndString = "";

            for (int i = 0; i < length; i++)
                rndString += chars[rnd.Next(charsNo)];

            return rndString;
        }

        public static string GenerateRandomNumber(int nLength)
        {
            char[] chars = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };
            int charsNo = 9;
            int length = nLength;
            Random rnd = new Random(DateTime.Now.Millisecond);
            String rndString = "";

            for (int i = 0; i < length; i++)
                rndString += chars[rnd.Next(charsNo)];

            return rndString;
        }

        public static string PadString(string str, int len)
        {
            if (str.Length >= len)
                return str;

            int appLen = len - str.Length;
            string newStr = "";
            for (int i = 0; i < appLen; i++)
                newStr += "0";

            return newStr + str;
        }
    }
}
