using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebUpLoderDemo
{
    public partial class Demo1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.IsPostBack)
            {
                System.Web.Script.Serialization.JavaScriptSerializer jsn = new System.Web.Script.Serialization.JavaScriptSerializer();
                List<Src> src = new List<Src>();
                Src s = new Src();
                for (int i = 0; i < 3; i++)
                {
                    s = new Src();
                    s.filePath = "../File/Image/Temp/20160729/20160729_4605.jpg";
                    src.Add(s);
                }
                old.Value = "{\"image1\":" + jsn.Serialize(src) + ",\"image2\":" + jsn.Serialize(src) + ",\"fujian1\":" + jsn.Serialize(src) + ",\"fujian2\":" + jsn.Serialize(src) + "}";
            }
        }
        [Serializable]
        public class Src
        {
            public string filePath { get; set; }
        }
    }
}