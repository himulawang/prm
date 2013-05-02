var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'prm';
var MAX_MONITOR_LOG = 500;
var MONITOR_COLUMN = 5;
var MONITOR_FILTER_INFO = true;

/* websocket */
var iWebSocket;

$(function() {
    /* data */
    window.dataPool = new I.DataPool();

    var connectionPK = new I.Models.ConnectionPK(19);
    dataPool.set('connection', 'PK', connectionPK);

    var connectionList = new I.Models.ConnectionList(0);
    dataPool.set('connectionList', 0, connectionList);

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
        connectionList.set(connection);
    }

    /* view */
    window.indexView = new IndexView();
    indexView.render();

    window.connectionMgrView = new ConnectionMgrView();
    connectionMgrView.render();
    window.monitorMgrView = new MonitorMgrView();
    monitorMgrView.render();
    
    NetController.Connect(function() {
        MgrController.Init();
    });

    window.onresize = Resizer.resizeMonitor;
});
