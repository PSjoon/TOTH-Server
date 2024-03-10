import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function githubAuth(app: FastifyInstance) {
  app.post('/githublogin', async (req) => {
    const bodySchemaGitHub = z.object({
      code: z.string(),
    })
    const { code } = bodySchemaGitHub.parse(req.body)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
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
          profilePictures: userInfo.avatar_url,
          username: userInfo.name,
          nickname: userInfo.login,

          email: '',
          emailNotify: false,
          promoNotify: false,
          likeNotify: false,
          followNotify: false,
          postNotify: false,
          password: '',
          college: [''],
          communityMember: [''],
          lattes: '',
          linkedin: '',
          savedPosts: [''],
          seguidores: [''],
        },
      })
    }

    const token = app.jwt.sign(
      {
        nickname: userGithub.nickname,
        usernae: userGithub.username,
        profilePictures: userGithub.profilePictures,
      },
      {
        sub: userGithub.id,
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
