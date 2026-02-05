"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require("multer");
var path = require("path");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        var uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});
exports.upload = multer({
    storage: storage
});
