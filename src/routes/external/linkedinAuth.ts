import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import console, { error } from 'node:console'

export async function linkedinAuth(app: FastifyInstance) {
  app.post('/linkedinlogin', async (req) => {
    const bodySchemaLinkedin = z.object({
      code: z.string(),
    })
    const { code } = bodySchemaLinkedin.parse(req.body)

    try {
      const accessTokenResponse = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.REDIRECT_URI,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          },
          headers: {
            Accept: 'application/json',
          },
        },
      )

      const { access_token } = accessTokenResponse.data

      try {
        const userResponse = await axios.get(
          'https://api.linkedin.com/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        )

        const userSchema = z.object({
          email: z.string(),
          given_name: z.string(),
          family_name: z.string(),
          picture: z.string().url(),
        })

        const userInfo = userSchema.parse(userResponse.data)

        let userLinkedin = await prisma.usuario.findUnique({
          where: {
            email: userInfo.email,
          },
        })

        const name = `${userInfo.given_name} ${userInfo.family_name}`

        if (!userLinkedin) {
          userLinkedin = await prisma.usuario.create({
            data: {
              email: userInfo.email,
              profilePictures: userInfo.picture,
              username: name,
              nickname: userInfo.given_name,

              githubId: 0,
              emailNotify: false,
              promoNotify: false,
              likeNotify: false,
              followNotify: false,
              postNotify: false,
              github: '',
              password: '',
              college: [''],
              linkedin: '',
              communityMember: [''],
              lattes: '',
              savedPosts: [''],
              seguidores: [''],
            },
          })
        }

        const token = app.jwt.sign(
          {
            nickname: userLinkedin.username,
            profilePictures: userLinkedin.profilePictures,
          },
          {
            sub: userLinkedin.id,
            expiresIn: '30 days',
          },
        )

        return {
          token,
        }
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  })
}
