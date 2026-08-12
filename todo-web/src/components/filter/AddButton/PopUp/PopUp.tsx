import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import "./PopUp.scss";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  colour: string;
  setColour: Dispatch<SetStateAction<string>>;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: string;
}

function Popup({
  isOpen,
  onClose,
  name,
  setName,
  colour,
  setColour,
  onSubmit,
  loading,
  error,
}: PopupProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    nameInputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return createPortal(
    <div className="popup-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        aria-labelledby="add-category-title"
        aria-modal="true"
        className="popup"
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <h3 id="add-category-title">Add category</h3>

        <input
          ref={nameInputRef}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Category name"
        />

        <label className="colour-picker">
          Colour
          <input
            type="color"
            value={colour}
            onChange={(event) => setColour(event.target.value)}
          />
          <output>{colour.toUpperCase()}</output>
        </label>

        {error && <p>{error}</p>}

        <div>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={() => void onSubmit()} disabled={loading || !name.trim() || !colour.trim()}>
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Popup;
