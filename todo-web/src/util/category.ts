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
