/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2018 Yohei Yoshikawa (https://github.com/yoo16/)
 */

'use strict';

//TODO remove jquery
var PwLog = function () {
    this.url_params = {};
    this.filename;
    this.html_id = '#log-list';
    this.name = 'pw_admin';
    this.action_list = 'log_list';
    this.action_detail = 'log_file';
    this.base_url = '';
    this.log_window;
    this.log_title;
    this.log_contents;

    this.loadList = function() {
        PwNode.id(this.html_id).html('');
        pw_app.postHtml(
            {controller: this.name, action: this.action_list},
            this.url_params,
            {callback: callback, is_show_loading: true}
        );
        function callback(json) {
            if (!json) return;
            var values = JSON.parse(json);
            renderHtml(values);
        }

        function renderHtml(values) {
            var dl = document.createElement('dl');
            //TODO remove jquery
            for (var key in values) {
                var log = values[key];

                var a = document.createElement('a');
                a.classList.add('pw-click');
                a.setAttribute('pw-lib', 'PwLog');
                a.setAttribute('pw-action', 'detail');
                a.setAttribute('filename', log.filename);
                a.innerText = log.basename;

                var dd = document.createElement('dd');
                dd.appendChild(a);
                dl.appendChild(dd);
            }

            let log_list = document.getElementById('log_list');
            log_list.appendChild(dl);
        }
    }
    this.detail = function(node) {
        this.filename = node.attr('filename');
        pw_log.filename = this.filename;
        this.url_params.filename = this.filename;

        pw_app.postHtml(
            { controller: 'pw_admin', action: 'log_file'},
            this.url_params,
            { callback: callback , is_show_loading: true}
        );
        function callback(data) {
            var values = nl2br(data);
            pw_log.log_title.html(pw_log.filename);
            pw_log.log_contents.html(values);
            pw_ui.showModal('log-window');
        }
    }
    this.reload = function(node) {
        if (!pw_log.filename) return;
        this.url_params.filename = pw_log.filename;
        pw_app.postHtml(
            { controller: 'pw_admin', action: 'log_file'},
            this.url_params,
            { callback: callback , is_show_loading: true}
        );
        function callback(data) {
            var values = nl2br(data);
            pw_log.log_contents.html(values);
        }
    }
    this.delete = function(node) {
        if (window.confirm('delete log?')) {
            var url = pw_log.base_url + 'pw_admin/delete_log';
            this.url_params.filename = pw_log.filename;
            pw_app.postHtml(
                { controller: 'pw_admin', action: 'delete_log'},
                this.url_params,
                { callback: callback , is_show_loading: true}
            )
            function callback(data) {
                pw_log.log_title.html('');
                pw_log.log_contents.html('');
                pw_ui.hideModal('log-window');
            }
        }
    }

    /**
     * return to BR tag
     * 
     * @param string str
     */
    var nl2br = function (str) {
        return str.replace(/\n/g, '<br>');
    };

}

var log_file_name = '';
var pw_log = new PwLog();

document.addEventListener('DOMContentLoaded', function() {
    pw_log.log_window = PwNode.id('log-window');
    pw_log.log_title = PwNode.id('log-title');
    pw_log.log_contents = PwNode.id('log-contents');
    //pw_log.base_url = pw_app.projectUrl()
});