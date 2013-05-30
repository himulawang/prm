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
        this.renderTreeBody = function renderTreeBody() {
            var connectionList = dataPool.get('connectionList', 0);
            for (var id in connectionList) {
                var connection = connectionList.get(id);
                this.renderTreeConnection(connection);
            }
        };
        this.renderTreeConnection = function renderTreeConnection(connection) {
            var html = Renderer.make('ConnectionMgr-Tree-Connection', { connection: connection });
            $('#ConnectionMgr-Tree-Body').append(html);
        };
        this.renderModifyConnection = function renderModifyConnection(id) {
            var connection = dataPool.get('connectionList', 0).get(id);
            var html = Renderer.make('ConnectionMgr-Modify', { connection: connection });
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
    };

    I.Util.require('ConnectionMgrView', 'View', ConnectionMgrView);
}();
