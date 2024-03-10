import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      nickname: string
      username: string
      profilePictures: string
      sub: string
    }
  }
}
