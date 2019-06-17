/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2018 Yohei Yoshikawa (https://github.com/yoo16/)
 */

'use strict';
var pw_form;

document.addEventListener('DOMContentLoaded', function() {
    pw_form = new PwForm();
});

var PwForm = function () {
    this.value = {}

    PwForm.getByName = function(name) {
        var elements = document.forms[name].elements;
        if (!elements) return;
        var length = elements.length;
        var model_name = '';
        var values = {};
        for (var i = 0; i <= length; i++) {
            var element = PwNode.byElement(elements[i]);
            if (model_name = element.attr('pw-model')) {
                var name = element.name();
                values[name] = element.value();
            }
        }
        return values;
    }
    this.init = function(selector_id) {
        this.initInput(selector_id)
        this.initSelect(selector_id)
        this.initTextarea(selector_id)
    }
    this.initInput = function(selector_id) {
        var selector = selector_id + ' input';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var type = node.attr('type');
            var name = node.attr('name');
            var default_value = node.attr('default_value');
            if (name) {
                if (type == 'checkbox') {
                    node.setValue('');
                    if (default_value) node.setValue(default_value);
                } else if (type == 'radio') {
                    node.setValue('');
                    if (default_value) node.setValue(default_value);
                } else {
                    node.setValue('');
                    if (default_value) node.setValue(default_value);
                }
            }
        });
    }
    this.initSelect = function(selector_id) {
        var selector = selector_id + ' select option';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var name = node.parent().attr('name');
            var default_value = element.attr('default_value');
            if (name) {
                node.parent().setValue('');
                if (default_value) node.parent().setValue(default_value);
            }
        });
    }
    this.initTextarea = function(selector_id) {
        var selector = selector_id + ' textarea';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var name = node.attr('name');
            var default_value = node.attr('default_value');
            if (name) {
                node.setValue('');
                if (default_value) node.setValue(default_value);
            }
        });
    }
    this.bind = function(selector_id, values) {
        this.init(selector_id);
        this.bindInput(selector_id, values);
        this.bindSelect(selector_id, values);
        this.bindTextarea(selector_id, values);
    }
    this.bindInput = function(selector_id, values) {
        var selector = selector_id + ' input';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var type = node.attr('type');
            var name = node.attr('name');
            name = checkName(name);
            if (name && values[name]) {
                var value = values[name];
                if (type == 'checkbox') {

                } else if (type == 'radio') {
                    //TODO
                    node.setValue(value);
                } else {
                    node.setValue(value);
                }
            }
        });
    }
    this.bindSelect = function(selector_id, values) {
        var selector = selector_id + ' select option';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var name = node.parent().attr('name');
            name = checkName(name);
            if (name && values[name]) { node.parent().setValue(values[name]); }
        });
    }
    this.bindTextarea = function(selector_id, values) {
        var selector = selector_id + ' textarea';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var name = node.attr('name');
            name = checkName(name);
            if (name && values[name]) { node.setValue(values[name]); }
        });
    }
    this.loadForm = function(selector_id) {
        this.loadInput(selector_id);
        this.loadSelect(selector_id);
        this.loadTextarea(selector_id);
    }
    this.loadInput = function(selector_id) {
        var selector = selector_id + ' input';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var type = node.attr('type');
            var name = node.attr('name');
            if (name) {
                if (type == 'checkbox') {
                    pw_form.value[name] = checkboxValues(name);
                } else if (type == 'radio') {
                    var checked = node.checked();
                    if (checked) pw_form.value[name] = node.value();
                } else {
                    pw_form.value[name] = node.value();
                }
            }
        });
    }
    this.loadSelect = function(selector_id) {
        var selector = selector_id + ' select option';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var name = node.parent().attr('name');
            if (name) pw_form.value[name] = node.value();
        });
    }
    this.loadTextarea = function(selector_id) {
        var selector = selector_id + ' textarea';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var name = node.attr('name');
            if (name) pw_form.value[name] = node.value();
        });
    }
    /**
     * check name
     * 
     * @param  string name
     * @return string
     */
    function checkName(name) {
        if (!name) return;
        var names;
        if (name.indexOf('[') != -1) {
            names = name.split('[');
            name = names[1];
        }
        if (name.indexOf(']') != -1) {
            names = name.split(']');
            name = names[0];
        }
        return name;
    }
    /**
     * checkboxValues
     * 
     * @param  string name
     * @return string
     */
    function checkboxValues(name) {
        var selector = '[name="' + name + '"]:checked';
        let elements = PwNode.byQuery(selector).elements;
        if (!elements) return;
        var checks = [];
        [].forEach(elements, function(element) {
            var node = PwNode.byElement(element);
            var checked = node.checked();
            if (checked) {
                checks.push(node.value());
            }
        });
        return checks;
    }

}