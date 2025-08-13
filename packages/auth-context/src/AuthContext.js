"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCurrentUser = exports.AuthCheckingScreen = exports.AuthProvider = exports.AuthContext = void 0;
var react_1 = require("react");
var AuthCheckingScreen_1 = require("./components/AuthCheckingScreen");
Object.defineProperty(exports, "AuthCheckingScreen", { enumerable: true, get: function () { return AuthCheckingScreen_1.AuthCheckingScreen; } });
exports.AuthContext = (0, react_1.createContext)({
    user: null,
    fetchCurrentUser: function () { return Promise.resolve(null); },
    logout: function () { return Promise.resolve(); },
    isUserAuthenticated: false,
});
// NOTE: export it as a named export
var AuthProvider = function (_a) {
    var baseUrl = _a.baseUrl, redirectUrl = _a.redirectUrl, children = _a.children;
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var fetchCurrentUser = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/api/auth/whoami"), { credentials: 'include' })];
                case 1:
                    response = _b.sent();
                    if (!response.ok)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [baseUrl]);
    var logout = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/api/auth/logout-v2"), { credentials: 'include' })];
                case 1:
                    response = _b.sent();
                    if (!response.ok)
                        return [2 /*return*/];
                    return [4 /*yield*/, response.json()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [baseUrl]);
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchCurrentUser()];
                    case 1:
                        data = _a.sent();
                        if (!isMounted)
                            return [2 /*return*/];
                        if (!data) {
                            window.location.href = redirectUrl !== null && redirectUrl !== void 0 ? redirectUrl : baseUrl;
                            return [2 /*return*/];
                        }
                        setUser(data);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () { isMounted = false; };
    }, [fetchCurrentUser, redirectUrl]);
    var isUserAuthenticated = !!user;
    return (react_1.default.createElement(exports.AuthContext.Provider, { value: { user: user, fetchCurrentUser: fetchCurrentUser, logout: logout, isUserAuthenticated: isUserAuthenticated } }, loading ? react_1.default.createElement(AuthCheckingScreen_1.AuthCheckingScreen, null) : children));
};
exports.AuthProvider = AuthProvider;
var fetchCurrentUser = function (baseUrl, requestHeaders) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("".concat(baseUrl, "/api/auth/whoami"), { credentials: 'include', headers: requestHeaders })];
            case 1:
                response = _b.sent();
                if (!response.ok)
                    return [2 /*return*/, null];
                return [4 /*yield*/, response.json()];
            case 2: return [2 /*return*/, _b.sent()];
            case 3:
                _a = _b.sent();
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchCurrentUser = fetchCurrentUser;
