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
exports.makeInitialQuery = exports.MakeQueryAble = exports.omitMany = exports.omitOne = exports.pickMany = exports.State = void 0;
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
                { Name: 'Mohammed', Surname: 'Abbadi', Profession: 'Softwaren Eningeer' },
                { Name: 'Francesco', Surname: 'Di Giacomo', Profession: 'Softwaren Architect' },
            ]
        },
    ]
};
var State = function (selectable, selected) {
    return List_1.MakePair(List_1.MakeList(selectable), List_1.MakeList(selected ? selected : []));
};
exports.State = State;
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
    include: function (key, f) {
        return exports.MakeQueryAble(obj.map(function (left) { return left.map(function (x) { return exports.omitOne(x, key); }); }, function (right) {
            return List_1.mergeZip(List_1.zip(right, obj.fst.map(function (x) {
                var _a;
                return (_a = {}, _a[key] = f(exports.makeInitialQuery(exports.State(x[key]))).run(), _a);
            })));
        }));
    },
    run: function () {
        return obj.snd.toArray();
    }
}); };
exports.MakeQueryAble = MakeQueryAble;
var makeInitialQuery = function (state) { return ({
    select: function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return exports.MakeQueryAble(state.map(function (left) { return left.map(function (x) { return exports.omitMany(x, keys); }); }, function (right) { return state.fst.map(function (x) { return exports.pickMany(x, keys); }); }));
    }
}); };
exports.makeInitialQuery = makeInitialQuery;
var data = exports.State([student1, student2, student3]);
var vvvv = exports.makeInitialQuery(data)
    .select('Surname')
    .include('Grades', function (g) { return g.select('CourseName').include('Teachers', function (t) { return t.select('Profession', 'Name', 'Surname'); }); })
    .run();
console.log(vvvv[0].Grades[0].Teachers[0]);
