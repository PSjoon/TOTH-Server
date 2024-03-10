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

// src/routes/artigo.ts
var artigo_exports = {};
__export(artigo_exports, {
  Artigo: () => Artigo
});
module.exports = __toCommonJS(artigo_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/artigo.ts
var import_zod = require("zod");
function Artigo(app) {
  return __async(this, null, function* () {
    app.get("/artigo", (req) => __async(this, null, function* () {
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
            scielo: artigo2.scielo,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            username: usuario == null ? void 0 : usuario.username,
            college: usuario == null ? void 0 : usuario.college,
            email: usuario == null ? void 0 : usuario.email,
            savedPosts: usuario == null ? void 0 : usuario.savedPosts
          };
        }))
      );
      return artigoData;
    }));
    app.get("/artigoale", (req) => __async(this, null, function* () {
      const artigo = yield prisma.artigo.findMany({
        orderBy: {
          reaction: "asc"
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
            scielo: artigo2.scielo,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            username: usuario == null ? void 0 : usuario.username,
            college: usuario == null ? void 0 : usuario.college,
            email: usuario == null ? void 0 : usuario.email,
            savedPosts: usuario == null ? void 0 : usuario.savedPosts
          };
        }))
      );
      return artigoData;
    }));
    app.get("/artigo/:by", (req, res) => __async(this, null, function* () {
      const paramSchema = import_zod.z.object({
        by: import_zod.z.string()
      });
      const { by } = paramSchema.parse(req.params);
      const artigoUser = yield prisma.artigo.findMany({
        where: {
          by
        },
        orderBy: {
          dateCreated: "asc"
        }
      });
      const artigoData = yield Promise.all(
        artigoUser.map((artigo) => __async(this, null, function* () {
          const usuario = yield prisma.usuario.findUnique({
            where: {
              id: artigo.by
            }
          });
          return {
            id: artigo.id,
            dateCreated: artigo.dateCreated,
            photo: artigo.photo,
            reaction: artigo.reaction,
            text: artigo.text,
            title: artigo.title,
            by: artigo.by,
            file: artigo.file,
            scielo: artigo.scielo,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            username: usuario == null ? void 0 : usuario.username,
            college: usuario == null ? void 0 : usuario.college,
            email: usuario == null ? void 0 : usuario.email,
            savedPosts: usuario == null ? void 0 : usuario.savedPosts
          };
        }))
      );
      return artigoData;
    }));
    app.get("/artigoSave/:by", (req, res) => __async(this, null, function* () {
      const paramSchema = import_zod.z.object({
        by: import_zod.z.string()
      });
      const { by } = paramSchema.parse(req.params);
      const User = yield prisma.usuario.findUnique({
        where: {
          id: by
        },
        select: {
          savedPosts: true
        }
      });
      const user = User == null ? void 0 : User.savedPosts.slice(1);
      console.log(user);
      if (user) {
        try {
          const artigoUser = yield prisma.artigo.findMany({
            where: {
              id: {
                in: user
              }
            }
          });
          const artigoData = yield Promise.all(
            artigoUser.map((artigo) => __async(this, null, function* () {
              const artigoFind = yield prisma.usuario.findUnique({
                where: {
                  id: artigo.by
                }
              });
              return {
                id: artigo.id,
                dateCreated: artigo.dateCreated,
                photo: artigo.photo,
                reaction: artigo.reaction,
                text: artigo.text,
                title: artigo.title,
                by: artigo.by,
                file: artigo.file,
                scielo: artigo.scielo,
                profilePictures: artigoFind == null ? void 0 : artigoFind.profilePictures,
                username: artigoFind == null ? void 0 : artigoFind.username,
                college: artigoFind == null ? void 0 : artigoFind.college,
                email: artigoFind == null ? void 0 : artigoFind.email,
                savedPosts: artigoFind == null ? void 0 : artigoFind.savedPosts
              };
            }))
          );
          return artigoData;
        } catch (error) {
          console.log(error);
        }
      }
    }));
    app.get("/artigo/visualizar/:id", (req, rep) => __async(this, null, function* () {
      const paramSchema = import_zod.z.object({
        id: import_zod.z.string()
      });
      const { id } = paramSchema.parse(req.params);
      const showArticle = yield prisma.artigo.findUniqueOrThrow({
        where: {
          id
        }
      });
      const showUser = yield prisma.usuario.findUniqueOrThrow({
        where: {
          id: showArticle.by
        }
      });
      return {
        id: showArticle.id,
        dateCreated: showArticle.dateCreated,
        photo: showArticle.photo,
        reaction: showArticle.reaction,
        text: showArticle.text,
        title: showArticle.title,
        by: showArticle.by,
        file: showArticle.file,
        scielo: showArticle.scielo,
        profilePictures: showUser.profilePictures,
        username: showUser.username,
        college: showUser.college,
        email: showUser.email,
        savedPosts: showUser.savedPosts
      };
    }));
    app.post("/artigo/criar", (req) => __async(this, null, function* () {
      const createArticleSchema = import_zod.z.object({
        title: import_zod.z.string(),
        text: import_zod.z.string(),
        photo: import_zod.z.string(),
        by: import_zod.z.string(),
        scielo: import_zod.z.string(),
        file: import_zod.z.string()
      });
      const { title, text, photo, by, scielo, file } = createArticleSchema.parse(
        req.body
      );
      const dataAtual = /* @__PURE__ */ new Date();
      const data = dataAtual.toISOString();
      const usuario = yield prisma.usuario.findFirst({
        where: {
          OR: [
            {
              email: by
            },
            {
              id: by
            }
          ]
        },
        select: {
          id: true
        }
      });
      if (usuario) {
        const userId = usuario.id;
        console.log(userId);
        try {
          const createArticle = yield prisma.artigo.create({
            data: {
              title,
              text,
              photo,
              strike: 0,
              by: userId,
              dateCreated: data,
              reaction: 0,
              scielo,
              file
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    }));
    app.post("/arrowUp", (req) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        artigoId: import_zod.z.string()
      });
      const { artigoId } = bodySchema.parse(req.body);
      try {
        const findReaction = yield prisma.artigo.findUniqueOrThrow({
          where: {
            id: artigoId
          }
        });
        const createReaction = yield prisma.artigo.update({
          where: {
            id: artigoId
          },
          data: {
            reaction: findReaction.reaction + 1
          }
        });
        return createReaction.reaction;
      } catch (error) {
        console.log(error);
      }
    }));
    app.post("/savePost", (req, res) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        sub: import_zod.z.string(),
        artigoId: import_zod.z.string()
      });
      const { sub, artigoId } = bodySchema.parse(req.body);
      try {
        const checkArticle = yield prisma.usuario.findUnique({
          where: {
            id: sub
          },
          select: {
            savedPosts: true
          }
        });
        if (!(checkArticle == null ? void 0 : checkArticle.savedPosts.includes(artigoId))) {
          const followUser = yield prisma.usuario.update({
            where: {
              id: sub
            },
            data: {
              savedPosts: {
                push: artigoId
              }
            }
          });
          res.status(201);
          return followUser;
        }
        const updateArticleSave = checkArticle.savedPosts.filter(
          (SavePost) => SavePost !== artigoId
        );
        const deleteSaveArticle = yield prisma.usuario.update({
          where: {
            id: sub
          },
          data: {
            savedPosts: {
              set: updateArticleSave
            }
          }
        });
        res.status(202);
        return deleteSaveArticle;
      } catch (error) {
        console.log(error);
      }
    }));
    app.post("/strike", (req, res) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        idArticle: import_zod.z.string()
      });
      const { idArticle } = bodySchema.parse(req.body);
      console.log(idArticle);
      try {
        const findStrikeArticle = yield prisma.artigo.findUniqueOrThrow({
          where: {
            id: idArticle
          }
        });
        if (findStrikeArticle) {
          const createStrike = yield prisma.artigo.update({
            where: {
              id: idArticle
            },
            data: {
              strike: findStrikeArticle.strike + 1
            }
          });
          if (createStrike.strike == 8) {
            yield prisma.artigo.delete({
              where: {
                id: idArticle
              }
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const findStrikePost = yield prisma.post.findUniqueOrThrow({
          where: {
            id: idArticle
          }
        });
        if (findStrikePost) {
          try {
            const createStrike = yield prisma.post.update({
              where: {
                id: idArticle
              },
              data: {
                strike: findStrikePost.strike + 1
              }
            });
            if (createStrike.strike == 8) {
              yield prisma.post.delete({
                where: {
                  id: idArticle
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const findStrikePostOne = yield prisma.postOne.findUniqueOrThrow({
          where: {
            id: idArticle
          }
        });
        if (findStrikePostOne) {
          const createStrike = yield prisma.postOne.update({
            where: {
              id: idArticle
            },
            data: {
              strike: findStrikePostOne.strike + 1
            }
          });
          if (createStrike.strike == 8) {
            yield prisma.postOne.delete({
              where: {
                id: idArticle
              }
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const findStrikeComentOne = yield prisma.commentOne.findUniqueOrThrow({
          where: {
            id: idArticle
          }
        });
        console.log(findStrikeComentOne);
        console.log(1);
        if (findStrikeComentOne) {
          const createStrike = yield prisma.commentOne.update({
            where: {
              id: idArticle
            },
            data: {
              strike: findStrikeComentOne.strike + 1
            }
          });
          if (createStrike.strike == 8) {
            yield prisma.commentOne.delete({
              where: {
                id: idArticle
              }
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
      try {
        const findStrikeComentTwo = yield prisma.commentTwo.findUniqueOrThrow({
          where: {
            id: idArticle
          }
        });
        if (findStrikeComentTwo) {
          const createStrike = yield prisma.commentTwo.update({
            where: {
              id: idArticle
            },
            data: {
              strike: findStrikeComentTwo.strike + 1
            }
          });
          if (createStrike.strike == 8) {
            yield prisma.commentTwo.delete({
              where: {
                id: idArticle
              }
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Artigo
});
