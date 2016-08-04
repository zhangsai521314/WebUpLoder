using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MODEL
{
    [Serializable]
    public class FileInfos
    {
        public string filePath { get; set; }

        /// <summary>
        /// 是否需要拷贝,正式的不需要拷贝
        /// </summary>
        public int IsCopy { get; set; }

        /// <summary>
        /// 页面文件包括元素的id
        /// </summary>
        public string queueId { get; set; }
        /// <summary>
        /// 文件名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 文件大小
        /// </summary>
        public string size { get; set; }

        /// <summary>
        /// 文件扩展名
        /// </summary>
        public string extension { get; set; }

        /// <summary>
        /// 文件类型
        /// </summary>
        public string mimetype { get; set; }
    }
}
