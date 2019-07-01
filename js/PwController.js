/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2017 Yohei Yoshikawa (https://github.com/yoo16/)
 */

'use strict';

var PwController = function () {
    var _this = this;
    this.init = function(params) {

    }

    this.isIE = function() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        if( userAgent.match(/(msie|MSIE)/) || userAgent.match(/(T|t)rident/) ) return true;
        return false;
    }

    this.ieVersion = function() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (this.isIE()) return userAgent.match(/((msie|MSIE)\s|rv:)([\d\.]+)/)[3];
        return '';
    }

    this.isEdge = function() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('edge') != -1) {
            return true;
        }
    }

    this.currentController = function() {
        return PwNode.id('pw-current-controller').value();
    }
    this.currentAction = function() {
        return PwNode.id('pw-current-action').value();
    }
    this.dom = function(params) {
        var instance = new PwNode(params);
        instance.init();
        return instance;
    }
    this.urlQuery = function(params) {
        return query(params);
    }
    this.urlFor = function (params, options) {
        var url_queries = [];
        if (params.controller) url_queries.push(params.controller);
        if (params.action) url_queries.push(params.action);
        if (params.id) url_queries.push(params.id);

        var url_query = url_queries.join('/');
        var url = projectUrl() + url_query;

        if (options && pw_multi_sid) options.pw_multi_sid = pw_multi_sid;
        if (options) url = url + '?' + query(options);
        return url;
    }
    this.headerGet = function() {
        var header = { 
            method: 'GET',
            headers: {'Content-Type': 'application/xhtml+xml'},
            credentials: 'include',
            body: body,
            mode: 'cors',
            cache: 'default',
        };
        return header;
    }
    this.headerPostValues = function(values) {
        var header = { 
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            credentials: 'include',
            body: query(values),
            mode: 'cors',
            cache: 'default',
        };
        return header;
    }
    this.headerPostJson = function(json) {
        var header = { 
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            credentials: 'include',
            body: json,
            mode: 'cors',
            cache: 'default',
        };
        return header;
    }
    this.getHtml = function (params, values, options) {
        if (pw_multi_sid) values.pw_multi_sid = pw_multi_sid;
        var url = this.urlFor(params, values);
        options.method = 'get';
        if (this.isIE()) {
            this.ajaxRequest(url, values, options);
        } else {
            this.fetchRequest(url, this.headerGet(), options);
        }
    }
    this.postHtml = function (params, values, options) {
        if (pw_multi_sid) values.pw_multi_sid = pw_multi_sid;
        var url = this.urlFor(params);
        options.method = 'post';
        if (this.isIE()) {
            this.ajaxRequest(url, values, options);
        } else {
            this.fetchRequest(url, this.headerPostValues(values), options);
        }
    }
    this.postJson = function (params, json, options) {
        if (!params) return;
        if (!params.controller) return;
        if (!params.action) return;
        if (!json) return;
        options.is_json = true;
        var url = this.urlFor(params);
        if (this.isIE()) {
            this.ajaxRequest(url, json, options);
        } else {
            this.fetchRequest(url, this.headerPostJson(json), options);
        }
    }
    this.post = function (node, values, callback) {
        pw_app.postHtml(
            { controller: node.controller(), action: node.action() },
            this.multiSID(values),
            {method: 'post', callback: callback}
        );
    }
    this.postByUrl = function (url, values, callback, data_format) {
        this.ajaxRequest(
            url,
            this.multiSID(values),
            { method: 'post', callback:callback, data_format:data_format}
        );
    }
    this.actionGet = function (node, action, params, callback, data_format) {
        params = this.multiSID(params);
        var url = this.urlFor({controller: node.controller(), action: action});
        var options = {callback:callback, data_format:data_format};
        options.method = 'get';
        this.ajaxRequest(url, params, options);
    }
    this.multiSID = function(values) {
        if (values && pw_multi_sid) values.pw_multi_sid = pw_multi_sid;
        return values;
    }

    /**
    * ajax request    
    *
    * @param string url
    * @param object data
    * @param object options 
    * @return void
    **/
   this.ajaxRequest = function(url, data, options) {
        var is_show_loading = options.is_show_loading;
        if (is_show_loading) pw_app.showLoading(options.loading_selector);

        var content_type = 'application/xhtml+xml';
        var callback;
        var method = 'get';
        if (options) {
            if (options.content_type) content_type = options.content_type;
            if (options.data_format) data_format = options.data_format;
            if (options.callback) callback = options.callback;
            if (options.method) method = options.method;
        }
        if (method = 'POST' || method == 'post') content_type = 'application/x-www-form-urlencoded';
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onreadystatechange = function() {
            if (is_show_loading) pw_app.hideLoading(options.loading_selector);
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (callback) callback(xhr.response);
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', content_type);
        if (options.is_json) {
            xhr.send(data);
        } else {
            xhr.send(query(data));
        }
    }

    /**
     * fetch request
     * 
     * @param string url 
     * @param Object header_options 
     * @param Object options 
     */
    this.fetchRequest = function(url, header_options, options) {
        var is_show_loading = options.is_show_loading;
        if (is_show_loading) pw_app.showLoading(options.loading_selector);
        
        fetch(url, header_options).catch(function(err) {
            if (is_show_loading) pw_app.hideLoading(options.loading_selector);
            throw new Error('post error')
        }).then(function(response) {
            if (is_show_loading) pw_app.hideLoading(options.loading_selector);
            if (response.ok) {
                return response.text().then(function(text) {
                    return text;
                });
            } else {
                var error_callback = options.error_callback;
                if (error_callback) error_callback(response);
            }
        }).then(function(text) {
            var callback = options.callback;
            if (callback) callback(text);
        }); 
    }

    this.pwLoad = function(params) {
        var pw_load = document.getElementsByClassName('pw-load');
        for (var $i = 0; $i < pw_load.length; $i++) {
            var element = pw_load[$i];
            var pw_node = PwNode.byElement(element);
            var controller_name = pw_node.controller();
            if (!controller_name) return;
    
            var function_name = pw_node.functionName();
            var controller_class_name = pw_node.controllerClassName();
            if (controller_class_name in window) {
                var controller = new window[controller_class_name]();
                if (function_name && (function_name in controller)) {
                    var is_run = true;
                    if (params) is_run = (params.controller == controller_name && params.function == function_name);
                    if (is_run) controller[function_name](pw_node);
                }
            }
        }
    }

    /**
     * pw-click handler
     *
     */
    this.pwClickHandler = function(event) {
        eventAction(this);
        event.preventDefault();
    }

    /**
     * pw-click
     * 
     */
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('pw-click')) {
            eventAction(event.target);
        //TODO child click event or use PwClick()
        } else if (event.target.parentNode.classList) {
            if (event.target.parentNode.classList.contains('pw-click')) eventAction(event.target.parentNode);
        }
    }, true);

    /**
     * pw-change
     * 
     */
    document.addEventListener('change', function(event) {
        if (event.target.classList.contains('pw-change')) {
            eventAction(event.target);
        }
    }, true);


    //TODO remove jquery
    document.addEventListener('change', function(event) {
        if (event.target.classList.contains('pw_upload_file')) {
            let text_id = event.target.id + '_text';
            var pw_node = PwNode.byElement(event.target);
            var label = pw_node.value().replace(/\\/g, '/').replace(/.*\//, '');
            PwNode.id(text_id).setValue(label);
        }
    });

    /**
     * loading
     * 
     */
    document.addEventListener('click', function(event) {
        if(event.target.classList.contains('action-loading')) {
            //pw_app.showLoading();
        }
    });

    this.multiSessionLink = function(fileName, content) {
        var pw_multi_session_id = PwNode.id('pw-multi-session-id');
        if (!pw_multi_session_id) return;
        pw_multi_sid = pw_multi_session_id.value();
        if (!pw_multi_sid) return;

        [].forEach.call(document.getElementsByTagName('a'), function(element) {
            var node = PwNode.byElement(element);
            var link = '';
            if (node.attr('is_not_pw_multi_sid')) return;
            if (link = node.attr('href')) {
                if (link.indexOf('pw_multi_sid') == -1) {
                    link = link + "&pw_multi_sid=" + pw_multi_sid;
                    node.setAttr('href', link);
                }
            }
        });
    };

    this.downloadAsFile = function(fileName, content) {
        var a = document.createElement('a');
        a.download = fileName;
        a.href = 'data:application/octet-stream,' + encodeURIComponent(content);
        a.click();
    };
    this.requestPage = function (url, params, callback) {
        if (params && pw_multi_sid) params.pw_multi_sid = pw_multi_sid;
        window.location.href = pw_app.generateUrl(url, params);
    }
    this.generateUrl = function (url, params) {
        var url_param = query(params);
        url = url + '?' + url_param;
        return url;
    }
    this.generateProjectUrl = function(url, params) {
        url = pw_app.projectUrl() + url;
        var url_param = query(params);
        url = url + '?' + url_param;
        return url;
    }
    this.projectUrl = function () {
        return projectUrl();
    }
    this.setSession = function (key, value) {
        value = JSON.stringify(value);
        localStorage.setItem(key, value);
    }
    this.getSession = function (key) {
        var value = localStorage.getItem(key)
        value = JSON.parse(value);
        return value;
    }
    this.showLoading = function(selector_name) {
        if (!selector_name) selector_name = pw_loading_selector;
        pw_ui.showLoading(selector_name);
    }
    this.hideLoading = function(selector_name) {
        if (!selector_name) selector_name = pw_loading_selector;
        pw_ui.hideLoading(selector_name);
    }
    /*
     * convert jQuery id
     */
    this.jqueryId = function(id) {
        if (id) {
            var start = id.slice(0, 1)
            if (start != '#') id = '#' + id;
        }
        return id;
    }
    //TODO
    this.checkImageLoading = function(class_name, count) {
        pw_app.hideLoading();
    }
    this.loadImage = function(url, node, callback, error_callback) {
        let loading_id = node.attr('loading_id');
        pw_ui.showLoading(loading_id);

        url+= '&serial=' + new Date().getTime();
        node.setAttr('src', '');
        node.setAttr('src', url);

        let loadHandler = function(event) {
            pw_app.hideLoading(loading_id);
            if (callback) callback();
            node.element.removeEventListener('load', loadHandler);
            node.show();
        }
        node.element.addEventListener('load', loadHandler, false);

        let errorHandler = function(event) {
            node.attr('src', '');
            pw_app.hideLoading(loading_id);
            if (error_callback) error_callback();
            node.element.removeEventListener('error', errorHandler);
            node.hide();
        }
        node.element.addEventListener('error', errorHandler, false);
    }
    this.confirmDeleteImage = function(controller, node, delete_id_column) {
        var link_delete_image = PwNode.id('link_delete_image');
        link_delete_image.setAttr('pw-controller', controller);
        link_delete_image.setAttr('pw-action', 'delete_image');
        link_delete_image.setAttr(delete_id_column, node.attr(delete_id_column));
        pw_ui.showModal(pw_ui.delete_file_window_name);
    }
    this.deleteImage = function(params) {
        pw_ui.hideModal(pw_ui.delete_file_window_name);
        var delete_id_column = params.delete_id_column;
        var url = pw_app.urlFor(
            {controller: params.controller, action: 'delete_image'},
            {delete_id_column: params.node.attr(delete_id_column)}
            );

        pw_app.postByUrl(url, null, 
            function (data, status, xhr) {
                if (params.image && params.callback) params.callback(params.image);
            }
        );
    }
    this.showDeleteConfirmImage = function() {
        PwNode.id('link_confirm_delete_image').show();
    }
    this.hideDeleteConfirmImage = function() {
        PwNode.id('link_confirm_delete_image').hide();
    }
    this.fileUpload = function(url, form_id, callback, loading_id)
    {
        let element = document.getElementById(form_id);
        if (!element) return;
        var form_data = new FormData(element);
        if (!form_data) return;

        pw_app.showLoading(loading_id);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            pw_app.hideLoading();
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr)
            }
        };
        xhr.open("POST", url, true);
        xhr.send(form_data);
    }

    /**
     * query
     * 
     * @param  array params
     * @return string
     */
    function query(params) {
        if (!params) return;
        var queryArray = [];
        Object.keys(params).forEach(function (key) { return queryArray.push(key + '=' + encodeURIComponent(params[key])); });
        var query = queryArray.join('&');
        return query;
    }

    /**
    * http base
    *
    * @param 
    * @return string
    **/
    function httpBase() {
        var domain = location.hostname;
        var url;
        if (pw_base_url) {
            url = pw_base_url;
        } else {
            url = '//' + domain + '/';
        }
        return url;
    }

    /**
    * project url
    *
    * @param 
    * @return string
    **/
    function projectUrl() {
        var pw_base_url = httpBase();
        var url = pw_base_url;
        if (pw_project_name) url += pw_project_name + '/';
        return url;
    }

    /**
    * upper string for top
    *
    * @param string string
    * @return string
    **/
    function upperTopString(string) {
        var value = string.charAt(0).toUpperCase() + string.slice(1);
        var value = string.substring(0, 1).toUpperCase() + string.substring(1);
        var value = string.replace(/^[a-z]/g, function (val) { return val.toUpperCase(); });
        return value;
    }

    /**
    * event action
    *
    * @param Element element
    * @return void
    **/
    function eventAction(element) {
        var pw_node = PwNode.byElement(element);
        var lib_name = pw_node.attr('pw-lib');
        if (lib_name) return libAction(element);

        var name = pw_node.controller();
        if (!name) return;

        var action = pw_node.action();
        if (!action) return;

        var controller_name = pw_node.controllerClassName();
        if (controller_name in window) {
            var controller = new window[controller_name]();
            if (action in controller) controller[action](pw_node);
        } 
    }

    /**
    * lib action
    *
    * @param Element element
    * @return void
    **/
    function libAction(element) {
        var pw_node = PwNode.byElement(element);
        var lib_name = pw_node.attr('pw-lib');
        if (!lib_name) return;

        var action = pw_node.action();
        if (!action) return

        if (lib_name in window) {
            var controller = new window[lib_name]();
            if (action in controller) controller[action](pw_node);
        }
    }

}

//TODO remove jquery
$.support.cors = true;

var pw_app = new PwController();
var pw_base_url = '';
var pw_current_controller = '';
var pw_current_action = '';
var pw_loading_selector = '';
var pw_multi_sid = '';

document.addEventListener('DOMContentLoaded', function() {
    pw_app.multiSessionLink();
    pw_app.pwLoad(); 

    //TODO important method
    if (PwNode.id('pw-current-controller').value()) pw_app.pw_current_controller = PwNode.id('pw-current-controller').value();
    if (PwNode.id('pw-current-action').value()) pw_app.pw_current_action = PwNode.id('pw-current-action').value();
});

//TODO IE closet
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
  
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
}