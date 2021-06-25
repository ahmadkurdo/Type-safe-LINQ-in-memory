"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.mergeZip = exports.zip = exports.MakeList = exports.MakePair = exports.State = exports.Unit = void 0;
exports.Unit = {};
var State = function (selectable, selected) {
    return exports.MakePair(exports.MakeList(selectable), exports.MakeList(selected ? selected : []));
};
exports.State = State;
var MakePair = function (fst, snd) { return ({
    fst: fst,
    snd: snd,
    mapLeft: function (f) {
        return exports.MakePair(f(this.fst), this.snd);
    },
    mapRight: function (g) {
        return exports.MakePair(this.fst, g(this.snd));
    },
    map: function (f, g) {
        return exports.MakePair(f(this.fst), g(this.snd));
    }
}); };
exports.MakePair = MakePair;
var MakeList = function (data) { return ({
    data: data,
    head: function () {
        return this.data[0];
    },
    tail: function () {
        return exports.MakeList(this.data.slice(1));
    },
    isEmpty: function () {
        return this.data.length === 0;
    },
    size: function () {
        return this.data.length;
    },
    map: function (f) {
        return exports.MakeList(this.data.map(f));
    },
    concat: function (l2) {
        return exports.MakeList(this.data.concat(l2.data));
    },
    toArray: function () {
        return this.data;
    }
}); };
exports.MakeList = MakeList;
var zip = function (l1, l2) {
    return l1.isEmpty() || l2.isEmpty()
        ? exports.MakeList([])
        : exports.MakeList([exports.MakePair(l1.head(), l2.head())]).concat(exports.zip(l1.tail(), l2.tail()));
};
exports.zip = zip;
var mergeZip = function (lst) {
    return exports.MakeList(lst.map(function (x) { return (__assign(__assign({}, x.fst), x.snd)); }).toArray());
};
exports.mergeZip = mergeZip;
