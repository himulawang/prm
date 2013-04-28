var DynamicMaker = function() {
    this.classes = {};
    this.changed = {};
};

DynamicMaker.prototype.getModel = function getModel(id) {
    if (!(this.classes[id] && !this.changed[id])) this.make(id);
    return this.classes[id].model;
};
DynamicMaker.prototype.getList = function getList(id) {
    if (!(this.classes[id] && !this.changed[id])) this.make(id);
    return this.classes[id].list;
};

DynamicMaker.prototype.make = function make(id) {
    var orm = this.makeOrm(id);
    this.classes[id] = {};
    this.makeModel(id, orm);
    this.makeList(id, orm);
};

DynamicMaker.prototype.makeOrm = function makeOrm(id) {
    var columnList = dataPool.get('columnList', id);
    var columns = ['c0'];
    columnList.getKeys().forEach(function(n, i) {
        columns.push('c' + n);
    });
    var orm = {
        name: 'Data' + id,
        abb: 'd' + id,
        column: columns,
        toAddFilter: [],
        toUpdateFilter: [0],
        toAbbFilter: [],
        toArrayFilter: [],
        pk: 'c0',
        pkAutoIncrement: true,
        list: 'Data' + id + 'List',
    };
    return orm;
};

DynamicMaker.prototype.makeModel = function makeModel(id, orm) {
    var abbs = this.makeAbbs(orm.column, []);

    // class create
    var content = '';
    content += "args = args || [];\n";
    content += "this.pk = '" + orm.pk + "';\n";

    // column
    var columns = [];
    var abbMap = '';
    var fullMap = '';
    orm.column.forEach(function(n, i) {
        columns[i] = {
            i: i,
            full: n,
            abb: abbs[n],
            toAdd: orm.toAddFilter.indexOf(i) !== -1,
            toUpdate: orm.toUpdateFilter.indexOf(i) !== -1,
            toAbb: orm.toAbbFilter.indexOf(i) !== -1,
            toArray: orm.toArrayFilter.indexOf(i) !== -1,
        };
        abbMap += abbs[n] + ": this.column[" + i + "],\n";
        fullMap += n + ": this.column[" + i + "],\n";
    });
    content += "this.column = " + JSON.stringify(columns) + ";\n";
    content += "this.abbMap = {\n";
    content += abbMap;
    content += "};\n";
    content += "this.fullMap = {\n";
    content += fullMap;
    content += "};\n";
    content += "this.init.call(this, args);";

    var Class = new Function('args', content);

    // extends
    Class.prototype = new I.Models.Model();
    Class.prototype.constructor = Class;

    // getter & setter
    orm.column.forEach(function(v, i) {
        Object.defineProperty(
            Class.prototype,
            v,
            {
                get: function() { return this.args[i]; },
                set: function(v) { 
                    if (this.args[i] === v) return;
                    this.args[i] = v;
                    this.updateList[i] = 1;
                },
            }
        );
    });

    this.classes[id].model = Class;
};

DynamicMaker.prototype.makeList = function makeList(id, orm) {
    // class create
    var content = '';
    content += "this.getChildModel = function getChildModel() { return dynamicMaker.getModel(" + id + "); };";
    content += "this.init.call(this, pk, list);\n";

    var Class = new Function('pk', 'list', content);

    // extends
    Class.prototype = new I.Models.List();
    Class.prototype.constructor = Class;

    this.classes[id].list = Class;
};

/* Abb */
DynamicMaker.prototype.makeAbbs = function makeAbbs(columns, filter) {
    var self = this;
    var abbs = {};
    var i = 0;
    columns.forEach(function(column) {
        // filter
        if (filter.indexOf(i) !== -1) {
            ++i;
            return;
        }

        var candidateAbb = self.makeAbb(column);
        while (self.abbExist(candidateAbb, abbs)) {
            candidateAbb = self.renameAbb(candidateAbb);
        }
        abbs[column] = candidateAbb;
        ++i;
    });

    return abbs;
};

DynamicMaker.prototype.makeAbb = function makeAbb(full) {
    return (full[0] + full.replace(/[a-z]/g, '')).toLowerCase();
};

DynamicMaker.prototype.abbExist = function abbExist(abb, abbs) {
    return I.Util.valueExist(abb, abbs);
};

DynamicMaker.prototype.renameAbb = function renameAbb(abb) {
    return /^([a-zA-Z0-9]+?)(\d+)$/.test(abb) ? RegExp.$1 + (parseInt(RegExp.$2) + 1) : abb + 1;
};

/*
DynamicMaker.prototype.makeModelBaseClasses = function makeModelBaseClasses(orms) {
    this.checkModelAbbs(orms);

    var self = this;
    this.classes = {};

    orms.forEach(function(orm) {
        self.makeModelBaseClass(orm);
    });
};

DynamicMaker.prototype.makeModelBaseClass = function makeModelBaseClass(orm) {
    // pk
    this.makePKClass(orm);
    if (global) this.makePKStoreClass(orm);
    // model
    this.makeModelClass(orm);
    if (global) this.makeModelStoreClass(orm);
    // list
    if (orm.list) {
        this.makeListClass(orm);
        if (global) this.makeListStoreClass(orm);
    }
};

DynamicMaker.prototype.checkModelAbbs = function checkModelAbbs(orms) {
    var repeats = {};
    var list;
    orms.forEach(function(orm) {
        if (repeats[orm.abb]) throw new I.Exception(10002);
        repeats[orm.abb] = true;

        if (orm.list) {
            list = orm.abb + 'l';
            if (repeats[list]) throw new I.Exception(10002);
            repeats[list] = true;
        }
    });
};

DynamicMaker.prototype.getClasses = function getClasses() {
    return this.classes;
};

DynamicMaker.prototype.makePKClass = function makePKClass(orm) {
    var content = '';

    var Class = new Function('pk', content);

    Class.prototype = new I.Models.PK();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'PKBase'] = Class;
};

DynamicMaker.prototype.makePKStoreClass = function makePKStoreClass(orm) {
    var content = '';
    content += "this.key = '" + I.Const.GLOBAL_KEY_PREFIX + orm.abb + "';\n";
    content += "this.getModel = function getModel() { return I.Models." + orm.name + "PK; };\n";
    content += "this.modelName = '" + orm.name + "';\n";

    var Class = new Function('pk', content);

    Class.prototype = new I.Models.PKStore();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'PKStoreBase'] = Class;
};

DynamicMaker.prototype.makeModelClass = function makeModelClass(orm) {
    var abbs = this.makeAbbs(orm.column, []);

    // class create
    var content = '';
    content += "this.pk = '" + orm.pk + "';\n";

    // column
    var columns = [];
    var abbMap = '';
    var fullMap = '';
    orm.column.forEach(function(n, i) {
        columns[i] = {
            i: i,
            full: n,
            abb: abbs[n],
            toAdd: orm.toAddFilter.indexOf(i) !== -1,
            toUpdate: orm.toUpdateFilter.indexOf(i) !== -1,
            toAbb: orm.toAbbFilter.indexOf(i) !== -1,
            toArray: orm.toArrayFilter.indexOf(i) !== -1,
        };
        abbMap += abbs[n] + ": this.column[" + i + "],\n";
        fullMap += n + ": this.column[" + i + "],\n";
    });
    content += "this.column = " + JSON.stringify(columns) + ";\n";
    content += "this.abbMap = {\n";
    content += abbMap;
    content += "};\n";
    content += "this.fullMap = {\n";
    content += fullMap;
    content += "};\n";

    var Class = new Function('args', content);

    // extends
    Class.prototype = new I.Models.Model();
    Class.prototype.constructor = Class;

    // getter & setter
    orm.column.forEach(function(v, i) {
        Object.defineProperty(
            Class.prototype,
            v,
            {
                get: function() { return this.args[i]; },
                set: function(v) { 
                    if (this.args[i] === v) return;
                    this.args[i] = v;
                    this.updateList[i] = 1;
                },
            }
        );
    });

    this.classes[orm.name + 'Base'] = Class;
};

DynamicMaker.prototype.makeModelStoreClass = function makeModelStoreClass(orm) {
    // class create
    var content = '';
    content += "this.getModel = function getModel() { return I.Models." + orm.name + "; };\n";
    content += "this.modelName = '" + orm.name + "';\n";
    content += "this.pk = '" + orm.pk + "';\n";
    content += "this.abb = '" + orm.abb + "';\n";
    content += "this.pkAutoIncrement = " + orm.pkAutoIncrement.toString() + ";\n";

    var Class = new Function(content);

    // extends
    Class.prototype = new I.Models.ModelStore();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'StoreBase'] = Class;
};

DynamicMaker.prototype.makeListClass = function makeListClass(orm) {
    // class create
    var content = '';
    content += "this.getChildModel = function getChildModel() { return I.Models." + orm.name + "; };\n";
    content += "this.childModelName = '" + orm.name + "';\n";

    var Class = new Function('pk', 'list', content);

    // extends
    Class.prototype = new I.Models.List();
    Class.prototype.constructor = Class;

    this.classes[orm.name + 'ListBase'] = Class;
};

DynamicMaker.prototype.makeListStoreClass = function makeListStoreClass(orm) {
    // class create
    var content = '';
    content += "this.abb = '" + orm.abb + "l';\n";

    content += "this.getListModel = function getListModel() { return I.Models." + orm.list + "; };\n";
    content += "this.listModelName = '" + orm.list + "';\n";

    content += "this.getChildModel = function getChildModel() { return I.Models." + orm.name + "; };\n";
    content += "this.childModelName = '" + orm.name + "';\n";

    content += "this.getChildStore = function getChildStore() { return I.Models." + orm.name + "Store; };\n";
    content += "this.childStoreName = '" + orm.name + "Store';\n";

    var Class = new Function(content);

    // extends
    Class.prototype = new I.Models.ListStore();
    Class.prototype.constructor = Class;

    this.classes[orm.list + 'StoreBase'] = Class;
};


DynamicMaker.prototype.createFiles = function createFiles(orms, dir) {
    var self = this;

    // check dir exist
    if (!fs.existsSync(dir)) {
        fs.mkdir(dir);
    }

    orms.forEach(function(orm) {
        // pk
        self.createPKFile(orm, dir);
        self.createPKStoreFile(orm, dir);
        // model
        self.createModelFile(orm, dir);
        self.createModelStoreFile(orm, dir);
        // list
        if (orm.list) {
            self.createListFile(orm, dir);
            self.createListStoreFile(orm, dir);
        }
    });
};

DynamicMaker.prototype.createPKFile = function createPKFile(orm, dir) {
    var pkName = orm.name + 'PK';
    var content = "";
    content += "!function () {\n";
    content += "    var " + pkName + " = function " + pkName + "(pk) {\n";
    content += "        this.init.call(this, pk);\n";
    content += "    };\n";
    content += "\n";

    // extends
    content += "    " + pkName + ".prototype = new I.Models." + pkName + "Base();\n";
    content += "    " + pkName + ".prototype.constructor = " + pkName + ";\n";
    content += "\n";

    // exports
    content += "    I.Util.require('" + pkName + "', 'Models', " + pkName + ");\n";
    content += "}();";

    this.writeFile(pkName + '.js', content, dir, false);
};

DynamicMaker.prototype.createPKStoreFile = function createPKStoreFile(orm, dir) {
    var pkStoreName = orm.name + 'PKStore';
    var content = "";
    content += "!function () {\n";
    content += "    var " + pkStoreName + " = function " + pkStoreName + "(db) {\n";
    content += "        this.db = db;\n";
    content += "    };\n";
    content += "\n";

    // extends
    content += "    " + pkStoreName + ".prototype = new I.Models." + pkStoreName + "Base();\n";
    content += "    " + pkStoreName + ".prototype.constructor = " + pkStoreName + ";\n";
    content += "\n";

    // exports
    content += "    I.Util.require('" + pkStoreName + "', 'Models', new " + pkStoreName + "(db));\n";
    content += "}();";

    this.writeFile(pkStoreName + '.js', content, dir, false);
};

DynamicMaker.prototype.createModelFile = function createModelFile(orm, dir) {
    var content = "";
    content += "!function () {\n";
    content += "    var " + orm.name + " = function " + orm.name + "(args) {\n";
    content += "        this.init.call(this, args);\n";
    content += "    };\n";
    content += "\n";

    // extends
    content += "    " + orm.name + ".prototype = new I.Models." + orm.name + "Base();\n";
    content += "    " + orm.name + ".prototype.constructor = " + orm.name + ";\n";
    content += "\n";

    // exports
    content += "    I.Util.require('" + orm.name + "', 'Models', " + orm.name + ");\n";
    content += "}();";

    this.writeFile(orm.name + '.js', content, dir, false);
};

DynamicMaker.prototype.createModelStoreFile = function createModelStoreFile(orm, dir) {
    var storeName = orm.name + 'Store';
    var content = "";
    content += "!function () {\n";
    content += "    var " + storeName + " = function " + storeName + "(db) {\n";
    content += "    this.db = db;\n";
    content += "    };\n";
    content += "\n";

    // extends
    content += "    " + storeName + ".prototype = new I.Models." + storeName + "Base();\n";
    content += "    " + storeName + ".prototype.constructor = " + storeName + ";\n";
    content += "\n";

    // exports
    content += "    I.Util.require('" + storeName + "', 'Models', new " + storeName + "(db));\n";
    content += "}();";

    this.writeFile(storeName + '.js', content, dir, false);
};

DynamicMaker.prototype.createListFile = function createListFile(orm, dir) {
    var content = "";
    content += "!function () {\n";
    content += "    var " + orm.list + " = function " + orm.list + "(pk, list) {\n";
    content += "        this.init.call(this, pk, list);\n";
    content += "    };\n";
    content += "\n";

    // extends
    content += "    " + orm.list + ".prototype = new I.Models." + orm.list + "Base();\n";
    content += "    " + orm.list + ".prototype.constructor = " + orm.list + ";\n";
    content += "\n";

    // exports
    content += "    I.Util.require('" + orm.list + "', 'Models', " + orm.list + ");\n";
    content += "}();";

    this.writeFile(orm.list + '.js', content, dir, false);
};

DynamicMaker.prototype.createListStoreFile = function createListStoreFile(orm, dir) {
    var listStoreName = orm.list + 'Store';
    var content = "";
    content += "!function () {\n";
    content += "    var " + listStoreName + " = function " + listStoreName + "(db) {\n";
    content += "    this.db = db;\n";
    content += "    };\n";
    content += "\n";

    // extends
    content += "    " + listStoreName + ".prototype = new I.Models." + listStoreName + "Base();\n";
    content += "    " + listStoreName + ".prototype.constructor = " + listStoreName + ";\n";
    content += "\n";

    // exports
    content += "    I.Util.require('" + listStoreName + "', 'Models', new " + listStoreName + "(db));\n";
    content += "}();";

    this.writeFile(listStoreName + '.js', content, dir, false);
};
*/
