import "dotenv/config"

import fastify from "fastify"

const app = fastify()
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3334

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
