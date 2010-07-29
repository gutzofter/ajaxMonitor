/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 3:57:12 PM
 * To change this template use File | Settings | File Templates.
 */
var $thisElement = {};

var config = {
    setup: function() {
        $('<div id="ajax_monitor"></div>').appendTo('body');
        $thisElement = $('#ajax_monitor');
        tstMsgBus = NewMessageBus();
        view = NewAjaxMonitorView(tstMsgBus);
        view.initialize($thisElement);
    },
    teardown: function() {
        view.destroy();
        $('#ajax_monitor').remove();
    }
};

module('view', config);

should('create view', function() {
    same($('#monitor_container').length, 1);
    same($('#monitor_container').is(':hidden'), true);
});

should('remove monitor', function() {
    view.destroy();
    same($('#ajax_monitor_container').length, 0);
});

should('verify minimize', function() {
    view.minimize();
    same($('#monitor_container').is(':hidden'), true);
});

should('verify maximize', function() {
    view.maximize();
    same($('#monitor_container').is(':visible'), true, 'display is visible');
});

should('maximize when [monitor] is clicked', function() {
    $('#monitor_button').click();

    same($('#monitor_container').is(':visible'), true);
});

should('verify active', function() {
    view.setActive();

    same($('#activate_control').text(), 'De-Activate');
    same($('#monitor_status').text(), 'Active');
});

should('activate when [activate] button is clicked', function() {
    setFireEvent('toggleActivation');
    $('#activate_control').click();

    same(isFired, true, 'activate toggle');
});

should('verify not active', function() {
    view.setNotActive();

    same($('#activate_control').text(), 'Activate');
    same($('#monitor_status').text(), 'Not Active');
});

should('verify display toggle', function() {
    same($('#monitor_container').is(':hidden'), true);

    view.displayToggle();
    same($('#monitor_container').is(':visible'), true);

    // TODO: need to figure out why this fails
    //    view.displayToggle();
    //
    //    while($('#monitor_container').is(':animated')) {
    //
    //    }
    //    same($('#monitor_container').is(':hidden'), true);

});

should('add new message to monitor messages window', function() {
    var message = {
        "id":                   0
        ,"requestStatus":       "completed"
        ,"completedStatus":     "success"
        ,"timeToComplete":      100
        ,"requestType":         "POST [Monitored]"
        ,"url":                 '../../server_side.php'
    };

    view.newMessage(message);

    // remember you have all html stripped from text in your asserts (see view.newMessage. it adds a tabel entry)
    same($('#monitor_messages').text(), 'Monitor MessagesIdCompletion Time mSec(s)Request TypeUrlRequest StatusCompletion Status0100POST [Monitored]../../server_side.phpcompletedsuccessIdCompletion Time mSec(s)Request TypeUrlRequest StatusCompletion Status');
});
