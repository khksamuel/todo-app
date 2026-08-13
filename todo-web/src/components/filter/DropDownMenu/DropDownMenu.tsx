import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getCategories, editCategory, deleteCategory, type Category } from "../../../util/category";
import CategoryDialog from "../../category/CategoryDialog";
import AddButton from "../AddButton/AddButton";
import "./DropDownMenu.scss";

interface DropDownMenuProps {
  onCategoryChange: (categoryId: number | undefined, filter: string) => void;
}

function DropDownMenu({ onCategoryChange }: DropDownMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"edit" | "delete" | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editColour, setEditColour] = useState("#2563EB");
  const [isSaving, setIsSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const loadCategories = async (): Promise<void> => {
    try {
      setError("");
      setCategories(await getCategories());
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    getCategories()
      .then((loadedCategories) => {
        if (isCurrent) setCategories(loadedCategories);
      })
      .catch((error: unknown) => {
        if (isCurrent) setError(error instanceof Error ? error.message : "Unable to load categories.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const selectedCategory = categories.find((category) => category.id === Number(selectedCategoryId));

  const openEditDialog = (category: Category): void => {
    setActiveCategory(category);
    setEditName(category.name);
    setEditColour(category.colour);
    setDialogError("");
    setDialogMode("edit");
  };

  const handleEdit = async (): Promise<void> => {
    if (activeCategory === null) return;

    try {
      setIsSaving(true);
      const updatedCategory = await editCategory(activeCategory.id, editName.trim(), editColour.trim());
      setCategories((currentCategories) =>
        currentCategories.map((currentCategory) =>
          currentCategory.id === updatedCategory.id ? updatedCategory : currentCategory,
        ),
      );
      closeDialog();
    } catch (error: unknown) {
      setDialogError(error instanceof Error ? error.message : "Unable to edit category.");
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (category: Category): void => {
    setActiveCategory(category);
    setDialogError("");
    setDialogMode("delete");
  };

  const handleDelete = async (): Promise<void> => {
    if (activeCategory === null) return;

    try {
      setIsSaving(true);
      await deleteCategory(activeCategory.id);
      setCategories((currentCategories) => currentCategories.filter((item) => item.id !== activeCategory.id));
      if (selectedCategoryId === String(activeCategory.id)) {
        setSelectedCategoryId("");
        onCategoryChange(undefined, "");
      }
      closeDialog();
    } catch (error: unknown) {
      setDialogError(error instanceof Error ? error.message : "Unable to delete category.");
    } finally {
      setIsSaving(false);
    }
  };

  const closeDialog = (): void => {
    setDialogMode(null);
    setActiveCategory(null);
    setDialogError("");
  };

  return (
    <div className="category-dropdown">
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="category-dropdown__trigger"
        disabled={isLoading}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {selectedCategory ? selectedCategory.name : "All categories"}
        <span aria-hidden="true">▾</span>
      </button>
      {isOpen && (
        <ul aria-label="Categories" className="category-dropdown__menu" role="listbox">
          <li>
            <button
              className="category-dropdown__option"
              onClick={() => {
                setSelectedCategoryId("");
                onCategoryChange(undefined, "");
                setIsOpen(false);
              }}
              type="button"
            >
              All Categories
            </button>
          </li>
          {categories.map((category) => (
            <li aria-selected={selectedCategoryId === String(category.id)} key={category.id} role="option">
              <button
                className="category-dropdown__option"
                onClick={() => {
                  setSelectedCategoryId(String(category.id));
                  onCategoryChange(category.id, category.name);
                  setIsOpen(false);
                }}
                type="button"
              >
                <span className="category-dropdown__swatch" style={{ backgroundColor: category.colour }} />
                {category.name}
              </button>
              <div className="category-dropdown__actions">
                <button aria-label={`Edit ${category.name}`} onClick={() => openEditDialog(category)} title="Edit category" type="button">
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button aria-label={`Delete ${category.name}`} onClick={() => openDeleteDialog(category)} title="Delete category" type="button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
          {/* Not yet implemented because done is not implemented as a category */}
          {/* <li>
            <button
              className="category-dropdown__option"
              onClick={() => {
                setSelectedCategoryId("");
                onCategoryChange(undefined, "");
                setIsOpen(false);
              }}
              type="button"
            >
              Done
            </button>
          </li> */}
        </ul>
      )}
      <AddButton onCategoryAdded={() => void loadCategories()} />
      {error && <span className="category-dropdown__error">{error}</span>}
      {dialogMode !== null && activeCategory !== null && (
        <CategoryDialog
          colour={editColour}
          error={dialogError}
          isOpen
          loading={isSaving}
          mode={dialogMode}
          name={dialogMode === "delete" ? activeCategory.name : editName}
          onClose={closeDialog}
          onSubmit={dialogMode === "delete" ? handleDelete : handleEdit}
          setColour={setEditColour}
          setName={setEditName}
        />
      )}
    </div>
  );
}

export default DropDownMenu;
