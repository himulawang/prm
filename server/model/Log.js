/* This file is generated by IFramework - Maker.js for user to rewrite Model file */
!function () {
    var Log = function Log(args) {
        this.init.call(this, args);
    };

    Log.prototype = new I.Models.LogBase();
    var functions = {
        constructor: Log,
    }
    I.Util.define(Log.prototype, functions);
    I.Util.require('Log', 'Models', Log);
}();