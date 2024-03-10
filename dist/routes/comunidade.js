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

// src/routes/comunidade.ts
var comunidade_exports = {};
__export(comunidade_exports, {
  Community: () => Community
});
module.exports = __toCommonJS(comunidade_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/comunidade.ts
var import_zod = require("zod");
function Community(app) {
  return __async(this, null, function* () {
    app.get("/comunidade", (req) => __async(this, null, function* () {
      const comunidade = yield prisma.comunidade.findMany({
        orderBy: {
          id: "asc"
        }
      });
      const artigoData = yield Promise.all(
        comunidade.map((comunidade2) => __async(this, null, function* () {
          const usuario = yield prisma.usuario.findUnique({
            where: {
              id: comunidade2.by
            }
          });
          return {
            id: comunidade2.id,
            by: comunidade2.by,
            photo: comunidade2.photo,
            isPublic: comunidade2.isPublic,
            comuName: comunidade2.comuName,
            description: comunidade2.description,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            username: usuario == null ? void 0 : usuario.username,
            email: usuario == null ? void 0 : usuario.email
          };
        }))
      );
      return artigoData;
    }));
    app.post("/comunidade/criar", (req) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        by: import_zod.z.string(),
        photo: import_zod.z.string(),
        isPublic: import_zod.z.boolean(),
        comuName: import_zod.z.string(),
        description: import_zod.z.string()
      });
      const { photo, isPublic, comuName, description, by } = bodySchema.parse(
        req.body
      );
      try {
        const createComunity = yield prisma.comunidade.create({
          data: {
            by,
            photo,
            isPublic,
            comuName,
            description
          }
        });
        const addComuToProfile = yield prisma.usuario.update({
          where: {
            id: by
          },
          data: {
            communityMember: {
              push: createComunity.id
            }
          }
        });
        return createComunity;
      } catch (error) {
        console.log(error);
      }
    }));
    app.get("/comunidade/:id", (req) => __async(this, null, function* () {
      const subSchema = import_zod.z.object({
        id: import_zod.z.string()
      });
      const { id } = subSchema.parse(req.params);
      console.log(id);
      const communityFind = yield prisma.comunidade.findUniqueOrThrow({
        where: {
          id
        }
      });
      return communityFind;
    }));
    app.post(`/post/:communityId`, (req) => __async(this, null, function* () {
      const createArticleSchema = import_zod.z.object({
        by: import_zod.z.string(),
        message: import_zod.z.string()
      });
      const createArticleSchemaParams = import_zod.z.object({
        communityId: import_zod.z.string()
      });
      const { by, message } = createArticleSchema.parse(req.body);
      const { communityId } = createArticleSchemaParams.parse(req.params);
      console.log(by);
      console.log(message);
      console.log(communityId);
      const dataAtual = /* @__PURE__ */ new Date();
      const data = dataAtual.toISOString();
      const createPost = yield prisma.post.create({
        data: {
          by,
          message,
          dateCreated: data,
          communityId,
          strike: 0,
          reaction: 0
        }
      });
      return createPost;
    }));
    app.get("/post/:communityId", (req) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod.z.object({
        communityId: import_zod.z.string()
      });
      const { communityId } = createArticleSchemaParams.parse(req.params);
      const postUse = yield prisma.post.findMany({
        where: {
          communityId
        },
        orderBy: {
          id: "asc"
        }
      });
      const postData = yield Promise.all(
        postUse.map((post) => __async(this, null, function* () {
          const usuario = yield prisma.usuario.findUnique({
            where: {
              id: post.by
            }
          });
          return {
            id: post.id,
            dateCreated: post.dateCreated,
            message: post.message,
            reaction: post.reaction,
            by: usuario == null ? void 0 : usuario.id,
            username: usuario == null ? void 0 : usuario.username,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            college: usuario == null ? void 0 : usuario.college
          };
        }))
      );
      return postData;
    }));
    app.get("/user/:by", (req) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod.z.object({
        by: import_zod.z.string()
      });
      const { by } = createArticleSchemaParams.parse(req.params);
      const comuUser = yield prisma.usuario.findUnique({
        where: {
          id: by
        },
        select: {
          communityMember: true
        }
      });
      console.log(comuUser == null ? void 0 : comuUser.communityMember);
      if (comuUser) {
        const queryComu = yield prisma.comunidade.findMany({});
        return queryComu;
      }
    }));
    app.post("/arrowUpPost", (req) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        artigoId: import_zod.z.string()
      });
      const { artigoId } = bodySchema.parse(req.body);
      try {
        const findReaction = yield prisma.post.findUniqueOrThrow({
          where: {
            id: artigoId
          }
        });
        const createReaction = yield prisma.post.update({
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
    app.put("/communty/:id", (req, res) => __async(this, null, function* () {
      const bySchema = import_zod.z.object({
        id: import_zod.z.string()
      });
      const userSchema = import_zod.z.object({
        comuName: import_zod.z.string(),
        description: import_zod.z.string(),
        isPublic: import_zod.z.boolean(),
        photo: import_zod.z.string()
      });
      const { id } = bySchema.parse(req.params);
      const { comuName, description, isPublic, photo } = userSchema.parse(
        req.body
      );
      const updateCommunity = yield prisma.comunidade.update({
        where: {
          id
        },
        data: {
          comuName,
          description,
          isPublic,
          photo
        }
      });
    }));
    app.post("/addmembers/:id", (req) => __async(this, null, function* () {
      const bySchema = import_zod.z.object({
        id: import_zod.z.string()
      });
      const bodySchema = import_zod.z.object({
        members: import_zod.z.string()
      });
      const { id } = bySchema.parse(req.params);
      const { members } = bodySchema.parse(req.body);
      console.log(id);
      console.log(members);
      const updateCommunity = yield prisma.usuario.update({
        where: {
          email: members
        },
        data: {
          communityMember: {
            push: id
          }
        }
      });
    }));
    app.get("/userCommunity/:id", (req) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod.z.object({
        id: import_zod.z.string()
      });
      const { id } = createArticleSchemaParams.parse(req.params);
      const communityUse = yield prisma.usuario.findMany({
        where: {
          communityMember: {
            has: id
          }
        }
      });
      return communityUse;
    }));
    app.post("/userCommunityCheck/:id", (req, res) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod.z.object({
        id: import_zod.z.string()
      });
      const checkUser = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const { id } = createArticleSchemaParams.parse(req.params);
      const { sub } = checkUser.parse(req.body);
      const communityUse = yield prisma.usuario.findUnique({
        where: {
          id: sub
        },
        select: {
          communityMember: true
        }
      });
      return communityUse == null ? void 0 : communityUse.communityMember;
    }));
    app.post("/follwoComu/:id", (req, res) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod.z.object({
        id: import_zod.z.string()
      });
      const addUser = import_zod.z.object({
        sub: import_zod.z.string()
      });
      const { id } = createArticleSchemaParams.parse(req.params);
      const { sub } = addUser.parse(req.body);
      console.log(id);
      console.log(sub);
      const checkFollow = yield prisma.usuario.findUnique({
        where: {
          id: sub
        },
        select: {
          communityMember: true
        }
      });
      if (!(checkFollow == null ? void 0 : checkFollow.communityMember.includes(id))) {
        const followUser = yield prisma.usuario.update({
          where: {
            id: sub
          },
          data: {
            communityMember: {
              push: id
            }
          }
        });
        res.status(201);
        return followUser;
      }
      const updateUserFollow = checkFollow.communityMember.filter(
        (communityMember) => communityMember !== id
      );
      const deleteFollow = yield prisma.usuario.update({
        where: {
          id: sub
        },
        data: {
          communityMember: {
            set: updateUserFollow
          }
        }
      });
      res.status(202);
      return deleteFollow;
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Community
});
