import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

export interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {
  label: string;
  description?: string;
  required?: boolean;
}

export function BaseFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  render,
  required,
  ...props
}: BaseFormFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      {...props}
      render={(fieldProps) => (
        <FormItem>
          <FormLabel>{`${label}${required ? ' *' : ''}`}</FormLabel>
          <FormControl>{render(fieldProps)}</FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
