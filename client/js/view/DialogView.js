var DialogView = function DialogView() {
    this.el = null;
    this.getEl = function getEl() {
        if (this.el === null) this.el = $('#Dialog');
        return this.el;
    };
    this.renderDeleteTableConfirm = function renderDeleteTableConfirm(id) {
        var table = dataPool.get('tableList', 0).get(id);
        var data = { table: table };
        var html = Renderer.make('DialogDeleteTableConfirm', data);
        this.getEl().html(html).modal('show');
    };
    this.renderImportTableData = function renderImportTableData(id) {
        Importer.data = [];
        var table = dataPool.get('tableList', 0).get(id);
        var data = { table: table };
        var html = Renderer.make('DialogImportTableData', data);
        this.getEl().html(html).modal('show');
    };
};
