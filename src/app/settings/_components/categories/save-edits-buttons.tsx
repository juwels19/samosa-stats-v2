"use client";
import { Category } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import React, { useContext } from "react";
import { toast } from "sonner";
import { CategoryContext } from "~/app/settings/_components/categories/context";
import { Button } from "~/components/ui/button";
import { updateCategories } from "~/db/queries/categories";

const SaveEditsButton = () => {
  const { hasEdits, setHasEdits, edits } = useContext(CategoryContext);

  const editCategoriesMutation = useMutation({
    mutationFn: (categories: Category[]) => updateCategories({ categories }),
  });

  const handleSaveClick = async () => {
    try {
      await editCategoriesMutation.mutateAsync(edits);
      setHasEdits(false);
      toast.success("Category edits were saved successfully!");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };

  return (
    <>
      {hasEdits && (
        <Button
          asChild
          onClick={handleSaveClick}
          disabled={editCategoriesMutation.isPending}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {editCategoriesMutation.isPending && (
              <Loader2Icon className="animate-spin" />
            )}
            Save changes
          </motion.button>
        </Button>
      )}
    </>
  );
};

export default SaveEditsButton;
