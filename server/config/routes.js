exports.routes = {
    // net
    C0001: {                          
        ctrl: 'Net',                  
        action: 'Connect',            
        param: {},
    },                                
    // management
    C0101: {
        ctrl: 'Mgr',                  
        action: 'Init', 
        param: {
            serverId: 'ni',
        },
    },
    // connection mgr
    C0201: {
        ctrl: 'ConnectionMgr',
        action: 'RestartAll',
        param: {
            connectionList: 'nh',
        },
    },
};
