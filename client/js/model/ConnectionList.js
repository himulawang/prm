/* This file is generated by IFramework - Maker.js for user to rewrite List file */
I.Loader.ModelQueue.push(function () {
    var ConnectionList = function ConnectionList(pk, list) {
        this.init.call(this, pk, list);
    };

    ConnectionList.prototype = new I.Models.ConnectionListBase();
    var functions = {
        constructor: ConnectionList,
    }
    I.Util.define(ConnectionList.prototype, functions);
    I.Util.require('ConnectionList', 'Models', ConnectionList);
});