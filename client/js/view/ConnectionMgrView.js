!function() {
    var ConnectionMgrView = function ConnectionMgrView() {
        this.render = function render() {
            var html = Renderer.make('ConnectionMgr');
            $('#ConnectionMgr').html(html);

            this.renderTreeBody();
        };
        this.renderCreateConnection = function renderCreateConnection() {
            var id = dataPool.get('connection', 'PK').get() + 1;

            var html = Renderer.make('ConnectionMgr-Create', { id: id });
            $('#ConnectionMgr-Content').html(html);
        };
        this.renderCreateBatchConnection = function renderCreateBatchConnection() {
            var html = Renderer.make('ConnectionMgr-CreateBatch');
            $('#ConnectionMgr-Content').html(html);
        };
        this.renderCreateLog = function renderCreateLog() {
            var id = dataPool.get('log', 'PK').get() + 1;

            var html = Renderer.make('ConnectionMgr-CreateLog', { id: id });
            $('#ConnectionMgr-Content').html(html);
        };
        this.renderTreeBody = function renderTreeBody() {
            var connectionList = dataPool.get('connectionList', 0);
            for (var id in connectionList) {
                var connection = connectionList.get(id);
                this.renderTreeConnection(connection);
            }

            var logList = dataPool.get('logList', 0);
            for (var id in logList) {
                var log = logList.get(id);
                this.renderTreeLog(log);
            }
        };
        this.renderTreeConnection = function renderTreeConnection(connection) {
            var html = Renderer.make('ConnectionMgr-Tree-Connection', { connection: connection });
            $('#ConnectionMgr-Tree-Body').append(html);
        };
        this.renderTreeLog = function renderTreeLog(log) {
            var html = Renderer.make('ConnectionMgr-Tree-Log', { log: log });
            $('#ConnectionMgr-Tree-Body').append(html);
        };
        this.renderModifyConnection = function renderModifyConnection(id) {
            var connection = dataPool.get('connectionList', 0).get(id);
            var html = Renderer.make('ConnectionMgr-Modify', { connection: connection });
            $('#ConnectionMgr-Content').html(html);
        };
        this.renderModifyLog = function renderModifyLog(id) {
            var log = dataPool.get('logList', 0).get(id);
            var html = Renderer.make('ConnectionMgr-ModifyLog', { log: log });
            $('#ConnectionMgr-Content').html(html);
        };
        this.renderRemoveConnection = function renderRemoveConnection(id) {
            $('#ConnectionMgr-Tree-Connection-Id-' + id).remove();
        };
        this.clearContent = function clearContent() {
            $('#ConnectionMgr-Content').empty();
        };
        // event
        this.onCreateConnection = function onCreateConnection() {
            var connection = new I.Models.Connection(
                [
                    $('#ConnectionMgr-Id').val(),
                    $('#ConnectionMgr-Name').val(),
                    $('#ConnectionMgr-Host').val(),
                    $('#ConnectionMgr-Port').val(),
                    $('#ConnectionMgr-Password').val(),
                    $('#ConnectionMgr-KeepAlive')[0].checked,
                    null, // handler for server
                    null, // monitor for server
                ]
            );

            // pk
            dataPool.get('connection', 'PK').incr();
            dataPool.get('connectionList', 0).addSync(connection);

            this.clearContent();
        };
        this.onModifyConnection = function onModifyConnection() {
            var id = $('#ConnectionMgr-Id').val();
            var connectionList = dataPool.get('connectionList', 0);
            var connection = connectionList.get(id);

            connection.name = $('#ConnectionMgr-Name').val();
            connection.host = $('#ConnectionMgr-Host').val();
            connection.port = $('#ConnectionMgr-Port').val();
            connection.password = $('#ConnectionMgr-Password').val();
            connection.keepAlive = $('#ConnectionMgr-KeepAlive')[0].checked;

            connectionList.update(connection);

            this.clearContent();

            $('#ConnectionMgr-Tree-Connection-Name-' + connection.id).text(connection.name);
        };
        this.onModifyLog = function onModifyLog() {
            var id = $('#ConnectionMgr-Id').val();
            var logList = dataPool.get('logList', 0);
            var log = logList.get(id);

            log.name = $('#ConnectionMgr-Name').val();
            log.path = $('#ConnectionMgr-Path').val();

            logList.update(log);

            this.clearContent();

            $('#ConnectionMgr-Tree-Log-Name-' + log.id).text(log.name);
        };
        this.onCreateBatchConnection = function onCreateBatchConnection() {
            var name = $('#ConnectionMgr-Name').val();
            var fromHost = $('#ConnectionMgr-FromHost').val();
            var toHost = $('#ConnectionMgr-ToHost').val();
            var fromPort = $('#ConnectionMgr-FromPort').val();
            var toPort = $('#ConnectionMgr-ToPort').val();
            var password = $('#ConnectionMgr-Password').val();
            var keepAlive = $('#ConnectionMgr-KeepAlive')[0].checked;

            var util = I.Util;
            if (!(util.isIP(fromHost) && util.isIP(toHost))) throw new I.Exception(30001);

            var fromHostArr = fromHost.split('.');
            var toHostArr = toHost.split('.');

            if (fromHost === toHost) {
                this.createBatchConnectionByPort(name, fromHost, fromPort, toPort, password, keepAlive);
                this.renderTreeBody();
                this.clearContent();
                return;
            }

            if (
                fromHostArr[0] === toHostArr[0] &&
                fromHostArr[1] === toHostArr[1] &&
                fromHostArr[2] === toHostArr[2]
            ) {
                if (toHostArr[3] < fromHostArr[3]) {
                    var tmp = toHostArr[3];
                    toHostArr[3] = fromHostArr[3];
                    fromHostArr[3] = tmp;
                }

                var delta = toHostArr[3] - fromHostArr[3];
                for (var i = 0; i <= delta; ++i) {
                    var host = fromHostArr[0] + '.' + fromHostArr[1] + '.' + fromHostArr[2] + '.' + (parseInt(fromHostArr[3]) + i);
                    this.createBatchConnectionByPort(name, host, fromPort, toPort, password, keepAlive);
                }
                this.renderTreeBody();
                this.clearContent();
            }
        };
        this.createBatchConnectionByPort = function createBatchConnectionByPort(name, host, fromPort, toPort, password, keepAlive) {
            var pk = dataPool.get('connection', 'PK');
            var ports = [fromPort, toPort];
            fromPort = I.Util.min(ports);
            toPort = I.Util.max(ports);

            var delta = toPort - fromPort;
            for (var i = 0; i <= delta; ++i) {
                var port = fromPort + i;
                var connection = new I.Models.Connection(
                    [
                        pk.incr(),
                        name + '_' + host + ':' + port,
                        host,
                        port,
                        password,
                        keepAlive,
                        null, // handler for server
                    ]
                );
                dataPool.get('connectionList', 0).addSync(connection);
            }
        };
        this.onCreateLog = function onCreateLog() {
            var log = new I.Models.Log(
                [
                    $('#ConnectionMgr-Id').val(),
                    $('#ConnectionMgr-Name').val(),
                    $('#ConnectionMgr-Path').val(),
                ]
            );

            // pk
            dataPool.get('log', 'PK').incr();
            dataPool.get('logList', 0).addSync(log);

            this.clearContent();
        };
        this.onRestartAll = function onRestartAll() {
            I.Ctrl.ConnectionMgrController.RestartAll();
            managerView.render();
        };
        this.onRemoveAll = function onRemoveAll() {
            var connectionList = dataPool.get('connectionList', 0);
            connectionList.dropSync();
            this.renderTreeBody();
            $('#ConnectionMgr-Tree-Body').empty();
        };
        this.onRemove = function onRemove(id) {
            dataPool.get('connectionList', 0).delSync(id);
            this.renderRemoveConnection(id);
        };
        this.onConnect = function onConnect(id) {
            I.Ctrl.ManagerController.Connect(id);
            var connection = dataPool.get('connectionList', 0).get(id);
            managerView.renderRemoveManager(id);
            managerView.renderManager(connection);
            Resizer.resizeManager();
        };
        this.onConnectLog = function onConnectLog(id) {
            I.Ctrl.ManagerController.ConnectLog(id);
            var log = dataPool.get('logList', 0).get(id);
            managerView.renderRemoveLogManager(id);
            managerView.renderLogManager(log);
            Resizer.resizeManager();
        };
    };

    I.Util.require('ConnectionMgrView', 'View', ConnectionMgrView);
}();
