!function() {
    var MonitorMgrController = {
        onCommanderConnected: function onCommanderConnected(data) {
            I.l6('CommandConnected', data.id);
        },
        onMonitorConnected: function onMonitorConnected(data) {
            monitorMgrView.renderMonitorConnected(data.id);
        },
        onIncomingMonitorMessage: function onIncomingMonitorMessage(data) {
            monitorMgrView.renderIncomingMessage(data);
        },
        onHandlerConnectionError: function onHandlerConnectionError(data) {
            I.l3('handler error', data);
        },
        onMonitorConnectionError: function onMonitorConnectionError(data) {
            monitorMgrView.renderMonitorConnectionError(data.id);
        },
    };

    I.Util.require('MonitorMgrController', 'Ctrl', MonitorMgrController);
}();
