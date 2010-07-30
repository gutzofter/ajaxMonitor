<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Ajax Monitor</title>


    <link rel="stylesheet" type="text/css" href="styles/dataTables.css" media="all"/>
    <link rel="stylesheet" type="text/css" href="styles/ajaxMonitor.css" media="all"/>

    <script type="text/javascript" src="scripts/jquery-1.4.2.js"></script>
    <script type="text/javascript" src="scripts/ajaxMonitor.msg.bus.js"></script>
    <script type="text/javascript" src="scripts/ajaxMonitor.view.js"></script>
    <script type="text/javascript" src="scripts/ajaxMonitor.model.js"></script>
    <script type="text/javascript" src="scripts/ajaxMonitor.controller.js"></script>
    <script type="text/javascript" src="scripts/ajaxMonitor.coordinator.js"></script>
    <script type="text/javascript" src="scripts/ajaxMonitor.service.js"></script>
    <script type="text/javascript" src="scripts/ajaxMonitor.mock.js"></script>

    <script type="text/javascript" src="scripts/jquery.ajaxMonitor.js"></script>

    <script type="text/javascript">
        $(function() {
            var $ajaxMonitor = $('#ajax_monitor').ajaxMonitor({maximize: true, monitorActive: true});

            var ajaxSettings = {
                    type:       'PUT'
                    ,mock:      false
                    ,url:        'server_side.php'
                    ,async:      false
                    ,dataType:   'json'
                    ,beforeSend: function() {
                        $('#message_container').html('Starting Request');
                    }
                    ,complete:  function(request, status) {
                        if(status === 'error') {
                            $('#message_container').html('The HTTP code is: ' + request.status);
                        }
                    }
                    ,success:    function(response) {
                        if (response.status === 'success') {
                            $('#message_container').html(response.message);
                        }
                    }
                };

            var ajaxMockSettings = {
                    type:       'PUT'
                    ,mock:      true
                    ,url:        'server_side.php'
                    ,async:      false
                    ,dataType:   'json'
                    ,beforeSend: function() {
                        $('#message_container').html('Starting Request');
                    }
                    ,complete:  function(request, status) {
                        if(status === 'error') {
                            $('#message_container').html('The HTTP code is: ' + request.status);
                        }
                    }
                    ,success:    function(response) {
                        if (response.status === 'success') {
                            $('#message_container').html(response.message);
                        }
                    }
                };

            $('#get_message_ajax').click(function() {
                $.ajax(ajaxSettings);
            });
            $('#get_message_mock').click(function() {
                $.ajax(ajaxMockSettings);
            });

        });

    </script>

</head>
<body>
    <div id="pretty">
        <h1><span id="get_message_ajax" class="ajax_monitor_control">Ajax Monitor Testing</span></h1>
        <h1><span id="get_message_mock" class="ajax_monitor_control">Ajax Monitor Mock Testing</span></h1>

        <div class="ajax_monitor_container">
            <div class="ajax_monitor_section">
                <div id="message_container">No Message Rx</div>
            </div>
        </div>

        <h1></h1>
    </div>
    <div id="ajax_monitor"></div>



</body>
</html>
