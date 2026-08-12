import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import "./CategoryDialog.scss";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "delete";
  name: string;
  setName?: Dispatch<SetStateAction<string>>;
  colour?: string;
  setColour?: Dispatch<SetStateAction<string>>;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: string;
}

function CategoryDialog({
  isOpen,
  onClose,
  mode,
  name,
  setName,
  colour,
  setColour,
  onSubmit,
  loading,
  error,
}: CategoryDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (mode !== "delete") nameInputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const isDeleteConfirmation = mode === "delete";
  const title = isDeleteConfirmation ? "Delete category" : `${mode === "add" ? "Add" : "Edit"} category`;
  const submitLabel = isDeleteConfirmation ? "Delete" : mode === "add" ? "Add" : "Save changes";

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") onClose();
  };

  return createPortal(
    <div className="category-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        aria-labelledby="category-dialog-title"
        aria-modal="true"
        className="category-dialog"
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <h3 id="category-dialog-title">{title}</h3>

        {isDeleteConfirmation ? (
          <p>Are you sure you want to delete the “{name}” category?</p>
        ) : (
          <>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(event) => setName?.(event.target.value)}
              placeholder="Category name"
            />

            <label className="category-dialog__colour-picker">
              Colour
              <input type="color" value={colour} onChange={(event) => setColour?.(event.target.value)} />
              <output>{colour?.toUpperCase()}</output>
            </label>
          </>
        )}

        {error && <p>{error}</p>}

        <div className="category-dialog__actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={() => void onSubmit()} disabled={loading || (!isDeleteConfirmation && (!name.trim() || !colour?.trim()))}>
            {loading ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CategoryDialog;
