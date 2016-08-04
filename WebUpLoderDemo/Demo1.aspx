<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Demo1.aspx.cs" Inherits="WebUpLoderDemo.Demo1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="Css/WebUploader1/demo.css" rel="stylesheet" />
    <link href="Css/WebUploader1/style.css" rel="stylesheet" />
    <link href="Css/WebUploader1/webuploader1.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div id="fujiantuo">
            <div id="fujian">
                <input type="hidden" id="deletefile1" value="" runat="server" />
            </div>
        </div>
        <div id="fujian2tuo">
            <div id="fujian2">
                <input type="hidden" id="deletefile2" value="" runat="server" />
            </div>
        </div>
        <div id="img1Tuo">
            <input type="hidden" id="deleteImage1" value="" runat="server" />
            <input type="hidden" id="ss" value="" />
            <div id="BusinesslicenseFileList">
            </div>
            <div class="cp_img_jia" id="BusinesslicenseId">
            </div>
        </div>
        <div id="img2Tuo">
            <input type="hidden" id="deleteImage2" value="" runat="server" />
            <div id="CompanyList">
            </div>
            <div class="cp_img_jia" id="CompanyId">
            </div>
        </div>
        <input type="hidden" id="old" value="" runat="server" />
        <script src="../js/WebUploader/jquery-1.8.2.min.js" type="text/javascript"></script>
        <script src="../js/WebUploader/webuploader.js" type="text/javascript"></script>
        <script src="../js/WebUploader/FileWebUploader.js" type="text/javascript"></script>
        <script src="../js/WebUploader/ImageWebUpLoder2.js"></script>
        <script type="text/javascript">
            $("#BusinesslicenseId").ImageUpLoad({
                imageList: "BusinesslicenseFileList",  //存放图片容器ID
                imagePathHiddenId: "old",
                imagePathAttribute: "image1",
                deleteImagePathId: "deleteImage1",
                newImagePathHiddenId: "ss",
                upDndID: "img1Tuo"
            });
            ////企业照片
            $("#CompanyId").ImageUpLoad({
                imageList: "CompanyList",  //存放图片容器ID
                imagePathHiddenId: "old",
                imagePathAttribute: "image2",
                deleteImagePathId: "deleteImage2",
                upDndID: "img2Tuo"
            });
            $("#fujian").WebUpLoaderFile({
                deleteFileID: "deletefile", // 被删除的正式文件的路径存放元素id
                serverUrl: "../ashx/WebUploaderFileOrImage.ashx",
                deleteFilePathID: "deletefile1", // 被删除的正式文件的路径存放元素id
                fielePathHiddenId: "old",//除了删除之外的文件存放,预加载用此种
                filePathAttribute: "fujian1",//除了删除之外的文件存放在fielePathHiddenId哪个属性下面,预加载：{"fujian1":[],"fujian2":[]，"fujian3":[]}
                upDndID: "fujiantuo"
            });
            $("#fujian2").WebUpLoaderFile({
                deleteFileID: "deletefile2", // 被删除的正式文件的路径存放元素id
                serverUrl: "../ashx/WebUploaderFileOrImage.ashx",
                deleteFilePathID: "deletefile2", // 被删除的正式文件的路径存放元素id
                fielePathHiddenId: "old",//除了删除之外的文件存放,预加载用此种
                filePathAttribute: "fujian2",//除了删除之外的文件存放在fielePathHiddenId哪个属性下面,预加载：{"fujian1":[],"fujian2":[]，"fujian3":[]}
                upDndID: "fujian2tuo"
            });
        </script>
        <p>
            &nbsp;
        </p>
        <p>
            &nbsp;
        </p>
        <p>
            <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="提交" />
        </p>
    </form>
</body>
</html>
