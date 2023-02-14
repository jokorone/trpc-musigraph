import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { Prettify } from '@utils/dev';
import { t } from 'server/trpc/trpc';

import prisma from '../../server/db/prisma';

/**
 * Default selector for User.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  // photo: true,
  // verified: true,
  // password: true,
  // role: true,
  // createdAt: true,
  // updatedAt: true,
  // provider: true,
});

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  // any query that uses this middleware will throw
  // an error unless there is a current session
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next();
});

// you can create a named procedure that uses a middleware
// (as is done here),
// or just use the middleware inline in the router like:
// `someProcedure: t.procedure.use(someMiddleware).query()
const authedProcedure = t.procedure.use(authMiddleware);

export const graphRouter = t.router({
  getGraph: authedProcedure.query(async () => {
    type Meta = any;
    type GraphNode<T> = { id: T };
    type GraphLink<T> = [T, T, Meta];

    type Graph<T> = {
      nodes: Array<GraphNode<T>>;
      links: Array<GraphLink<GraphNode<T>['id']>>;
    };

    const graph: Graph<string> = {
      nodes: [{ id: '1' }, { id: '2' }, { id: '3' }],
      links: [
        ['1', '2', null],
        ['2', '3', null],
        ['3', '1', null],
      ],
    };

    return graph;
  }),
});
