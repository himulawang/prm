var KeyPoolView = function KeyPoolView() {
    this.render = function render(data) {
        var html = Renderer.make('KeyPool', data);
        $('Keys-Pool').html(html);
    };
};
