/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2019 Yohei Yoshikawa (https://github.com/yoo16/)
 */

'use strict';

var pw_node;

var PwDom = function (params) {
    this.params = params;
    this.init = function() {
        if (this.params.id) {
            this.dom = document.getElementById(this.params.id);
        } else if (this.params.dom) {
            this.dom = this.params.dom;
        }
    }
    this.setValue = function(value) {
        if (this.dom) {
            this.dom.setAttribute('value', value);
            return this;
        }
    }
    this.setAttr = function(key, value) {
        if (this.dom) {
            this.dom.setAttribute(key, value);
            return this;
        }
    }
    this.bind = function(params) {
        if (!params) return;
        if (this.dom) Object.keys(params).map(function(key) { this.dom.setAttribute(key, params[key]) });
    }
    this.value = function(value) {
        if (this.dom) return this.dom.getAttribute('value');
    }
    this.attr = function(selector) {
        if (!selector) return;
        if (this.dom) return this.dom.getAttribute(selector);
    }
    this.html = function(html) {
        if (this.dom) return this.dom.innerHTML = html;
    }
    this.toggle = function(class_name) {
        if (!class_name) return;
        if (this.dom) {
            this.dom.classList.toggle(class_name);
            return this;
        }
    }
    this.controller = function() {
        if (this.dom) return this.attr('pw-controller');
    }
    this.action = function() {
        if (this.dom) return this.attr('pw-action');
    }

    /**
     * controller class name
     * 
     * @return string
     */
    this.controllerClassName = function() {
        if (!this.dom) return;
        var controller_name = this.controller();
        if (!controller_name) return;

        var class_name = '';
        var names = controller_name.split('_');
        if (!names) return;
        names.forEach(function(name) {
            class_name += upperTopString(name);
        });
        class_name += 'Controller';
        return class_name;
    }


    /**
    * upper string for top
    *
    * @param string string
    * @return string
    **/
   function upperTopString(string) {
        if (!string) return;
        var value = string.charAt(0).toUpperCase() + string.slice(1);
        var value = string.substring(0, 1).toUpperCase() + string.substring(1);
        var value = string.replace(/^[a-z]/g, function (val) { return val.toUpperCase(); });
        return value;
    }
}