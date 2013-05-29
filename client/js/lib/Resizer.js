var Resizer = {
    resizeManager: function resizeManager() {
        var column = I.env.MGR.COLUMN;
        var width = Math.floor(($('body').innerWidth()) / column);
        $('.Manager').css('width', width);
    },
};

