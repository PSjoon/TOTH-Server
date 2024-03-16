import { z } from "zod"
import { prisma } from "./lib/prisma"
import { Express } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { comparePassword, encryptPassword, secret } from "."
import { log } from "console"

export async function newUser(app: Express) {
  app.post("/cadastrar", async (req, res) => {
    const newUserSchema = z.object({
      email: z.string(),
      username: z
        .string()
        .toLowerCase()
        .transform((name) => {
          return name
            .trim()
            .split(" ")
            .map((word) => {
              return word[0].toLocaleUpperCase().concat(word.substring(1))
            })
            .join(" ")
        }),
      nickname: z.string(),
      password: z.string(),
    })

    const { username, nickname, email, password } = newUserSchema.parse(
      req.body
    )
    const hashPassword = await encryptPassword(password)

    let isLog = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    })
    if (isLog) {
      res.sendStatus(405)
      return
    }

    isLog = await prisma.usuario.create({
      data: {
        username,
        nickname,
        email,
        password: hashPassword,

        college: [""],
        github: "",
        githubId: 0,
        lattes: "",
        linkedin: "",
        profilePicture: "http://localhost:3334/uploads/User2.svg",
        savedPosts: [""],
        seguidores: [""],
      },
    })

    const token = jwt.sign(
      {
        username: isLog.username,
        nickname: isLog.nickname,
        profilePictures: isLog.profilePicture,
      },
      secret,
      {
        subject: isLog.id,
        expiresIn: "30 days",
      }
    )
    console.log(token)
    res.send({ token: token })
  })

  app.post("/logar", async (req, res) => {
    const logUserSchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = logUserSchema.parse(req.body)

    try {
      const isRegister = await prisma.usuario.findUnique({
        where: {
          email: email,
        },
      })

      if (isRegister) {
        if (!(await comparePassword(password, isRegister.password))) {
          res.status(403)
        }
      } else {
        res.status(404)
      }

      if (isRegister) {
        const token = jwt.sign(
          {
            username: isRegister.username,
            nickname: isRegister.nickname,
            profilePictures: isRegister.profilePicture,
          },
          secret,
          {
            subject: isRegister.id,
            expiresIn: "30 days",
          }
        )
        res.send({ token: token, user: isRegister })
      }
    } catch {
      res.status(301)
      return
    }
  })
}
