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
        $(selector).each(function() {
            var type = $(this).attr('type');
            var name = $(this).attr('name');
            var default_value = $(this).attr('default_value');
            if (name) {
                if (type == 'checkbox') {
                    $(this).val('');
                    if (default_value) $(this).val(default_value);
                } else if (type == 'radio') {
                    $(this).val('');
                    if (default_value) $(this).val(default_value);
                } else {
                    $(this).val('');
                    if (default_value) $(this).val(default_value);
                }
            }
        });
    }
    this.initSelect = function(selector_id) {
        var selector = selector_id + ' select option';
        $(selector).each(function() {
            var name = $(this).parent().attr('name');
            var default_value = $(this).attr('default_value');
            if (name) {
                $(this).parent().val('');
                if (default_value) $(this).parent().val(default_value);
            }
        });
    }
    this.initTextarea = function(selector_id) {
        var selector = selector_id + ' textarea';
        $(selector).each(function() {
            var name = $(this).attr('name');
            var default_value = $(this).attr('default_value');
            if (name) {
                $(this).val('');
                if (default_value) $(this).val(default_value);
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
        $(selector).each(function() {
            var type = $(this).attr('type');
            var name = $(this).attr('name');
            name = checkName(name);
            if (name && values[name]) {
                var value = values[name];
                if (type == 'checkbox') {

                } else if (type == 'radio') {
                    $(this).val(value);
                } else {
                    $(this).val(value);
                }
            }
        });
    }
    this.bindSelect = function(selector_id, values) {
        var selector = selector_id + ' select option';
        $(selector).each(function() {
            var name = $(this).parent().attr('name');
            name = checkName(name);
            if (name && values[name]) {
                var value = values[name];
                $(this).parent().val(value);
            }
        });
    }
    this.bindTextarea = function(selector_id, values) {
        var selector = selector_id + ' textarea';
        $(selector).each(function() {
            var name = $(this).attr('name');
            name = checkName(name);
            if (name && values[name]) {
                var value = values[name];
                $(this).val(value);
            }
        });
    }
    this.loadForm = function(selector_id) {
        this.loadInput(selector_id);
        this.loadSelect(selector_id);
        this.loadTextarea(selector_id);
    }
    this.loadInput = function(selector_id) {
        var selector = selector_id + ' input';
        $(selector).each(function() {
            var type = $(this).attr('type');
            var name = $(this).attr('name');

            if (name) {
                if (type == 'checkbox') {
                    pw_form.value[name] = checkboxValues(name);
                } else if (type == 'radio') {
                    var checked = $(this).prop('checked');
                    if (checked) pw_form.value[name] = $(this).val();
                } else {
                    pw_form.value[name] = $(this).val();
                }
            }
        });
    }
    this.loadSelect = function(selector_id) {
        var selector = selector_id + ' select option';
        $(selector).each(function() {
            var name = $(this).parent().attr('name');
            if (name) pw_form.value[name] = $(this).val();
        });
    }
    this.loadTextarea = function(selector_id) {
        var selector = selector_id + ' textarea';
        $(selector).each(function() {
            var name = $(this).attr('name');
            if (name) pw_form.value[name] = $(this).val();
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
        var column = '[name="' + name + '"]:checked';
        var checks = [];
        $(column).each(function() {
            var checked = $(this).prop('checked');
            if (checked) {
                checks.push($(this).val());
            }
        });
        return checks;
    }

}