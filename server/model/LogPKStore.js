/* This file is generated by IFramework - Maker.js for user to rewrite PKStore file */
!function () {
    var LogPKStore = function LogPKStore(db) {
        this.db = db;
    };

    LogPKStore.prototype = new I.Models.LogPKStoreBase();
    var functions = {
        constructor: LogPKStore,
    }
    I.Util.define(LogPKStore.prototype, functions);
    I.Util.require('LogPKStore', 'Models', new LogPKStore(rdb));
}();