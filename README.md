ParaNoidz Redis Manager
===

A Redis farm manager, can multi monitor and manipulate redis server.

![][1]

### Feature

- Pure Javascript，based on Chrome and node.js

### Server

- node.js 0.8.x \>=
- Redis 2.6.x \>=

### Client

- Chrome 27 \>=

### Configuration

./run.js

```javascript
global.I_ABS_PATH = '/home/ila/project/prm/server/node_modules/i'; // ParaNoidz I Framework Path
global.APP_ABS_PATH = '/home/ila/project/prm/server'; // Server Path
global.STA_ABS_PATH = '/home/ila/project/prm/client'; // Client Path
```

./server/config/env.js:

```javascript
exports.env = {
    WEB: {
        PORT: '8082', // Web port
    },
    RDB: {
        ENABLED: true,
        HOST: '127.0.0.1',
        PORT: '6379',
    },
};
```

./client/js/config/env.js:

```javascript
var env = {
    APP: {
        NAME: 'prm',
        // 3: 'ERR', 4: 'WARNING', 5: 'NOTICE', 6: 'INFO', 7: 'DEBUG',
        LOG_LEVEL: 7,
    },
    JADE: {
        URI: '../../tpl/',
    },
    IDB: { // IndexedDB
        ENABLED: true,
        NAME: 'prm',
        VERSION: 2,
        SYNC_INTERVAL: 10000, // timer which will sync data to IndexedDB
    },
    WS: { // WebSocket
        ENABLED: true,
        URL: 'ws://' + window.location.host + '/',
        PROTOCOL: 'prm',
        AUTO_RECONNECT_INTERVAL: 800, // 0 is off
    },
    MGR: { // APP
        COLUMN: 5, // how many manager windows in one line

        MONITOR_MAX_LOG: 500, // monitor can display how many logs
        MONITOR_FILTER_INFO: true, // whether monitor filter redis command INFO, because node_redis will sent INFO periodically for testint connection is correct, but it's annoying.

        COMMANDER_MAX_LOG: 1000, // commander can display how many logs
    },
};
```

### Start

Start server

```bash
node run.js
```

Enter to Chrome

```
http://localhost:8082/
```

### Acknowledgement
- node.js: http://nodejs.org/
- Redis: http://redis.io/
- Chrome: https://www.google.com/intl/en/chrome/browser/
- node.js lib
    - express: https://github.com/visionmedia/express
    - hiredis: https://github.com/redis/hiredis
    - node_redis: https://github.com/mranney/node_redis
    - WebSocket-Node: https://github.com/Worlize/WebSocket-Node
    - ParaNoidz I Framework: https://github.com/himulawang/i
- bootstrap: https://github.com/twitter/bootstrap
- jquery: http://jquery.com/
- jade: https://github.com/visionmedia/jade
- Q: https://github.com/kriskowal/q

  [1]: https://raw.github.com/himulawang/prm/master/doc/img/01_intro.jpg
