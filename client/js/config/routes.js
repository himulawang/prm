!function() {
    var routes = {
        // net
        C0001: {
            ctrl: 'Net',
            action: 'Connect',
        },
        // management
        C0101: {
            ctrl: 'Mgr',
            action: 'Init',
        },
        // connection mgr
        C0201: {
            ctrl: 'ConnectionMgr',
            action: 'RestartAll',
        },
        // manager
        C0301: {
            ctrl: 'Manager',
            action: 'MonitorConnected',
        },
        C0302: {
            ctrl: 'Manager',
            action: 'MonitorConnectionError',
        },
        C0303: {
            ctrl: 'Manager',
            action: 'MonitorDisconnected',
        },
        C0304: {
            ctrl: 'Manager',
            action: 'MonitorMessage',
        },
        C0305: {
            ctrl: 'Manager',
            action: 'CommanderConnected',
        },
        C0306: {
            ctrl: 'Manager',
            action: 'CommanderConnectionError',
        },
        C0307: {
            ctrl: 'Manager',
            action: 'CommanderDisconnected',
        },
        C0308: {
            ctrl: 'Manager',
            action: 'CommanderMessage',
        },
        C0309: {
            ctrl: 'Manager',
            action: 'Disconnect',
        },
        C0310: {
            ctrl: 'Manager',
            action: 'Connect',
        },
        C0311: {
            ctrl: 'Manager',
            action: 'CommanderMessageAll',
        },
    };

    I.Util.require('routes', '', routes);
}();
