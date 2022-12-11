import 'reflect-metadata'
import { createYoga } from 'graphql-yoga'
import fastify, {
  FastifyReply,
  FastifyRequest,
  RouteHandlerMethod,
} from 'fastify'
import { useGraphQLModules } from '@envelop/graphql-modules'
import { Scope, createApplication } from 'graphql-modules'
import { basicModule } from './modules/basic'
import { HStorage } from './storage'

function test() {
  const storage: HStorage = {
    hello() {
      return 'hello'
    },
  }
  return storage
}


export function createGraphQLApp() {
  const storage = test()
  return createApplication({
    modules: [basicModule],
    providers: [
      {
        provide: HStorage,
        useValue: storage,
        scope: Scope.Singleton,
      },
    ],
  })
}

export function createGraphQLHandler(): RouteHandlerMethod {
  const graphQLServer = createYoga<{
    req: FastifyRequest
    reply: FastifyReply
  }>({
    logging: false,
    plugins: [useGraphQLModules(createGraphQLApp())],
  })

  return async (req, reply) => {
    const response = await graphQLServer.handleNodeRequest(req, {
      req,
      reply,
    })
    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })

    reply.status(response.status)

    reply.send(response.body)

    return reply
  }
}

export function buildApp() {
  const app = fastify({ logger: false })

  app.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: createGraphQLHandler(),
  })

  return app
}
