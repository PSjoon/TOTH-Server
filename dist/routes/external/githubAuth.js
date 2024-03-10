"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/routes/external/githubAuth.ts
var githubAuth_exports = {};
__export(githubAuth_exports, {
  githubAuth: () => githubAuth
});
module.exports = __toCommonJS(githubAuth_exports);
var import_axios = __toESM(require("axios"));
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/external/githubAuth.ts
function githubAuth(app) {
  return __async(this, null, function* () {
    app.post("/githublogin", (req) => __async(this, null, function* () {
      const bodySchemaGitHub = import_zod.z.object({
        code: import_zod.z.string()
      });
      const { code } = bodySchemaGitHub.parse(req.body);
      const accessTokenResponse = yield import_axios.default.post(
        "https://github.com/login/oauth/access_token",
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
          },
          headers: {
            Accept: "application/json"
          }
        }
      );
      const { access_token } = accessTokenResponse.data;
      const userResponse = yield import_axios.default.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      const userSchema = import_zod.z.object({
        id: import_zod.z.number(),
        login: import_zod.z.string(),
        name: import_zod.z.string(),
        avatar_url: import_zod.z.string().url()
      });
      const userInfo = userSchema.parse(userResponse.data);
      let userGithub = yield prisma.usuario.findUnique({
        where: {
          githubId: userInfo.id
        }
      });
      if (!userGithub) {
        userGithub = yield prisma.usuario.create({
          data: {
            githubId: userInfo.id,
            github: `https://github.com/${userInfo.login}`,
            profilePictures: userInfo.avatar_url,
            username: userInfo.name,
            nickname: userInfo.login,
            email: "",
            emailNotify: false,
            promoNotify: false,
            likeNotify: false,
            followNotify: false,
            postNotify: false,
            password: "",
            college: [""],
            communityMember: [""],
            lattes: "",
            linkedin: "",
            savedPosts: [""],
            seguidores: [""]
          }
        });
      }
      const token = app.jwt.sign(
        {
          nickname: userGithub.nickname,
          usernae: userGithub.username,
          profilePictures: userGithub.profilePictures
        },
        {
          sub: userGithub.id,
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
  githubAuth
});
