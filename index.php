<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Ajax Monitor</title>


    <link rel="stylesheet" type="text/css" href="ajaxMonitor-1.0.0/styles/dataTables.css" media="all"/>
    <link rel="stylesheet" type="text/css" href="ajaxMonitor-1.0.0/styles/ajaxMonitor.css" media="all"/>

    <script type="text/javascript" src="ajaxMonitor-1.0.0/scripts/jquery-1.4.2.js"></script>
    <script type="text/javascript" src="ajaxMonitor-1.0.0/scripts/jquery.dataTables.js"></script>

    <script type="text/javascript" src="ajaxMonitor-1.0.0/src/jquery.ajaxMonitor-1.0.0.js"></script>
    <script type="text/javascript">
        $(function() {
            var ajaxMonitor = $('#ajax_monitor').ajaxMonitor({
                maximize: true,
                monitorActive: true
            });

            var ajaxMonitorTable = { fnDestroy: function() {
            }};

            var ajaxSettings = {
                type:       'PUT'
                ,mock:      false
                ,url:        'ajaxMonitor-1.0.0/server_side.php'
                ,async:      false
                ,dataType:   'json'
                ,beforeSend: function() {
                    $('#message_container').html('Starting Request');
                }
                ,complete:  function(request, status) {
                    if (status === 'error') {
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
                ,url:        'ajaxMonitor-1.0.0/server_side.php'
                ,async:      false
                ,dataType:   'json'
                ,beforeSend: function() {
                    $('#message_container').html('Starting Request');
                }
                ,complete:  function(request, status) {
                    if (status === 'error') {
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

                ajaxMonitorTable.fnDestroy();
                ajaxMonitorTable = $('#monitor_table').dataTable();

            });
            $('#get_message_mock').click(function() {
                $.ajax(ajaxMockSettings);

                ajaxMonitorTable.fnDestroy();
                ajaxMonitorTable = $('#monitor_table').dataTable();

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
    <div id="ajax_monitor" class="reset_left left_position"></div>
    <div class="reset_left left_position">Ajax Request Properties:
        <pre>
            var ajaxSettings = {
                    type:       'PUT'
                    ,mock:      false
                    ,url:        'ajaxMonitor-1.0.0/server_side.php'
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
        </pre>
    </div>

    <div class="reset_left left_position">Ajax Mock Request Properties:
        <pre>
            var ajaxMockSettings = {
                    type:       'PUT'
                    ,mock:      true
                    ,url:        'ajaxMonitor-1.0.0/server_side.php'
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
        </pre>
    </div>


</body>
</html>
