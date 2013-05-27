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
        // monitor mgr
        C0301: {
            ctrl: 'MonitorMgr',
            action: 'CommanderConnected',
        },
        C0302: {
            ctrl: 'MonitorMgr',
            action: 'MonitorConnected',
        },
        C0303: {
            ctrl: 'MonitorMgr',
            action: 'IncomingMonitorMessage',
        },
        C0304: {
            ctrl: 'MonitorMgr',
            action: 'HandlerConnectionError',
        },
        C0305: {
            ctrl: 'MonitorMgr',
            action: 'MonitorConnectionError',
        },
    };

    I.Util.require('routes', '', routes);
}();
