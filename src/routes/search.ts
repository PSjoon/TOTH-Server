import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function Search(app: FastifyInstance) {
  app.post('/search/:search', async (req, res) => {
    const searchSchema = z.object({
      search: z.string(),
    })

    const { search } = searchSchema.parse(req.params)

    const artigo = await prisma.artigo.findMany({
      where: {
        OR: [
          {
            text: {
              contains: search,
            },
          },
          {
            title: {
              contains: search,
            },
          },
        ],
      },
    })

    const usuario = await prisma.usuario.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            nickname: search,
          },
          {
            college: {
              has: search,
            },
          },
        ],
      },
    })

    const comunidades = await prisma.comunidade.findMany({
      where: {
        OR: [
          {
            comuName: {
              contains: search,
            },
          },
        ],
      },
    })

    if (usuario.length >= 1) {
      res.send({ usuario: usuario })
    }

    if (artigo.length >= 1) {
      res.send({ artigo: artigo })
    }

    if (comunidades.length >= 1) {
      res.send({ comunidades: comunidades })
    }
  })
}
