import PageHeading from "~/components/common/page-heading";
import { Skeleton } from "~/components/ui/skeleton";
import { ROUTES } from "~/lib/routes";

export default function Loading() {
  return (
    <div className="w-full p-6 flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        <PageHeading label="" hasBackButton backButtonHref={ROUTES.SCORES} />
        <Skeleton className="h-6 w-48 md:w-72 lg:w-96 mt-2" />
      </div>
    </div>
  );
}
