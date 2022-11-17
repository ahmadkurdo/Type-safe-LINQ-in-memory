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
    return (0, exports.MakePair)((0, exports.MakeList)(selectable), (0, exports.MakeList)(selected ? selected : []));
};
exports.State = State;
var MakePair = function (fst, snd) { return ({
    fst: fst,
    snd: snd,
    mapLeft: function (f) {
        return (0, exports.MakePair)(f(this.fst), this.snd);
    },
    mapRight: function (g) {
        return (0, exports.MakePair)(this.fst, g(this.snd));
    },
    map: function (f, g) {
        return (0, exports.MakePair)(f(this.fst), g(this.snd));
    }
}); };
exports.MakePair = MakePair;
var MakeList = function (data) { return ({
    data: data,
    head: function () {
        return this.data[0];
    },
    tail: function () {
        return (0, exports.MakeList)(this.data.slice(1));
    },
    isEmpty: function () {
        return this.data.length === 0;
    },
    size: function () {
        return this.data.length;
    },
    map: function (f) {
        return (0, exports.MakeList)(this.data.map(f));
    },
    concat: function (l2) {
        return (0, exports.MakeList)(this.data.concat(l2.data));
    },
    toArray: function () {
        return this.data;
    },
    sort: function (key, order) {
        return (0, exports.MakeList)(data.sort(function (obj1, obj2) {
            switch (order) {
                case 'ASC': {
                    return obj1[key] > obj2[key] ? 1 : -1;
                }
                case 'DESC': {
                    return obj1[key] < obj2[key] ? 1 : -1;
                }
            }
        }));
    }
}); };
exports.MakeList = MakeList;
var zip = function (l1, l2) {
    return l1.isEmpty() || l2.isEmpty()
        ? (0, exports.MakeList)([])
        : (0, exports.MakeList)([(0, exports.MakePair)(l1.head(), l2.head())]).concat((0, exports.zip)(l1.tail(), l2.tail()));
};
exports.zip = zip;
var mergeZip = function (lst) {
    return (0, exports.MakeList)(lst.map(function (x) { return (__assign(__assign({}, x.fst), x.snd)); }).toArray());
};
exports.mergeZip = mergeZip;
