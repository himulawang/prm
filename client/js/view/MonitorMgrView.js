!function() {
    var MonitorMgrView = function MonitorMgrView() {
        this.render = function render() {
            this.renderMonitors();
            Resizer.resizeMonitor();
        };
        this.renderMonitors = function renderMonitors() {
            var connectionList = dataPool.get('connectionList', 0);

            var i = 1;
            for (var id in connectionList) {
                if (i % MONITOR_COLUMN === 1) {
                    var html = Renderer.make('MonitorMgr');
                    $('#MonitorMgr').append(html);
                }

                var connection = connectionList.get(id);
                this.renderMonitor(connection);

                ++i;
            }
        };
        this.renderMonitor = function renderMonitor(connection) {
            var data = {
                connection: connection,
            };
            var html = Renderer.make('Monitor', data);
            $('#MonitorMgr').children().last().append(html);
        };
        this.renderMonitorConnected = function renderMonitorConnected(id) {
            $el = $('#Monitor-Status-' + id);
            $el.removeClass('label-error').addClass('label-success').html('Online');
        };
        this.renderMonitorConnectionError = function renderMonitorConnectionError(id) {
            $el = $('#Monitor-Status-' + id);
            $el.removeClass('label-success').addClass('label-error').html('Offline');
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
        // event
        this.onClearLog = function onClearLog(id) {
            var $el = $('#Monitor-Log-' + id);
            $el.children().remove();
        };
    };

    I.Util.require('MonitorMgrView', 'View', MonitorMgrView);
}();
