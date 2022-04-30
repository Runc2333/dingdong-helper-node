const crypto = require('crypto');
const md5 = function (e) {
    return crypto.createHash('md5').update(e).digest('hex');
};

var randStr = function () {
    for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 16, t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz12345678", n = "", r = 0; r < e; r++) n += t.charAt(Math.floor(Math.random() * t.length));
    return n;
};

function i (e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

function r (e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })), n.push.apply(n, r);
    }
    return n;
}

function o (e) {
    for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? r(Object(n), !0).forEach(function (t) {
            i(e, t, n[t]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
        });
    }
    return e;
}

const funSesiEncrypt = function (e) {
    try {
        var t = md5(e).substring(5, 21), n = randStr(7), a = md5(n);
        return n + md5(a + e + t + n);
    } catch (e) {
        var c = randStr(18);
        return md5(c) + c.substring(5, 12);
    }
};

function a (e) {
    var t = e.uid, n = void 0 === t ? "" : t, r = "2lRMzaGLtb1zS5^WkQ3LcuOy^gC$0EB3Ys!%hDSzjQY891$yjB";
    var i = o(o({}, e), {}, {
        private_key: n || r
    }), s = "", u = Object.keys(i).sort();
    u.forEach(function (e, t) {
        s += "".concat(e, "=").concat(i[e]).concat(t < u.length - 1 ? "&" : "");
    });
    var l = md5(s);
    return {
        nars: l,
        sesi: funSesiEncrypt(l)
    };
}


function sign (body) {
    return a(JSON.parse(body));
}

module.exports = sign;