var redis = require('redis');
exports.ManagerController = {
    CommanderMessage: function CommanderMessage(connection, api, params) {
        var cid = connection.id;
        var connectionList = dataPool.get('connectionList', cid);
        var id = params.id;
        var con = connectionList.get(id);
        if (!con || !con.handler) return;

        this._CommanderMessage(connection, params.cmd, con);

    },
    _CommanderMessage: function _CommanderMessage(connection, rawCMD, con) {
        var i = rawCMD.indexOf(' ');

        if (i === -1) {
            var cmd = rawCMD;
            var args = [];
        } else {
            var cmd = rawCMD.substring(i, 0);
            var rest = rawCMD.substr(i + 1);
            var args = rest.split(' ');
        }

        con.handler.send_command(cmd, args, function(err, result) {
            var data = { id: con.id };
            if (err) {
                data.err = err.message;
            } else {
                data.result = result;
            }

            connectionPool.single(connection, 'C0308', 0, data);
        });
    },
    Disconnect: function Disconnect(connection, api, params) {
        var cid = connection.id;
        var connectionList = dataPool.get('connectionList', cid);
        var id = params.id;
        var con = connectionList.get(id);
        if (!con) return;

        this._Disconnect(connection, connectionList, con);
        connectionPool.single(connection, 'C0309', 0, { id: id });
    },
    _Disconnect: function _Disconnect(connection, connectionList, con) {
        var id = con.id;
        var cid = connection.id;
        if (con.monitor !== null) {
            con.monitor.end();
            console.log('Disconnect', cid, id, 'monitor');
            con.monitor = null;
        }
        if (con.handler !== null) {
            con.handler.end();
            console.log('Disconnect', cid, id, 'handler');
            con.handler = null;
        }
        connectionList.unset(con);
    },
    Connect: function Connect(connection, api, params) {
        var cid = connection.id;
        var connectionList = dataPool.get('connectionList', cid);
        if (!connectionList) {
            var connectionList = new I.Models.ConnectionList(cid);
            dataPool.set('connectionList', cid, connectionList);
        }

        var id = params.id;
        var con = connectionList.get(id);
        
        if (con) {
            this._Disconnect(connection, connectionList, con);
        }

        con = new I.Models.Connection();
        con.fromAbbArray(params.connection);

        this._Connect(connection, con);
        connectionList.set(con);
    },
    _Connect: function _Connect(connection, con) {
        var id = con.id;
        var cid = connection.id;
        // monitor
        if (!con.monitor) {
            con.monitor = redis.createClient(con.port, con.host);
            con.monitor.monitor(function(err, res) {
                connectionPool.single(connection, 'C0301', 0, { id: id });
            });

            con.monitor.on('error', function(err) {
                connectionPool.single(connection, 'C0302', 0, { id: id });
                con.monitor.end();
                console.log('Error and Disconnect', cid, id, 'monitor');
                con.monitor = null;
            });

            con.monitor.on('monitor', function(time, args) {
                connectionPool.single(connection, 'C0304', 0, { time: time, args: args, id: id });
            });
        }

        // commander
        if (!con.handler) {
            con.handler = redis.createClient(con.port, con.host);
            con.handler.on('ready', function(err) {
                connectionPool.single(connection, 'C0305', 0, { id: id });
            });

            con.handler.on('error', function(err) {
                connectionPool.single(connection, 'C0306', 0, { id: id });
                con.handler.end();
                console.log('Error and Disconnect', cid, id, 'handler');
                con.handler = null;
            });
        }
    },
    CommanderMessageAll: function CommanderMessageAll(connection, api, params) {
        var cid = connection.id;
        var connectionList = dataPool.get('connectionList', cid);

        for (var id in connectionList) {
            var con = connectionList.get(id);
            if (!con || !con.handler) continue;

            this._CommanderMessage(connection, params.cmd, con);
        }
    },
    ConnectLog: function ConnectLog(connection, api, params) {
        var cid = connection.id;
        var logList = dataPool.get('logList', cid);
        if (!logList) {
            var logList = new I.Models.LogList(cid);
            dataPool.set('logList', cid, logList);
        }

        var id = params.id;
        var log = logList.get(id);
        
        if (log) {
            this._DisconnectLog(connection, logList, log);
        }

        log = new I.Models.Log();
        log.fromAbbArray(params.log);

        this._ConnectLog(connection, log);
        logList.set(log);

        connectionPool.single(connection, 'C0313', 0, { id: id });
    },
    _DisconnectLog: function _DisconnectLog(connection, logList, log) {
        var id = log.id;
        var cid = connection.id;
        if (log.handler !== null) {
            log.handler.unwatch();
            console.log('Disconnect Log', cid, id, 'handler');
            log.handler = null;
        }
        logList.unset(log);
    },
    _ConnectLog: function _ConnectLog(connection, log) {
        var id = log.id;
        var cid = connection.id;

        if (!log.handler) {
            log.handler = new Tail(log.path);
            console.log('Connect Log', cid, id, 'handler');
            log.handler.on('line', function(data) {
                connectionPool.single(connection, 'C0315', 0, { id: id, data: data });
            });
        }
    },
};
