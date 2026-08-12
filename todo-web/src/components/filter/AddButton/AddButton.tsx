import { useState } from "react";
import { addCategory } from "../../../util/category";
import CategoryDialog from "../../category/CategoryDialog";

interface AddButtonProps {
  onCategoryAdded?: () => void;
}

function AddButton({ onCategoryAdded }: AddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [colour, setColour] = useState("#2563EB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = (): void => {
    setName("");
    setColour("#2563EB");
    setError("");
  };

  const handleSubmit = async (): Promise<void> => {
    if (!name.trim() || !colour.trim()) {
      setError("Name and colour are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await addCategory(name.trim(), colour.trim());
      onCategoryAdded?.();
      setIsOpen(false);
      resetForm();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to add category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Add category
      </button>

      <CategoryDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetForm();
        }}
        mode="add"
        name={name}
        setName={setName}
        colour={colour}
        setColour={setColour}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default AddButton;
