import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { t } from 'server/trpc/trpc';

import { prisma } from '../../server/db/prisma';

/**
 * Default selector for User.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  // id: true,
  // name: true,
  // email: true,
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

export const authRouter = t.router({
  getUserCount: authedProcedure.query(async ({ ctx }) => {
    const userCount = await prisma.user.count();
    return userCount;
  }),
  getSession: t.procedure.query(async ({ ctx }) => {
    // The session object is added to the routers context
    // in the context file server side
    console.log('session❓', ctx.session);

    return ctx.session;
  }),
  getSecretCode: authedProcedure.query(async () => {
    const secretCode = 'the cake is a lie.';
    console.log(secretCode);

    return secretCode;
  }),
});
