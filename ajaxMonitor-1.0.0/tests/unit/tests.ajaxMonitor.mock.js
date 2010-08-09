/**
 * Created by IntelliJ IDEA.
 * User: jgutierrez
 * Date: Jul 26, 2010
 * Time: 3:01:02 PM
 * To change this template use File | Settings | File Templates.
 */

module('mock');

should('be able to intercept ajax calls', function() {
    same(service.isActiveCount(), 0, 'no service should be running');
    
    var serverResponse = { status: 'success'};

    var mock = NewAjaxMonitorMock(
    {
        success: true
        ,runTimes: 2
    }, serverResponse);


    same(getAjaxServerRequest(), true, 'mock ajax passed ');
    same(mock.executionCount(), 1);
    same(getAjaxServerRequest(), true, 'mock ajax passed ');
    same(mock.executionCount(), 2);
    same(getAjaxServerRequest(), true, 'real ajax passed ');
    same(mock.executionCount(), 2);
});

should("maintain context with ajax events", function() {
    expect(3);

    stop();

    var serverResponse = { status: 'success'};

    var mock = NewAjaxMonitorMock( 
    {
        success: true
        ,runTimes: 1
    }, serverResponse);

    var context = document.createElement("div");

    function callback(msg) {
        return function() {
            equals(this, context, "context is preserved on callback " + msg);
        };
    }

    $.ajax({
        url: 'data/name.html',
        beforeSend: callback("beforeSend"),
        success: callback("success"),
        error: callback("error"),
        complete: function() {
            callback("complete").call(this);
            start();
        },
        context: context
    });
});
