/* This file is generated by IFramework - Maker.js for user to rewrite List file */
!function () {
    var ClientList = function ClientList(pk, list) {
        this.init.call(this, pk, list);
    };

    ClientList.prototype = new I.Models.ClientListBase();
    var functions = {
        constructor: ClientList,
    }
    I.Util.define(ClientList.prototype, functions);
    I.Util.require('ClientList', 'Models', ClientList);
}();