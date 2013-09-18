!function() {
    var ConnectionMgrController = {
        RestartAll: function RestartAll() {
            var connectionList = dataPool.get('connectionList', 0);
            I.ws.send('C0201', { connectionList: connectionList.toAbbArray(), });
        },
        LoadFromIDB: function LoadFromIDB() {
            I.Models.ConnectionListStore
                .get(0)
                .then(function(list) {
                    dataPool.set('connectionList', 0, list);
                    I.Models.LogListStore
                        .get(0)
                        .then(function(list) {
                            dataPool.set('logList', 0, list);
                            connectionMgrView.render();
                        });
                });
            I.Models.ConnectionPKStore
                .get()
                .then(function(pk) {
                    dataPool.set('connection', 'PK', pk);
                });
            I.Models.LogPKStore
                .get()
                .then(function(pk) {
                    dataPool.set('log', 'PK', pk);
                });
        },
    };

    I.Util.require('ConnectionMgrController', 'Ctrl', ConnectionMgrController);
}();
