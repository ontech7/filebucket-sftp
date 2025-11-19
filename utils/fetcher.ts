const API_URL = process.env.NEXT_PUBLIC_API_URL?.endsWith("/")
  ? process.env.NEXT_PUBLIC_API_URL.slice(0, -1)
  : process.env.NEXT_PUBLIC_API_URL;

export async function fetcher<T = any>(
  url: string,
  config?: RequestInit
): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}/${url}`, config);

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch (err) {
    console.log(err);
    return null;
  }
}
