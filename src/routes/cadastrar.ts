import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
// import { hashPassword, comparePassword, signToken } from ''

export async function newUser(app: FastifyInstance) {
  app.post('/cadastrar', async (req, res) => {
    const newUserSchema = z.object({
      email: z.string(),
      username: z
        .string()
        .toLowerCase()
        .transform((name) => {
          return name
            .trim()
            .split(' ')
            .map((word) => {
              return word[0].toLocaleUpperCase().concat(word.substring(1))
            })
            .join(' ')
        }),
      nickname: z.string(),
      password: z.string(),
    })

    const { username, nickname, email, password } = newUserSchema.parse(
      req.body,
    )
    const hashPassword = await app.bcrypt.hash(password)

    let isLog = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    })
    if (isLog) {
      res.status(301)
      return
    }
    isLog = await prisma.usuario.create({
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

        college: [''],
        communityMember: [''],
        github: '',
        githubId: 0,
        lattes: '',
        linkedin: '',
        profilePictures: 'http://localhost:3334/uploads/User2.svg',
        savedPosts: [''],
        seguidores: [''],
      },
    })

    const token = app.jwt.sign(
      {
        username: isLog.username,
        nickname: isLog.nickname,
        profilePictures: isLog.profilePictures,
      },
      {
        sub: isLog.id,
        expiresIn: '30 days',
      },
    )

    res.send({ token: token })
  })

  app.post('/logar', async (req, res) => {
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
        if (!(await app.bcrypt.compare(password, isRegister.password))) {
          res.status(403)
        }
      } else {
        res.status(404)
      }

      if (isRegister) {
        const token = app.jwt.sign(
          {
            username: isRegister.username,
            nickname: isRegister.nickname,
            profilePictures: isRegister.profilePictures,
          },
          {
            sub: isRegister.id,
            expiresIn: '30 days',
          },
        )
        res.send({ token: token, user: isRegister })
      }
    } catch {
      res.status(301)
      return
    }
  })
}
