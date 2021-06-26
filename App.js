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
        result = exports.omitOne(result, prop);
    });
    return result;
};
exports.omitMany = omitMany;
var MakeQueryAble = function (obj) { return ({
    select: function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return exports.MakeQueryAble(obj.map(function (left) { return left.map(function (x) { return exports.omitMany(x, keys); }); }, function (right) {
            return List_1.mergeZip(List_1.zip(right, obj.fst.map(function (x) { return exports.pickMany(x, keys); })));
        }));
    },
    groupBy: function (key) {
        var ddd = obj.mapRight(function (x) { return List_1.MakeList([groupBy(x, key)]); });
        return exports.MakeQueryAble(ddd);
    },
    OrderBy: function (key, order) {
        return exports.MakeQueryAble(obj.mapRight(function (x) { return x.sort(key, order); }));
    },
    include: function (key, f) {
        return exports.MakeQueryAble(obj.map(function (left) { return left.map(function (x) { return exports.omitOne(x, key); }); }, function (right) {
            return List_1.mergeZip(List_1.zip(right, obj.fst.map(function (x) {
                var _a;
                return (_a = {}, _a[key] = f(exports.makeInitialQuerAble(exports.State(x[key]))).run(), _a);
            })));
        }));
    },
    run: function () {
        return obj.snd.toArray();
    }
}); };
exports.MakeQueryAble = MakeQueryAble;
var State = function (x, y) { return List_1.MakePair(List_1.MakeList(x), List_1.MakeList(y ? y : [])); };
exports.State = State;
var makeInitialQuerAble = function (state) { return ({
    select: function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return exports.MakeQueryAble(state.map(function (left) { return left.map(function (x) { return exports.omitMany(x, keys); }); }, function (right) { return state.fst.map(function (x) { return exports.pickMany(x, keys); }); }));
    }
}); };
exports.makeInitialQuerAble = makeInitialQuerAble;
var data = exports.State([student1, student4, student3, student2]);
var vvvv = exports.makeInitialQuerAble(data)
    .select('Surname')
    .include('Grades', function (g) {
    return g.select('Grade').include('Teachers', function (t) { return t.select('Profession', 'Name', 'Surname'); });
})
    .groupBy('Surname').select('Name')
    .run();
function groupBy(list, key, record) {
    if (record === void 0) { record = {}; }
    if (list.isEmpty()) {
        return record;
    }
    var elem = list.head();
    var innerKey = elem[key];
    Object.keys(record).indexOf(innerKey.toString()) >= 0
        ? record[innerKey].push(exports.omitOne(elem, key))
        : (record[innerKey] = [exports.omitOne(elem, key)]);
    return groupBy(list.tail(), key, record);
}
console.log(vvvv);
