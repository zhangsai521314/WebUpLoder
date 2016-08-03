//var applicationPath = window.applicationPath === "" ? "" : window.applicationPath || "../../";
(function ($, window) {
    $.fn.ImageUpLoad = function (options) {
        //1.Settings 初始化设置 
        var c = $.extend({
            imageContainerID: $(this).attr("id"), //上传点击按钮ID
            imageList: "",  //存放图片容器ID
            deleteImagePathId: "", //被删除的正式图片存放
            fileType: "",  //图片类别
            newImagePathHiddenId: "",//新图片路径存放，为空时不做处理,没有预加载可用此种
            imagePathHiddenId: "",//除了删除之外的图片存放,预加载用此种
            imagePathAttribute: "",//除了删除之外的图片存放在imagePathHiddenId哪个属性下面,预加载：{"image1":[],"image2":[]，"image3":[]}
            thumbnailWidth: 90,//缩略图宽度
            thumbnailHeight: 90,//缩略图高度
            minImageCount: 0,//最小数量,点击上传的时候使用
            maxImageCount: 30,
            fileSingleSizeLimit: 1,//单个文件大小m
            serverUrl: "../Ashx/WebUploaderFileOrImage.ashx"
        }, options);
        UpImage(c);
        LoadingImage(c);
    };

    function UpImage(c) {
        //不支持时的处理
        if (!WebUploader.Uploader.support()) {
            var error = "上传控件不支持您的浏览器！请尝试<a target='_blank' href='http://get.adobe.com/cn/flashplayer/'>升级flash版本</a>或者<a target='_blank' href='http://se.360.cn'>使用Chrome引擎的浏览器</a>。";
            alert(error);
            return false;
        }
        var $list = $('#' + c.imageList),
        uploader,
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,
        newImageJsonData = {
            //新图片的存放
            fileList: []
        },
        ImageJsonData = {
            //除了删除之外的图片存放
        };
        c.thumbnailWidth = c.thumbnailWidth * ratio;
        c.thumbnailHeight = c.thumbnailWidth * ratio;
        // 缩略图大小
        uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: true,
            //限制图片的数量
            fileNumLimit: c.maxImageCount,
            //设定单个文件大小
            fileSingleSizeLimit: 1024 * 1024 * c.fileSingleSizeLimit,
            disableGlobalDnd: true,
            swf: '../js/WebUploader/Uploader.swf',
            server: c.serverUrl,
            pick: '#' + c.imageContainerID,
            formData: {
                operationType: 'addimage',
                fileType: c.fileType
            },
            //只允许选择图片
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        //用户的操作超出限制
        uploader.on('error', function (handler) {
            switch (handler) {
                case "Q_EXCEED_NUM_LIMIT":
                    alert("图片数量超出，图片最多" + c.maxImageCount + "张");
                    break;
                case "Q_TYPE_DENIED":
                    alert("请选择图片");
                    break;
                case "F_EXCEED_SIZE":
                    alert("图片大小超出，图片最大" + c.fileSingleSizeLimit + "M");
                    break;
            }
        });

        // 文件添加进来只前的时候
        uploader.on('beforeFileQueued', function (file) {

            //处理修改信息时预览图片问题start
            var isreturn = 0;
            var img = $list.find("img");
            if (img.length >= c.maxImageCount) {
                isreturn = 0;
            } else {
                isreturn = 1;
            }
            if (isreturn == 0) {
                alert("图片数量超出，图片最多" + c.maxImageCount + "张");
                return false;
            } else {
                return true;
            }
            //处理修改信息时预览图片问题end
        });

        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            var $li = $(
                        '<div id="' + file.id + '" class="cp_img">' +
                            '<img>' +
                        '<div class="cp_img_jian"></div></div>'
                        ),
                    $img = $li.find('img');
            $list.append($li);

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // c.thumbnailWidth x c.thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr('src', src);
            }, c.thumbnailWidth, c.thumbnailHeight);
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                    $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                            .appendTo($li)
                            .find('span');
            }
            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, response) {
            $('#' + file.id).addClass('upload-state-done').attr("msrc", response.filePath).addClass("newImg");
            if (c.newImagePathHiddenId != "") {
                var newImagePath = $("#" + c.newImagePathHiddenId).val();
                if (newImagePath == "") {
                    newImagePath = "{\"fileList\":[]}";
                }
                newImageJsonData = JSON.parse(newImagePath);
                var fileEvent = {
                    queueId: file.id,
                    name: file.name,
                    size: file.size,
                    type: '.' + file.ext,
                    extension: '.' + file.ext,
                    mimetype: file.type,
                    filePath: response.filePath
                };
                newImageJsonData.fileList.push(fileEvent)
                $("#" + c.newImagePathHiddenId).val(JSON.stringify((newImageJsonData)));
            }
            if (c.imagePathHiddenId != "" && c.imagePathAttribute != "") {
                var imagePath = $("#" + c.imagePathHiddenId).val();
                ImageJsonData = JSON.parse(imagePath);
                $.each(ImageJsonData, function (index, item) {
                    if (index == c.imagePathAttribute) {
                        var fileEvent = {
                            queueId: file.id,
                            name: file.name,
                            size: file.size,
                            type: '.' + file.ext,
                            mimetype: file.type,
                            filePath: response.filePath
                        };
                        item.push(fileEvent);
                        $("#" + c.imagePathHiddenId).val(JSON.stringify((ImageJsonData)));
                        return false;
                    }
                });
            }
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                    $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });

        //所有文件上传完毕
        uploader.on("uploadFinished", function () {
            //提交表单

        });

        //开始上传
        $("#ctlBtn").click(function () {
            var imageCount = $("#" + c.imageList + " .cp_img").length;
            if (imageCount >= c.minImageCount) {
                uploader.upload();
            } else {
                alert("选择的图片少于" + c.minImageCount + "张");
            }
        });

        //显示删除按钮
        $(".cp_img").live("mouseover", function () {
            $(this).children(".cp_img_jian").css('display', 'block');

        });

        //隐藏删除按钮
        $(".cp_img").live("mouseout", function () {
            $(this).children(".cp_img_jian").css('display', 'none');

        });

        //执行删除方法
        $list.on("click", ".cp_img_jian", function () {
            var $image = $(this).parent();
            var imgsrc = $image.attr("msrc");
            var Id = $image.attr("id");
            var imageId = Id.split('_')[2];
            $image.remove();
            if (imageId >= 88888) {
                if (c.deleteImagePathId != "") {
                    $("#" + c.deleteImagePathId).val($("#" + c.deleteImagePathId).val() + imgsrc + ",");
                }
                if (c.imagePathHiddenId != "" && c.imagePathAttribute != "") {
                    var imagePath = $("#" + c.imagePathHiddenId).val();
                    ImageJsonData = JSON.parse(imagePath);
                    $.each(ImageJsonData, function (index, item) {
                        if (index == c.imagePathAttribute) {
                            $.each(item, function (i, em) {
                                if (em && em.filePath == imgsrc) {
                                    item.splice(i, 1);
                                    $("#" + c.imagePathHiddenId).val(JSON.stringify((ImageJsonData)));
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                }
            } else {
                uploader.removeFile(uploader.getFile(Id, true));
                if (c.newImagePathHiddenId != "") {
                    $.each(newImageJsonData.fileList, function (index, item) {
                        if (item && item.queueId == Id) {
                            newImageJsonData.fileList.splice(index, 1);
                            $("#" + c.newImagePathHiddenId).val(JSON.stringify(newImageJsonData));
                            return false;
                        }
                    });
                }
                if (c.imagePathHiddenId != "" && c.imagePathAttribute != "") {
                    $.each(ImageJsonData, function (index, item) {
                        if (index == c.imagePathAttribute) {
                            $.each(item, function (i, em) {
                                if (em && em.queueId == Id) {
                                    item.splice(i, 1);
                                    $("#" + c.imagePathHiddenId).val(JSON.stringify((ImageJsonData)));
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                }
                $.post(c.serverUrl, { operationType: "delete", imagePath: imgsrc }, function (data) {
                });
            }
        });

    };

    //预加载
    function LoadingImage(c) {
        if (c.imagePathHiddenId != "" && c.imagePathAttribute != "") {
            var mimagePath = $("#" + c.imagePathHiddenId).val();
            var mImageJsonData = {
            };
            mImageJsonData = JSON.parse(mimagePath);
            $.each(mImageJsonData, function (i, em) {
                if (i == c.imagePathAttribute) {
                    $.each(em, function (index, item) {
                        var num = ImageNum();
                        $("#" + c.imageList).append($("<div class='cp_img upload-state-done oldImg' msrc='" + item.filePath + "' id='WU_FILE_" + num + "'><img src='" + item.filePath + "'/><div class='cp_img_jian' style='display: none;'></div> </div>"));
                    });
                    return false;
                }
            });
        }
    };

    function ImageNum() {
        var num = Math.round(Math.random() * (99999 - 88888) + 88888);
        while ($("#WU_FILE_" + num).length > 1) {
            num = Math.round(Math.random() * (99999 - 88888) + 88888);
        }
        return num;
    };
})(jQuery, window);


