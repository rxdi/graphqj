"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrToObj = (a) => a.reduce((acc, curr) => (Object.assign({}, acc, { curr })), {});
