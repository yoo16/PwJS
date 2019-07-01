/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2019 Yohei Yoshikawa (https://github.com/yoo16/)
 */

var PwModal = function() {
    this.backdrop_id = 'pw_modal_backdrop';
    this.load_show_class_name = 'pw-modal';
    this.show_class_name = 'pw-modal-show';
    this.close_class_name = 'pw-modal-close';
    this.pw_backdrop_element;
    
    this.createBackground = function() {
        if (!pw_modal.pw_backdrop_element) {
            pw_modal.pw_backdrop_element = document.createElement('div');
            pw_modal.pw_backdrop_element.id = 'pw_modal_backdrop';
            pw_modal.pw_backdrop_element.classList.add('pw_modal_backdrop');
            document.body.appendChild(pw_modal.pw_backdrop_element);
        }
    }

    this.show = function(selector) {
        if (!selector) return;
        pw_modal.createBackground();

        var background_node = PwNode.id(pw_modal.backdrop_id);
        background_node.show();

        var node = PwNode.id(selector);
        node.showInline();
    }
    this.hide = function(selector) {
        //if (!selector) return;
        var background_node = PwNode.id(pw_modal.backdrop_id);
        background_node.hide();

        //var node = PwNode.id(selector);
        //node.hide();
        PwNode.byClass(pw_modal.load_show_class_name).hide();
    }
    this.showHandler = function(event) {
        pw_modal.show(this.getAttribute('selector'));
    }
    this.hideHandler = function(event) {
        pw_modal.hide(this.getAttribute('selector'));
    }
    this.reloadEvents = function() {
        //IE dosen't work elements.forEach()
        let load_show_elements = document.getElementsByClassName(pw_modal.load_show_class_name);
        [].forEach.call(load_show_elements, function(element) {
            let event = element.getAttribute('event');
            let action = element.getAttribute('action');
            if (element.id && event && action) {
                if (event == 'load' && action == 'show') {
                    pw_modal.show(element.id);
                }
            }
        });
        let show_elements = document.getElementsByClassName(pw_modal.show_class_name);
        [].forEach.call(show_elements, function(element) {
            element.addEventListener('click', pw_modal.showHandler, false);
        });
        let close_elements = document.getElementsByClassName(pw_modal.close_class_name);
        [].forEach.call(close_elements, function(element) {
            element.addEventListener('click', pw_modal.hideHandler, false);
        });
    }
}

var pw_modal = new PwModal();
document.addEventListener('DOMContentLoaded', function() {
    pw_modal.reloadEvents();
});
