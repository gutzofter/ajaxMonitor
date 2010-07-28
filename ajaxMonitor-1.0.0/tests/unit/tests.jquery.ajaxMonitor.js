/**
* Created by IntelliJ IDEA.
* User: jgutierrez
* Date: Jul 23, 2010
* Time: 12:34:51 PM
* To change this template use File | Settings | File Templates.
*/

var config = {
    setup: function() {
        $('<div id="ajax_monitor"></div>').appendTo('body');
    },
    teardown: function() {
        $('#ajax_monitor').remove();
    }
};

module('ajax monitor plug-in', config);

should('should log to console name and version information', function() {
    var message = '';
    if (window.console && window.console.log) {
        var logger = window.console.log;
        window.console.log = function(msg) {
            message = msg;
        };

        $('#ajax_monitor').ajaxMonitor();

        window.console.log = logger;

        same(message, 'ajaxMonitor Version: 1.0.0 is initialized');
    }
});

should('remove monitor via built-in function to ajaxMonitor', function() {
    var monitor = $('#ajax_monitor').ajaxMonitor();
    $(monitor).ajaxMonitor.destroy();

    same($('#monitor_container').length, 0);
});

module('ajax monitor - view', config);

should('verify initial settings show monitor minimized', function() {
    $('#ajax_monitor').ajaxMonitor();
    same($('#monitor_container').is(':hidden'), true, 'monitor minimized');
});

should('verify maximize settings show display maximized', function() {
    $('#ajax_monitor').ajaxMonitor({ maximize: true});
    same($('#monitor_container').is(':visible'), true, 'monitor maximized');
});

should('verify maximize settings when [monitor] is clicked', function() {
    $('#ajax_monitor').ajaxMonitor();
    $('#monitor_button').click();
    same($('#monitor_container').is(':visible'), true, 'monitor maximized');
});

should('verify that monitor is not active', function() {
    $('#ajax_monitor').ajaxMonitor();

    same($('#activate_control').text(), 'Activate');
    same($('#monitor_status').text(), 'Not Active');
});

should('verify that monitor is active', function() {
    $('#ajax_monitor').ajaxMonitor({ monitorActive: true });

    same($('#activate_control').text(), 'De-Activate');
    same($('#monitor_status').text(), 'Active');
});

should('verify that monitor is inactive after activating', function() {
    $('#ajax_monitor').ajaxMonitor();
    same($('#monitor_status').text(), 'Not Active');

    $('#activate_control').click();
    same($('#monitor_status').text(), 'Active');
    $('#activate_control').click();
    same($('#monitor_status').text(), 'Not Active');
});

should('remove monitor with [remove] click', function() {
    $('#ajax_monitor').ajaxMonitor();
    $('#remove_control').click();

    same($('#monitor_container').length, 0);
});

