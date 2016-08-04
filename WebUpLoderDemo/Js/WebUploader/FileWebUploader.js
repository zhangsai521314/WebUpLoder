
(function ($, window) {

    //var applicationPath = window.applicationPath === "" ? "" : window.applicationPath || "../..";
    //function FileS4() {
    //    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    //}
    // 当domReady的时候开始初始化
    $.fn.WebUpLoaderFile = function (options) {
        //1.Settings 初始化设置 
        var c = $.extend({
            fileContainerID: $(this).attr("id"),//文件的存放ID
            upDndID: "",//拖拽容器id,注意此id不能是fileContainerID
            fileType: "",//文件类型，区分是什么类型的文件
            deleteFilePathID: "", // 被删除的正式文件的路径存放元素id
            newFilePathHiddenId: "",//新文件路径存放，为空时不做处理,没有预加载可用此种
            fielePathHiddenId: "",//除了删除之外的文件存放,预加载用此种.fielePathHiddenId和filePathAttribute都不为空则会开启预加载
            filePathAttribute: "",//除了删除之外的文件存放在fielePathHiddenId哪个属性下面,预加载：{"fujian1":[],"fujian2":[]，"fujian3":[]}
            fileNumLimit: 5,//文件总的个数
            fileSizeLimit: 200,//文件的总大小m
            fileSingleSizeLimit: 5,//单个文件的最大m
            postbackHold: false,
            showDownload: false,
            serverUrl: '../ashx/WebUploaderImage.ashx'
        }, options);
        WebUpLoaderFile(c);
        LoadingFile(c);
    };

    function WebUpLoaderFile(c) {
        //不支持时的处理
        if (!WebUploader.Uploader.support()) {
            var error = "上传控件不支持您的浏览器！请尝试<a target='_blank' href='http://get.adobe.com/cn/flashplayer/'>升级flash版本</a>或者<a target='_blank' href='http://se.360.cn'>使用Chrome引擎的浏览器</a>。";
            alert(error);
            return false;
        }
        var target = $("#" + c.fileContainerID);
        var guid = WebUploader.Base.guid()//guid分片上传区别唯一文件
        var pickerid = FileS4();
        //var uploaderStrdiv = '<div class="webuploader">' +
        //    '<div class="uploader-list thelist"></div>' +
        //    '<div class="btns">' +
        //    '<div id="' + pickerid + '">选择文件</div>' +
        ////            '<br/><a  class="btn btn-default ctlBtn">开始上传</a>' +
        //    '</div>' +
        //'</div>';
        if (target.find("div.webuploader").length <= 0) {
            target.append($("<div class='webuploader'><div class='uploader-list thelist'></div><div class='btns'><div class='zselectFile' id='" + pickerid + "'>选择文件</div></div></div>"));
        } else {
            pickerid = target.find("div.zselectFile").attr("id");
        }
        var $list = target.find("div.thelist"),
             $btn = target.find("div.ctlBtn"),
             state = 'pending',
             uploader,
             newFileJsonData = {
                 //新文件存放
                 fileList: []
             },
             fileJsonData = {
                 //除了删除之外的文件存放
             },
             upDndID = c.upDndID == "" ? "" : "#" + c.upDndID;;
        this.$list = $list;

        // 实例化
        uploader = WebUploader.create({
            //选中就上传
            auto: true,
            // swf文件路径
            swf: '../js/WebUploader/Uploader.swf',
            // 文件接收服务端。
            server: c.serverUrl,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#' + pickerid,

            chunked: true, //开启分片

            threads: 1, //上传并发数

            formData: {
                operationType: 'addFile',//操作类型
                fileType: c.fileType,
                guid: guid
            },
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            fileNumLimit: c.fileNumLimit, //文件总的个数
            fileSizeLimit: 1024 * 1024 * c.fileSizeLimit,    // 文件总大小
            fileSingleSizeLimit: 1024 * 1024 * c.fileSingleSizeLimit,//单个文件的大小
            dnd: upDndID,// [可选] [默认值：undefined]指定Drag And Drop拖拽的容器，如果不指定，则不启动。
            disableGlobalDnd: true
        });
        // 拖拽时不接受 js, txt 文件。阻止此事件可以拒绝某些类型的文件拖入进来。
        uploader.on('dndAccept', function (items) {
            var denied = false,
                len = items.length,
                i = 0,
                // 修改js类型
                unAllowed = 'text/plain;application/javascript ';

            for (; i < len; i++) {
                // 如果在列表里面
                if (~unAllowed.indexOf(items[i].type)) {
                    denied = true;
                    break;
                }
            }

            return !denied;
        });

        // 文件添加进来只前的时候
        uploader.on('beforeFileQueued', function (file) {
            var fileCountIsMax = false, fileTypeErr = false;
            var errArray = ["cs", "aspx", "html", "js", "css", "ashx", "ascx", "aspx", "htm", "sln", "suo", "dll", "csproj", "pdb", "cache", "db", "config"];
            $.each(errArray, function (index, item) {
                if (item == file.ext.toLocaleLowerCase()) {
                    fileTypeErr = true;
                    return false;
                }
            });
            if ($("#" + c.fileContainerID + " div.thelist>div").length >= c.fileNumLimit) {
                fileCountIsMax = true;
            }
            if (fileCountIsMax || fileTypeErr) {
                if (fileCountIsMax) {
                    alert("附件数量超出，附件最多" + c.fileNumLimit + "个");
                } else {
                    alert(file.name + "为禁止上传的文件格式");
                }
                return false;
            } else {
                return true;
            }
        });

        //用户的操作超出限制
        uploader.on('error', function (handler) {
            switch (handler) {
                case "Q_EXCEED_NUM_LIMIT":
                    alert("附件数量超出，附件最多" + c.fileNumLimit + "个");
                    break;
                case "F_EXCEED_SIZE":
                    alert("附件过大，附件最大" + c.fileSingleSizeLimit + "M");
                    break;
            }
        });

        //文件加入进来时触发
        uploader.on('fileQueued', function (file) {
            $list.append('<div id="' + file.id + '" class="item">' +
                '<div class="info">' + file.name + '</div>' +
                '<div class="state">等待上传...</div>' +
                '<div class="download" style="display:none;"></div>' +
                '<div class="del"></div>' +
            '</div>');
        });

        //上传过程中触发，携带上传进度。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = target.find('#' + file.id),
                $percent = $li.find('.progress .bar');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<span class="progress">' +
                    '<span  class="percentage"><span class="text"></span>' +
                  '<span class="bar" role="progressbar" style="width: 0%">' +
                  '</span></span>' +
                '</span>').appendTo($li).find('.bar');
            }
            $('#' + file.id + " .del").addClass("mydel");
            $('#' + file.id + " .del").removeClass("del");
            $li.find('div.state').text('上传中');
            $li.find("span.text").text(Math.round(percentage * 100) + '%');
            $percent.css('width', percentage * 100 + '%');
        });

        //上传成功
        uploader.on('uploadSuccess', function (file, response) {
            target.find('#' + file.id).find('div.state').text('已上传');
            $('#' + file.id + " .mydel").addClass("del");
            $('#' + file.id + " .mydel").removeClass("mydel");
            if (c.showDownload) {
                target.find('#' + file.id).find('div.download').show();
            }
            $('#' + file.id).addClass("newFile").attr("msrc", response.filePath);
            if (c.newFilePathHiddenId != "") {
                var newImagePath = $("#" + c.newFilePathHiddenId).val();
                if (newImagePath == "") {
                    newImagePath = "{\"fileList\":[]}";
                }
                newFileJsonData = JSON.parse(newImagePath);
                var fileEvent = {
                    queueId: file.id,
                    name: file.name,
                    size: file.size,
                    extension: '.' + file.ext,
                    mimetype: file.type,
                    filePath: response.filePath,
                    IsCopy: 1
                };
                newFileJsonData.fileList.push(fileEvent)
                $("#" + c.newFilePathHiddenId).val(JSON.stringify((newFileJsonData)));
            }
            if (c.fielePathHiddenId != "" && c.filePathAttribute != "") {
                var filePath = $("#" + c.fielePathHiddenId).val();
                fileJsonData = JSON.parse(filePath);
                $.each(fileJsonData, function (index, item) {
                    if (index == c.filePathAttribute) {
                        var fileEvent = {
                            queueId: file.id,
                            name: file.name,
                            size: file.size,
                            type: '.' + file.ext,
                            mimetype: file.type,
                            filePath: response.filePath
                        };
                        item.push(fileEvent);
                        $("#" + c.fielePathHiddenId).val(JSON.stringify((fileJsonData)));
                        return false;
                    }
                });
            }
        });

        //上传失败
        uploader.on('uploadError', function (file) {
            target.find('#' + file.id).find('div.state').text('上传出错');
            $('#' + file.id + " .mydel").addClass("del");
            $('#' + file.id + " .mydel").removeClass("mydel");
        });

        //不管成功或者失败，文件上传完成时触发。
        uploader.on('uploadComplete', function (file) {
            target.find('#' + file.id).find('.progress').fadeOut();
        });

        uploader.on('all', function (type) {
            if (type === 'startUpload') {
                state = 'uploading';
            } else if (type === 'stopUpload') {
                state = 'paused';
            } else if (type === 'uploadFinished') {
                state = 'done';
            }
            if (state === 'uploading') {
                $btn.text('暂停上传');
            } else {
                $btn.text('开始上传');
            }
        });

        //点击开始上传
        $btn.on('click', function () {
            if (state === 'uploading') {
                uploader.stop(true);
            } else {
                uploader.upload();
            }
        });

        //删除
        $list.on("click", ".del", function () {
            var $ele = $(this);
            var id = $ele.parent().attr("id");
            var num = id.split('_')[2];
            var msrc = $("#" + id).attr("msrc");
            $ele.parent().remove();
            if ($ele.prevAll("div.state").eq(0).html() != "上传出错") {
                if (num >= 88888) {
                    if (c.deleteFilePathID != "") {
                        $("#" + c.deleteFilePathID).val($("#" + c.deleteFilePathID).val() + msrc + ",");
                    }
                    if (c.fielePathHiddenId != "" && c.filePathAttribute != "") {
                        var filePath = $("#" + c.fielePathHiddenId).val();
                        fileJsonData = JSON.parse(filePath);
                        $.each(fileJsonData, function (index, item) {
                            if (index == c.filePathAttribute) {
                                $.each(item, function (i, em) {
                                    if (em && em.filePath == msrc) {
                                        item.splice(i, 1);
                                        $("#" + c.fielePathHiddenId).val(JSON.stringify((fileJsonData)));
                                        return false;
                                    }
                                });
                                return false;
                            }
                        });
                    }
                    $.post(c.serverUrl, { operationType: "delete", filePath: msrc }, function (returndata) {
                    });
                } else {
                    //删除新增加的附件
                    uploader.removeFile(uploader.getFile(id));
                    if (c.newFilePathHiddenId != "") {
                        $.each(newFileJsonData.fileList, function (index, item) {
                            if (item && item.queueId == Id) {
                                newFileJsonData.fileList.splice(index, 1);
                                $("#" + c.newFilePathHiddenId).val(JSON.stringify(newFileJsonData));
                                return false;
                            }
                        });
                    }
                    if (c.fielePathHiddenId != "" && c.filePathAttribute != "") {
                        $.each(fileJsonData, function (index, item) {
                            if (index == c.filePathAttribute) {
                                $.each(item, function (i, em) {
                                    if (em && em.queueId == Id) {
                                        item.splice(i, 1);
                                        $("#" + c.fielePathHiddenId).val(JSON.stringify((fileJsonData)));
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
            };
        });
    };

    //预加载附件 
    function LoadingFile(c) {
        if (c.fielePathHiddenId != "" && c.filePathAttribute != "") {
            var mfilePath = $("#" + c.fielePathHiddenId).val();
            var mfileJsonData = {
            };
            mfileJsonData = JSON.parse(mfilePath);

            $.each(mfileJsonData, function (i, em) {
                if (i == c.filePathAttribute) {
                    $.each(em, function (index, item) {
                        var num = FileNum();
                        $("#" + c.fileContainerID + " div.thelist").append($("<div class='item oldFile' msrc='" + item.filePath + "' id='WU_FILE_" + num + "'><div class='info'>" + item.filePath.split('/')[item.filePath.split('/').length - 1] + "</div><div class='state'>已上传</div><div style='display:none;' class='download'></div><div class='del'></div><span class='progress' style='display: none;'><span class='percentage'><span class='text'>100%</span><span style='width: 100%;' role='progressbar' class='bar'></span></span></span></div>"));
                    });
                    return false;
                }
            });
        }
    };

    function FileNum() {
        var num = Math.round(Math.random() * (99999 - 88888) + 88888);
        while ($("#WU_FILE_" + num).length > 1) {
            num = Math.round(Math.random() * (99999 - 88888) + 88888);
        }
        return num;
    };
    function FileS4() {
        var s4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        while ($("#" + s4).length > 1) {
            s4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return s4;
    }
})(jQuery, window);
