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

global.connectionPool = new I.ConnectionPool();
var Route = new I.Route(routes);
global.dataPool = new I.DataPool();

ws.on('request', function(req) {
    var connection = req.accept('prm', req.origin);
    var id = connectionPool.push(connection);
    connection.id = id;

    // server connection
    var serverList = new I.Models.ServerList(id);
    var server = new I.Models.Server();
    server.id = 1;
    server.address = '127.0.0.1';
    server.port = '6379';
    server.password = null;
    server.redis = require('redis').createClient(server.port, server.address);

    serverList.addSync(server);
    dataPool.set('ServerList', id, serverList);

    console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);

    connection.on('close', function(reasonCode, description) {
        console.log(reasonCode, description);
        var id = connectionPool.remove(connection);
        dataPool.unset('ServerList', id);
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

server.listen(8081);
