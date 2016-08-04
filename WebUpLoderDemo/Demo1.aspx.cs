using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Common;
using MODEL;
using Newtonsoft.Json;

namespace WebUpLoderDemo
{
    public partial class Demo1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.IsPostBack)
            {
                List<FileInfos> src = new List<FileInfos>();
                FileInfos s = new FileInfos();
                for (int i = 0; i < 3; i++)
                {
                    s = new FileInfos();
                    s.filePath = "../File/image/Temp/20160804/20160804_6141.jpg";
                    s.IsCopy = 1;
                    src.Add(s);
                }
                MyFile ff = new MyFile();
                ff.image1 = src;
                ff.image2 = src;
                ff.fujian1 = src;
                ff.fujian2 = src;
                old.Value = JsonConvert.SerializeObject(ff);
            }
        }
        private class MyFile
        {
            public List<FileInfos> image1 { get; set; }
            public List<FileInfos> image2 { get; set; }
            public List<FileInfos> fujian1 { get; set; }
            public List<FileInfos> fujian2 { get; set; }

        }

        protected void Button1_Click(object sender, EventArgs e)
        {

            string filePath = old.Value;
            MyFile dd = JsonConvert.DeserializeObject<MyFile>(filePath);
            string day = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
            //获取数据库存储路径
            string image1 = FileHelper.FilePath(dd.image1, "|").Replace("Temp", "Formal");
            string image2 = FileHelper.FilePath(dd.image2, "|").Replace("Temp", "Formal");
            string fujian1 = FileHelper.FilePath(dd.fujian1, "|").Replace("Temp", "Formal");
            string fujian2 = FileHelper.FilePath(dd.fujian2, "|").Replace("Temp", "Formal");
            //拷贝临时文件到正式目录
            FileHelper.CopyFile(dd.image1, Server.MapPath(@"~\File\Image\Formal\" + day), true);
            FileHelper.CopyFile(dd.image2, Server.MapPath(@"~\File\Image\Formal\" + day), true);
            FileHelper.CopyFile(dd.fujian1, Server.MapPath(@"~\File\Image\Formal\" + day), true);
            FileHelper.CopyFile(dd.fujian2, Server.MapPath(@"~\File\Image\Formal\" + day), true);
            //删除已删除的正式文件
            string deleteImg1 = deleteImage1.Value;
            string deleteImg2 = deleteImage2.Value;
            string fujian11 = deletefile1.Value;
            string fujian22 = deletefile2.Value;
            FileHelper.DeleteFile(deleteImg1, ',');
            FileHelper.DeleteFile(deleteImg2, ',');
            FileHelper.DeleteFile(fujian11, ',');
            FileHelper.DeleteFile(fujian22, ',');
            //也可以这样
            string deletePath = deleteImage2.Value + deleteImage1.Value + deletefile1.Value + deletefile2.Value;
            FileHelper.DeleteFile(deletePath, ',');
        }
    }
}