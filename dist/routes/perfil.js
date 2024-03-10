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

// src/routes/perfil.ts
var perfil_exports = {};
__export(perfil_exports, {
  Perfil: () => Perfil
});
module.exports = __toCommonJS(perfil_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/perfil.ts
var import_zod = require("zod");
function Perfil(app) {
  return __async(this, null, function* () {
    app.get("/perfil/:by", (req, res) => __async(this, null, function* () {
      const userSchema = import_zod.z.object({
        by: import_zod.z.string()
      });
      const { by } = userSchema.parse(req.params);
      const user = yield prisma.usuario.findUniqueOrThrow({
        where: {
          id: by
        }
      });
      return user;
    }));
    app.get("/perfil", (req) => __async(this, null, function* () {
      const user = yield prisma.artigo.findMany({
        where: {
          by: req.user.sub
        }
      });
      console.log(user);
      return user;
    }));
    app.put("/perfil/:by", (req, res) => __async(this, null, function* () {
      const bySchema = import_zod.z.object({
        by: import_zod.z.string()
      });
      const userSchema = import_zod.z.object({
        email: import_zod.z.string(),
        username: import_zod.z.string().toLowerCase().transform((name) => {
          return name.trim().split(" ").map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          }).join(" ");
        }),
        linkedin: import_zod.z.string(),
        github: import_zod.z.string(),
        lattes: import_zod.z.string(),
        profilePictures: import_zod.z.string()
      });
      const { username, email, linkedin, github, lattes, profilePictures } = userSchema.parse(req.body);
      const { by } = bySchema.parse(req.params);
      const updateUser = yield prisma.usuario.update({
        where: {
          id: by
        },
        data: {
          email,
          username,
          linkedin,
          github,
          lattes,
          profilePictures
        }
      });
      const token = app.jwt.sign(
        {
          username: updateUser.username,
          profilePictures: updateUser.profilePictures,
          college: updateUser.college
        },
        {
          sub: updateUser.id,
          expiresIn: "30 days"
        }
      );
      res.send({ token });
    }));
    app.post("/perfil/:sub", (req, res) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const userSchema = import_zod.z.object({
        user: import_zod.z.string()
      });
      const { user } = userSchema.parse(req.body);
      const { sub } = subSchema.parse(req.params);
      const checkFollow = yield prisma.usuario.findUnique({
        where: {
          id: sub
        },
        select: {
          seguidores: true
        }
      });
      if (!(checkFollow == null ? void 0 : checkFollow.seguidores.includes(user))) {
        const followUser = yield prisma.usuario.update({
          where: {
            id: sub
          },
          data: {
            seguidores: {
              push: user
            }
          }
        });
        res.status(201);
        return followUser;
      }
      const updateUserFollow = checkFollow.seguidores.filter(
        (seguidores) => seguidores !== user
      );
      const deleteFollow = yield prisma.usuario.update({
        where: {
          id: sub
        },
        data: {
          seguidores: {
            set: updateUserFollow
          }
        }
      });
      res.status(202);
      return deleteFollow;
    }));
    app.post("/perfil/follow/:sub", (req) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const { sub } = subSchema.parse(req.params);
      const getfollow = yield prisma.usuario.findUnique({
        where: {
          id: sub
        },
        select: {
          seguidores: true
        }
      });
      return getfollow == null ? void 0 : getfollow.seguidores;
    }));
    app.post("/college/:by", (req, res) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        college: import_zod.z.string().toLowerCase().transform((name) => {
          return name.trim().split(" ").map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          }).join(" ");
        })
      });
      const subSchema = import_zod.z.object({
        by: import_zod.z.string()
      });
      const { college } = bodySchema.parse(req.body);
      const { by } = subSchema.parse(req.params);
      const updateCollege = yield prisma.usuario.findUnique({
        where: {
          id: by
        },
        select: {
          college: true
        }
      });
      if (!(updateCollege == null ? void 0 : updateCollege.college.includes(college))) {
        if ((updateCollege == null ? void 0 : updateCollege.college[0]) == "") {
          const splice = updateCollege == null ? void 0 : updateCollege.college.splice(0, 1);
          console.log(splice);
          console.log(1);
          yield prisma.usuario.update({
            where: {
              id: by
            },
            data: {
              college: {
                set: updateCollege == null ? void 0 : updateCollege.college
              }
            }
          });
        }
        const followUser = yield prisma.usuario.update({
          where: {
            id: by
          },
          data: {
            college: {
              push: college
            }
          }
        });
        res.status(201);
        return followUser;
      }
    }));
    app.get("/college/:by", (req, res) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        by: import_zod.z.string()
      });
      const { by } = subSchema.parse(req.params);
      const updateCollege = yield prisma.usuario.findMany({
        where: {
          id: by
        },
        select: {
          college: true
        }
      });
      return updateCollege;
    }));
    app.post("/college/modify/:by", (req, res) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        by: import_zod.z.string()
      });
      const bodySchema = import_zod.z.object({
        state: import_zod.z.array(
          import_zod.z.object({
            id: import_zod.z.number(),
            name: import_zod.z.string(),
            chosen: import_zod.z.boolean()
          })
        )
      });
      const { by } = subSchema.parse(req.params);
      const { state } = bodySchema.parse(req.body);
      if (state.length == 0) {
        return;
      }
      const updateCollege = yield prisma.usuario.update({
        where: {
          id: by
        },
        data: {
          college: {
            set: state.map((item) => item.name)
          }
        },
        select: {
          college: true
        }
      });
      return updateCollege;
    }));
    app.post("/notify/:sub", (req, res) => __async(this, null, function* () {
      const paramsSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const bodySchema = import_zod.z.object({
        email: import_zod.z.boolean(),
        promo: import_zod.z.boolean(),
        like: import_zod.z.boolean(),
        follow: import_zod.z.boolean(),
        post: import_zod.z.boolean()
      });
      const { sub } = paramsSchema.parse(req.params);
      const { email, promo, like, follow, post } = bodySchema.parse(req.body);
      const notifyUserUpdate = yield prisma.usuario.update({
        where: {
          id: sub
        },
        data: {
          emailNotify: email,
          promoNotify: promo,
          likeNotify: like,
          followNotify: follow,
          postNotify: post
        }
      });
      res.send({
        emailNotify: notifyUserUpdate == null ? void 0 : notifyUserUpdate.emailNotify,
        promoNotify: notifyUserUpdate == null ? void 0 : notifyUserUpdate.promoNotify,
        likeNotify: notifyUserUpdate == null ? void 0 : notifyUserUpdate.likeNotify,
        followNotify: notifyUserUpdate == null ? void 0 : notifyUserUpdate.followNotify,
        postNotify: notifyUserUpdate == null ? void 0 : notifyUserUpdate.postNotify
      });
    }));
    app.get("/notifyget/:sub", (req, res) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const { sub } = subSchema.parse(req.params);
      const notifyUser = yield prisma.usuario.findUnique({
        where: {
          id: sub
        },
        select: {
          emailNotify: true,
          promoNotify: true,
          likeNotify: true,
          followNotify: true,
          postNotify: true
        }
      });
      res.send({
        emailNotify: notifyUser == null ? void 0 : notifyUser.emailNotify,
        promoNotify: notifyUser == null ? void 0 : notifyUser.promoNotify,
        likeNotify: notifyUser == null ? void 0 : notifyUser.likeNotify,
        followNotify: notifyUser == null ? void 0 : notifyUser.followNotify,
        postNotify: notifyUser == null ? void 0 : notifyUser.postNotify
      });
    }));
    app.delete("/perfil/:sub", (req, res) => __async(this, null, function* () {
      const paramsSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const { sub } = paramsSchema.parse(req.params);
      const findCommmentTwo = yield prisma.commentTwo.findMany({
        where: {
          by: sub
        }
      });
      if (findCommmentTwo) {
        const findCommmentTwoData = yield Promise.all(
          findCommmentTwo.map((artigo) => __async(this, null, function* () {
            const usuario = yield prisma.artigo.delete({
              where: {
                id: artigo.id
              }
            });
          }))
        );
      }
      const findCommmentOne = yield prisma.commentOne.findMany({
        where: {
          by: sub
        }
      });
      const findCommmentOneData = yield Promise.all(
        findCommmentOne.map((artigo) => __async(this, null, function* () {
          const usuario = yield prisma.artigo.delete({
            where: {
              id: artigo.id
            }
          });
        }))
      );
      const findArticle = yield prisma.artigo.findMany({
        where: {
          by: sub
        }
      });
      const artigoDelData = yield Promise.all(
        findArticle.map((artigo) => __async(this, null, function* () {
          const usuario = yield prisma.artigo.delete({
            where: {
              id: artigo.id
            }
          });
        }))
      );
      const findCommunityPostTwo = yield prisma.postTwo.findMany({
        where: {
          by: sub
        }
      });
      const findCommunityPostTwoData = yield Promise.all(
        findCommunityPostTwo.map((artigo) => __async(this, null, function* () {
          const usuario = yield prisma.artigo.delete({
            where: {
              id: artigo.id
            }
          });
        }))
      );
      const findCommunityPostOne = yield prisma.postOne.findMany({
        where: {
          by: sub
        }
      });
      const findCommunityPostOneData = yield Promise.all(
        findCommunityPostOne.map((artigo) => __async(this, null, function* () {
          const usuario = yield prisma.artigo.delete({
            where: {
              id: artigo.id
            }
          });
        }))
      );
      const findCommunityPost = yield prisma.post.findMany({
        where: {
          by: sub
        }
      });
      const findCommunityPostData = yield Promise.all(
        findCommunityPost.map((artigo) => __async(this, null, function* () {
          const usuario = yield prisma.artigo.delete({
            where: {
              id: artigo.id
            }
          });
        }))
      );
      const findCommunity = yield prisma.comunidade.findMany({
        where: {
          by: sub
        }
      });
      const findCommunityData = yield Promise.all(
        findCommunity.map((artigo) => __async(this, null, function* () {
          const usuario = yield prisma.artigo.delete({
            where: {
              id: artigo.id
            }
          });
        }))
      );
      yield prisma.usuario.delete({
        where: {
          id: sub
        }
      });
    }));
    app.get("/showfollow/:sub", (req, res) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const { sub } = subSchema.parse(req.params);
      console.log(sub);
      const findFollow = yield prisma.usuario.findMany({
        where: {
          seguidores: {
            has: sub
          }
        }
      });
      return findFollow;
    }));
    app.post("/password/:sub", (req, res) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const bodySchema = import_zod.z.object({
        password: import_zod.z.string()
      });
      const { sub } = subSchema.parse(req.params);
      const { password } = bodySchema.parse(req.body);
      console.log(sub);
      console.log(password);
      const hashPassword = yield app.bcrypt.hash(password);
      const newPassword = yield prisma.usuario.update({
        where: {
          id: sub
        },
        data: {
          password: hashPassword
        }
      });
    }));
    app.post("/passwordForgot/:sub", (req, res) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const bodySchema = import_zod.z.object({
        password: import_zod.z.string()
      });
      const { sub } = subSchema.parse(req.params);
      const { password } = bodySchema.parse(req.body);
      console.log(sub);
      console.log(password);
      const hashPassword = yield app.bcrypt.hash(password);
      try {
        const newPassword = yield prisma.usuario.update({
          where: {
            email: sub
          },
          data: {
            password: hashPassword
          }
        });
      } catch (error) {
        console.log(error);
      }
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Perfil
});
