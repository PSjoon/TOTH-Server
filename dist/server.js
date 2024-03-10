"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve3, reject) => {
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
    var step = (x) => x.done ? resolve3(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.3.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://github.com/motdotla/dotenv?sponsor=1",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error2) {
          if (i + 1 >= length) {
            throw error2;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error2) {
        if (error2.code === "ERR_INVALID_URL") {
          throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
        }
        throw error2;
      }
      const key = uri.password;
      if (!key) {
        throw new Error("INVALID_DOTENV_KEY: Missing key part");
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        throw new Error("INVALID_DOTENV_KEY: Missing environment part");
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      if (options && options.path && options.path.length > 0) {
        dotenvPath = options.path;
      }
      return dotenvPath.endsWith(".vault") ? dotenvPath : `${dotenvPath}.vault`;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
        let processEnv = process.env;
        if (options && options.processEnv != null) {
          processEnv = options.processEnv;
        }
        DotenvModule.populate(processEnv, parsed, options);
        return { parsed };
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    function config(options) {
      const vaultPath = _vaultPath(options);
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      if (!fs.existsSync(vaultPath)) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.slice(0, 12);
      const authTag = ciphertext.slice(-16);
      ciphertext = ciphertext.slice(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error2) {
        const isRange = error2 instanceof RangeError;
        const invalidKeyLength = error2.message === "Invalid key length";
        const decryptionFailed = error2.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const msg = "INVALID_DOTENV_KEY: It must be 64 characters long (or more)";
          throw new Error(msg);
        } else if (decryptionFailed) {
          const msg = "DECRYPTION_FAILED: Please check your DOTENV_KEY";
          throw new Error(msg);
        } else {
          console.error("Error: ", error2.code);
          console.error("Error: ", error2.message);
          throw error2;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports2, module2) {
    "use strict";
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module2.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports2, module2) {
    "use strict";
    var re = /^dotenv_config_(encoding|path|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
      return args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
    };
  }
});

// node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// src/server.ts
var import_fastify = __toESM(require("fastify"));
var import_multipart = __toESM(require("@fastify/multipart"));
var import_static = __toESM(require("@fastify/static"));
var import_cors = __toESM(require("@fastify/cors"));

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/perfil.ts
var import_zod = require("zod");
function Perfil(app2) {
  return __async(this, null, function* () {
    app2.get("/perfil/:by", (req, res) => __async(this, null, function* () {
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
    app2.get("/perfil", (req) => __async(this, null, function* () {
      const user = yield prisma.artigo.findMany({
        where: {
          by: req.user.sub
        }
      });
      console.log(user);
      return user;
    }));
    app2.put("/perfil/:by", (req, res) => __async(this, null, function* () {
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
      const token = app2.jwt.sign(
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
    app2.post("/perfil/:sub", (req, res) => __async(this, null, function* () {
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
    app2.post("/perfil/follow/:sub", (req) => __async(this, null, function* () {
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
    app2.post("/college/:by", (req, res) => __async(this, null, function* () {
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
    app2.get("/college/:by", (req, res) => __async(this, null, function* () {
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
    app2.post("/college/modify/:by", (req, res) => __async(this, null, function* () {
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
    app2.post("/notify/:sub", (req, res) => __async(this, null, function* () {
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
    app2.get("/notifyget/:sub", (req, res) => __async(this, null, function* () {
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
    app2.delete("/perfil/:sub", (req, res) => __async(this, null, function* () {
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
    app2.get("/showfollow/:sub", (req, res) => __async(this, null, function* () {
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
    app2.post("/password/:sub", (req, res) => __async(this, null, function* () {
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
      const hashPassword = yield app2.bcrypt.hash(password);
      const newPassword = yield prisma.usuario.update({
        where: {
          id: sub
        },
        data: {
          password: hashPassword
        }
      });
    }));
    app2.post("/passwordForgot/:sub", (req, res) => __async(this, null, function* () {
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
      const hashPassword = yield app2.bcrypt.hash(password);
      try {
        const newPassword = yield prisma.usuario.update({
          where: {
            email: sub
          },
          data: {
            password: hashPassword
          }
        });
      } catch (error2) {
        console.log(error2);
      }
    }));
  });
}

// src/routes/artigo.ts
var import_zod2 = require("zod");
function Artigo(app2) {
  return __async(this, null, function* () {
    app2.get("/artigo", (req) => __async(this, null, function* () {
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
    app2.get("/artigoale", (req) => __async(this, null, function* () {
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
    app2.get("/artigo/:by", (req, res) => __async(this, null, function* () {
      const paramSchema = import_zod2.z.object({
        by: import_zod2.z.string()
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
    app2.get("/artigoSave/:by", (req, res) => __async(this, null, function* () {
      const paramSchema = import_zod2.z.object({
        by: import_zod2.z.string()
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
        } catch (error2) {
          console.log(error2);
        }
      }
    }));
    app2.get("/artigo/visualizar/:id", (req, rep) => __async(this, null, function* () {
      const paramSchema = import_zod2.z.object({
        id: import_zod2.z.string()
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
    app2.post("/artigo/criar", (req) => __async(this, null, function* () {
      const createArticleSchema = import_zod2.z.object({
        title: import_zod2.z.string(),
        text: import_zod2.z.string(),
        photo: import_zod2.z.string(),
        by: import_zod2.z.string(),
        scielo: import_zod2.z.string(),
        file: import_zod2.z.string()
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
        } catch (error2) {
          console.log(error2);
        }
      }
    }));
    app2.post("/arrowUp", (req) => __async(this, null, function* () {
      const bodySchema = import_zod2.z.object({
        artigoId: import_zod2.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.post("/savePost", (req, res) => __async(this, null, function* () {
      const bodySchema = import_zod2.z.object({
        sub: import_zod2.z.string(),
        artigoId: import_zod2.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.post("/strike", (req, res) => __async(this, null, function* () {
      const bodySchema = import_zod2.z.object({
        idArticle: import_zod2.z.string()
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
      } catch (error2) {
        console.log(error2);
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
          } catch (error2) {
            console.log(error2);
          }
        }
      } catch (error2) {
        console.log(error2);
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
      } catch (error2) {
        console.log(error2);
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
      } catch (error2) {
        console.log(error2);
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
      } catch (error2) {
        console.log(error2);
      }
    }));
  });
}

// src/routes/comunidade.ts
var import_zod3 = require("zod");
function Community(app2) {
  return __async(this, null, function* () {
    app2.get("/comunidade", (req) => __async(this, null, function* () {
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
    app2.post("/comunidade/criar", (req) => __async(this, null, function* () {
      const bodySchema = import_zod3.z.object({
        by: import_zod3.z.string(),
        photo: import_zod3.z.string(),
        isPublic: import_zod3.z.boolean(),
        comuName: import_zod3.z.string(),
        description: import_zod3.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.get("/comunidade/:id", (req) => __async(this, null, function* () {
      const subSchema = import_zod3.z.object({
        id: import_zod3.z.string()
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
    app2.post(`/post/:communityId`, (req) => __async(this, null, function* () {
      const createArticleSchema = import_zod3.z.object({
        by: import_zod3.z.string(),
        message: import_zod3.z.string()
      });
      const createArticleSchemaParams = import_zod3.z.object({
        communityId: import_zod3.z.string()
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
    app2.get("/post/:communityId", (req) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod3.z.object({
        communityId: import_zod3.z.string()
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
    app2.get("/user/:by", (req) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod3.z.object({
        by: import_zod3.z.string()
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
    app2.post("/arrowUpPost", (req) => __async(this, null, function* () {
      const bodySchema = import_zod3.z.object({
        artigoId: import_zod3.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.put("/communty/:id", (req, res) => __async(this, null, function* () {
      const bySchema = import_zod3.z.object({
        id: import_zod3.z.string()
      });
      const userSchema = import_zod3.z.object({
        comuName: import_zod3.z.string(),
        description: import_zod3.z.string(),
        isPublic: import_zod3.z.boolean(),
        photo: import_zod3.z.string()
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
    app2.post("/addmembers/:id", (req) => __async(this, null, function* () {
      const bySchema = import_zod3.z.object({
        id: import_zod3.z.string()
      });
      const bodySchema = import_zod3.z.object({
        members: import_zod3.z.string()
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
    app2.get("/userCommunity/:id", (req) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod3.z.object({
        id: import_zod3.z.string()
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
    app2.post("/userCommunityCheck/:id", (req, res) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod3.z.object({
        id: import_zod3.z.string()
      });
      const checkUser = import_zod3.z.object({
        sub: import_zod3.z.string()
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
    app2.post("/follwoComu/:id", (req, res) => __async(this, null, function* () {
      const createArticleSchemaParams = import_zod3.z.object({
        id: import_zod3.z.string()
      });
      const addUser = import_zod3.z.object({
        sub: import_zod3.z.string()
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

// src/routes/cadastrar.ts
var import_zod4 = require("zod");
function newUser(app2) {
  return __async(this, null, function* () {
    app2.post("/cadastrar", (req, res) => __async(this, null, function* () {
      const newUserSchema = import_zod4.z.object({
        email: import_zod4.z.string(),
        username: import_zod4.z.string().toLowerCase().transform((name) => {
          return name.trim().split(" ").map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          }).join(" ");
        }),
        nickname: import_zod4.z.string(),
        password: import_zod4.z.string()
      });
      const { username, nickname, email, password } = newUserSchema.parse(
        req.body
      );
      const hashPassword = yield app2.bcrypt.hash(password);
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
      const token = app2.jwt.sign(
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
    app2.post("/logar", (req, res) => __async(this, null, function* () {
      const logUserSchema = import_zod4.z.object({
        email: import_zod4.z.string(),
        password: import_zod4.z.string()
      });
      const { email, password } = logUserSchema.parse(req.body);
      try {
        const isRegister = yield prisma.usuario.findUnique({
          where: {
            email
          }
        });
        if (isRegister) {
          if (!(yield app2.bcrypt.compare(password, isRegister.password))) {
            res.status(403);
          }
        } else {
          res.status(404);
        }
        if (isRegister) {
          const token = app2.jwt.sign(
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

// src/routes/external/githubAuth.ts
var import_axios = __toESM(require("axios"));
var import_zod5 = require("zod");
function githubAuth(app2) {
  return __async(this, null, function* () {
    app2.post("/githublogin", (req) => __async(this, null, function* () {
      const bodySchemaGitHub = import_zod5.z.object({
        code: import_zod5.z.string()
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
      const userSchema = import_zod5.z.object({
        id: import_zod5.z.number(),
        login: import_zod5.z.string(),
        name: import_zod5.z.string(),
        avatar_url: import_zod5.z.string().url()
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
      const token = app2.jwt.sign(
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

// src/server.ts
var import_jwt = __toESM(require("@fastify/jwt"));

// src/routes/external/insertgoogle.ts
var import_zod6 = require("zod");
function googleRegister(app2) {
  return __async(this, null, function* () {
    app2.post("/insertgoogle", (req, res) => __async(this, null, function* () {
      const googleSchema = import_zod6.z.object({
        email: import_zod6.z.string(),
        profilePictures: import_zod6.z.string(),
        name: import_zod6.z.string()
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
      const token = app2.jwt.sign(
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

// src/routes/uploads.ts
var import_crypto = require("crypto");
var import_path = require("path");
var import_fs = require("fs");
var import_stream = require("stream");
var import_util = require("util");
var pump = (0, import_util.promisify)(import_stream.pipeline);
function uploadRoutes(app2) {
  return __async(this, null, function* () {
    app2.post("/uploads", (req, rep) => __async(this, null, function* () {
      const upload = yield req.file({
        limits: {
          fileSize: 5242880
          // 5mb
        }
      });
      if (!upload) {
        return rep.status(400).send();
      }
      const mineTypeRegex = /^(image)\/[a-zA-Z]+/;
      const isValidFile = mineTypeRegex.test(upload.mimetype);
      if (!isValidFile) {
        return;
      }
      const fileId = (0, import_crypto.randomUUID)();
      const extension = (0, import_path.extname)(upload.filename);
      const fileName = fileId.concat(extension);
      const writeStream = (0, import_fs.createWriteStream)(
        (0, import_path.resolve)(__dirname, "..", "..", "uploads", fileName)
      );
      yield pump(upload.file, writeStream);
      const fullUrl = req.protocol.concat("://").concat(req.hostname);
      const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();
      return { fileUrl };
    }));
    app2.post("/uploadsPDF", (req, rep) => __async(this, null, function* () {
      const upload = yield req.file({
        limits: {
          fileSize: 5242880
          // 5mb
        }
      });
      if (!upload) {
        return rep.status(400).send();
      }
      const mineTypeRegex = /^application\/(pdf)$/;
      const isValidFile = mineTypeRegex.test(upload.mimetype);
      if (!isValidFile) {
        return;
      }
      const fileId = (0, import_crypto.randomUUID)();
      const extension = (0, import_path.extname)(upload.filename);
      const fileName = fileId.concat(extension);
      const writeStream = (0, import_fs.createWriteStream)(
        (0, import_path.resolve)(__dirname, "..", "..", "uploads", fileName)
      );
      yield pump(upload.file, writeStream);
      const fullUrl = req.protocol.concat("://").concat(req.hostname);
      const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();
      return { fileUrl };
    }));
  });
}

// src/server.ts
var import_node_path = require("path");

// src/routes/search.ts
var import_zod7 = require("zod");
function Search(app2) {
  return __async(this, null, function* () {
    app2.post("/search/:search", (req, res) => __async(this, null, function* () {
      const searchSchema = import_zod7.z.object({
        search: import_zod7.z.string()
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

// src/routes/comment.ts
var import_zod8 = require("zod");
function Comment(app2) {
  return __async(this, null, function* () {
    app2.post("/commentOne", (req, res) => __async(this, null, function* () {
      const createCommentOne = import_zod8.z.object({
        id: import_zod8.z.string(),
        sub: import_zod8.z.string(),
        comment: import_zod8.z.string()
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
    app2.get("/ListcommentOne/:id", (req, res) => __async(this, null, function* () {
      const findCommentOnezod = import_zod8.z.object({
        id: import_zod8.z.string()
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
    app2.post("/commentTwo", (req, res) => __async(this, null, function* () {
      const createCommentOne = import_zod8.z.object({
        CommentTwoID: import_zod8.z.string(),
        sub: import_zod8.z.string(),
        comment: import_zod8.z.string()
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
    app2.get("/ListcommentTwo/:id", (req, res) => __async(this, null, function* () {
      const findCommentOnezod = import_zod8.z.object({
        id: import_zod8.z.string()
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
    app2.post("/arrowUp/Comment", (req) => __async(this, null, function* () {
      const bodySchema = import_zod8.z.object({
        commentId: import_zod8.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.post("/arrowUp/CommentTwo", (req) => __async(this, null, function* () {
      const bodySchema = import_zod8.z.object({
        commentId: import_zod8.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.post("/arrowUp/PostComment", (req) => __async(this, null, function* () {
      const bodySchema = import_zod8.z.object({
        commentTwoId: import_zod8.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.post("/arrowUpPostOne", (req) => __async(this, null, function* () {
      const bodySchema = import_zod8.z.object({
        artigoId: import_zod8.z.string()
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
      } catch (error2) {
        console.log(error2);
      }
    }));
    app2.get("/ListcommentOneComu/:id", (req, res) => __async(this, null, function* () {
      const findCommentOnezod = import_zod8.z.object({
        id: import_zod8.z.string()
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
    app2.post("/commentPost", (req, res) => __async(this, null, function* () {
      const createCommentOne = import_zod8.z.object({
        id: import_zod8.z.string(),
        sub: import_zod8.z.string(),
        comment: import_zod8.z.string()
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

// src/routes/external/linkedinAuth.ts
var import_axios2 = __toESM(require("axios"));
var import_zod9 = require("zod");
var import_node_console = __toESM(require("console"));
function linkedinAuth(app2) {
  return __async(this, null, function* () {
    app2.post("/linkedinlogin", (req) => __async(this, null, function* () {
      const bodySchemaLinkedin = import_zod9.z.object({
        code: import_zod9.z.string()
      });
      const { code } = bodySchemaLinkedin.parse(req.body);
      try {
        const accessTokenResponse = yield import_axios2.default.post(
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
          const userResponse = yield import_axios2.default.get(
            "https://api.linkedin.com/v2/userinfo",
            {
              headers: {
                Authorization: `Bearer ${access_token}`
              }
            }
          );
          const userSchema = import_zod9.z.object({
            email: import_zod9.z.string(),
            given_name: import_zod9.z.string(),
            family_name: import_zod9.z.string(),
            picture: import_zod9.z.string().url()
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
          const token = app2.jwt.sign(
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

// src/server.ts
var import_fastify_bcrypt = __toESM(require("fastify-bcrypt"));
var app = (0, import_fastify.default)();
var port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3334;
app.register(import_multipart.default);
app.register(import_static.default, {
  root: (0, import_node_path.resolve)(__dirname, "../uploads"),
  prefix: "/uploads/"
});
app.register(import_cors.default, {
  origin: true
});
app.register(import_fastify_bcrypt.default, {
  saltWorkFactor: 12
});
app.register(import_jwt.default, {
  secret: "lsdgkdsg5dsgdsghsdlg62023jooniefortoth"
});
app.get("/", (req, res) => __async(exports, null, function* () {
  console.log("hello World");
  res.send("Hello World!");
}));
app.register(Perfil);
app.register(Artigo);
app.register(Community);
app.register(newUser);
app.register(googleRegister);
app.register(githubAuth);
app.register(linkedinAuth);
app.register(uploadRoutes);
app.register(Search);
app.register(Comment);
app.listen({
  port
}).then(() => {
  console.log(`hello world in port: ${port}`);
});
