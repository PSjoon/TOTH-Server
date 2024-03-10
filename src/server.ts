import "dotenv/config"

import fastify from "fastify"
import multipart from "@fastify/multipart"
import fastatic from "@fastify/static"
import cors from "@fastify/cors"
import { Perfil } from "./routes/perfil"
import { Artigo } from "./routes/artigo"
import { Community } from "./routes/comunidade"
import { newUser } from "./routes/cadastrar"
import { githubAuth } from "./routes/external/githubAuth"
import jwt from "@fastify/jwt"
import { googleRegister } from "./routes/external/insertgoogle"
import { uploadRoutes } from "./routes/uploads"
import { resolve } from "node:path"
import { Search } from "./routes/search"
import { Comment } from "./routes/comment"
import { linkedinAuth } from "./routes/external/linkedinAuth"
import fastifyBcrypt from "fastify-bcrypt"

const app = fastify()
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3334
app.register(multipart)

app.register(fastatic, {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads/",
})

app.register(cors, {
  origin: true,
})

app.register(fastifyBcrypt, {
  saltWorkFactor: 12,
})

app.register(jwt, {
  secret: "lsdgkdsg5dsgdsghsdlg62023jooniefortoth",
})

app.register(Perfil)
app.register(Artigo)
app.register(Community)
app.register(newUser)
app.register(googleRegister)
app.register(githubAuth)
app.register(linkedinAuth)
app.register(uploadRoutes)
app.register(Search)
app.register(Comment)

app.get("/", async (req, res) => {
  console.log("Hello World")
  res.send("Hello World!")
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`hello world in port: ${port}`)
  })
