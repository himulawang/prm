!function() {
    var IndexView = function IndexView() {
        this.render = function render() {
            var html = Renderer.make('Index');
            $('body').html(html);
        };
    };

    I.Util.require('IndexView', 'View', IndexView);
}();
