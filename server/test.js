var Tail = require('tail').Tail;

var mysqlLog = new Tail('/var/log/syslog');

mysqlLog.on('line', function(data) {
    console.log(data);
});
