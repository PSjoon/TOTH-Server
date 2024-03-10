import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function Comment(app: FastifyInstance) {
  app.post('/commentOne', async (req, res) => {
    const createCommentOne = z.object({
      id: z.string(),
      sub: z.string(),
      comment: z.string(),
    })

    const { id, sub, comment } = createCommentOne.parse(req.body)

    console.log(id)
    console.log(sub)
    console.log(comment)

    const dataAtual = new Date()
    const data = dataAtual.toISOString()

    const createComment = await prisma.commentOne.create({
      data: {
        by: sub,
        message: comment,
        artigoId: id,
        dateCreated: data,
        strike: 0,

        reaction: 0,
      },
    })
  })

  app.get('/ListcommentOne/:id', async (req, res) => {
    const findCommentOnezod = z.object({
      id: z.string(),
    })

    const { id } = findCommentOnezod.parse(req.params)

    const commentOne = await prisma.commentOne.findMany({
      where: {
        artigoId: id,
      },
      orderBy: {
        dateCreated: 'desc',
      },
    })

    console.log(id)

    const findCommentOne = await Promise.all(
      commentOne.map(async (commentOne) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: commentOne.by,
          },
        })

        return {
          id: commentOne.id,
          dateCreated: commentOne.dateCreated,
          message: commentOne.message,
          reaction: commentOne.reaction,
          by: commentOne.by,

          profilePictures: usuario?.profilePictures,
          username: usuario?.username,
          college: usuario?.college,
          email: usuario?.email,
        }
      }),
    )
    return findCommentOne
  })

  app.post('/commentTwo', async (req, res) => {
    const createCommentOne = z.object({
      CommentTwoID: z.string(),
      sub: z.string(),
      comment: z.string(),
    })

    const { CommentTwoID, sub, comment } = createCommentOne.parse(req.body)

    const dataAtual = new Date()
    const data = dataAtual.toISOString()

    const createComment = await prisma.commentTwo.create({
      data: {
        by: sub,
        message: comment,
        commentId: CommentTwoID,
        dateCreated: data,
        strike: 0,

        reaction: 0,
      },
    })
  })

  app.get('/ListcommentTwo/:id', async (req, res) => {
    const findCommentOnezod = z.object({
      id: z.string(),
    })

    const { id } = findCommentOnezod.parse(req.params)

    const commentTwo = await prisma.commentTwo.findMany({
      where: {
        commentId: id,
      },
      orderBy: {
        dateCreated: 'desc',
      },
    })

    const findCommentTwo = await Promise.all(
      commentTwo.map(async (commentTwo) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: commentTwo.by,
          },
        })

        return {
          id: commentTwo.id,
          dateCreated: commentTwo.dateCreated,
          message: commentTwo.message,
          reaction: commentTwo.reaction,
          by: commentTwo.by,

          profilePictures: usuario?.profilePictures,
          username: usuario?.username,
          college: usuario?.college,
          email: usuario?.email,
        }
      }),
    )
    return findCommentTwo
  })

  app.post('/arrowUp/Comment', async (req) => {
    const bodySchema = z.object({
      commentId: z.string(),
    })

    const { commentId } = bodySchema.parse(req.body)

    try {
      const findReaction = await prisma.commentOne.findUniqueOrThrow({
        where: {
          id: commentId,
        },
      })

      const createReaction = await prisma.commentOne.update({
        where: {
          id: commentId,
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

  app.post('/arrowUp/CommentTwo', async (req) => {
    const bodySchema = z.object({
      commentId: z.string(),
    })

    const { commentId } = bodySchema.parse(req.body)

    try {
      const findReaction = await prisma.commentTwo.findUniqueOrThrow({
        where: {
          id: commentId,
        },
      })

      const createReaction = await prisma.commentTwo.update({
        where: {
          id: commentId,
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

  app.post('/arrowUp/PostComment', async (req) => {
    const bodySchema = z.object({
      commentTwoId: z.string(),
    })

    const { commentTwoId } = bodySchema.parse(req.body)

    try {
      const findReaction = await prisma.postOne.findUniqueOrThrow({
        where: {
          id: commentTwoId,
        },
      })

      const createReaction = await prisma.postOne.update({
        where: {
          id: commentTwoId,
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

  app.post('/arrowUpPostOne', async (req) => {
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

  app.get('/ListcommentOneComu/:id', async (req, res) => {
    const findCommentOnezod = z.object({
      id: z.string(),
    })

    const { id } = findCommentOnezod.parse(req.params)

    const commentOne = await prisma.postOne.findMany({
      where: {
        postId: id,
      },
      orderBy: {
        dateCreated: 'desc',
      },
    })

    console.log(id)

    const findCommentOne = await Promise.all(
      commentOne.map(async (commentOne) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: commentOne.by,
          },
        })

        return {
          id: commentOne.id,
          dateCreated: commentOne.dateCreated,
          message: commentOne.message,
          reaction: commentOne.reaction,
          by: commentOne.by,

          profilePictures: usuario?.profilePictures,
          username: usuario?.username,
          college: usuario?.college,
          email: usuario?.email,
        }
      }),
    )
    return findCommentOne
  })

  app.post('/commentPost', async (req, res) => {
    const createCommentOne = z.object({
      id: z.string(),
      sub: z.string(),
      comment: z.string(),
    })

    const { id, sub, comment } = createCommentOne.parse(req.body)

    console.log(id)
    console.log(sub)
    console.log(comment)

    const dataAtual = new Date()
    const data = dataAtual.toISOString()

    const createComment = await prisma.postOne.create({
      data: {
        by: sub,
        message: comment,
        postId: id,
        dateCreated: data,
        strike: 0,

        reaction: 0,
      },
    })

    // console.log(createCommentOne)
  })
}
