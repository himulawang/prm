var ConnectionMgrController = {
    RestartAll: function RestartAll() {
        var connectionList = dataPool.get('connectionList', 0);
        iWebSocket.send('C0201', { connectionList: connectionList.toArray(), });
    },
};
