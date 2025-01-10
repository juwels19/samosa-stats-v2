"use client";

import { Category } from "@prisma/client";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { useDoubleTap } from "use-double-tap";
import { CategoryContext } from "~/app/settings/_components/categories/context";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";

const EditableCategory = ({
  category,
  index,
  className,
}: {
  category: Category;
  index: number;
  className?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(category.text);

  const { initialCategories, edits, hasEdits, setHasEdits } =
    useContext(CategoryContext);

  const doubleTapHandler = useDoubleTap(() => {
    if (hasEdits && isEditing) {
      toast.error("You have unsaved category edits. Please save them first.");
      return;
    }
    setIsEditing(!isEditing);
  });

  return (
    <div {...doubleTapHandler} className={className}>
      {isEditing ? (
        <Textarea
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            edits[index] = {
              ...initialCategories[index],
              text: e.target.value,
            };
            setHasEdits(true);
          }}
        />
      ) : (
        <div className="flex flex-row gap-2">
          <p>{category.text}</p>
          {category.isGlobal && <Badge>Global</Badge>}
        </div>
      )}
    </div>
  );
};

export default EditableCategory;
