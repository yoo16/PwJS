/**
 * PwTableDND
 * 
 * ver 0.0.2
 * required PwNode.js
 * 
 * @author  Yohei Yoshikawa
 * Copyright (c) 2018 Yohei Yoshikawa (https://github.com/yoo16/)
 */

function PwTableDND(options) {
    var _this = this;
    const pw_row_id_column = 'pw_table_dnd_';

    this.that = this;
    this.options = options;
    this.url = '';
    this.is_show_sortable = false;
    this.is_show_up = true;
    this.is_show_down = true;
    this.is_show_top = true;
    this.is_show_bottom = true;
    this.table_id = 'sortable-table';
    this.row_id_column = 'row-id';
    this.tablednd_menu = 'pw-tablednd-menu';
    this.tablednd_control = 'pw-tablednd-control';
    this.tablednd_event = 'pw_table_dnd_event';
    this.api_uri = '';
    this.body_selector = '';
    this.tr_selector = '';
    this.sortable_tr_selector = '';
    this.sort_orders;
    this.model_name = '';
    this.before_rows = []; //under construction cache
    this.callback;
    this.is_use_loading = true;
    this.is_font_awesome = true;
    this.is_use_row_control = true;
    this.drag_item;
    this.target_item;
    this.drag_element;
    this.drag_label = '[Drag]';
    this.top_label = '[Top]';
    this.bottom_label = '[Bottom]';
    this.up_label = '[Up]';
    this.down_label = '[Down]';
    this.is_add_events = false;

    this.bindOptions = function() {
        if (!_this.options) return;
        Object.keys(_this.options).forEach(function(key) {
            _this[key] = this[key];
        }, _this.options);
    }
    this.init = function() {
        _this.bindOptions();
        _this.loadSelectorColumn();
        _this.addDragEvents();
        _this.enableDrag();
        _this.is_show_sortable = true;
        _this.before_rows = [];
    }
    this.addDragEvents = function() {
        //avoid duplicate event registration
        if (_this.is_add_events == true) return;
        _this.is_add_events = true;
        function handleDragStart(event) {
            let tr = event.target.closest('tr');
            if (tr) _this.drag_item = event.target.closest('tr');
            event.target.style.opacity = '0.4';
            event.stopPropagation();
        }
        function handleDrag(event) {
        }
        function handleDragEnter(event) {
        }
        function handleDragOver(event) {
            event.dataTransfer.dropEffect = 'move';
            event.preventDefault();
            return false;
        }
        function handleDragLeave(event) {
        }
        function handleDrop(event) {
            var tr = event.target.closest('tr');
            if (tr && _this.drag_item != tr) {
                let row_id = tr.getAttribute(_this.row_id_column);
                if (!row_id) return;
                _this.target_item = tr;
            }
            event.target.style.opacity = '1.0'
            let row_id = _this.drag_item.getAttribute(_this.row_id_column);
            if (row_id && _this.target_item && _this.drag_item != _this.target_item) {
                var tbody = PwNode.byQuery(_this.body_selector).first();
                let drag_order = _this.drag_item.getAttribute('order');
                let target_order = _this.target_item.getAttribute('order');
                if (drag_order && target_order) {
                    if (drag_order > target_order) {
                        tbody.insertBefore(_this.drag_item, _this.target_item);
                    } else if (drag_order < target_order) {
                        tbody.insertBefore(_this.drag_item, _this.target_item.nextElementSibling);
                    }
                    _this.reloadRowIds();
                }
            }
            event.preventDefault();
            event.stopPropagation();
        }
        function handleDragEnd(event) {
            event.target.style.opacity = ''
        }
        document.addEventListener('dragstart', handleDragStart, false);
        document.addEventListener('drag', handleDrag, false);
        document.addEventListener('dragenter', handleDragEnter, false)
        document.addEventListener('dragover', handleDragOver, false);
        document.addEventListener('dragleave', handleDragLeave, false);
        document.addEventListener('drop', handleDrop, false);
        document.addEventListener('dragend', handleDragEnd, false);
    }
    this.enableDrag = function() {
        if (!this.table_id) return;
        var row_id;
        [].forEach.call(this.getElements(), function(element, index) {
            _this.before_rows.push(element);
            row_node = PwNode.byElement(element);
            if (row_id = row_node.attr(_this.row_id_column)) {
                row_node.setAttr('id', pw_row_id_column + row_id);
                row_node.setAttr('order', index + 1);
                row_node.setAttr('draggable', true);
                if (!pw_app.isIE()) {
                    row_node.setAttr('ondragstart', "event.dataTransfer.setData('text/plain', null)");
                }
            }
        });
    }
    this.loadSelectorColumn = function() {
        _this.body_selector = '#' + _this.table_id + ' tbody';
        _this.tr_selector = '#' + _this.table_id + ' tr';
        _this.sortable_tr_selector = _this.body_selector + ' tr';
    }
    this.getElements = function() {
        let elements = PwNode.byQuery(_this.sortable_tr_selector).elements;
        return elements;
    }
    this.reloadRowIds = function() {
        _this.sort_orders = [];
        var order = 0;
        [].forEach.call(this.getElements(), function(element) {
            order++;
            element.setAttribute('order', order);
            let row_id = element.getAttribute(_this.row_id_column);
            if (row_id) {
                _this.sort_orders.push({id: row_id, order: order});
            }
        });
    }
    this.getOrders = function() {
        return _this.sort_orders;
    }
    this.set = function(params) {
        if (params) {
            if (params.hasOwnProperty('table_id')) _this.table_id = params.table_id;
            if (params.hasOwnProperty('api_uri')) _this.api_uri = params.api_uri;
            if (params.hasOwnProperty('callback')) _this.callback = params.callback;
            if (params.hasOwnProperty('is_use_loading')) _this.is_use_loading = params.is_use_loading;
        }
    }
    this.reset = function() {
        _this.close();
    }
    this.setOptions = function(options) {
        _this.options = options;
    }
    this.edit = function() {
        if (_this.is_show_sortable) return;
        _this.init();
        PwNode.byClass(_this.tablednd_menu).show();
        _this.showControl();
    }
    this.update_sort = function() {
        if (!_this.sort_orders) return;
        let json = JSON.stringify(_this.getOrders());
        let controller = this.getAttribute('pw-controller');
        let action = this.getAttribute('pw-action');

        if (typeof pw_app === "undefined") {
            if (_this.url) {
                _this.postJson(_this.url, json, options);
            } else {
                window.alert('Not found url');
            }
        } else {
            //use PwApp
            pw_app.postJson( { controller: controller, action: action },
                json,
                {callback: callback, is_show_loading: true}
            );
        }
        function callback(data) {
            _this.before_rows = [];
            _this.is_show_sortable = false;
            _this.close();
            if (_this.callback) _this.callback(data);
        }
    }
    //Case: not use PwApp
    this.postJson = function (url, json, options) {
        if (options.is_show_loading) pw_ui.showLoading();
        function headerPostJson (json) {
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
        function fetchRequest(url, header_options, options) {
            var callback = options.callback;
            var error_callback = options.error_callback;
            fetch(url, header_options).catch(function(err) {
                throw new Error('post error')
            }).then(function(response) {
                //const promise = response.text();
                if (response.ok) {
                    return response.text().then(function(text) {
                        return text;
                    });
                } else {
                    if (error_callback) error_callback(response);
                }
            }).then(function(text) {
                if (callback) callback(text);
            }); 
        }
        fetchRequest(url, headerPostJson(json), options);
    }
    this.close = function() {
        _this.is_show_sortable = false;
        PwNode.byClass(_this.tablednd_menu).hide();
        PwNode.byClass(_this.tablednd_control).remove();
        this.cursorChange('default');

        [].forEach.call(this.getElements(), function(element, index) {
            row_node = PwNode.byElement(element);
            if (row_node.attr(_this.row_id_column)) { row_node.setAttr('draggable', false); }
        });
    }
    this.cursorChange = function(value) {
        var tbody = PwNode.byQuery(_this.body_selector).first();
        tbody.style.cursor = value;
    }
    this.showControl = function(node) {
        PwNode.byClass(_this.tablednd_control).show();
        if (this.is_use_row_control) this.addRowControl();
    }
    this.top = function(event) {
        var tbody = PwNode.byQuery(_this.body_selector).first();
        let top_tr = PwNode.byQuery(_this.sortable_tr_selector).first()
        let tr = this.closest('tr');
        tbody.insertBefore(tr, top_tr);
        _this.reloadRowIds();
    }
    this.up = function(event) {
        var tbody = PwNode.byQuery(_this.body_selector).first();
        let tr = this.closest('tr');
        let prev_tr = tr.previousElementSibling;
        if (prev_tr) {
            tbody.insertBefore(tr, prev_tr);
            _this.reloadRowIds();
        }
    }
    this.down = function(event) {
        var tbody = PwNode.byQuery(_this.body_selector).first();
        let tr = this.closest('tr');
        let next_tr = tr.nextElementSibling;
        if (next_tr) {
            tbody.insertBefore(next_tr, tr);
            _this.reloadRowIds();
        }
    }
    this.bottom = function(event) {
        var tbody = PwNode.byQuery(_this.body_selector).first();
        let last_tr = PwNode.byQuery(_this.sortable_tr_selector).last();
        let tr = this.closest('tr');
        tbody.insertBefore(tr, last_tr);
        _this.reloadRowIds();
    }
    this.addRowControl = function() {
        var header_tr_element = PwNode.byQuery(_this.tr_selector).first();
        var sortable_control_header_element = document.createElement('th');
        sortable_control_header_element.classList.add(_this.tablednd_control);
        header_tr_element.insertBefore(sortable_control_header_element, header_tr_element.children[0]);

        [].forEach.call(this.getElements(), function(element, index) {
            let tr = PwNode.byElement(element);
            if (row_id = tr.attr(_this.row_id_column)) {
                var sortable_control_element = document.createElement('td');
                sortable_control_element.classList.add(_this.tablednd_control);
                sortable_control_element.setAttribute('row_id', row_id);
                sortable_control_element.setAttribute('nowrap', 'nowrap');
                element.insertBefore(sortable_control_element, element.children[0]);
            }
        });

        var link_tag = '';
        link_tag = '';
        var drag_label = this.drag_label;
        var top_label = this.top_label;
        var bottom_label = this.bottom_label;
        var up_label = this.up_label;
        var down_label = this.down_label;
        if (this.is_font_awesome) {
            drag_label = '<i class="fa fa-align-justify"></i>';
            top_label = '<i class="fa fa-angle-double-up"></i>';
            bottom_label = '<i class="fa fa-angle-double-down"></i>';
            up_label = '<i class="fa fa-angle-up"></i>';
            down_label = '<i class="fa fa-angle-down"></i>';
        } 
        var drag_element = document.createElement('a');
        drag_element.innerHTML = drag_label;

        var top_element = document.createElement('a');
        top_element.classList.add('btn');
        top_element.classList.add('btn-sm');
        top_element.classList.add(_this.tablednd_event);
        top_element.setAttribute('event', 'click');
        top_element.setAttribute('action', 'top');
        top_element.innerHTML = top_label;

        var bottom_element = document.createElement('a');
        bottom_element.classList.add('btn');
        bottom_element.classList.add('btn-sm');
        bottom_element.classList.add(_this.tablednd_event);
        bottom_element.setAttribute('event', 'click');
        bottom_element.setAttribute('action', 'bottom');
        bottom_element.innerHTML = bottom_label;

        var up_element = document.createElement('a');
        up_element.classList.add('btn');
        up_element.classList.add('btn-sm');
        up_element.classList.add(_this.tablednd_event);
        up_element.setAttribute('event', 'click');
        up_element.setAttribute('action', 'up');
        up_element.innerHTML = up_label;

        var down_element = document.createElement('a');
        down_element.classList.add('btn');
        down_element.classList.add('btn-sm');
        down_element.classList.add(_this.tablednd_event);
        down_element.setAttribute('event', 'click');
        down_element.setAttribute('action', 'down');
        down_element.innerHTML = down_label;

        link_tag+= drag_element.outerHTML;
        if (_this.is_show_top) link_tag+= top_element.outerHTML;
        if (_this.is_show_bottom) link_tag+= bottom_element.outerHTML;
        if (_this.is_show_up) link_tag+= up_element.outerHTML;
        if (_this.is_show_down) link_tag+= down_element.outerHTML;

        //TODO add element?
        let query = 'td.' + _this.tablednd_control;
        PwNode.byQuery(query).html(link_tag);

        let elements = document.getElementsByClassName('pw_table_dnd_event');
        if (elements) {
            [].forEach.call(elements, function(element) {
                let event = element.getAttribute('event');
                let action = element.getAttribute('action');
                if (event == 'click' && action) { element.addEventListener('click', _this[action], false); }
            });
        }
    }
    this.reloadEvents = function() {
        addEvents();
    }
    function addEvents() {
        let elements = document.getElementsByClassName('pw_table_dnd');
        if (elements) {
            [].forEach.call(elements, function(element) {
                let event = element.getAttribute('event');
                let action = element.getAttribute('action');
                if (event && action) { 
                    if (element.removeEventListener) element.removeEventListener(event, _this[action], false); 
                    element.addEventListener(event, _this[action], false); 
                }
            });
        }
    }
    document.addEventListener('DOMContentLoaded', function() {
        addEvents();
    });
    return this;
}
var pw_table_dnd = new PwTableDND();