var MonitorMgrView = function MonitorMgrView() {
    this.render = function render() {
        this.renderMonitors();
    };
    this.renderMonitors = function renderMonitors() {
        var connectionList = dataPool.get('connectionList', 0);

        var i = 1;
        for (var id in connectionList.list) {
            if (i % MONITOR_COLUMN === 1) {
                var html = Renderer.make('MonitorMgr');
                $('#MonitorMgr').append(html);
            }

            var connection = connectionList.get(id);
            this.renderMonitorConnected(connection);

            ++i;
        }
        Resizer.resizeMonitor();
    };
    this.renderMonitorConnected = function renderMonitorConnected(connection) {
        var data = {
            connection: connection,
        };
        var html = Renderer.make('Monitor', data);
        $('#MonitorMgr').children().last().append(html);
    };
    this.renderIncomingMessage = function renderIncomingMessage(data) {
        if (MONITOR_FILTER_INFO && data.args[0] === 'info') return;
        // remove if reach max log
        var $el = $('#Monitor-Log-' + data.id);
        var children = $el.children();
        if (children.length > MAX_MONITOR_LOG) {
            children.last().remove();
        }

        var html = Renderer.make('Monitor-Log', data);
        $el.prepend(html);
    };
};
