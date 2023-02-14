import { invoke as _invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';
import { z } from 'zod';

const response = z.object({
  content: z.string(),
});

const Commands = z.object({
  greet: z.object({
    payload: z.object({
      name: z.string(),
    }),
    response,
  }),
  login: z.object({
    payload: z.object({
      uname: z.string(),
      pw: z.string().min(5),
    }),
    response,
  }),
});
type Commands = z.infer<typeof Commands>;

type Command = keyof Commands;

type Payload<T extends Command> = Commands[T]['payload'];
type Response<T extends Command> = Commands[T]['response'];
type Content<T extends Command> = Response<T>['content'];
type Error = string;

export function useCommand<T extends Command>(name: T) {
  const [error, setError] = useState<Error>();
  const [value, setValue] = useState<Content<T>>();

  async function invoke(payload: Payload<T>) {
    const result = await _invoke<Content<T>>(name, payload).catch(
      (err: Error) => setError(err),
    );

    if (!error && result) {
      setValue(result);
    }
  }

  return [
    {
      value,
      error,
    },
    invoke,
  ] as const;
}
