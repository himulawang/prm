exports.ConnectionMgrController = {
    RestartAll: function RestartAll(connection, api, params) {
        var cid = connection.id;
        this.CloseAll(connection, cid);
        var connectionList = new I.Models.ConnectionList(cid);
        connectionList.fromAbbArray(params.connectionList);

        for (var id in connectionList) {
            var con = connectionList.get(id);
            I.Ctrl.ManagerController._Connect(connection, con);
        }

        dataPool.set('connectionList', cid, connectionList);
    },
    CloseAll: function CloseAll(connection, cid) {
        var connectionList = dataPool.get('connectionList', cid);
        if (!connectionList) return;

        for (var id in connectionList) {
            var con = connectionList.get(id);
            I.Ctrl.ManagerController._Disconnect(connection, connectionList, con);
        }

        dataPool.unset('connectionList', cid);
    },
};
