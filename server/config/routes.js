exports.routes = {
    // net
    C0001: {                          
        ctrl: 'Net',                  
        action: 'Connect',            
        param: {},
    },                                
    // connection mgr
    C0201: {
        ctrl: 'ConnectionMgr',
        action: 'RestartAll',
        param: {
            connectionList: 'nh',
        },
    },
    // manager
    C0308: {
        ctrl: 'Manager',
        action: 'CommanderMessage',
        param: {
            id: 'ni',
            cmd: 'ns',
        },
    },
    C0309: {
        ctrl: 'Manager',
        action: 'Disconnect',
        param: {
            id: 'ni',
        },
    },
    C0310: {
        ctrl: 'Manager',
        action: 'Connect',
        param: {
            id: 'ni',
        },
    },
    C0311: {
        ctrl: 'Manager',
        action: 'CommanderMessageAll',
        param: {
            cmd: 'ns',
        },
    },
};
