!function() {
    var ManagerController = {
        onMonitorConnected: function onMonitorConnected(data) {
            managerView.renderMonitorConnected(data.id);
        },
        onMonitorConnectionError: function onMonitorConnectionError(data) {
            managerView.renderMonitorConnectionError(data.id);
        },
        onMonitorDisconnected: function onMonitorDisconnected(data) {
            managerView.renderMonitorDisconnected(data.id);
        },
        onMonitorMessage: function onMonitorMessage(data) {
            managerView.renderMonitorLog(data);
        },
        onCommanderConnected: function onCommanderConnected(data) {
            managerView.renderCommanderConnected(data.id);
        },
        onCommanderConnectionError: function onCommanderConnectionError(data) {
            managerView.renderCommanderConnectionError(data.id);
        },
        onCommanderDisconnected: function onCommanderDisconnected(data) {
            managerView.renderCommanderDisconnected(data.id);
        },
        CommanderMessage: function CommanderMessage(data) {
            I.ws.send('C0308', data);
        },
        onCommanderMessage: function onCommanderMessage(data) {
            managerView.renderCommanderLog(data);
        },
        Disconnect: function Disconnect(id) {
            I.ws.send('C0309', { id: id });
        },
        onDisconnect: function onDisconnect(data) {
            managerView.renderMonitorDisconnected(data.id);
            managerView.renderCommanderDisconnected(data.id);
        },
        Connect: function Connect(id) {
            var connection = dataPool.get('connectionList', 0).get(id);
            I.ws.send('C0310', { id: id, connection: connection.toAbbArray() });
        },
        onConnect: function onConnect(data) {
        },
        CommanderMessageAll: function CommanderMessageAll(data) {
            I.ws.send('C0311', data);
        },
    };

    I.Util.require('ManagerController', 'Ctrl', ManagerController);
}();
