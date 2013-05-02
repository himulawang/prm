var MonitorMgrController = {
    onCommanderConnected: function onCommanderConnected(data) {
        console.log('commandConnected', data.id);
    },
    onMonitorConnected: function onMonitorConnected(data) {
        //monitorMgrView.renderMonitorConnected(data.id);
    },
    onIncomingMonitorMessage: function onIncomingMonitorMessage(data) {
        monitorMgrView.renderIncomingMessage(data);
    },
};

