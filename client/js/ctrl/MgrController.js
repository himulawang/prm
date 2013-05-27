var MgrController = {
    Init: function Init() {
        I.ws.send('C0101', { serverId: 1 });
    },
    onInit: function onInit(data) {
        KeyPoolView.render(data);
    },
};

