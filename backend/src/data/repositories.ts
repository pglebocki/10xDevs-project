export interface Repository {
  id: string;
  name: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

export const mockRepositories = [
    {
        id: "1",
        url: "https://github.com/facebook/react",
    },
    {
        id: "2",
        url: "https://github.com/vercel/next.js",
    },
    {
        id: "3",
        url: "https://github.com/tailwindlabs/tailwindcss",
    }
]
