import { Prettify } from '@utils/dev';
import clsx from 'clsx';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

function Button(
  props: Prettify<
    ComponentPropsWithoutRef<'button'> & {
      [Key in
        | 'outline'
        | 'contain'
        | 'text'
        | 'italic'
        | 'bold'
        | 'default'
        | 'lg'
        | 'md'
        | 'sm'
        | 'fullWidth']?: boolean;
    } & {
      children: ReactNode;
    }
  >,
): JSX.Element {
  const {
    fullWidth,
    children,
    outline,
    contain,
    bold,
    italic,
    text,
    sm,
    md,
    lg,
    className: extraClasses,
    ...nativeProps
  } = props;

  return (
    <button
      className={clsx(
        `rounded-md px-4 py-2 text-primary-900${' ' + extraClasses}`,
        {
          'hover:bg-primary-400-700 bg-primary-200': contain,
          italic,
          outline,
          'outline-1': outline && !bold,
          'outline-4': outline && bold,
          '': text,
          'w-full': !!fullWidth,
          'max-h-sm max-w-sm text-sm sm:text-xs': sm,
          'max-h-md text-md max-w-md sm:text-sm': md,
          'max-h-lg sm:text-md max-w-lg text-lg': lg,
          'font-bold': bold,
        },
      )}
      {...nativeProps}
    >
      {children}
    </button>
  );
}

export default Button;
