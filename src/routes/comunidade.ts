import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import email from 'next-auth/providers/email'

export async function Community(app: FastifyInstance) {
  app.get('/comunidade', async (req) => {
    const comunidade = await prisma.comunidade.findMany({
      orderBy: {
        id: 'asc',
      },
    })

    const artigoData = await Promise.all(
      comunidade.map(async (comunidade) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: comunidade.by,
          },
        })

        return {
          id: comunidade.id,
          by: comunidade.by,
          photo: comunidade.photo,
          isPublic: comunidade.isPublic,
          comuName: comunidade.comuName,
          description: comunidade.description,

          profilePictures: usuario?.profilePictures,
          username: usuario?.username,
          email: usuario?.email,
        }
      }),
    )

    return artigoData
  })

  app.post('/comunidade/criar', async (req) => {
    const bodySchema = z.object({
      by: z.string(),
      photo: z.string(),
      isPublic: z.boolean(),
      comuName: z.string(),
      description: z.string(),
    })

    const { photo, isPublic, comuName, description, by } = bodySchema.parse(
      req.body,
    )

    try {
      const createComunity = await prisma.comunidade.create({
        data: {
          by,
          photo,
          isPublic,
          comuName,
          description,
        },
      })
      const addComuToProfile = await prisma.usuario.update({
        where: {
          id: by,
        },
        data: {
          communityMember: {
            push: createComunity.id,
          },
        },
      })

      return createComunity
    } catch (error) {
      console.log(error)
    }
  })

  app.get('/comunidade/:id', async (req) => {
    const subSchema = z.object({
      id: z.string(),
    })

    const { id } = subSchema.parse(req.params)
    console.log(id)

    const communityFind = await prisma.comunidade.findUniqueOrThrow({
      where: {
        id: id,
      },
    })

    return communityFind
  })

  app.post(`/post/:communityId`, async (req) => {
    const createArticleSchema = z.object({
      by: z.string(),
      message: z.string(),
    })

    const createArticleSchemaParams = z.object({
      communityId: z.string(),
    })

    const { by, message } = createArticleSchema.parse(req.body)

    const { communityId } = createArticleSchemaParams.parse(req.params)

    console.log(by)
    console.log(message)
    console.log(communityId)

    const dataAtual = new Date()
    const data = dataAtual.toISOString()

    const createPost = await prisma.post.create({
      data: {
        by: by,
        message: message,
        dateCreated: data,
        communityId: communityId,
        strike: 0,
        reaction: 0,
      },
    })

    return createPost
  })

  app.get('/post/:communityId', async (req) => {
    const createArticleSchemaParams = z.object({
      communityId: z.string(),
    })

    const { communityId } = createArticleSchemaParams.parse(req.params)

    // console.log(communityId)

    const postUse = await prisma.post.findMany({
      where: {
        communityId: communityId,
      },
      orderBy: {
        id: 'asc',
      },
    })

    const postData = await Promise.all(
      postUse.map(async (post) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: post.by,
          },
        })

        return {
          id: post.id,
          dateCreated: post.dateCreated,
          message: post.message,
          reaction: post.reaction,
          by: usuario?.id,
          username: usuario?.username,
          profilePictures: usuario?.profilePictures,
          college: usuario?.college,
        }
      }),
    )
    return postData
  })

  app.get('/user/:by', async (req) => {
    const createArticleSchemaParams = z.object({
      by: z.string(),
    })

    const { by } = createArticleSchemaParams.parse(req.params)

    const comuUser = await prisma.usuario.findUnique({
      where: {
        id: by,
      },
      select: {
        communityMember: true,
      },
    })

    console.log(comuUser?.communityMember)

    if (comuUser) {
      const queryComu = await prisma.comunidade.findMany({})

      return queryComu
    }
  })

  app.post('/arrowUpPost', async (req) => {
    const bodySchema = z.object({
      artigoId: z.string(),
    })

    const { artigoId } = bodySchema.parse(req.body)

    try {
      const findReaction = await prisma.post.findUniqueOrThrow({
        where: {
          id: artigoId,
        },
      })

      const createReaction = await prisma.post.update({
        where: {
          id: artigoId,
        },
        data: {
          reaction: findReaction.reaction + 1,
        },
      })

      return createReaction.reaction
    } catch (error) {
      console.log(error)
    }
  })

  app.put('/communty/:id', async (req, res) => {
    const bySchema = z.object({
      id: z.string(),
    })

    const userSchema = z.object({
      comuName: z.string(),
      description: z.string(),
      isPublic: z.boolean(),
      photo: z.string(),
    })

    const { id } = bySchema.parse(req.params)

    const { comuName, description, isPublic, photo } = userSchema.parse(
      req.body,
    )

    const updateCommunity = await prisma.comunidade.update({
      where: {
        id: id,
      },
      data: {
        comuName,
        description,
        isPublic,
        photo,
      },
    })
  })

  app.post('/addmembers/:id', async (req) => {
    const bySchema = z.object({
      id: z.string(),
    })

    const bodySchema = z.object({
      members: z.string(),
    })

    const { id } = bySchema.parse(req.params)

    const { members } = bodySchema.parse(req.body)

    console.log(id)
    console.log(members)

    const updateCommunity = await prisma.usuario.update({
      where: {
        email: members,
      },
      data: {
        communityMember: {
          push: id,
        },
      },
    })
  })

  app.get('/userCommunity/:id', async (req) => {
    const createArticleSchemaParams = z.object({
      id: z.string(),
    })

    const { id } = createArticleSchemaParams.parse(req.params)

    const communityUse = await prisma.usuario.findMany({
      where: {
        communityMember: {
          has: id,
        },
      },
    })

    return communityUse
  })

  app.post('/userCommunityCheck/:id', async (req, res) => {
    const createArticleSchemaParams = z.object({
      id: z.string(),
    })

    const checkUser = z.object({
      sub: z.string(),
    })

    const { id } = createArticleSchemaParams.parse(req.params)
    const { sub } = checkUser.parse(req.body)

    const communityUse = await prisma.usuario.findUnique({
      where: {
        id: sub,
      },
      select: {
        communityMember: true,
      },
    })

    return communityUse?.communityMember
  })

  app.post('/follwoComu/:id', async (req, res) => {
    const createArticleSchemaParams = z.object({
      id: z.string(),
    })

    const addUser = z.object({
      sub: z.string(),
    })

    const { id } = createArticleSchemaParams.parse(req.params)
    const { sub } = addUser.parse(req.body)

    console.log(id)
    console.log(sub)

    const checkFollow = await prisma.usuario.findUnique({
      where: {
        id: sub,
      },
      select: {
        communityMember: true,
      },
    })

    if (!checkFollow?.communityMember.includes(id)) {
      const followUser = await prisma.usuario.update({
        where: {
          id: sub,
        },
        data: {
          communityMember: {
            push: id,
          },
        },
      })
      res.status(201)
      return followUser
    }

    const updateUserFollow = checkFollow.communityMember.filter(
      (communityMember) => communityMember !== id,
    )

    const deleteFollow = await prisma.usuario.update({
      where: {
        id: sub,
      },
      data: {
        communityMember: {
          set: updateUserFollow,
        },
      },
    })

    res.status(202)
    return deleteFollow
  })
}
