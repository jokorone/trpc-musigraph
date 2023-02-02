import { signIn, signOut } from 'next-auth/react';
import { trpc } from 'utils/trpc';

export default function Login() {
  const session = trpc.authRouter.getSession.useQuery().data;
  const secretCode = trpc.authRouter.getSecretCode.useQuery().data;
  const userCount = trpc.authRouter.getUserCount.useQuery().data;

  return (
    <div className="auth-wall">
      <div className="my-1 py-2">
        <h3 className="text-xl">
          Server side session check with tRPC&apos;s context
        </h3>
        {session ? (
          <>
            Signed in as {session?.user?.email} <br />
          </>
        ) : (
          <>
            Not signed in <br />
          </>
        )}
      </div>

      <div className="flex items-center">
        <button
          className="btn"
          onClick={
            session
              ? () => {
                  signOut();
                }
              : () => {
                  signIn();
                }
          }
        >
          {session ? 'Sign Out' : 'Sign In'}
        </button>
        <p className="ml-1">(Any credentials work)</p>
      </div>
      <div>
        <p className="m-2 text-xl">UserCount: {userCount}</p>
      </div>
    </div>
  );
}

export function ServerSideSessionCheck() {
  const query = trpc.authRouter.getSession.useQuery(undefined, {
    suspense: true,
  });

  const session = query.data;

  return (
    <div className="my-1 py-2">
      <h3 className="text-xl">
        Server side session check with tRPC&apos;s context
      </h3>
      {session ? (
        <>
          Signed in as {session?.user?.email} <br />
        </>
      ) : (
        <>
          Not signed in <br />
        </>
      )}
    </div>
  );
}

export function MiddlewareQuery() {
  const query = trpc.authRouter.getSecretCode.useQuery();

  const secretCode = query.data;
  return (
    <div className="my-1">
      <h3 className="text-xl">
        Server side middleware session check with tRPC&apos;s context
      </h3>
      {secretCode ? (
        <>
          You&apos;re logged in. The secret code from the server is: &quot;
          {secretCode}&quot;
          <br />
        </>
      ) : (
        <>
          Not signed in, no code from the server, a 401 response and an error is
          raised. <br />
        </>
      )}
    </div>
  );
}

export function SignInButton() {
  const query = trpc.authRouter.getSession.useQuery(undefined, {
    suspense: true,
  });

  const session = query.data;

  return (
    <div className="flex items-center">
      <button
        className="btn"
        onClick={
          session
            ? () => {
                signOut();
              }
            : () => {
                signIn();
              }
        }
      >
        {session ? 'Sign Out' : 'Sign In'}
      </button>
      <p className="ml-1">(Any credentials work)</p>
    </div>
  );
}
