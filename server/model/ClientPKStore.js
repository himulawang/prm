/* This file is generated by IFramework - Maker.js for user to rewrite PKStore file */
!function () {
    var ClientPKStore = function ClientPKStore(db) {
        this.db = db;
    };

    ClientPKStore.prototype = new I.Models.ClientPKStoreBase();
    var functions = {
        constructor: ClientPKStore,
    }
    I.Util.define(ClientPKStore.prototype, functions);
    I.Util.require('ClientPKStore', 'Models', new ClientPKStore(rdb));
}();