var NetController = {
    Connect: function Connect(onready) {
        iWebSocket = new I.WebSocket().start(WS_URL, WS_PROTOCOL);
        iWebSocket.onopen = function onopen() {
            $('#Status').html('<span class="label label-success">Online </span>');
            onready();
        };
        iWebSocket.onclose = function onclose() {
            $('#Status').html('<span class="label label-important">Offline </span>');
        };
    },
};
