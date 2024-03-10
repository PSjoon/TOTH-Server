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

// src/routes/search.ts
var search_exports = {};
__export(search_exports, {
  Search: () => Search
});
module.exports = __toCommonJS(search_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/search.ts
function Search(app) {
  return __async(this, null, function* () {
    app.post("/search/:search", (req, res) => __async(this, null, function* () {
      const searchSchema = import_zod.z.object({
        search: import_zod.z.string()
      });
      const { search } = searchSchema.parse(req.params);
      const artigo = yield prisma.artigo.findMany({
        where: {
          OR: [
            {
              text: {
                contains: search
              }
            },
            {
              title: {
                contains: search
              }
            }
          ]
        }
      });
      const usuario = yield prisma.usuario.findMany({
        where: {
          OR: [
            {
              username: {
                contains: search
              }
            },
            {
              nickname: search
            },
            {
              college: {
                has: search
              }
            }
          ]
        }
      });
      const comunidades = yield prisma.comunidade.findMany({
        where: {
          OR: [
            {
              comuName: {
                contains: search
              }
            }
          ]
        }
      });
      if (usuario.length >= 1) {
        res.send({ usuario });
      }
      if (artigo.length >= 1) {
        res.send({ artigo });
      }
      if (comunidades.length >= 1) {
        res.send({ comunidades });
      }
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Search
});
