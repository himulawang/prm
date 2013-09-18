require('i').init();
var WebSocketServer = require('websocket').server;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(STA_ABS_PATH));

var routes = require('./config/routes.js').routes;

var ws = new WebSocketServer({
    httpServer: server,
});

global.Tail = require('tail').Tail;
global.connectionPool = new I.ConnectionPool();
var Route = new I.Route(routes);
global.dataPool = new I.DataPool();

var clientPK = new I.Models.ClientPK();

ws.on('request', function(req) {
    var connection = req.accept('prm', req.origin);
    connection.id = clientPK.incr();
    connectionPool.push(connection);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);

    connection.on('close', function(reasonCode, description) {
        console.log(reasonCode, description);
        // remove connection
        var id = connectionPool.remove(connection);
        // close redis connection
        I.Ctrl.ConnectionMgrController.CloseAll(connection, connection.id);
    });

    connection.on('message', function(message) {
        var start = process.hrtime();

        if (message.type === 'binary') return;
        var req = JSON.parse(message.utf8Data);

        try {
            Route.process(connection, req);
        } catch (e) {
            console.log('Error', e);
        }
    });
});

var env = require('./config/env.js').env;
server.listen(env.WEB.PORT);

process.on('uncaughtException', function(err) {
    console.log('uncaughtException', err);
});
