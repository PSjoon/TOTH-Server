import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function googleRegister(app: FastifyInstance) {
  app.post('/insertgoogle', async (req, res) => {
    const googleSchema = z.object({
      email: z.string(),
      profilePictures: z.string(),
      name: z.string(),
    })
    const { email, name, profilePictures } = googleSchema.parse(req.body)

    let userGoogle = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    })

    if (!userGoogle) {
      userGoogle = await prisma.usuario.create({
        data: {
          username: name,
          email: email,
          profilePictures: profilePictures,

          password: '',
          nickname: '',
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
          savedPosts: [''],
          seguidores: [''],
        },
      })
    }

    const token = app.jwt.sign(
      {
        username: userGoogle.username,
        profilePictures: userGoogle.profilePictures,
      },
      {
        sub: userGoogle.id,
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
