using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using MODEL;

namespace Common
{
    public static class FileHelper
    {
        #region 获取字符串路径
        /// <summary>
        /// 获取字符串路径：1,2,3
        /// </summary>
        /// <param name="list_FileInfo"></param>
        /// <param name="split"></param>
        /// <returns></returns>
        public static string FilePath(List<FileInfos> list_FileInfo, string join)
        {
            try
            {
                if ((list_FileInfo == null || list_FileInfo.Count <= 0) && !string.IsNullOrEmpty(join))
                {
                    return null;
                }
                List<string> str = new List<string>();
                foreach (var item in list_FileInfo)
                {
                    str.Add(item.filePath);
                }
                return string.Join(join, str);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region 拷贝
        /// <summary>
        ///  拷贝
        /// </summary>
        /// <param name="list_FileInfo"></param>
        /// <param name="copyPath">拷贝至</param>
        /// <param name="isDeleteFile">是否删除源文件</param>
        /// <returns></returns>
        public static void CopyFile(List<FileInfos> list_FileInfo, string copyPath, bool isDeleteFile)
        {

            try
            {
                if ((list_FileInfo == null || list_FileInfo.Count <= 0) && !string.IsNullOrEmpty(copyPath))
                {
                    return;
                }
                List<string> str = new List<string>();
                foreach (var item in list_FileInfo)
                {
                    str.Add(item.filePath);
                    if (item.IsCopy == 1)
                    {
                        if (!Directory.Exists(copyPath))
                        {
                            Directory.CreateDirectory(copyPath);
                        }
                        string primaryPath = HttpContext.Current.Server.MapPath(item.filePath.Replace("..", "~"));
                        string filePath = copyPath + @"\" + item.filePath.Split('/')[item.filePath.Split('/').Length - 1];
                        if (File.Exists(primaryPath))
                        {
                            System.IO.File.Copy(primaryPath, filePath, true);
                            if (isDeleteFile)
                            {
                                File.Delete(primaryPath);
                            }
                        }
                    }
                }
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
        /// <param name="filePath">文件路径</param>
        /// <param name="split">分隔符</param>
        public static void DeleteFile(string filePath, char split)
        {
            try
            {
                if (!string.IsNullOrEmpty(filePath))
                {
                    string[] strPath = filePath.Split(split);
                    foreach (var item in strPath)
                    {
                        if (!string.IsNullOrEmpty(item))
                        {
                            File.Delete(HttpContext.Current.Server.MapPath(item.Replace("..", "~")));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}
