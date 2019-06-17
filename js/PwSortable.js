/**
 * PwSortable
 * 
 * ver 0.0.1
 * required PwNode.js
 * 
 * @author  Yohei Yoshikawa
 * Copyright (c) 2018 Yohei Yoshikawa (https://github.com/yoo16/)
 */

var PwSortable = function(options) {
    const pw_row_id_column = 'pw_sortable_';

    this.options = options;
    this.is_show_sortable = false;
    this.table_id = 'sortable-table';
    this.row_id_column = 'row-id';
    this.api_uri = '';
    this.body_selector = '';
    this.tr_selector = '';
    this.sortable_tr_selector = '';
    this.sort_orders;
    this.model_name = '';
    this.before_rows = []; //under construction
    this.callback;
    this.is_use_loading = true;
    this.is_font_awesome = true;
    this.is_use_row_control = true;
    this.drag_item;
    this.target_item;
    this.drag_element;
    this.drag_label = '=';
    this.up_label = '[Top]';
    this.bottom_label = '[Bottom]';
    this.is_add_events = false;

    this.init = function(node) {
        this.bindOptions();
        this.loadTableId(node);
        this.addDragEvents();
        this.enableDrag();
        pw_sortable.is_show_sortable = true;
        pw_sortable.before_rows = [];
    }
    this.bindOptions = function() {
        if (!pw_sortable.options) return;
        Object.keys(pw_sortable.options).forEach(function(key) {
            pw_sortable[key] = this[key];
        }, pw_sortable.options);
    }
    this.addDragEvents = function() {
        //TODO
        if (pw_sortable.is_add_events == true) return;
        pw_sortable.is_add_events = true;
        function handleDragStart(event) {
            let tr = event.target.closest('tr');
            if (tr) pw_sortable.drag_item = event.target.closest('tr');
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
            var tr = event.target.closest('tr');
            if (tr && pw_sortable.drag_item != tr) {
                pw_sortable.target_item = tr;
            }
        }
        function handleDrop(event) {
            event.target.style.opacity = '1.0'
            let row_id = pw_sortable.drag_item.getAttribute(pw_sortable.row_id_column);
            if (row_id && pw_sortable.target_item && pw_sortable.drag_item != pw_sortable.target_item) {
                var tbody = PwNode.byQuery(pw_sortable.body_selector).first();
                let drag_order = pw_sortable.drag_item.getAttribute('order');
                let target_order = pw_sortable.target_item.getAttribute('order');
                if (drag_order > target_order) {
                    tbody.insertBefore(pw_sortable.drag_item, pw_sortable.target_item);
                } else if (drag_order < target_order) {
                    tbody.insertBefore(pw_sortable.drag_item, pw_sortable.target_item.nextElementSibling);
                }
                pw_sortable.reloadRowIds();
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
            pw_sortable.before_rows.push(element);
            row_node = PwNode.byElement(element);
            if (row_id = row_node.attr(pw_sortable.row_id_column)) {
                row_node.setAttr('id', pw_row_id_column + row_id);
                row_node.setAttr('order', index + 1);
                row_node.setAttr('draggable', true);
                row_node.setAttr('ondragstart', "event.dataTransfer.setData('text/plain', null)");
            }
        });
    }
    this.loadTableId = function(node) {
        if (node && node.attr('pw_sortable_table_id')) {
            pw_sortable.table_id = node.attr('pw_sortable_table_id');
        } else if (pw_sortable.options && pw_sortable.options.hasOwnProperty('table_id')) {
            pw_sortable.table_id = pw_sortable.options.table_id;
        }
        pw_sortable.body_selector = '#' + pw_sortable.table_id + ' tbody';
        pw_sortable.tr_selector = '#' + pw_sortable.table_id + ' tr';
        pw_sortable.sortable_tr_selector = pw_sortable.body_selector + ' tr';
    }
    this.getElements = function() {
        let elements = PwNode.byQuery(pw_sortable.sortable_tr_selector).elements;
        return elements;
    }
    this.reloadRowIds = function() {
        pw_sortable.sort_orders = [];
        var order = 0;
        [].forEach.call(this.getElements(), function(element) {
            order++;
            element.setAttribute('order', order);
            let row_id = element.getAttribute(pw_sortable.row_id_column);
            if (row_id) {
                pw_sortable.sort_orders.push({id: row_id, order: order});
            }
        });
    }
    this.getOrders = function() {
        return pw_sortable.sort_orders;
    }
    this.set = function(params) {
        if (params) {
            if (params.hasOwnProperty('table_id')) pw_sortable.table_id = params.table_id;
            if (params.hasOwnProperty('api_uri')) pw_sortable.api_uri = params.api_uri;
            if (params.hasOwnProperty('callback')) pw_sortable.callback = params.callback;
            if (params.hasOwnProperty('is_use_loading')) pw_sortable.is_use_loading = params.is_use_loading;
        }
    }
    this.reset = function(node) {
        pw_sortable.close(node);
    }
    this.edit = function(node) {
        if (pw_sortable.is_show_sortable) return;
        this.init(node);
        PwNode.byClass('pw-sortable-control').show();
        pw_sortable.showControl(node);
    }
    this.update_sort = function(node) {
        if (!pw_sortable.sort_orders) return;
        pw_app.postJson( { controller: node.controller(), action: node.action() },
            JSON.stringify(this.getOrders()),
            {callback: callback, is_show_loading: true}
        );
        function callback(data) {
            pw_sortable.before_rows = [];
            pw_sortable.is_show_sortable = false;
            pw_sortable.close(node);
            if (pw_sortable.callback) pw_sortable.callback(data);
        }
    }
    this.close = function(node) {
        pw_sortable.is_show_sortable = false;
        PwNode.byClass('pw-sortable-control').hide();
        PwNode.byClass('sortable-control').remove();
        this.cursorChange('default');

        [].forEach.call(this.getElements(), function(element, index) {
            row_node = PwNode.byElement(element);
            if (row_node.attr(pw_sortable.row_id_column)) { row_node.setAttr('draggable', false); }
        });
    }
    this.cursorChange = function(value) {
        var tbody = PwNode.byQuery(pw_sortable.body_selector).first();
        tbody.style.cursor = value;
    }
    this.showControl = function(node) {
        PwNode.byClass('sortable-control').show();
        if (this.is_use_row_control) this.addRowControl();
    }
    this.top = function(node) {
        var tbody = PwNode.byQuery(pw_sortable.body_selector).first();
        var top_tr = PwNode.byQuery(pw_sortable.sortable_tr_selector).first()
        var tr = node.element.closest('tr');
        tbody.insertBefore(tr, top_tr);

        pw_sortable.reloadRowIds();
    }
    this.bottom = function(node) {
        var tbody = PwNode.byQuery(pw_sortable.body_selector).first();
        var last_tr = PwNode.byQuery(pw_sortable.sortable_tr_selector).last()
        var tr = node.element.closest('tr');
        tbody.insertBefore(tr, last_tr);

        pw_sortable.reloadRowIds();
    }
    this.addRowControl = function() {
        var header_tr_element = PwNode.byQuery(pw_sortable.tr_selector).first();
        var sortable_control_header_element = document.createElement('th')
        sortable_control_header_element.classList.add('sortable-control');
        header_tr_element.insertBefore(sortable_control_header_element, header_tr_element.children[0]);

        [].forEach.call(this.getElements(), function(element, index) {
            let tr = PwNode.byElement(element);
            if (row_id = tr.attr(pw_sortable.row_id_column)) {
                var sortable_control_element = document.createElement('td');
                sortable_control_element.classList.add('sortable-control');
                sortable_control_element.setAttribute('row_id', row_id);
                sortable_control_element.setAttribute('nowrap', 'nowrap');
                element.insertBefore(sortable_control_element, element.children[0]);
            }
        });

        var link_tag = '';
        var drag_label = this.drag_label;
        var up_label = this.up_label;
        var bottom_label = this.bottom_label;
        if (this.is_font_awesome) {
            drag_label = '<i class="fa fa-align-justify"></i>';
            up_label = '<i class="fa fa-angle-double-up"></i>';
            bottom_label = '<i class="fa fa-angle-double-down"></i>';
        }
        link_tag+= '<a>' + drag_label +'</a>';
        link_tag+= '<a class="btn btn-sm pw-click" pw-lib="PwSortable" pw-action="top">' + up_label + '</a>';
        link_tag+= '<a class="bottom btn btn-sm pw-click" pw-lib="PwSortable" pw-action="bottom">' + bottom_label + '</a>';
        PwNode.byQuery('td.sortable-control').html(link_tag);
    }
}
var pw_sortable = new PwSortable();
document.addEventListener('DOMContentLoaded', function() {
});