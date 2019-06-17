/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2018 Yohei Yoshikawa (https://github.com/yoo16/)
 */

var PwUI = function() {
    this.delete_file_window_name = 'delete-file-window';
    this.error_window_name = 'pw-error';
    this.popup_name = 'pw-popup';
    this.confirm_dialog_name = 'confirm-dialog';
    this.confirm_delete_name = 'confirm-delete';
    this.delete_checkbox_name = 'delete_checkbox';

    /**
     * convert jQuery id
     */
    this.jqueryId = function(id) {
        if (id) {
            var start = id.slice(0, 1)
            if (start != '#') id = '#' + id;
        }
        return id;
    }

    //remove jquery
    this.showModal = function(selector) {
        selector = this.jqueryId(selector);
        $(selector).modal('show');
    }
    //remove jquery
    this.hideModal = function(selector) {
        selector = this.jqueryId(selector);
        $(selector).modal('hide');
    }

    this.openWindow = function(url, params) {
        var queryArray = [];
        [].forEach.call(params, function(key) {
            queryArray.push(key + '=' + params[key]);
        });
        var query = queryArray.join(',');
        if (url) window.open(url, 'new', query);
    }

    /**
     * confirm delete
     */
    this.deleteConfirmHandler = function(event) {
        var delete_id = this.getAttribute('delete_id');
        if (!delete_id) return;
        PwNode.id('from_delete_id').setValue(delete_id);
        pw_ui.showModal('delete-window');
    }
    this.reloadDeleteConfirm = function() {
        //IE dosen't work elements.forEach()
        let elements = document.getElementsByClassName(pw_ui.confirm_delete_name);
        [].forEach.call(elements, function(element) {
            element.addEventListener('click', pw_ui.deleteConfirmHandler, false);
        });
    }

    /**
     * popup
     */
    this.popupEventHandler = function(event) {
        var window_name = '_blank';
        var window_option = null;
        if (this.getAttribute('window_name')) window_name = this.getAttribute('window_name');
        if (this.getAttribute('window_option')) window_option = this.getAttribute('window_option');
        window.open(this.href, window_name, window_option).focus();
        event.preventDefault();
        event.stopPropagation();
    }
    this.reloadPopupEvent = function() {
        //IE dosen't work elements.forEach()
        let elements = document.getElementsByClassName(pw_ui.popup_name);
        [].forEach.call(elements, function(element) {
            element.addEventListener('click', pw_ui.popupEventHandler, false);
        });
    }

    /**
     * confirm dialog
     */
    //TODO remove event?
    this.confirmDialogHandler = function(event) {
        var message = '';
        if (this.getAttribute('message')) message = this.getAttribute('message');
        pw_ui.reloadConfirmDialogEvent();
        if (!window.confirm(message)) {
            event.preventDefault();
        }
    }
    this.reloadConfirmDialogEvent = function() {
        //IE dosen't work elements.forEach()
        let elements = document.getElementsByClassName(pw_ui.confirm_dialog_name);
        [].forEach.call(elements, function(element) {
            element.addEventListener('click', pw_ui.confirmDialogHandler, false);
        });
    }

    /**
     * delete check
     */
    this.deleteCheckbox = function() {
        //IE dosen't work elements.forEach()
        let elements = document.getElementsByClassName(pw_ui.delete_checkbox_name);
        [].forEach.call(elements, function(element) {
            element.addEventListener('change', function(event) {
                let pw_node = PwNode.byElement(element);
                let delete_link_node = PwNode.id('delete_link');
                let is_checked = pw_node.checked();
                if (is_checked) {
                    delete_link_node.abled();                    
                } else {
                    delete_link_node.disabled();                    
                }
            });
        });
    }
}

var pw_ui = new PwUI();
document.addEventListener('DOMContentLoaded', function() {
    pw_ui.deleteCheckbox();
    pw_ui.reloadDeleteConfirm();
    pw_ui.reloadConfirmDialogEvent();
    pw_ui.reloadPopupEvent();
});
