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

// src/routes/external/insertgoogle.ts
var insertgoogle_exports = {};
__export(insertgoogle_exports, {
  googleRegister: () => googleRegister
});
module.exports = __toCommonJS(insertgoogle_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/external/insertgoogle.ts
function googleRegister(app) {
  return __async(this, null, function* () {
    app.post("/insertgoogle", (req, res) => __async(this, null, function* () {
      const googleSchema = import_zod.z.object({
        email: import_zod.z.string(),
        profilePictures: import_zod.z.string(),
        name: import_zod.z.string()
      });
      const { email, name, profilePictures } = googleSchema.parse(req.body);
      let userGoogle = yield prisma.usuario.findUnique({
        where: {
          email
        }
      });
      if (!userGoogle) {
        userGoogle = yield prisma.usuario.create({
          data: {
            username: name,
            email,
            profilePictures,
            password: "",
            nickname: "",
            emailNotify: false,
            promoNotify: false,
            likeNotify: false,
            followNotify: false,
            postNotify: false,
            college: [""],
            communityMember: [""],
            github: "",
            githubId: 0,
            lattes: "",
            linkedin: "",
            savedPosts: [""],
            seguidores: [""]
          }
        });
      }
      const token = app.jwt.sign(
        {
          username: userGoogle.username,
          profilePictures: userGoogle.profilePictures
        },
        {
          sub: userGoogle.id,
          expiresIn: "30 days"
        }
      );
      return {
        token
      };
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  googleRegister
});
