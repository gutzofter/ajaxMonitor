<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Ajax Monitor</title>


    <link rel="stylesheet" type="text/css" href="styles/dataTables.css" media="all"/>
    <link rel="stylesheet" type="text/css" href="styles/ajaxMonitor.css" media="all"/>

    <script type="text/javascript" src="scripts/jquery-1.4.2.js"></script>
<!--    <script type="text/javascript" src="scripts/jquery.dataTables.js"></script>-->
    <script type="text/javascript" src="src/jquery.ajaxMonitor-1.0.0.js"></script>

    <script type="text/javascript">
        $(function() {
//            var tableSettings = {
//                aoColumns: [
//                    { sWidth: "20%" }
//                    ,
//                    { sWidth: "80%" }
//                ]
//            };

            var $ajaxMonitor = $('#ajax_monitor').ajaxMonitor({maximize: true, monitorActive: true});
//            var monitorTable = $('#monitor_table').dataTable(tableSettings);

            $('#get_message').click(function() {
                $.ajax({
                    type:       'GET'
                    ,url:        'server_side.php'
                    ,async:      false
                    ,dataType:   'json'
                    ,beforeSend: function() {
                        $('#message_container').html('Starting Request');
                    }
                    ,success:    function(response) {
                        if (response.status === 'success') {
                            $('#message_container').html(response.message);
                        }
                    }
                });
//                monitorTable.fnDestroy();
//                monitorTable = $('#monitor_table').dataTable(tableSettings);
            });
        });

    </script>

</head>
<body>
    <div id="pretty">
        <h1><span id="get_message" class="ajax_monitor_control">Ajax Testing</span></h1>

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
