import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z, map } from 'zod'

export async function Artigo(app: FastifyInstance) {
  app.get('/artigo', async (req) => {
    const artigo = await prisma.artigo.findMany({
      orderBy: {
        dateCreated: 'desc',
      },
    })

    const artigoData = await Promise.all(
      artigo.map(async (artigo) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: artigo.by,
          },
        })

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

          profilePictures: usuario?.profilePictures,
          username: usuario?.username,
          college: usuario?.college,
          email: usuario?.email,
          savedPosts: usuario?.savedPosts,
        }
      }),
    )

    return artigoData
  })

  app.get('/artigoale', async (req) => {
    const artigo = await prisma.artigo.findMany({
      orderBy: {
        reaction: 'asc',
      },
    })

    const artigoData = await Promise.all(
      artigo.map(async (artigo) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: artigo.by,
          },
        })

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

          profilePictures: usuario?.profilePictures,
          username: usuario?.username,
          college: usuario?.college,
          email: usuario?.email,
          savedPosts: usuario?.savedPosts,
        }
      }),
    )

    return artigoData
  })

  app.get('/artigo/:by', async (req, res) => {
    const paramSchema = z.object({
      by: z.string(),
    })

    const { by } = paramSchema.parse(req.params)

    const artigoUser = await prisma.artigo.findMany({
      where: {
        by: by,
      },
      orderBy: {
        dateCreated: 'asc',
      },
    })

    const artigoData = await Promise.all(
      artigoUser.map(async (artigo) => {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: artigo.by,
          },
        })

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
          profilePictures: usuario?.profilePictures,
          username: usuario?.username,
          college: usuario?.college,
          email: usuario?.email,
          savedPosts: usuario?.savedPosts,
        }
      }),
    )

    return artigoData
  })

  app.get('/artigoSave/:by', async (req, res) => {
    const paramSchema = z.object({
      by: z.string(),
    })

    const { by } = paramSchema.parse(req.params)

    const User = await prisma.usuario.findUnique({
      where: {
        id: by,
      },
      select: {
        savedPosts: true,
      },
    })

    const user = User?.savedPosts.slice(1)

    console.log(user)

    if (user) {
      try {
        const artigoUser = await prisma.artigo.findMany({
          where: {
            id: {
              in: user,
            },
          },
        })

        const artigoData = await Promise.all(
          artigoUser.map(async (artigo) => {
            const artigoFind = await prisma.usuario.findUnique({
              where: {
                id: artigo.by,
              },
            })

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
              profilePictures: artigoFind?.profilePictures,
              username: artigoFind?.username,
              college: artigoFind?.college,
              email: artigoFind?.email,
              savedPosts: artigoFind?.savedPosts,
            }
          }),
        )
        return artigoData
      } catch (error) {
        console.log(error)
      }
    }
  })

  app.get('/artigo/visualizar/:id', async (req, rep) => {
    const paramSchema = z.object({
      id: z.string(),
    })

    const { id } = paramSchema.parse(req.params)

    const showArticle = await prisma.artigo.findUniqueOrThrow({
      where: {
        id: id,
      },
    })

    const showUser = await prisma.usuario.findUniqueOrThrow({
      where: {
        id: showArticle.by,
      },
    })

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
      savedPosts: showUser.savedPosts,
    }
  })

  app.post('/artigo/criar', async (req) => {
    const createArticleSchema = z.object({
      title: z.string(),
      text: z.string(),
      photo: z.string(),
      by: z.string(),
      scielo: z.string(),
      file: z.string(),
    })

    const { title, text, photo, by, scielo, file } = createArticleSchema.parse(
      req.body,
    )

    const dataAtual = new Date()
    const data = dataAtual.toISOString()

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          {
            email: by,
          },
          {
            id: by,
          },
        ],
      },
      select: {
        id: true,
      },
    })

    if (usuario) {
      const userId = usuario.id
      console.log(userId)

      try {
        const createArticle = await prisma.artigo.create({
          data: {
            title,
            text,
            photo,

            strike: 0,
            by: userId,
            dateCreated: data,
            reaction: 0,
            scielo: scielo,
            file: file,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
  })

  app.post('/arrowUp', async (req) => {
    const bodySchema = z.object({
      artigoId: z.string(),
    })

    const { artigoId } = bodySchema.parse(req.body)

    try {
      const findReaction = await prisma.artigo.findUniqueOrThrow({
        where: {
          id: artigoId,
        },
      })

      const createReaction = await prisma.artigo.update({
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

  app.post('/savePost', async (req, res) => {
    const bodySchema = z.object({
      sub: z.string(),
      artigoId: z.string(),
    })

    const { sub, artigoId } = bodySchema.parse(req.body)

    try {
      const checkArticle = await prisma.usuario.findUnique({
        where: {
          id: sub,
        },
        select: {
          savedPosts: true,
        },
      })

      if (!checkArticle?.savedPosts.includes(artigoId)) {
        const followUser = await prisma.usuario.update({
          where: {
            id: sub,
          },
          data: {
            savedPosts: {
              push: artigoId,
            },
          },
        })
        res.status(201)
        return followUser
      }

      const updateArticleSave = checkArticle.savedPosts.filter(
        (SavePost) => SavePost !== artigoId,
      )

      const deleteSaveArticle = await prisma.usuario.update({
        where: {
          id: sub,
        },
        data: {
          savedPosts: {
            set: updateArticleSave,
          },
        },
      })

      res.status(202)
      return deleteSaveArticle
    } catch (error) {
      console.log(error)
    }
  })

  app.post('/strike', async (req, res) => {
    const bodySchema = z.object({
      idArticle: z.string(),
    })

    const { idArticle } = bodySchema.parse(req.body)

    console.log(idArticle)

    try {
      const findStrikeArticle = await prisma.artigo.findUniqueOrThrow({
        where: {
          id: idArticle,
        },
      })

      if (findStrikeArticle) {
        const createStrike = await prisma.artigo.update({
          where: {
            id: idArticle,
          },
          data: {
            strike: findStrikeArticle.strike + 1,
          },
        })

        if (createStrike.strike == 8) {
          await prisma.artigo.delete({
            where: {
              id: idArticle,
            },
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
    try {
      const findStrikePost = await prisma.post.findUniqueOrThrow({
        where: {
          id: idArticle,
        },
      })

      if (findStrikePost) {
        try {
          const createStrike = await prisma.post.update({
            where: {
              id: idArticle,
            },
            data: {
              strike: findStrikePost.strike + 1,
            },
          })

          if (createStrike.strike == 8) {
            await prisma.post.delete({
              where: {
                id: idArticle,
              },
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const findStrikePostOne = await prisma.postOne.findUniqueOrThrow({
        where: {
          id: idArticle,
        },
      })

      if (findStrikePostOne) {
        const createStrike = await prisma.postOne.update({
          where: {
            id: idArticle,
          },
          data: {
            strike: findStrikePostOne.strike + 1,
          },
        })

        if (createStrike.strike == 8) {
          await prisma.postOne.delete({
            where: {
              id: idArticle,
            },
          })
        }
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const findStrikeComentOne = await prisma.commentOne.findUniqueOrThrow({
        where: {
          id: idArticle,
        },
      })

      console.log(findStrikeComentOne)
      console.log(1)

      if (findStrikeComentOne) {
        const createStrike = await prisma.commentOne.update({
          where: {
            id: idArticle,
          },
          data: {
            strike: findStrikeComentOne.strike + 1,
          },
        })

        if (createStrike.strike == 8) {
          await prisma.commentOne.delete({
            where: {
              id: idArticle,
            },
          })
        }
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const findStrikeComentTwo = await prisma.commentTwo.findUniqueOrThrow({
        where: {
          id: idArticle,
        },
      })

      if (findStrikeComentTwo) {
        const createStrike = await prisma.commentTwo.update({
          where: {
            id: idArticle,
          },
          data: {
            strike: findStrikeComentTwo.strike + 1,
          },
        })

        if (createStrike.strike == 8) {
          await prisma.commentTwo.delete({
            where: {
              id: idArticle,
            },
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  })
}
