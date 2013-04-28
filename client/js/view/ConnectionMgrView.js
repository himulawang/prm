var ConnectionMgrView = function ConnectionMgrView() {
    this.render = function render() {
        var html = Renderer.make('ConnectionMgr');
        $('#ConnectionMgr').html(html);
    };
    this.renderCreateConnection = function renderCreateConnection() {
        var id = dataPool.get('Connection', 'PK').get() + 1;

        var html = Renderer.make('ConnectionMgr-Create', { id: id });
        $('#ConnectionMgr-Content').html(html);
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
            ]
        );
    };
};
