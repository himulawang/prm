/* This file is generated by IFramework - Maker.js for user to rewrite ListStore file */
I.Loader.IndexedDBQueue.push(function (db) {
    var LogListStore = function LogListStore(db) {
        this.db = db;
    };

    LogListStore.prototype = new I.Models.LogListStoreBase();
    var functions = {
        constructor: LogListStore,
    }
    I.Util.define(LogListStore.prototype, functions);
    I.Util.require('LogListStore', 'Models', new LogListStore(db));
});