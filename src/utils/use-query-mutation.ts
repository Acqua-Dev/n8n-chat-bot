import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import type { DefaultError, QueryClient } from '@tanstack/query-core';
import { toast } from '@/utils/ui/hooks/use-toast';

interface UseQueryMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  onSuccessMessage?: string;
  onErrorMessage?: string;
}

export const useQueryMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseQueryMutationOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient,
) => {
  return useMutation<TData, TError, TVariables, TContext>(
    {
      ...options,
      onSuccess: (data, variables, context) => {
        if (options?.onSuccessMessage) {
          toast({
            title: 'Success',
            description: options.onSuccessMessage,
            variant: 'default',
          });
        }
        return options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        if (options?.onErrorMessage) {
          toast({
            title: 'Error',
            description: options.onErrorMessage,
            variant: 'destructive',
          });
        }
        return options?.onError?.(error, variables, context);
      },
    },
    queryClient,
  );
};
