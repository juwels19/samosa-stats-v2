"use client";

import { CirclePlusIcon, Loader2Icon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "~/db/queries/categories";
import { CategoryContext } from "~/app/settings/_components/categories/context";

const NewCategoryInput = () => {
  const [showInput, setShowInput] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const [categoryValue, setCategoryValue] = useState("");

  const queryClient = useQueryClient();

  const { activeSeasonId } = useContext(CategoryContext);

  const newCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      const newCategory = await createCategory({
        text: categoryName,
        seasonId: activeSeasonId,
      });
      return newCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleAddCategory = async () => {
    if (categoryValue === "") {
      toast.error("Please enter a category name.");
      return;
    }
    try {
      const newCategory = await newCategoryMutation.mutateAsync(categoryValue);
      toast.success(
        `${newCategory?.data.newCategory.text} was added successfully!`
      );
      setCategoryValue("");
    } catch {
      toast.error("There was an error adding the category.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showButton && (
        <Button variant="link" asChild>
          <motion.button
            key="button"
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowButton(false);
              setShowInput(true);
            }}
          >
            Add category <CirclePlusIcon />
          </motion.button>
        </Button>
      )}
      {showInput && (
        <motion.div
          key="input"
          exit={{ opacity: 0 }}
          className="flex flex-col md:flex-row gap-2 w-full"
        >
          <Input
            placeholder="Enter a category..."
            className="w-full grow"
            value={categoryValue}
            onChange={(e) => setCategoryValue(e.target.value)}
          />
          <div className="flex">
            <Button onClick={handleAddCategory}>
              {newCategoryMutation.isPending && (
                <Loader2Icon className="animate-spin" />
              )}
              Add
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setShowButton(true);
                setShowInput(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewCategoryInput;
