"use client";

import { MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { H2, H3 } from "~/components/ui/typography";
import { useBreakpoints } from "~/hooks/use-breakpoint";

const PageHeading = ({
  label,
  hasBackButton = false,
  backButtonHref,
}: {
  label: string;
  hasBackButton?: boolean;
  backButtonHref?: string;
}) => {
  const { isSm } = useBreakpoints();

  return (
    <div className="flex flex-row items-start gap-2">
      {hasBackButton && backButtonHref && (
        <Link href={backButtonHref}>
          <Button variant="link" size="icon">
            <MoveLeftIcon />
          </Button>
        </Link>
      )}
      {isSm ? <H3>{label}</H3> : <H2>{label}</H2>}
    </div>
  );
};

export default PageHeading;
