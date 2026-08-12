const baseUrl = '/api'

// usage: apiFetch('/todos', { method: 'GET' }),
// const newTodo = await apiFetch('/todos', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     dueAt: '2026-12-20T17:00:00',
//     categoryId: 1,
//   }),
// })
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json() as Promise<T>
}

export default apiFetch
