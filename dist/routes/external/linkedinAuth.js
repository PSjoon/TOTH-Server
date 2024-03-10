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

// src/routes/external/linkedinAuth.ts
var linkedinAuth_exports = {};
__export(linkedinAuth_exports, {
  linkedinAuth: () => linkedinAuth
});
module.exports = __toCommonJS(linkedinAuth_exports);
var import_axios = __toESM(require("axios"));
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/external/linkedinAuth.ts
var import_node_console = __toESM(require("console"));
function linkedinAuth(app) {
  return __async(this, null, function* () {
    app.post("/linkedinlogin", (req) => __async(this, null, function* () {
      const bodySchemaLinkedin = import_zod.z.object({
        code: import_zod.z.string()
      });
      const { code } = bodySchemaLinkedin.parse(req.body);
      try {
        const accessTokenResponse = yield import_axios.default.post(
          "https://www.linkedin.com/oauth/v2/accessToken",
          null,
          {
            params: {
              grant_type: "authorization_code",
              code,
              redirect_uri: process.env.REDIRECT_URI,
              client_id: process.env.LINKEDIN_CLIENT_ID,
              client_secret: process.env.LINKEDIN_CLIENT_SECRET
            },
            headers: {
              Accept: "application/json"
            }
          }
        );
        const { access_token } = accessTokenResponse.data;
        try {
          const userResponse = yield import_axios.default.get(
            "https://api.linkedin.com/v2/userinfo",
            {
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            }
          );
          const userSchema = import_zod.z.object({
            email: import_zod.z.string(),
            given_name: import_zod.z.string(),
            family_name: import_zod.z.string(),
            picture: import_zod.z.string().url()
          });
          const userInfo = userSchema.parse(userResponse.data);
          let userLinkedin = yield prisma.usuario.findUnique({
            where: {
              email: userInfo.email
            }
          });
          const name = `${userInfo.given_name} ${userInfo.family_name}`;
          if (!userLinkedin) {
            userLinkedin = yield prisma.usuario.create({
              data: {
                email: userInfo.email,
                profilePictures: userInfo.picture,
                username: name,
                nickname: userInfo.given_name,
                githubId: 0,
                emailNotify: false,
                promoNotify: false,
                likeNotify: false,
                followNotify: false,
                postNotify: false,
                github: "",
                password: "",
                college: [""],
                linkedin: "",
                communityMember: [""],
                lattes: "",
                savedPosts: [""],
                seguidores: [""]
              }
            });
          }
          const token = app.jwt.sign(
            {
              nickname: userLinkedin.username,
              profilePictures: userLinkedin.profilePictures
            },
            {
              sub: userLinkedin.id,
              expiresIn: "30 days"
            }
          );
          return {
            token
          };
        } catch (error2) {
          import_node_console.default.log(error2);
        }
      } catch (error2) {
        import_node_console.default.log(error2);
      }
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  linkedinAuth
});
