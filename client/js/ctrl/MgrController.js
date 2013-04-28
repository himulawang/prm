var MgrController = {
    Init: function Init() {
        iWebSocket.send('C0101', { serverId: 1 });
    },
    onInit: function onInit(data) {
        KeyPoolView.render(data);
    },
};

