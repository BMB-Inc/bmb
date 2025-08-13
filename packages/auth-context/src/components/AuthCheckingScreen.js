"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCheckingScreen = AuthCheckingScreen;
var react_1 = require("react");
function AuthCheckingScreen() {
    return (react_1.default.createElement("div", { style: {
            height: '100vh',
            width: '100vw',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        } },
        react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' } },
            react_1.default.createElement("div", { style: { marginBottom: '1rem' } },
                react_1.default.createElement("span", { style: {
                        display: 'inline-block',
                        width: 48,
                        height: 48,
                        border: '6px solid #eee',
                        borderTop: '6px solid #888',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    } }),
                react_1.default.createElement("style", null, "\n            @keyframes spin {\n              0% { transform: rotate(0deg); }\n              100% { transform: rotate(360deg); }\n            }\n          ")),
            react_1.default.createElement("div", { style: { fontSize: '1.25rem', fontWeight: 500, color: '#888' } }, "Checking authentication..."),
            react_1.default.createElement("div", { style: { fontSize: '0.95rem', color: '#aaa', textAlign: 'center' } }, "Please wait while we verify your credentials"))));
}
