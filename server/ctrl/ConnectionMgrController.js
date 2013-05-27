exports.ConnectionMgrController = {
    RestartAll: function RestartAll(connection, api, params) {
        var cid = connection.id;
        this.CloseAll(cid);
        var connectionList = new I.Models.ConnectionList(cid);
        connectionList.fromAbbArray(params.connectionList);

        var redis = require('redis');
        for (var id in connectionList) {
            console.log(id);
            !function(id) {
                var con = connectionList.get(id);
                con.handler = redis.createClient(con.port, con.host);
                con.handler.on('ready', function(err) {
                    connectionPool.single(connection, 'C0301', 0, { id: id });
                });

                con.handler.on('error', function(err) {
                    connectionPool.single(connection, 'C0304', 0, { id: id });
                    con.handler.end();
                    console.log('Error and Disconnect', cid, id, 'handler');
                    con.handler = null;
                });

                con.monitor = redis.createClient(con.port, con.host);
                con.monitor.monitor(function(err, res) {
                    connectionPool.single(connection, 'C0302', 0, { id: id });
                });

                con.monitor.on('error', function(err) {
                    connectionPool.single(connection, 'C0305', 0, { id: id });
                    con.monitor.end();
                    console.log('Error and Disconnect', cid, id, 'monitor');
                    con.monitor = null;
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

        for (var id in connectionList) {
            var connection = connectionList.get(id);
            if (connection.handler !== null) {
                connection.handler.quit();
                console.log('Disconnect', cid, id, 'handler');
                connection.handler = null;
            }
            if (connection.monitor !== null) {
                connection.monitor.quit();
                console.log('Disconnect', cid, id, 'monitor');
                connection.monitor = null;
            }
        }

        dataPool.unset('connectionList', cid);
    },
};
