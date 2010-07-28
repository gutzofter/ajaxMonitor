/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 3:38:11 PM
 * To change this template use File | Settings | File Templates.
 */


function NewAjaxMonitorView(msgBus) {
    var view = {};

    view.initialize = function($thisElement) {

        $('<div id="ajax_monitor_container" class="reset_left left_position"/>').appendTo($thisElement);

        $('#ajax_monitor_container')
                .append('<h1><span id="monitor_button" class="control">Monitor</span></h1>')
                .append('<div id="monitor_container" class="main_container reset_left left_position"/>');

        $('#monitor_container')
                .append('<div id="monitor_controls" class="section reset_left left_position"></div>')
                .append('<div id="monitor_messages" class="section reset_left left_position">Monitor Messages</div>')
                .append('<div id="monitor_footer" class="section reset_left left_position">Monitor Footer</div>')
                .append('<div id="monitor_status" class="section reset_left left_position">Monitor Status</div>');

        $('#monitor_controls')
                .append('<div id="remove_control" class="control reset_left left_position">Remove</div>')
                .append('<div id="activate_control" class="control right_position">Activate Not Initialized</div>');

        $('#monitor_messages')
            .append('<table id="monitor_table" />');

        $('<thead>' +
                '<tr>' +
                    '<th>Status</th><th>Completion Time mSec(s)</th>' +
                '</tr>' +
                '</thead>').appendTo('#monitor_table');
        $('<tbody>' +
                '<tr>' +
//                    '<td>------</td><td>0</td>' +
                '</tr>' +
                '</tbody>').appendTo('#monitor_table');
        $('<tfoot>' +
                '<tr>' +
                    '<th>Status</th><th>Completion Time mSec(s)</th>' +
                '</tr>' +
                '</tfoot>').appendTo('#monitor_table');

        $('#monitor_container').hide();

        $('#monitor_button').click(function() {
            view.displayToggle();
        });

        $('#activate_control').click(function() {
            msgBus.fire.toggleActivation();
        });

        $('#remove_control').click(function() {
            msgBus.fire.removeMonitor();
        });

    };

    view.destroy = function() {
        $('#ajax_monitor_container').remove();
    };

    view.minimize = function() {
        $('#monitor_container').hide();
    };

    view.maximize = function() {
        $('#monitor_container').show();
    };

    view.setNotActive = function() {
        $('#activate_control').text('Activate');
        $('#monitor_status').text('Not Active');
    };

    view.setActive = function() {
        $('#activate_control').text('De-Activate');
        $('#monitor_status').text('Active');
    };

    view.displayToggle = function() {
        $('#monitor_container').slideToggle('slow');
    };

    view.newMessage = function(message) {
        var tableEntry = '<tr>' +
                '<td>' + message.completedStatus + '</td>' +
                '<td>' + message.timeToComplete + '</td>';
        $('#monitor_table tbody').append(tableEntry);
    };

    return view;
}

