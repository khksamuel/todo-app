import apiFetch from "./api";

export interface Category {
  id: number;
  name: string;
  colour: string;
}

export async function addCategory(name: string, colour: string): Promise<Category> {
  const category = await apiFetch<Category>("/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      colour,
    }),
  });

  if (category === null) {
    throw new Error("The API returned an empty response when creating a category.");
  }

  return category;
}

export async function getCategories(): Promise<Category[]> {
  const categories = await apiFetch<Category[]>("/categories", {
    method: "GET",
  });

  if (categories === null) {
    throw new Error("The API returned an empty response when fetching categories.");
  }

  return categories;
}

export async function editCategory(id: number, name: string, colour: string): Promise<Category> {
  const category = await apiFetch<Category>(`/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      colour,
    }),
  });

  if (category === null) {
    throw new Error("The API returned an empty response when editing a category.");
  }

  return category;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiFetch<void>(`/categories/${id}`, {
    method: "DELETE",
  });
}

export default { getCategories, addCategory, editCategory, deleteCategory };
