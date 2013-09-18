!function() {
    var orms = [
    {
        name: 'Connection',
        abb: 'c',
        column: [
            'id',
            'name',
            'host',
            'port',
            'password',
            'keepAlive',
            'handler',
            'monitor',
        ],
        toAddFilter: [],
        toUpdateFilter: [0],
        toAbbFilter: [],
        toArrayFilter: [],
        pk: 'id',
        pkAutoIncrement: true,
        list: 'ConnectionList',
        storeType: 'IndexedDB',
    },
    {
        name: 'Log',
        abb: 'l',
        column: [
            'id',
            'name',
            'path',
        ],
        toAddFilter: [],
        toUpdateFilter: [0],
        toAbbFilter: [],
        toArrayFilter: [],
        pk: 'id',
        pkAutoIncrement: true,
        list: 'LogList',
        storeType: 'IndexedDB',
    },
    ];

    if (I.Util.isBrowser()) {
        I.Util.require('orms', '', orms);
    } else {
        // for server to create model files
        exports.orms = orms;
    }
}();
