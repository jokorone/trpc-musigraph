import TauriApp from '@tauri-app/app';
import * as _TauriApp from '@tauri-apps/api';
import Button from '@ui/button';
import { meta as nextAuthMeta } from 'feature/next-auth/meta';
import { meta as reactHookFormMeta } from 'feature/react-hook-form/meta';
import { meta as ssgMeta } from 'feature/ssg/meta';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ExampleProps } from 'utils/ExamplePage';

import Login from './../feature/auth/index';

const propsList: ExampleProps[] = [reactHookFormMeta, ssgMeta, nextAuthMeta];

declare global {
  interface Window {
    __TAURI__: typeof _TauriApp;
  }
}

enum Clients {
  'CLIENT_NOT_SET',
  'TAURI',
  'WEB',
}

function IndexPage() {
  const router = useRouter();
  const [clientType, setClientType] = useState<Clients>(Clients.CLIENT_NOT_SET);

  useEffect(() => {
    setClientType(window.__TAURI__ ? Clients.TAURI : Clients.WEB);
  }, [clientType]);

  return (
    <>
      {/*
      WEB ?
        <Head>
          title
        </Head>

      <Layout>
        <Nav></Nav> fixed top (menu ------- user state)
        <AppRouter>

          Collection
            ?  Collection of Datasets (music sourceA, music sourceB, ???)
            : Import Wizard

          Import Wizard Flow ->
            <ImportFrom>
              Tauri ? fs
              Web ? connect to public APIS
            </ImportFrom>

            <Cleanup>
              organize,
              batchedit,
              save as collection owned by user (auth required?)
              connect handlers for metadata (mp3, custom metadata model provided by user?)
            </Cleanup>

            Persist in tauri ? local_db (sqlite?) : localstorage
            persist in postgres web api if auth ✅

            <Success></Success>

        </AppRouter>
      </Layout>

    */}
      <Head>
        <title>Musigraph</title>
      </Head>

      {/* <Login /> */}

      {/* <div className="bg-primary-400">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">A collection tRPC usage patterns</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Your go-to place to find out how to find solutions to common
            problems.
          </p>
        </div>
      </div> */}

      <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <ul className="space-y-2 p-4">
          {propsList.map((props) => (
            <Link key={props.title} href={props.href}>
              <a className="block overflow-hidden rounded-lg bg-white shadow transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-primary-400">
                <div className="px-2 py-5 sm:p-6">
                  <h2 className="my-3 text-2xl font-bold">{props.title}</h2>
                  <div className="my-2 text-xl">{props.summary}</div>
                </div>
              </a>
            </Link>
          ))}
        </ul>

        {clientType === Clients.TAURI ? <TauriApp /> : <p>Coming soon...</p>}
      </main>
    </>
  );
}

export default IndexPage;
