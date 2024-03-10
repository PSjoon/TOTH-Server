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

// src/routes/cadastrar.ts
var cadastrar_exports = {};
__export(cadastrar_exports, {
  newUser: () => newUser
});
module.exports = __toCommonJS(cadastrar_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/cadastrar.ts
function newUser(app) {
  return __async(this, null, function* () {
    app.post("/cadastrar", (req, res) => __async(this, null, function* () {
      const newUserSchema = import_zod.z.object({
        email: import_zod.z.string(),
        username: import_zod.z.string().toLowerCase().transform((name) => {
          return name.trim().split(" ").map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          }).join(" ");
        }),
        nickname: import_zod.z.string(),
        password: import_zod.z.string()
      });
      const { username, nickname, email, password } = newUserSchema.parse(
        req.body
      );
      const hashPassword = yield app.bcrypt.hash(password);
      let isLog = yield prisma.usuario.findUnique({
        where: {
          email
        }
      });
      if (isLog) {
        res.status(301);
        return;
      }
      isLog = yield prisma.usuario.create({
        data: {
          username,
          nickname,
          email,
          password: hashPassword,
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
          profilePictures: "http://localhost:3334/uploads/User2.svg",
          savedPosts: [""],
          seguidores: [""]
        }
      });
      const token = app.jwt.sign(
        {
          username: isLog.username,
          nickname: isLog.nickname,
          profilePictures: isLog.profilePictures
        },
        {
          sub: isLog.id,
          expiresIn: "30 days"
        }
      );
      res.send({ token });
    }));
    app.post("/logar", (req, res) => __async(this, null, function* () {
      const logUserSchema = import_zod.z.object({
        email: import_zod.z.string(),
        password: import_zod.z.string()
      });
      const { email, password } = logUserSchema.parse(req.body);
      try {
        const isRegister = yield prisma.usuario.findUnique({
          where: {
            email
          }
        });
        if (isRegister) {
          if (!(yield app.bcrypt.compare(password, isRegister.password))) {
            res.status(403);
          }
        } else {
          res.status(404);
        }
        if (isRegister) {
          const token = app.jwt.sign(
            {
              username: isRegister.username,
              nickname: isRegister.nickname,
              profilePictures: isRegister.profilePictures
            },
            {
              sub: isRegister.id,
              expiresIn: "30 days"
            }
          );
          res.send({ token, user: isRegister });
        }
      } catch (e) {
        res.status(301);
        return;
      }
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  newUser
});
