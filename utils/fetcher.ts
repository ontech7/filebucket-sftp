export async function fetcher<T = any>(
  url: string,
  config?: RequestInit
): Promise<T | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
      config
    );

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch (err) {
    console.log(err);
    return null;
  }
}
