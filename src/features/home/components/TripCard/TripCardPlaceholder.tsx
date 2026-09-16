import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TripCardPlaceholder = () => {
  return (
    <Card className="overflow-hidden gap-0 py-0">
      <Skeleton className="aspect-square w-full rounded-none" />

      <CardHeader className="gap-2 px-4 py-3">
        <CardTitle className="flex w-full justify-center">
          <Skeleton className="h-5 w-2/3" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="mx-auto h-3 w-24" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default TripCardPlaceholder;