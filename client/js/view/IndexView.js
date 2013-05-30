!function() {
    var IndexView = function IndexView() {
        this.render = function render() {
            var html = Renderer.make('Index', { redisCommands: JSON.stringify(RedisCommands) });
            $('body').html(html);
        };
    };

    I.Util.require('IndexView', 'View', IndexView);
}();
