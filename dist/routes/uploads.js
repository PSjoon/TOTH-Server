"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/routes/uploads.ts
var uploads_exports = {};
__export(uploads_exports, {
  uploadRoutes: () => uploadRoutes
});
module.exports = __toCommonJS(uploads_exports);
var import_crypto = require("crypto");
var import_path = require("path");
var import_fs = require("fs");
var import_stream = require("stream");
var import_util = require("util");
var pump = (0, import_util.promisify)(import_stream.pipeline);
function uploadRoutes(app) {
  return __async(this, null, function* () {
    app.post("/uploads", (req, rep) => __async(this, null, function* () {
      const upload = yield req.file({
        limits: {
          fileSize: 5242880
          // 5mb
        }
      });
      if (!upload) {
        return rep.status(400).send();
      }
      const mineTypeRegex = /^(image)\/[a-zA-Z]+/;
      const isValidFile = mineTypeRegex.test(upload.mimetype);
      if (!isValidFile) {
        return;
      }
      const fileId = (0, import_crypto.randomUUID)();
      const extension = (0, import_path.extname)(upload.filename);
      const fileName = fileId.concat(extension);
      const writeStream = (0, import_fs.createWriteStream)(
        (0, import_path.resolve)(__dirname, "..", "..", "uploads", fileName)
      );
      yield pump(upload.file, writeStream);
      const fullUrl = req.protocol.concat("://").concat(req.hostname);
      const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();
      return { fileUrl };
    }));
    app.post("/uploadsPDF", (req, rep) => __async(this, null, function* () {
      const upload = yield req.file({
        limits: {
          fileSize: 5242880
          // 5mb
        }
      });
      if (!upload) {
        return rep.status(400).send();
      }
      const mineTypeRegex = /^application\/(pdf)$/;
      const isValidFile = mineTypeRegex.test(upload.mimetype);
      if (!isValidFile) {
        return;
      }
      const fileId = (0, import_crypto.randomUUID)();
      const extension = (0, import_path.extname)(upload.filename);
      const fileName = fileId.concat(extension);
      const writeStream = (0, import_fs.createWriteStream)(
        (0, import_path.resolve)(__dirname, "..", "..", "uploads", fileName)
      );
      yield pump(upload.file, writeStream);
      const fullUrl = req.protocol.concat("://").concat(req.hostname);
      const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();
      return { fileUrl };
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadRoutes
});
