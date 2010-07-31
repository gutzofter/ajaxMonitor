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
                .append('<div id="monitor_messages" class="section reset_left left_position"><div>Monitor Messages</div></div>')
                .append('<div id="monitor_footer" class="section reset_left left_position">Monitor Footer</div>')
                .append('<div id="monitor_status" class="section reset_left left_position">Monitor Status</div>');

        $('#monitor_controls')
                .append('<div id="remove_control" class="control reset_left left_position">Remove</div>')
                .append('<div id="activate_control" class="control right_position">Activate Not Initialized</div>');

        $('#monitor_messages')
                .append('<table id="monitor_table" class="display"/>');

        $('#monitor_table').hide();
        $('<thead>' + view.formatColumnHTML() + '</thead>').appendTo('#monitor_table');
        $('<tfoot>' + view.formatColumnHTML() + '</tfoot>').appendTo('#monitor_table');
        $('<tbody>' + '</tbody>').appendTo('#monitor_table');


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
        var id = message.id;
        var selector = '#monitor_table tbody tr[id=message_' + id + ']';

        $(selector).remove();

        var tableEntry = view.formatMessageHTML(id, message);

        $('#monitor_table tbody').append(tableEntry);
        $('#monitor_table').show();
    };

    view.formatColumnHTML = function() {
        var columns = '<tr>';

        columns += view.formatColumnItemHTML('Id', 5);
        columns += view.formatColumnItemHTML('HTTP Status', 5);
        columns += view.formatColumnItemHTML('Completion Time mSec(s)', 10);
        columns += view.formatColumnItemHTML('Request Type', 25);
        columns += view.formatColumnItemHTML('Url', 25);
        columns += view.formatColumnItemHTML('Request Status', 15);
        columns += view.formatColumnItemHTML('Completion Status', 15);

        columns += '</tr>';

        return columns;
    };

    view.formatColumnItemHTML = function(item, width) {
//        return '<th width="' + width + '%">' + item + '</th>';
        return '<th >' + item + '</th>';
    };

    view.formatMessageHTML = function(id, message) {
        var tableEntry = '<tr id="message_' + id + '" >';

        tableEntry += view.formatMessageItemHTML(message.id);
        tableEntry += view.formatMessageItemHTML(message.statusHTTP);
        tableEntry += view.formatMessageItemHTML(message.timeToComplete);
        tableEntry += view.formatMessageItemHTML(message.requestType);
        tableEntry += view.formatMessageItemHTML(message.url);
        tableEntry += view.formatMessageItemHTML(message.requestStatus);
        tableEntry += view.formatMessageItemHTML(message.completedStatus);

        tableEntry += '</tr>';

        return tableEntry;
    };

    view.formatMessageItemHTML = function(item) {
        return '<td>' + item + '</td>';
    };

    return view;
}

