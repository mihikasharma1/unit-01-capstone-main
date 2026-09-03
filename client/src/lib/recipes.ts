export type Ingredient = { name: string; quantity: string };
export type Instruction = { step: number; description: string };
export type RecipeInput = {
  title: string;
  image: string;
  description: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
};
export type Recipe = RecipeInput & { _id: string; ownerId?: string; createdAt?: string };

export function getApiError(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
    if (response?.data && 'err' in response.data && response.data.err) return String(response.data.err);
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

export function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : undefined;
}