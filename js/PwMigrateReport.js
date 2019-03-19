/**
 * @author  Yohei Yoshikawa
 *
 * Copyright (c) 2018 Yohei Yoshikawa (https://github.com/yoo16/)
 */

'use strict';
//TODO remove jquery

var PwMigrateReport = function () {
    this.log_contents;

    this.show_errors = function(node) {
        var params = {};
        params.migrate_report_id = node.attr('migrate_report_id');
        pw_app.controllerPost('migrate_report', 'api_error', params, callback);

        function callback(json) {
            if (!json) return;
            var errors = JSON.parse(json);
            var html = '';
            if (errors) {
                if (errors.sql) {
                    $.each(errors.sql, function(key, sql_error) {
                        html+= '<div>' + sql_error + '</div>';
                    });
                } else if (errors.error) {
                    if (errors.error) {
                        $.each(errors.error, function(key, values) {
                            if (errors.old_db_info) {
                                var old_db_info = errors.old_db_info[key];
                                html+= '<div>' + old_db_info.host + ' ' + old_db_info.dbname + '</div>';
                            }

                            $.each(values, function(index, value) {
                                html+= '<div>' + value.column + ' ' + value.message + '</div>';
                            });
                            if (errors.old_value) {
                                html+= '<ul>';
                                var old_value = errors.old_value[key];
                                $.each(old_value, function(object_key, object_value) {
                                    html+= '<li>' + object_key + ' : ' + object_value + '</li>';
                                });
                                html+= '</ul>';
                            }
                        });
                    }
                }
                log_contents.html(html);
                $('#migrate_error_modal').modal('show');
            }
        }
    }

    this.show_sql = function(node) {
        var params = {};
        params.migrate_report_id = node.attr('migrate_report_id');
        pw_app.controllerPost('migrate_report', 'api_sql', params, callback);

        function callback(json) {
            if (!json) return;
            var execution_sql = JSON.parse(json);
            var html = '';
            if (execution_sql) {
                if (execution_sql) {
                    $.each(execution_sql, function(key, sql) {
                        html+= '<div></div>' + sql + '</div>';
                    });
                }
                log_contents.html(html);
                $('#migrate_error_modal').modal('show');
            }
        }
    }
    this.deletes = function(node) {
        var message = node.attr('message');
        if (!window.confirm(message)) return;

        location.href = 'deletes';
    }

}

var pw_migrate_report = new PwMigrateReport();
document.addEventListener('DOMContentLoaded', function() {
    pw_migrate_report.log_contents = PwNode.id('log-contents').html(html);
});
