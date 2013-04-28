var WS_URL = 'ws://' + window.location.host + '/';
var WS_PROTOCOL = 'prm';

/* websocket */
var iWebSocket;

$(function() {
    /* view */
    window.indexView = new IndexView();
    indexView.render();

    window.connectionMgrView = new ConnectionMgrView();
    connectionMgrView.render();
    
    /* data */
    window.dataPool = new I.DataPool();

    /*
    NetController.Connect(function() {
        MgrController.Init();
    });
    */
});
