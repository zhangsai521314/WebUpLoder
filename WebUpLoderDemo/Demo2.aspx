<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Demo2.aspx.cs" Inherits="WebUpLoderDemo.Demo2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="Css/WebUploader2/webuploader.css" rel="stylesheet" />
    <link href="Css/WebUploader2/imageWebUpLoaderStyle.css" rel="stylesheet" />
</head>
<body>
    <div id="wrapper" class="wrapper">
        <%--<div class="div_close"><span class="span_close" onclick="ImageClose(this)">X</span></div>--%>
        <input type="hidden" id="deleteImage1" value="" />
        <%--wrapper操作无关--%>
        <div id="container" class="container">
            <%--container操作无关--%>
            <!--头部，相册选择和格式选择-->
            <div id="uploader" class="ImageWebUploader">
                <%--uploader容器id--%>
                <div class="queueList">
                    <div id="dndArea" class="placeholder">
                        <div id="filePicker"></div>
                        <p>或将照片拖到这里，单次最多可选300张</p>
                    </div>
                </div>
                <div class="statusBar" style="display: none;">
                    <div class="progress">
                        <span class="text">0%</span>
                        <span class="percentage"></span>
                    </div>
                    <div class="info"></div>
                    <div class="btns">
                        <div id="filePicker2" class="filePicker"></div>
                        <div class="uploadBtn">开始上传</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="wrapper2" class="wrapper">
        <%--<div class="div_close"><span class="span_close" onclick="ImageClose(this)">X</span></div>--%>
        <input type="hidden" id="deleteImage2" value="" />
        <input type="hidden" id="ss2" value="" />
        <div id="container2" class="container">
            <div id="uploader2" class="ImageWebUploader">
                <div class="queueList">
                    <div id="dndArea2" class="placeholder">
                        <div id="filePicker22"></div>
                        <p>或将照片拖到这里，单次最多可选300张</p>
                    </div>
                </div>
                <div class="statusBar" style="display: none;">
                    <div class="progress">
                        <span class="text">0%</span>
                        <span class="percentage"></span>
                    </div>
                    <div class="info"></div>
                    <div class="btns">
                        <div id="filePicker222" class="filePicker"></div>
                        <div class="uploadBtn">开始上传</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <input type="hidden" id="old" value="" runat="server" />
    <script src="Js/WebUploader/jquery-1.8.2.min.js"></script>
    <script src="Js/WebUploader/webuploader.js"></script>
    <script src="Js/WebUploader/ImageWebUploader.js"></script>
    <script type="text/javascript">
        $("#uploader").WebUpLoaderImage({
            upPickID: "filePicker",
            upDndID: "dndArea",
            upAddButtonID: "filePicker2",
            maxImageCount: 30,//最大数量
            fileSingleSizeLimit: 1,//单个文件大小m
            thumbnailWidth: 110,//缩略图宽度
            thumbnailHeight: 110,//缩略图高度
            imagePathHiddenId: "old",
            imagePathAttribute: "image1",
            deleteImagePathId: "deleteImage1",
        });

        $("#uploader2").WebUpLoaderImage({
            upPickID: "filePicker22",
            upDndID: "dndArea2",
            upAddButtonID: "filePicker222",
            maxImageCount: 30,//最大数量
            fileSingleSizeLimit: 1,//单个文件大小m
            thumbnailWidth: 110,//缩略图宽度
            thumbnailHeight: 110,//缩略图高度
            imagePathHiddenId: "old",
            imagePathAttribute: "image2",
            newImagePathHiddenId: "ss2"
        });
    </script>
</body>
</html>
