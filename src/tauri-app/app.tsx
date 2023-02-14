import Button from '@ui/button';
import React from 'react';

import { useCommand } from './commands';

function TauriApp() {
  const [loginResponse, login] = useCommand('login');
  const [greeting, greet] = useCommand('greet');

  return (
    <main className="flex h-full w-full flex-col">
      <Button
        className="m-4"
        contain
        lg
        onClick={async () => greet({ name: 'Jonas' })}
      >
        Greet me:
      </Button>

      <Button
        className="m-4"
        contain
        md
        onClick={async () => greet({ name: 'Jonas' })}
      >
        Greet me:
      </Button>

      <div className="m-4">
        {greeting.error && <h3 className="text-red-600">{greeting.error}</h3>}
        {greeting.value && <h2 className="text-xl">{greeting.value}</h2>}
      </div>

      <Button
        className="m-4"
        contain
        sm
        onClick={async () => login({ uname: 'Jonas', pw: '123!' })}
      >
        Login
      </Button>

      <div className="m-4">
        {loginResponse.error && (
          <h3 className="text-red-600">{loginResponse.error}</h3>
        )}
        {loginResponse.value && (
          <h2 className="text-xl">{loginResponse.value}</h2>
        )}
      </div>
    </main>
  );
}

export default TauriApp;
