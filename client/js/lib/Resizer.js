var Resizer = {
    resizeMonitor: function resizeMonitor() {
        var width = Math.floor(($('body').innerWidth() - 2) / MONITOR_COLUMN);
        $('.Monitor').css('width', width);
    },
};

