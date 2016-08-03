using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebUpLoderDemo.Ashx
{
    /// <summary>
    /// WebUploaderFileOrImage 的摘要说明
    /// </summary>
    public class WebUploaderFileOrImage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            if (true)//判断登陆
            {
                try
                {
                    context.Response.ContentType = "text/plain";
                    context.Response.Charset = "utf-8";
                    string operationType = context.Request["operationType"];
                    switch (operationType.ToLower())
                    {
                        case "addimage":
                            AddImage(context);
                            break;
                        case "addfile":
                            AddFile(context);
                            break;
                        case "delete":
                            DeleteFile(context);
                            break;
                        default:
                            return;
                    }
                }
                catch (Exception ex)
                {
                    context.Response.Write(JsonConvert.SerializeObject(new RetutnMSG()));
                }
            }
        }

        #region 添加文件
        private void AddFile(HttpContext context)
        {
            try
            {
                HttpPostedFile file = context.Request.Files[0];
                if (file == null)
                {
                    context.Response.Write(JsonConvert.SerializeObject(new RetutnMSG() { Msg = "未获取到文件" }));
                    return;
                }
                string[] parameter = context.Request.Form.AllKeys;
                System.Random re = new Random();
                RetutnMSG model = new RetutnMSG();
                string jsonArrStr = string.Empty;
                string fileType = context.Request["fileType"];
                string day = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                string localPath = context.Server.MapPath("~/File/File/Temp/" + day + "/");
                string returnPath = "../File/File/Temp/" + day + "/";
                if (!System.IO.Directory.Exists(localPath))
                {
                    System.IO.Directory.CreateDirectory(localPath);
                }
                #region 不用更新webconfig中的globalization来解决格式不对
                string name = file.FileName;
                int s = name.LastIndexOf('?');
                if (s > 0)
                {
                    char[] cname = name.ToCharArray();
                    cname[s] = '.';
                    name = new string(cname);
                }
                #endregion
                string filePathName = filePathName = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo) + "_" + re.Next(1000, 9999) + Path.GetExtension(name);
                if (((System.Collections.IList)parameter).Contains("chunk"))
                {
                    //如果进行了分片
                    //取得chunk和chunks
                    int chunk = Convert.ToInt32(context.Request.Form["chunk"]);
                    int chunks = Convert.ToInt32(context.Request.Form["chunks"]);
                    string ss = context.Request["guid"];
                    string fenlocalPath = localPath + "\\" + context.Request["guid"] + Path.GetExtension(file.FileName);
                    FileStream addFile = new FileStream(fenlocalPath, FileMode.Append, FileAccess.Write);
                    BinaryWriter AddWriter = new BinaryWriter(addFile);
                    //获得上传的分片数据流

                    Stream stream = file.InputStream;
                    BinaryReader TempReader = new BinaryReader(stream);
                    //将上传的分片追加到临时文件末尾
                    AddWriter.Write(TempReader.ReadBytes((int)stream.Length));
                    //关闭BinaryReader文件阅读器
                    TempReader.Close();
                    stream.Close();
                    AddWriter.Close();
                    addFile.Close();
                    TempReader.Dispose();
                    stream.Dispose();
                    AddWriter.Dispose();
                    addFile.Dispose();
                    //如果是最后一个分片，则重命名临时文件为上传的文件名
                    if (chunk == (chunks - 1))
                    {
                        FileInfo fileinfo = new FileInfo(fenlocalPath);
                        if (File.Exists(fenlocalPath))
                        {
                            filePathName = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo) + "_" + re.Next(1000, 9999) + Path.GetExtension(file.FileName);
                        }
                        fileinfo.MoveTo(Path.Combine(localPath, filePathName));
                    }
                }
                else//没有分片直接保存
                {
                    if (File.Exists(Path.Combine(localPath, filePathName)))
                    {
                        filePathName = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo) + "_" + re.Next(1000, 9999) + Path.GetExtension(file.FileName); ;
                    }
                    context.Request.Files[0].SaveAs(Path.Combine(localPath, filePathName));
                }
                model.stutas = 1;
                model.id = "id";
                model.filePath = returnPath + filePathName;
                jsonArrStr = JsonConvert.SerializeObject(model);
                context.Response.Write(jsonArrStr);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region 添加图片
        /// <summary>
        ///添加图片
        /// </summary>
        /// <param name="context"></param>
        private void AddImage(HttpContext context)
        {
            try
            {
                HttpPostedFile file = context.Request.Files["file"];
                if (file == null || context.Request.Files.Count == 0)
                {
                    context.Response.Write(JsonConvert.SerializeObject(new RetutnMSG() { Msg = "未获取到文件" }));
                    return;
                }
                RetutnMSG model = new RetutnMSG();
                string jsonArrStr = string.Empty;
                string id = context.Request["id"];//容器元素id，webupder自带参数
                //string name = context.Request["name"];//文件名称，webupder自带参数
                // string lastModifiedDate = context.Request["lastModifiedDate"];//文件的最后修改时间，webupder自带参数
                int size = Convert.ToInt32(context.Request["size"]);
                string filePathName = string.Empty;
                string fileType = context.Request["fileType"];
                string day = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                string localPath = context.Server.MapPath("~/File/Image/Temp/" + day + "/");//文件存储路径
                string returnPath = "../File/Image/Temp/" + day + "/";//返回文件地址路径
                #region 不用更新webconfig中的globalization来解决格式不对
                string name = file.FileName;
                int s = name.LastIndexOf('?');
                if (s > 0)
                {
                    char[] cname = name.ToCharArray();
                    cname[s] = '.';
                    name = new string(cname);
                }
                #endregion
                string nameH = Path.GetExtension(name);
                System.Random Random = new System.Random();
                int Result = Random.Next(1000, 9999);
                filePathName = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo) + "_" + Result + nameH;
                if (IsFile(localPath, filePathName))
                {
                    filePathName = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo) + "_" + Random.Next(1000, 9999) + nameH;
                }
                file.SaveAs(Path.Combine(localPath, filePathName));
                model.stutas = 1;
                model.id = id;
                model.filePath = returnPath + filePathName;
                jsonArrStr = JsonConvert.SerializeObject(model);
                context.Response.Write(jsonArrStr);
                return;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region 删除文件
        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="context"></param>
        private void DeleteFile(HttpContext context)
        {
            try
            {
                string filePath = string.Empty;
                filePath = context.Request["imagePath"];
                if (string.IsNullOrEmpty(filePath))
                {
                    filePath = context.Request["filePath"];
                }
                if (string.IsNullOrEmpty(filePath))
                {
                    return;
                }
                string localPath = context.Server.MapPath(filePath.Replace("..", "~")).Replace("/", "\\");
                if (File.Exists(localPath))
                {
                    File.Delete(localPath);
                }
                context.Response.Write("{'status':'200'}");
                return;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region 查询文件是否已存在，存在为true
        /// <summary>
        /// 查询文件是否已存在，存在为true
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        private bool IsFile(string filePath, string fileName)
        {
            try
            {
                if (!string.IsNullOrEmpty(filePath))
                {
                    if (!System.IO.Directory.Exists(filePath))
                    {
                        System.IO.Directory.CreateDirectory(filePath);
                    }
                    if (File.Exists(Path.Combine(filePath, fileName)))
                    {
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        private class RetutnMSG
        {
            public RetutnMSG()
            {
                stutas = 0;
                Msg = "上传成功";
            }
            /// <summary>
            /// 1成功，0失败
            /// </summary>
            public int stutas { get; set; }

            /// <summary>
            /// 元素id：WU_FILE_0
            /// </summary>
            public string id { get; set; }

            /// <summary>
            /// 存储路径
            /// </summary>
            public string filePath { get; set; }

            public string Msg { get; set; }


        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}