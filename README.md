#ajaxMonitor#

##jQuery Plugin-in for monitoring ajax requests##

###Default settings###
        var defaultSettings = {
            monitorActive: false
            ,maximize: false
            // TODO: Not Implemented at this time
            ,refreshRate: 'realtime' // 'realtime', 'fast', 'medium', 'slow', value in mSecs
            // TODO: Not Implemented at this time
            ,useExternalServices: false // future jsonlint testing of request data and repsonse data and test json reuqest to my server
        };

*maximize: [true/false]*

True value allows the view to be maximized at initialization of plug-in

*monitorActive: [true/false]*

True value allows the monitor to be activated at initialization of plug-in

###Usage###

Default:

        var = $('selector').ajaxMonitor();

Over-riding default:

        var $ajaxMonitor = $('#ajax_monitor').ajaxMonitor({
            maximize: true,
            monitorActive: true
        });
