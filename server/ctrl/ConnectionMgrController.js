exports.ConnectionMgrController = {
    RestartAll: function RestartAll(connection, api, params) {
        var cid = connection.id;
        var connectionList = new I.Models.ConnectionList(cid);
        connectionList.fromArray(params.connectionList);

        var redis = require('redis');
        for (var id in connectionList.list) {
            !function(id) {
                var con = connectionList.get(id);
                con.handler = redis.createClient(con.port, con.host);
                con.handler.on('ready', function(err) {
                    connectionPool.single(connection, 'C0301', 0, { id: id });
                });

                con.monitor = redis.createClient(con.port, con.host);
                con.monitor.monitor(function(err, res) {
                    connectionPool.single(connection, 'C0302', 0, { id: id });
                });

                con.monitor.on('monitor', function(time, args) {
                    connectionPool.single(connection, 'C0303', 0, { time: time, args: args, id: id });
                });
            }(id);
        }

        dataPool.set('connectionList', cid, connectionList);
    },
    CloseAll: function CloseAll(cid) {
        var connectionList = dataPool.get('connectionList', cid);
        if (!connectionList) return;

        for (var id in connectionList.list) {
            var connection = connectionList.get(id);
            if (connection.handler !== null) {
                connection.handler.quit();
                console.log('Disconnect', cid, id, 'handler');
            }
            if (connection.monitor !== null) {
                connection.monitor.quit();
                console.log('Disconnect', cid, id, 'monitor');
            }
        }

        dataPool.unset('connectionList', cid);
    },
};
