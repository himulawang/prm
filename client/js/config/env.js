!function() {
    var env = {
        APP: {
            NAME: 'prm',
            // 3: 'ERR', 4: 'WARNING', 5: 'NOTICE', 6: 'INFO', 7: 'DEBUG',
            LOG_LEVEL: 7,
        },
        JADE: {
            URI: '../../tpl/',
        },
        IDB: {
            ENABLED: true,
            NAME: 'prm',
            VERSION: 3,
            SYNC_INTERVAL: 10000,
        },
        WS: {
            ENABLED: true,
            URL: 'ws://' + window.location.host + '/',
            PROTOCOL: 'prm',
            AUTO_RECONNECT_INTERVAL: 800, // 0 is off
        },
        MGR: {
            COLUMN: 5,

            MONITOR_MAX_LOG: 500,
            MONITOR_FILTER_INFO: true,

            COMMANDER_MAX_LOG: 1000,
        },
    };

    I.Util.require('env', '', env);
}();
