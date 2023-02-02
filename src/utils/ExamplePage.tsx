import { EyeIcon } from '@heroicons/react/outline';
import { CodeIcon } from '@heroicons/react/outline';
import { CheckIcon, ClipboardCopyIcon, HomeIcon } from '@heroicons/react/solid';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';
import { Fragment, ReactNode, Suspense, useEffect, useState } from 'react';

import { ErrorBoundary } from './ClientSuspense';
import { trpc } from './trpc';
import { useClipboard } from './useClipboard';

interface SourceFile {
  title: string;
  path: string;
}

function clsx(...classes: unknown[]) {
  return classes.filter(Boolean).join(' ');
}

export interface ExampleProps {
  title: string;
  href: string;
  /**
   * Only render this on the client
   */
  clientOnly?: boolean;
  /**
   * Summary - shown on home page
   */
  summary?: JSX.Element;
  /**
   * Detail page components
   */
  detail?: JSX.Element;
  /**
   * Files for "View Source" in the UI
   */
  files: SourceFile[];
}

export default function Breadcrumbs(props: {
  pages: { title: string; href: string }[];
}) {
  const router = useRouter();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/">
              <a className="text-gray-400 hover:text-gray-500">
                <HomeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>
        {props.pages.map((page) => (
          <li key={page.href}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link href={page.href}>
                <a
                  href={page.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={
                    router.pathname === page.href ? 'page' : undefined
                  }
                >
                  {page.title}
                </a>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Code(props: { contents: string; language: string }) {
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={props.contents}
      language="tsx"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-scroll rounded p-4`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

function basename(path: string) {
  return path.split('/').pop() ?? '';
}

function ViewSource(props: SourceFile) {
  const query = trpc.source.getSource.useQuery(
    { path: props.path },
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const filename = basename(props.path);
  const language = filename.split('.').pop() ?? '';

  const [hasCopied, copy] = useClipboard(query.data?.contents || '');

  if (!query.data) {
    return <Spinner />;
  }

  return (
    <div className="relative">
      <button
        onClick={copy}
        type="button"
        className="absolute right-4 top-4 inline-flex items-center rounded-lg border border-transparent bg-gray-600 p-1.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        {hasCopied ? (
          <>
            <span className="sr-only">Copied</span>
            <CheckIcon className="h-5 w-5" aria-hidden />
          </>
        ) : (
          <>
            <span className="sr-only">Copy</span>
            <ClipboardCopyIcon className="h-5 w-5" aria-hidden />
          </>
        )}
      </button>
      <Code contents={query.data.contents} language={language} />
    </div>
  );
}

function Spinner() {
  return (
    <div>
      <span className="animate inline-block animate-spin py-2 italic text-primary-500">
        ⏳
      </span>
    </div>
  );
}

function ClientOnly(props: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return <Spinner />;
  }
  return <>{props.children}</>;
}
export function ExamplePage(
  props: ExampleProps & {
    children?: ReactNode;
  },
) {
  const routerQuery = useRouter().query;
  const utils = trpc.useContext();

  useEffect(() => {
    for (const file of props.files) {
      utils.source.getSource.prefetch({ path: file.path });
    }
  }, [props.files, utils]);

  const innerContent = (
    <Suspense fallback={<Spinner />}>
      {!routerQuery.file && props.children}

      {props.files.map((file) => (
        <Fragment key={file.path}>
          {file.path === routerQuery.file && <ViewSource {...file} />}
        </Fragment>
      ))}
    </Suspense>
  );
  const content = props.clientOnly ? (
    <ClientOnly>{innerContent}</ClientOnly>
  ) : (
    innerContent
  );
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <div className="bg-primary-400">
        <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {props.title}
          </h1>

          <div className="text-primary-200">{props.summary}</div>
        </div>
      </div>
      <main>
        <div className="mx-auto max-w-7xl space-y-4 p-4 sm:px-6 lg:px-8">
          <Breadcrumbs pages={[props]} />
          <hr className="w-full border-t border-gray-300" />
          <div className="space-y-2 overflow-hidden border-l-2 border-primary-400 bg-white py-2 px-4">
            <div className="p-2">
              <h3 className="mb-2 text-2xl font-bold">{props.title}</h3>
              <div className="prose">{props.detail || props.summary}</div>
            </div>
          </div>
          <div id="content">
            <div className="sticky top-0 flex justify-between overflow-x-auto bg-primary-100 bg-opacity-50">
              <div></div>
              <div className="btn-group top-0">
                <Link
                  href={{ query: { file: undefined }, hash: 'content' }}
                  scroll={false}
                >
                  <a
                    className={clsx('btn', !routerQuery.file && 'btn--active')}
                  >
                    <EyeIcon className="btn__icon" aria-hidden="true" />
                    Preview
                  </a>
                </Link>
                {props.files.map((file) => (
                  <Link
                    href={{
                      query: {
                        file: file.path,
                      },
                      hash: 'content',
                    }}
                    scroll={false}
                    key={file.path}
                  >
                    <a
                      className={clsx(
                        'btn',
                        routerQuery.file === file.path && 'btn--active',
                      )}
                    >
                      <CodeIcon className="btn__icon" aria-hidden="true" />
                      <code>{basename(file.path)}</code>
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-4">
              <ErrorBoundary>{content}</ErrorBoundary>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
