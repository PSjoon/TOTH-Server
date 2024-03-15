import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { viewArticle } from "./viewArticle"
import { githubAuth } from "./externalLogin/githubAuth"
import { Secret } from "jsonwebtoken"

const app = express()
app.use(cors())
dotenv.config({ path: "../.env" })
dotenv.config({})

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3334

export const secret: Secret = "3iku89e234iku8efgtegijostuw38325te4et24iklou890"

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

viewArticle(app)
githubAuth(app)

app.get("/", async (req, res) => {
  console.log("hello World")
  res.json("Hello World!")
})

try {
  app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
  })
} catch (error) {
  console.log(error)
}
