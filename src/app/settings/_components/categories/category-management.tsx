"use client";

import { useQuery } from "@tanstack/react-query";
import { TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryManagementLoading from "~/app/settings/_components/categories/category-management-loading";
import { CategoryContext } from "~/app/settings/_components/categories/context";
import EditableCategory from "~/app/settings/_components/categories/editable-category";
import NewCategoryInput from "~/app/settings/_components/categories/new-category-input";
import SaveEditsButton from "~/app/settings/_components/categories/save-edits-buttons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getCategoriesForActiveSeason } from "~/db/queries/categories";
import { getActiveSeason } from "~/db/queries/seasons";

const CategoryManagement = () => {
  const [hasEdits, setHasEdits] = useState(false);
  const [activeSeasonId, setActiveSeasonId] = useState(0);

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = await getCategoriesForActiveSeason();
      return categories;
    },
  });

  const activeSeason = useQuery({
    queryKey: ["activeSeason"],
    queryFn: async () => {
      const categories = await getActiveSeason();
      return categories;
    },
  });

  useEffect(() => {
    if (activeSeason.data) {
      setActiveSeasonId(activeSeason.data.id);
    }
  }, [activeSeason.data]);

  if (!categories.data) return <CategoryManagementLoading />;

  return (
    <CategoryContext.Provider
      value={{
        initialCategories: categories.data,
        edits: categories.data,
        hasEdits,
        setHasEdits,
        activeSeasonId,
        setActiveSeasonId,
      }}
    >
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="w-full pb-3">
          <CardTitle className="flex justify-between items-center">
            Categories
            <SaveEditsButton />
          </CardTitle>
          <CardDescription>
            Scroll to see all categories. Double click a category to toggle edit
            mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-56 flex flex-col gap-4 overflow-scroll pb-0">
          {categories.data.length === 0 ? (
            <Alert variant="warning">
              <TriangleAlertIcon />
              <AlertTitle>No categories found!</AlertTitle>
              <AlertDescription>
                There are no categories setup for this season. Use the button
                below to add categories!
              </AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className="border rounded-md border-neutral-200 dark:border-neutral-800">
              {categories.data.map((category, index) => (
                <EditableCategory
                  key={category.id}
                  category={category}
                  index={index}
                  className="m-2"
                />
              ))}
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter className="">
          <NewCategoryInput />
        </CardFooter>
      </Card>
    </CategoryContext.Provider>
  );
};

export default CategoryManagement;
