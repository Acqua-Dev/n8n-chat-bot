import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md w-full">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardHeader>
      <CardContent className="flex-1 p-4 space-y-4">
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-20 w-2/3 rounded-2xl ml-auto" />
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-12 w-2/3 rounded-2xl ml-auto" />
      </CardContent>
      <CardFooter className="border-t p-4 gap-2 flex">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </CardFooter>
    </Card>
  );
}
