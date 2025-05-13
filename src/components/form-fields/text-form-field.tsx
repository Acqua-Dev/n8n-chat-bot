import {
  BaseFormField,
  BaseFormFieldProps,
} from '@/components/form-fields/base-form-field';
import { Input } from '@/components/ui/input';
import type { FieldPath } from 'react-hook-form';
import { ComponentProps } from 'react';

interface TextFormFieldProps<
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, 'render'>,
    Pick<ComponentProps<'input'>, 'type' | 'placeholder' | 'required'> {}

export function TextFormField<
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ placeholder, type, ...props }: TextFormFieldProps<TFieldValues, TName>) {
  return (
    <BaseFormField
      {...props}
      render={({ field }) => (
        <Input placeholder={placeholder} type={type} {...field} />
      )}
    />
  );
}
