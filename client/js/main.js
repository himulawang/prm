var MAX_MONITOR_LOG = 500;
var MONITOR_COLUMN = 5;
var MONITOR_FILTER_INFO = true;

$(function() {
    I.Loader.init(function() {
        $('#Status').html('<span class="label label-success">Online </span>');
        //I.Ctrl.NetController.GetOnlineUserCount();
    }, function() {
        I.Ctrl.ConnectionMgrController.LoadFromIDB();
    });

    I.ws.onclose = function() {
        $('#Status').html('<span class="label label-important">Offline </span>');
        $('#OnlineUser').html('<span class="badge badge-default"> ? </span>');
    };

    window.dataPool = new I.DataPool();

    /*
    var connectionPK = new I.Models.ConnectionPK();
    connectionPK.set(19);
    dataPool.set('connection', 'PK', connectionPK);

    var connectionList = new I.Models.ConnectionList(0);

    for (var i = 1; i <= 19; ++i) {
        var port = i + 6378;
        var connection = new I.Models.Connection(
            [
                i,
                '10.88.228.232:' + port,
                '10.88.228.232',
                port,
                '',
                true,
                null, // handler for server
                null, // monitor for server
            ]
        );
        connectionList.addSync(connection);
    }

    dataPool.set('connectionList', 0, connectionList);
    */

    /* view */
    window.indexView = new I.View.IndexView();
    indexView.render();
    window.connectionMgrView = new I.View.ConnectionMgrView();
    window.monitorMgrView = new I.View.MonitorMgrView();

    window.onresize = Resizer.resizeMonitor;
});
