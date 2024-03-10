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

// src/routes/comment.ts
var comment_exports = {};
__export(comment_exports, {
  Comment: () => Comment
});
module.exports = __toCommonJS(comment_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/comment.ts
function Comment(app) {
  return __async(this, null, function* () {
    app.post("/commentOne", (req, res) => __async(this, null, function* () {
      const createCommentOne = import_zod.z.object({
        id: import_zod.z.string(),
        sub: import_zod.z.string(),
        comment: import_zod.z.string()
      });
      const { id, sub, comment } = createCommentOne.parse(req.body);
      console.log(id);
      console.log(sub);
      console.log(comment);
      const dataAtual = /* @__PURE__ */ new Date();
      const data = dataAtual.toISOString();
      const createComment = yield prisma.commentOne.create({
        data: {
          by: sub,
          message: comment,
          artigoId: id,
          dateCreated: data,
          strike: 0,
          reaction: 0
        }
      });
    }));
    app.get("/ListcommentOne/:id", (req, res) => __async(this, null, function* () {
      const findCommentOnezod = import_zod.z.object({
        id: import_zod.z.string()
      });
      const { id } = findCommentOnezod.parse(req.params);
      const commentOne = yield prisma.commentOne.findMany({
        where: {
          artigoId: id
        },
        orderBy: {
          dateCreated: "desc"
        }
      });
      console.log(id);
      const findCommentOne = yield Promise.all(
        commentOne.map((commentOne2) => __async(this, null, function* () {
          const usuario = yield prisma.usuario.findUnique({
            where: {
              id: commentOne2.by
            }
          });
          return {
            id: commentOne2.id,
            dateCreated: commentOne2.dateCreated,
            message: commentOne2.message,
            reaction: commentOne2.reaction,
            by: commentOne2.by,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            username: usuario == null ? void 0 : usuario.username,
            college: usuario == null ? void 0 : usuario.college,
            email: usuario == null ? void 0 : usuario.email
          };
        }))
      );
      return findCommentOne;
    }));
    app.post("/commentTwo", (req, res) => __async(this, null, function* () {
      const createCommentOne = import_zod.z.object({
        CommentTwoID: import_zod.z.string(),
        sub: import_zod.z.string(),
        comment: import_zod.z.string()
      });
      const { CommentTwoID, sub, comment } = createCommentOne.parse(req.body);
      const dataAtual = /* @__PURE__ */ new Date();
      const data = dataAtual.toISOString();
      const createComment = yield prisma.commentTwo.create({
        data: {
          by: sub,
          message: comment,
          commentId: CommentTwoID,
          dateCreated: data,
          strike: 0,
          reaction: 0
        }
      });
    }));
    app.get("/ListcommentTwo/:id", (req, res) => __async(this, null, function* () {
      const findCommentOnezod = import_zod.z.object({
        id: import_zod.z.string()
      });
      const { id } = findCommentOnezod.parse(req.params);
      const commentTwo = yield prisma.commentTwo.findMany({
        where: {
          commentId: id
        },
        orderBy: {
          dateCreated: "desc"
        }
      });
      const findCommentTwo = yield Promise.all(
        commentTwo.map((commentTwo2) => __async(this, null, function* () {
          const usuario = yield prisma.usuario.findUnique({
            where: {
              id: commentTwo2.by
            }
          });
          return {
            id: commentTwo2.id,
            dateCreated: commentTwo2.dateCreated,
            message: commentTwo2.message,
            reaction: commentTwo2.reaction,
            by: commentTwo2.by,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            username: usuario == null ? void 0 : usuario.username,
            college: usuario == null ? void 0 : usuario.college,
            email: usuario == null ? void 0 : usuario.email
          };
        }))
      );
      return findCommentTwo;
    }));
    app.post("/arrowUp/Comment", (req) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        commentId: import_zod.z.string()
      });
      const { commentId } = bodySchema.parse(req.body);
      try {
        const findReaction = yield prisma.commentOne.findUniqueOrThrow({
          where: {
            id: commentId
          }
        });
        const createReaction = yield prisma.commentOne.update({
          where: {
            id: commentId
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
    app.post("/arrowUp/CommentTwo", (req) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        commentId: import_zod.z.string()
      });
      const { commentId } = bodySchema.parse(req.body);
      try {
        const findReaction = yield prisma.commentTwo.findUniqueOrThrow({
          where: {
            id: commentId
          }
        });
        const createReaction = yield prisma.commentTwo.update({
          where: {
            id: commentId
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
    app.post("/arrowUp/PostComment", (req) => __async(this, null, function* () {
      const bodySchema = import_zod.z.object({
        commentTwoId: import_zod.z.string()
      });
      const { commentTwoId } = bodySchema.parse(req.body);
      try {
        const findReaction = yield prisma.postOne.findUniqueOrThrow({
          where: {
            id: commentTwoId
          }
        });
        const createReaction = yield prisma.postOne.update({
          where: {
            id: commentTwoId
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
    app.post("/arrowUpPostOne", (req) => __async(this, null, function* () {
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
    app.get("/ListcommentOneComu/:id", (req, res) => __async(this, null, function* () {
      const findCommentOnezod = import_zod.z.object({
        id: import_zod.z.string()
      });
      const { id } = findCommentOnezod.parse(req.params);
      const commentOne = yield prisma.postOne.findMany({
        where: {
          postId: id
        },
        orderBy: {
          dateCreated: "desc"
        }
      });
      console.log(id);
      const findCommentOne = yield Promise.all(
        commentOne.map((commentOne2) => __async(this, null, function* () {
          const usuario = yield prisma.usuario.findUnique({
            where: {
              id: commentOne2.by
            }
          });
          return {
            id: commentOne2.id,
            dateCreated: commentOne2.dateCreated,
            message: commentOne2.message,
            reaction: commentOne2.reaction,
            by: commentOne2.by,
            profilePictures: usuario == null ? void 0 : usuario.profilePictures,
            username: usuario == null ? void 0 : usuario.username,
            college: usuario == null ? void 0 : usuario.college,
            email: usuario == null ? void 0 : usuario.email
          };
        }))
      );
      return findCommentOne;
    }));
    app.post("/commentPost", (req, res) => __async(this, null, function* () {
      const createCommentOne = import_zod.z.object({
        id: import_zod.z.string(),
        sub: import_zod.z.string(),
        comment: import_zod.z.string()
      });
      const { id, sub, comment } = createCommentOne.parse(req.body);
      console.log(id);
      console.log(sub);
      console.log(comment);
      const dataAtual = /* @__PURE__ */ new Date();
      const data = dataAtual.toISOString();
      const createComment = yield prisma.postOne.create({
        data: {
          by: sub,
          message: comment,
          postId: id,
          dateCreated: data,
          strike: 0,
          reaction: 0
        }
      });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Comment
});
