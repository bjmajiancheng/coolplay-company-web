/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    window.App = {
        //href: "http://ops.platform.chenjz.com",
        //href: "http://platform.ops.vyohui.com",
        href: window.location.origin,
        requestMapping: {}
    };

    /**
     * 下载文件
     * @param href
     */
    App.download = function (href) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ".." + href, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (this.status === 200) {
                var filename = "";
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                var type = xhr.getResponseHeader('Content-Type');
                var blob = new Blob([this.response], {type: type});
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing
                    // the blob for which they were created. These URLs will no longer resolve as
                    // the data backing the URL has been freed."
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        // use HTML5 a[download] attribute to specify filename
                        var a = document.createElement("a");
                        // safari doesn't support this yet
                        if (typeof a.download === 'undefined') {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 100);
                }
            }
        };
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Auth-Token', App.token);
        xhr.send();
    }

    App.scrollTo = function (el, offeset) {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;
        if (el) {
            if ($("body").hasClass('page-header-fixed')) {
                pos = pos - $('.page-header').height();
            } else if ($('body').hasClass('page-header-top-fixed')) {
                pos = pos - $('.page-header-top').height();
            } else if ($('body').hasClass('page-header-menu-fixed')) {
                pos = pos - $('.page-header-menu').height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        }, 'slow');
    };


    App.scrollToDiv = function (el, div, offeset) {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;
        if (el) {
            if ($("body").hasClass('page-header-fixed')) {
                pos = pos - $('.page-header').height();
            } else if ($('body').hasClass('page-header-top-fixed')) {
                pos = pos - $('.page-header-top').height();
            } else if ($('body').hasClass('page-header-menu-fixed')) {
                pos = pos - $('.page-header-menu').height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        div.animate({
            scrollTop: pos
        }, 'slow');
    };

    /**
     * 更改右侧内容标题
     * @param title
     */
    App.title = function (title) {
        $("#main-title").text(title);
    };
    /**
     * 右侧内容方法集合
     * @type {{append: App.body.append, empty: App.body.empty}}
     */
    App.content = {
        append: function (ele) {
            $("#main-body").append(ele);
        },
        empty: function () {
            $("#main-body").empty();
        },
        find: function (ele) {
            return $("#main-body").find(ele);
        }
    };

    /**
     * get请求
     *
     * @param uri
     * @param params
     */
    App.getRequestData = function (uri, params, callback) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result.data);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * get请求
     *
     * @param uri
     * @param params
     */
    App.getRequest = function (uri, params, callback) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * post请求
     *
     * @param uri
     * @param params
     */
    App.postRequestData = function(uri, params, callback) {
        $.ajax(
            {
                type: 'POST',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result.data);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * post请求
     *
     * @param uri
     * @param params
     */
    App.postRequest = function(uri, params, callback) {
        $.ajax(
            {
                type: 'POST',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * 展示文本
     *
     * @param title
     * @param content
     */
    App.showMsg = function(alertText) {

        $.messager.show({
            height: 42,
            timeout: 1500,
            showSpeed: 200,
            msg: '<i class="fa fa-info-circle"></i>&nbsp; ' + alertText,
            style: {
                right: '',
                top: document.body.scrollTop + document.documentElement.scrollTop + 20,
                bottom: '',
                'z-index': 999,
                'box-shadow': '0 1px 6px rgba(0,0,0,.2)'
            }
        });
    };

    App.$content = function () {
        return $("#main-body");
    };

    App.treeSetting = function(data) {
        var chkboxType = data.chkboxType === undefined ? {"Y": "p", "N": "p"} : data.chkboxType;
        var beforeCheck = data.beforeCheck === undefined ? function () {
        } : data.beforeCheck;

        var setting = {
            view: {
                addHoverDom: false,
                removeHoverDom: false,
                selectedMulti: false
            },
            check: {
                enable: true,
                chkStyle: data.chkStyle,
                radioType: "all",
                chkboxType: chkboxType
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: {
                enable: true,
                url: data.url,
                type: "POST",
                autoParam: data.autoParam
            },
            edit: {
                enable: false
            },
            callback: {
                beforeCheck: beforeCheck,
                onCheck: function (e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    var nodes = zTree.getCheckedNodes(true);
                    var ids = [];
                    if (nodes.length > 0) {
                        for (var i in nodes) {
                            ids.push(nodes[i].id);
                        }
                        $("[role='" + treeId + "_input']").val(ids)
                            .attr("value", ids);
                    } else {
                        $("[role='" + treeId + "_input']").val("")
                            .attr("value", "");
                    }
                    $("[role='" + treeId + "_input']").trigger("change");
                },
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    var value = $("[role='" + treeId + "_input']").attr("value");
                    if (value) {
                        var ids = value.split(",");
                        if (ids.length > 0) {
                            for (var i in ids) {
                                var c_node = zTree.getNodeByParam("id",
                                    ids[i], null);
                                if (c_node) {
                                    zTree.checkNode(c_node, true, false);
                                }
                            }
                        }
                    }
                    zTree.expandAll(true);
                }
            }
        };

        return setting;
    }

})(jQuery, window, document);
