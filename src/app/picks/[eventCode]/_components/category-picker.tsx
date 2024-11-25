"use client";

import { Progress } from "@nextui-org/react";
import { XIcon } from "lucide-react";
import React, { useContext } from "react";
import { PickContext } from "~/app/picks/[eventCode]/_components/context";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const CategoryPicker = () => {
  const { categorySelections, setCategorySelections, categories, event } =
    useContext(PickContext);

  const categorySelectionCount = Object.entries(categorySelections).filter(
    (entry) => entry[1] === true
  ).length;

  return (
    <>
      <div className="flex flex-row justify-between items-end gap-4">
        <Progress
          label={`${categorySelectionCount} / ${event.numberOfCategoryPicks} categories selected`}
          color={
            categorySelectionCount !== event.numberOfCategoryPicks
              ? "primary"
              : "success"
          }
          value={(categorySelectionCount / event.numberOfCategoryPicks) * 100}
        />
        <Button variant="destructive" onClick={() => setCategorySelections({})}>
          <XIcon />
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2 mx-auto">
        {categories.map((category, index) => (
          <Button
            key={`category-${index}`}
            disabled={
              categorySelectionCount === event.numberOfCategoryPicks &&
              !categorySelections[category.id]
            }
            variant="outline"
            className={cn(
              "whitespace-normal h-auto justify-start text-left",
              categorySelections[category.id]
                ? "bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-900"
                : "bg-transparent dark:bg-transparent"
            )}
            onClick={() => {
              if (categorySelections[category.id] === undefined) {
                setCategorySelections({
                  ...categorySelections,
                  [category.id]: true,
                });
              } else {
                setCategorySelections({
                  ...categorySelections,
                  [category.id]: !categorySelections[category.id],
                });
              }
            }}
          >
            {category.text}
          </Button>
        ))}
      </div>
    </>
  );
};

export default CategoryPicker;
