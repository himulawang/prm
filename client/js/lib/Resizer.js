var Resizer = {
    resizeMonitor: function resizeMonitor() {
        var width = Math.floor(($('body').innerWidth() - MONITOR_COLUMN * 3) / MONITOR_COLUMN);
        $('.Monitor').css('width', width);
    },
};

