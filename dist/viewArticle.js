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
  return new Promise((resolve, reject) => {
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
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// api/viewArticle.ts
var viewArticle_exports = {};
__export(viewArticle_exports, {
  viewArticle: () => viewArticle
});
module.exports = __toCommonJS(viewArticle_exports);

// api/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// api/viewArticle.ts
function viewArticle(app) {
  return __async(this, null, function* () {
    app.get("/article", (req, res) => __async(this, null, function* () {
      try {
        const artigo = yield prisma.artigo.findMany({
          orderBy: {
            dateCreated: "desc"
          }
        });
        const artigoData = yield Promise.all(
          artigo.map((artigo2) => __async(this, null, function* () {
            const usuario = yield prisma.usuario.findUnique({
              where: {
                id: artigo2.by
              }
            });
            return {
              id: artigo2.id,
              dateCreated: artigo2.dateCreated,
              photo: artigo2.photo,
              reaction: artigo2.reaction,
              text: artigo2.text,
              title: artigo2.title,
              by: artigo2.by,
              file: artigo2.file,
              profilePictures: usuario == null ? void 0 : usuario.profilePicture,
              username: usuario == null ? void 0 : usuario.username,
              college: usuario == null ? void 0 : usuario.college,
              email: usuario == null ? void 0 : usuario.email,
              savedPosts: usuario == null ? void 0 : usuario.savedPosts
            };
          }))
        );
        res.send({ artigoData });
      } catch (error) {
        res.status(404);
        res.send(error);
      }
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  viewArticle
});
