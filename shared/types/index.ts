// GitHub API Types
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  url: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  merged: boolean;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  user: GitHubUser;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Repository Model (shared between frontend and backend)
export interface Repository {
  id: string;
  name: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

// Developer Model (shared between frontend and backend)
export interface Developer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  repositories: string[];
  role: string;
} 