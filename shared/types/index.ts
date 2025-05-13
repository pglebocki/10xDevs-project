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