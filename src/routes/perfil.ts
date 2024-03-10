import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import { error } from 'node:console'

export async function Perfil(app: FastifyInstance) {
  // app.addHook('preHandler', async (req) => {
  //   await req.jwtVerify()
  // })

  app.get('/perfil/:by', async (req, res) => {
    const userSchema = z.object({
      by: z.string(),
    })

    const { by } = userSchema.parse(req.params)

    const user = await prisma.usuario.findUniqueOrThrow({
      where: {
        id: by,
      },
    })

    return user
  })

  app.get('/perfil', async (req) => {
    const user = await prisma.artigo.findMany({
      where: {
        by: req.user.sub,
      },
    })

    console.log(user)
    return user
  })

  app.put('/perfil/:by', async (req, res) => {
    const bySchema = z.object({
      by: z.string(),
    })

    const userSchema = z.object({
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
      linkedin: z.string(),
      github: z.string(),
      lattes: z.string(),
      profilePictures: z.string(),
    })

    const { username, email, linkedin, github, lattes, profilePictures } =
      userSchema.parse(req.body)

    const { by } = bySchema.parse(req.params)

    const updateUser = await prisma.usuario.update({
      where: {
        id: by,
      },
      data: {
        email,
        username,
        linkedin,
        github,
        lattes,
        profilePictures,
      },
    })

    const token = app.jwt.sign(
      {
        username: updateUser.username,
        profilePictures: updateUser.profilePictures,
        college: updateUser.college,
      },
      {
        sub: updateUser.id,
        expiresIn: '30 days',
      },
    )

    res.send({ token: token })
  })

  app.post('/perfil/:sub', async (req, res) => {
    const subSchema = z.object({
      sub: z.string(),
    })
    const userSchema = z.object({
      user: z.string(),
    })

    const { user } = userSchema.parse(req.body)
    const { sub } = subSchema.parse(req.params)

    const checkFollow = await prisma.usuario.findUnique({
      where: {
        id: sub,
      },
      select: {
        seguidores: true,
      },
    })

    if (!checkFollow?.seguidores.includes(user)) {
      const followUser = await prisma.usuario.update({
        where: {
          id: sub,
        },
        data: {
          seguidores: {
            push: user,
          },
        },
      })
      res.status(201)
      return followUser
    }

    const updateUserFollow = checkFollow.seguidores.filter(
      (seguidores) => seguidores !== user,
    )

    const deleteFollow = await prisma.usuario.update({
      where: {
        id: sub,
      },
      data: {
        seguidores: {
          set: updateUserFollow,
        },
      },
    })

    res.status(202)
    return deleteFollow
  })

  app.post('/perfil/follow/:sub', async (req) => {
    const subSchema = z.object({
      sub: z.string(),
    })

    const { sub } = subSchema.parse(req.params)

    const getfollow = await prisma.usuario.findUnique({
      where: {
        id: sub,
      },
      select: {
        seguidores: true,
      },
    })

    return getfollow?.seguidores
  })

  app.post('/college/:by', async (req, res) => {
    const bodySchema = z.object({
      college: z
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
    })

    const subSchema = z.object({
      by: z.string(),
    })

    const { college } = bodySchema.parse(req.body)
    const { by } = subSchema.parse(req.params)

    const updateCollege = await prisma.usuario.findUnique({
      where: {
        id: by,
      },
      select: {
        college: true,
      },
    })

    if (!updateCollege?.college.includes(college)) {
      if (updateCollege?.college[0] == '') {
        const splice = updateCollege?.college.splice(0, 1)
        console.log(splice)
        console.log(1)

        await prisma.usuario.update({
          where: {
            id: by,
          },
          data: {
            college: {
              set: updateCollege?.college,
            },
          },
        })
      }

      const followUser = await prisma.usuario.update({
        where: {
          id: by,
        },
        data: {
          college: {
            push: college,
          },
        },
      })
      res.status(201)
      return followUser
    }
  })

  app.get('/college/:by', async (req, res) => {
    const subSchema = z.object({
      by: z.string(),
    })

    const { by } = subSchema.parse(req.params)

    const updateCollege = await prisma.usuario.findMany({
      where: {
        id: by,
      },
      select: {
        college: true,
      },
    })

    return updateCollege
  })

  app.post('/college/modify/:by', async (req, res) => {
    const subSchema = z.object({
      by: z.string(),
    })

    const bodySchema = z.object({
      state: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          chosen: z.boolean(),
        }),
      ),
    })

    const { by } = subSchema.parse(req.params)
    const { state } = bodySchema.parse(req.body)

    if (state.length == 0) {
      return
    }

    const updateCollege = await prisma.usuario.update({
      where: {
        id: by,
      },
      data: {
        college: {
          set: state.map((item) => item.name),
        },
      },
      select: {
        college: true,
      },
    })

    return updateCollege
  })

  app.post('/notify/:sub', async (req, res) => {
    const paramsSchema = z.object({
      sub: z.string(),
    })
    const bodySchema = z.object({
      email: z.boolean(),
      promo: z.boolean(),
      like: z.boolean(),
      follow: z.boolean(),
      post: z.boolean(),
    })

    const { sub } = paramsSchema.parse(req.params)

    const { email, promo, like, follow, post } = bodySchema.parse(req.body)

    const notifyUserUpdate = await prisma.usuario.update({
      where: {
        id: sub,
      },
      data: {
        emailNotify: email,
        promoNotify: promo,
        likeNotify: like,
        followNotify: follow,
        postNotify: post,
      },
    })

    res.send({
      emailNotify: notifyUserUpdate?.emailNotify,
      promoNotify: notifyUserUpdate?.promoNotify,
      likeNotify: notifyUserUpdate?.likeNotify,
      followNotify: notifyUserUpdate?.followNotify,
      postNotify: notifyUserUpdate?.postNotify,
    })
  })

  app.get('/notifyget/:sub', async (req, res) => {
    const subSchema = z.object({
      sub: z.string(),
    })

    const { sub } = subSchema.parse(req.params)

    const notifyUser = await prisma.usuario.findUnique({
      where: {
        id: sub,
      },
      select: {
        emailNotify: true,
        promoNotify: true,
        likeNotify: true,
        followNotify: true,
        postNotify: true,
      },
    })

    res.send({
      emailNotify: notifyUser?.emailNotify,
      promoNotify: notifyUser?.promoNotify,
      likeNotify: notifyUser?.likeNotify,
      followNotify: notifyUser?.followNotify,
      postNotify: notifyUser?.postNotify,
    })
  })

  app.delete('/perfil/:sub', async (req, res) => {
    const paramsSchema = z.object({
      sub: z.string(),
    })

    const { sub } = paramsSchema.parse(req.params)

    const findCommmentTwo = await prisma.commentTwo.findMany({
      where: {
        by: sub,
      },
    })

    if (findCommmentTwo) {
      const findCommmentTwoData = await Promise.all(
        findCommmentTwo.map(async (artigo) => {
          const usuario = await prisma.artigo.delete({
            where: {
              id: artigo.id,
            },
          })
        }),
      )
    }

    const findCommmentOne = await prisma.commentOne.findMany({
      where: {
        by: sub,
      },
    })

    const findCommmentOneData = await Promise.all(
      findCommmentOne.map(async (artigo) => {
        const usuario = await prisma.artigo.delete({
          where: {
            id: artigo.id,
          },
        })
      }),
    )

    const findArticle = await prisma.artigo.findMany({
      where: {
        by: sub,
      },
    })

    const artigoDelData = await Promise.all(
      findArticle.map(async (artigo) => {
        const usuario = await prisma.artigo.delete({
          where: {
            id: artigo.id,
          },
        })
      }),
    )

    const findCommunityPostTwo = await prisma.postTwo.findMany({
      where: {
        by: sub,
      },
    })

    const findCommunityPostTwoData = await Promise.all(
      findCommunityPostTwo.map(async (artigo) => {
        const usuario = await prisma.artigo.delete({
          where: {
            id: artigo.id,
          },
        })
      }),
    )

    const findCommunityPostOne = await prisma.postOne.findMany({
      where: {
        by: sub,
      },
    })

    const findCommunityPostOneData = await Promise.all(
      findCommunityPostOne.map(async (artigo) => {
        const usuario = await prisma.artigo.delete({
          where: {
            id: artigo.id,
          },
        })
      }),
    )

    const findCommunityPost = await prisma.post.findMany({
      where: {
        by: sub,
      },
    })

    const findCommunityPostData = await Promise.all(
      findCommunityPost.map(async (artigo) => {
        const usuario = await prisma.artigo.delete({
          where: {
            id: artigo.id,
          },
        })
      }),
    )

    const findCommunity = await prisma.comunidade.findMany({
      where: {
        by: sub,
      },
    })

    const findCommunityData = await Promise.all(
      findCommunity.map(async (artigo) => {
        const usuario = await prisma.artigo.delete({
          where: {
            id: artigo.id,
          },
        })
      }),
    )

    await prisma.usuario.delete({
      where: {
        id: sub,
      },
    })
  })

  app.get('/showfollow/:sub', async (req, res) => {
    const subSchema = z.object({
      sub: z.string(),
    })

    const { sub } = subSchema.parse(req.params)

    console.log(sub)

    const findFollow = await prisma.usuario.findMany({
      where: {
        seguidores: {
          has: sub,
        },
      },
    })

    return findFollow
  })

  app.post('/password/:sub', async (req, res) => {
    const subSchema = z.object({
      sub: z.string(),
    })

    const bodySchema = z.object({
      password: z.string(),
    })

    const { sub } = subSchema.parse(req.params)
    const { password } = bodySchema.parse(req.body)

    console.log(sub)
    console.log(password)

    const hashPassword = await app.bcrypt.hash(password)

    const newPassword = await prisma.usuario.update({
      where: {
        id: sub,
      },
      data: {
        password: hashPassword,
      },
    })
  })

  app.post('/passwordForgot/:sub', async (req, res) => {
    const subSchema = z.object({
      sub: z.string(),
    })

    const bodySchema = z.object({
      password: z.string(),
    })

    const { sub } = subSchema.parse(req.params)
    const { password } = bodySchema.parse(req.body)

    console.log(sub)
    console.log(password)

    const hashPassword = await app.bcrypt.hash(password)

    try {
      const newPassword = await prisma.usuario.update({
        where: {
          email: sub,
        },
        data: {
          password: hashPassword,
        },
      })
    } catch (error) {
      console.log(error)
    }
  })
}
