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
    this.renderTreeBody = function renderTreeBody() {
        var connectionList = dataPool.get('connectionList', 0);
        for (var id in connectionList.list) {
            var connection = connectionList.get(id);
            this.renderTreeConnection(connection);
        }
    };
    this.renderTreeConnection = function renderTreeConnection(connection) {
        var html = Renderer.make('ConnectionMgr-Tree-Connection', { connection: connection });
        $('#ConnectionMgr-Tree-Body').append(html);
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
            ]
        );

        // pk
        dataPool.get('connection', 'PK').incr();
        dataPool.get('connectionList', 0).addSync(connection);
    };
    this.onRestartAll = function onRestartAll() {
        ConnectionMgrController.RestartAll();
    };
};
