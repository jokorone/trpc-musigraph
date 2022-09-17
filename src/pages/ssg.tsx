import { createProxySSGHelpers } from '@trpc/react/ssg';
import { meta } from 'feature/ssg/meta';
import { InferGetStaticPropsType } from 'next';
import { createContext } from 'server/trpc/context';
import { appRouter } from 'server/trpc/routers';
import superjson from 'superjson';
import { ExamplePage } from 'utils/ExamplePage';
import { baseTRPC } from 'utils/trpc';

const trpc = baseTRPC.ssgRouter;

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { id } = props;
  const query = trpc.byId.useQuery({ id });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const post = query.data!;

  return (
    <>
      <ExamplePage {...meta}>
        <article>
          <h2 className="text-2xl font-bold">{post.title}</h2>
        </article>
      </ExamplePage>
    </>
  );
}

export async function getStaticProps() {
  const ssgHelper = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson, // optional - adds superjson serialization
  });

  const id = '1';
  const post = await ssgHelper.ssgRouter.byId.fetch({ id });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      trpcState: ssgHelper.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}
