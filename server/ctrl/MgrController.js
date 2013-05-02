exports.MgrController = {
    Init: function Init(connection, api, params) {
        var id = connection.id;
        var serverList = dataPool.get('ServerList', id);
        var server = serverList.get(params.serverId);

        server.redis.keys('*', function(err, result) {
            console.log(result);
            var data = {
                keys: result,
            };
            connectionPool.single(connection, api, I.Const.PRMConst.REQUEST_RESULT_CODE_SUCCESS, data);
        });
    },
};

