/* This file is generated by IFramework - Maker.js for user to rewrite List file */
!function () {
    var LogList = function LogList(pk, list) {
        this.init.call(this, pk, list);
    };

    LogList.prototype = new I.Models.LogListBase();
    var functions = {
        constructor: LogList,
    }
    I.Util.define(LogList.prototype, functions);
    I.Util.require('LogList', 'Models', LogList);
}();