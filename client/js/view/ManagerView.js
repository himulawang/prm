!function() {
    var ManagerView = function ManagerView() {
        this.render = function render() {
            this.renderManagers();
            Resizer.resizeManager();
        };
        this.renderManagers = function renderManagers() {
            $('.Manager-Row').remove();
            var connectionList = dataPool.get('connectionList', 0);

            var i = 1;
            var column = I.env.MGR.COLUMN;
            for (var id in connectionList) {
                if (i % column === 1) {
                    var html = Renderer.make('Manager-Row');
                    $('#Manager').append(html);
                }

                var connection = connectionList.get(id);
                this.renderManager(connection);

                ++i;
            }

            $('#Commander-Input-All').keyup(this.onCommanderInputAllKeyUp);
        };
        this.renderManager = function renderManager(connection) {
            var data = {
                connection: connection,
                redisCommands: JSON.stringify(RedisCommands),
            };
            var rows = $('.Manager-Row');
            if (rows.length === 0 || rows.last().children().length >= I.env.MGR.COLUMN) {
                $('#Manager').append(Renderer.make('Manager-Row'));
            }

            var html = Renderer.make('Manager', data);
            $('#Manager').children().last().append(html);

            $('#Commander-Input-' + connection.id).keyup(this.onCommanderInputKeyUp);
        };
        this.renderRemoveManager = function renderRemoveManager(id) {
            $('#Manager-' + id).remove();
        };
        // monitor
        this.renderMonitorConnected = function renderMonitorConnected(id) {
            $el = $('#Monitor-Status-' + id);
            $el.removeClass('label-error').addClass('label-success').html('On');
        };
        this.renderMonitorConnectionError = function renderMonitorConnectionError(id) {
            $el = $('#Monitor-Status-' + id);
            $el.removeClass('label-success').addClass('label-error').html('Off');
        };
        this.renderMonitorDisconnected = function renderMonitorDisconnected(id) {
            $el = $('#Monitor-Status-' + id);
            $el.removeClass('label-success').addClass('label-error').html('Off');
        };
        this.renderMonitorLog = function renderMonitorLog(data) {
            if (I.env.MGR.MONITOR_FILTER_INFO && data.args[0] === 'info') return;
            // remove if reach max log
            var $el = $('#Monitor-Log-' + data.id);
            var children = $el.children();
            if (children.length > I.env.MGR.MONITOR_MAX_LOG) {
                children.last().remove();
            }

            var html = Renderer.make('Manager-Monitor-Log', data);
            $el.prepend(html);
        };
        // commander
        this.renderCommanderConnected = function renderCommanderConnected(id) {
            $el = $('#Commander-Status-' + id);
            $el.removeClass('label-error').addClass('label-success').html('On');
        };
        this.renderCommanderConnectionError = function renderCommanderConnectionError(id) {
            $el = $('#Commander-Status-' + id);
            $el.removeClass('label-success').addClass('label-error').html('Off');
        };
        this.renderCommanderDisconnected = function renderCommanderDisconnected(id) {
            $el = $('#Commander-Status-' + id);
            $el.removeClass('label-success').addClass('label-error').html('Off');
        };
        this.renderCommanderLog = function renderCommanderLog(data) {
            // remove if reach max log
            var $el = $('#Commander-Log-' + data.id);
            var children = $el.children();
            if (children.length > I.env.MGR.COMMANDER_MAX_LOG) {
                children.last().remove();
            }

            if (data.err) {
                data.result = data.err;
            }

            var html = Renderer.make('Manager-Commander-Log', data);
            $el.prepend(html);
        };
        // event
        this.onMonitorClear = function onMonitorClear(id) {
            var $el = $('#Monitor-Log-' + id);
            $el.children().remove();
        };
        this.onCommanderClear = function onCommanderClear(id) {
            var $el = $('#Commander-Log-' + id);
            $el.children().remove();
        };
        this.onCommanderInputKeyUp = function onCommanderInputKeyUp(e) {
            if (e.keyCode !== 13) return;

            var el = $(this);
            var data = {
                id: this.dataset.id,
                cmd: el.val(),
            };
            I.Ctrl.ManagerController.CommanderMessage(data);

            el.val('');
        };
        this.onCommanderInputAllKeyUp = function onCommanderInputAllKeyUp(e) {
            if (e.keyCode !== 13) return;

            var el = $(this);
            var data = {
                cmd: el.val(),
            };
            I.Ctrl.ManagerController.CommanderMessageAll(data);

            el.val('');
        };
        this.onConnect = function onConnect(id) {
            I.Ctrl.ManagerController.Connect(id);
        };
        this.onDisconnect = function onDisconnect(id) {
            I.Ctrl.ManagerController.Disconnect(id);
        };
        this.onSwitchAllToMonitor = function onSwitchAllToMonitor() {
            $('.Monitor-Tab').click();
        };
        this.onSwitchAllToCommander = function onSwitchAllToCommander() {
            $('.Commander-Tab').click();
        };
    };

    I.Util.require('ManagerView', 'View', ManagerView);
}();
