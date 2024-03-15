import axios from "axios"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { Express } from "express"
import jwt from "jsonwebtoken"
import { secret } from "../index"

export async function githubAuth(app: Express) {
  app.post("/githubauth", async (req, res) => {
    const bodySchemaGitHub = z.object({
      code: z.string(),
    })
    const { code } = bodySchemaGitHub.parse(req.body)

    console.log(code)

    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    )
    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let userGithub = await prisma.usuario.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    if (!userGithub) {
      userGithub = await prisma.usuario.create({
        data: {
          githubId: userInfo.id,
          github: `https://github.com/${userInfo.login}`,
          profilePicture: userInfo.avatar_url,
          username: userInfo.name,
          nickname: userInfo.login,
          email: "",
          password: "",
          college: [""],
          lattes: "",
          linkedin: "",
          savedPosts: [""],
          seguidores: [""],
        },
      })
    }

    try {
      const token = jwt.sign(
        {
          nickname: userGithub.nickname,
          username: userGithub.username,
          profilePictures: userGithub.profilePicture,
        },
        secret,
        {
          subject: userGithub.id,
          expiresIn: "30 days",
        }
      )
      console.log(token)
      res.send({ token: token })
    } catch (error) {
      console.log(error)
      res.status(405)
    }
  })
}
