"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.makeInitialQuerAble = exports.State = exports.MakeQueryAble = exports.omitMany = exports.omitOne = exports.pickMany = void 0;
var List_1 = require("./List");
var student1 = {
    Name: 'Ahmed',
    Surname: 'Rashid',
    Grades: [
        {
            Grade: 10,
            CourseId: 10,
            CourseName: 'Chemistry',
            Teachers: [
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Eningeer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ]
        },
    ]
};
var student2 = {
    Name: 'Ali',
    Surname: 'G',
    Grades: [
        {
            Grade: 5,
            CourseId: 6,
            CourseName: 'Biology',
            Teachers: [
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Eningeer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ]
        },
    ]
};
var student3 = {
    Name: 'Mohammed',
    Surname: 'Ali',
    Grades: [
        {
            Grade: 8,
            CourseId: 15,
            CourseName: 'Math',
            Teachers: [
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Engineer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ]
        },
    ]
};
var student4 = {
    Name: 'Ahmed',
    Surname: 'Ali',
    Grades: [
        {
            Grade: 8,
            CourseId: 15,
            CourseName: 'Math',
            Teachers: [
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Engineer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ]
        },
    ]
};
var pickMany = function (entity, props) {
    return props.reduce(function (s, prop) { return ((s[prop] = entity[prop]), s); }, {});
};
exports.pickMany = pickMany;
var omitOne = function (entity, prop) {
    var _a = entity, _b = prop, deleted = _a[_b], newState = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return newState;
};
exports.omitOne = omitOne;
var omitMany = function (entity, props) {
    var result = entity;
    props.forEach(function (prop) {
        result = (0, exports.omitOne)(result, prop);
    });
    return result;
};
exports.omitMany = omitMany;
function groupBy(list, key, record) {
    if (record === void 0) { record = {}; }
    if (list.isEmpty()) {
        return record;
    }
    var elem = list.head();
    var innerKey = elem[key];
    Object.keys(record).indexOf(innerKey.toString()) >= 0
        ? record[innerKey].push((0, exports.omitOne)(elem, key))
        : (record[innerKey] = [(0, exports.omitOne)(elem, key)]);
    return groupBy(list.tail(), key, record);
}
var MakeQueryAble = function (obj) { return ({
    select: function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return (0, exports.MakeQueryAble)(obj.map(function (left) { return left.map(function (x) { return (0, exports.omitMany)(x, keys); }); }, function (right) {
            return (0, List_1.mergeZip)((0, List_1.zip)(right, obj.fst.map(function (x) { return (0, exports.pickMany)(x, keys); })));
        }));
    },
    groupBy: function (key) {
        var ddd = obj.mapRight(function (x) { return (0, List_1.MakeList)([groupBy(x, key)]); });
        return (0, exports.MakeQueryAble)(ddd);
    },
    OrderBy: function (key, order) {
        return (0, exports.MakeQueryAble)(obj.mapRight(function (x) { return x.sort(key, order); }));
    },
    include: function (key, f) {
        return (0, exports.MakeQueryAble)(obj.map(function (left) { return left.map(function (x) { return (0, exports.omitOne)(x, key); }); }, function (right) {
            return (0, List_1.mergeZip)((0, List_1.zip)(right, obj.fst.map(function (x) {
                var _a;
                return (_a = {}, _a[key] = f((0, exports.makeInitialQuerAble)((0, exports.State)(x[key]))).run(), _a);
            })));
        }));
    },
    run: function () {
        return obj.snd.toArray();
    }
}); };
exports.MakeQueryAble = MakeQueryAble;
var State = function (x, y) { return (0, List_1.MakePair)((0, List_1.MakeList)(x), (0, List_1.MakeList)(y ? y : [])); };
exports.State = State;
var makeInitialQuerAble = function (state) { return ({
    select: function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return (0, exports.MakeQueryAble)(state.map(function (left) { return left.map(function (x) { return (0, exports.omitMany)(x, keys); }); }, function (right) { return state.fst.map(function (x) { return (0, exports.pickMany)(x, keys); }); }));
    }
}); };
exports.makeInitialQuerAble = makeInitialQuerAble;
var data = (0, exports.State)([student1, student4, student3, student2]);
var queryResult = (0, exports.makeInitialQuerAble)(data)
    .select('Surname', 'Name')
    .include('Grades', function (g) {
    return g.select('Grade').include('Teachers', function (t) { return t.select('Profession', 'Name', 'Surname'); });
})
    .OrderBy('Name', 'DESC').groupBy('Name')
    .run();
console.log(JSON.stringify(queryResult));
