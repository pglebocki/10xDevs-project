import { Repository, Developer } from '@10xdevs/shared';

export interface PullRequest {
  id: string;
  title: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  status: 'open' | 'closed' | 'merged';
  author: string;
  repository: string;
  comments: number;
  additions: number;
  deletions: number;
}

export const mockRepositories: Repository[] = [
  {
    id: "repo1",
    githubId: "1234567890",
    name: "frontend-app",
    url: "https://github.com/company/frontend-app",
    description: "Main frontend application built with React and TypeScript",
    stars: 156,
    forks: 32,
    language: "TypeScript"
  },
  {
    id: "repo2",
    githubId: "1234567891",
    name: "api-service",
    url: "https://github.com/company/api-service",
    description: "Backend API service built with Node.js and Express",
    stars: 89,
    forks: 18,
    language: "JavaScript"
  },
  {
    id: "repo3",
    githubId: "1234567892",
    name: "design-system",
    url: "https://github.com/company/design-system",
    description: "Component library and design system used across projects",
    stars: 212,
    forks: 45,
    language: "TypeScript"
  },
  {
    id: "repo4",
    githubId: "1234567893",
    name: "mobile-app",
    url: "https://github.com/company/mobile-app",
    description: "Cross-platform mobile application built with React Native",
    stars: 176,
    forks: 38,
    language: "TypeScript"
  },
  {
    id: "repo5",
    githubId: "1234567894",
    name: "data-processing",
    url: "https://github.com/company/data-processing",
    description: "Data processing and analytics services",
    stars: 68,
    forks: 12,
    language: "Python"
  }
];

export const mockDevelopers: Developer[] = [
  {
    id: "dev1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    repositories: ["1", "repo3"],
    role: "Frontend Developer"
  },
  {
    id: "dev2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    repositories: ["1", "repo2", "repo4"],
    role: "Full Stack Developer"
  },
  {
    id: "dev3",
    name: "Miguel Rodriguez",
    email: "miguel.rodriguez@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    repositories: ["1", "repo5"],
    role: "Backend Developer"
  },
  {
    id: "dev4",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    repositories: ["1", "repo3", "repo4"],
    role: "UI/UX Designer"
  },
  {
    id: "dev5",
    name: "James Lee",
    email: "james.lee@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    repositories: ["1", "repo5"],
    role: "Data Engineer"
  },
  {
    id: "dev6",
    name: "Olivia Parker",
    email: "olivia.parker@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/6.jpg",
    repositories: ["1", "repo3"],
    role: "Frontend Developer"
  },
  {
    id: "dev7",
    name: "Daniel Smith",
    email: "daniel.smith@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/7.jpg",
    repositories: ["1", "repo4"],
    role: "DevOps Engineer"
  }
];

// Generate more realistic PR data
const generatePRs = (repoId: string, count: number = 20): PullRequest[] => {
  const prs: PullRequest[] = [];
  const developers = mockDevelopers
  
  // Generate PRs over the last 30 days
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < count; i++) {
    const createdAt = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const updatedAt = new Date(createdAt.getTime() + Math.random() * (endDate.getTime() - createdAt.getTime()));
    
    const status = Math.random() > 0.8 ? 'open' : Math.random() > 0.3 ? 'merged' : 'closed';
    const mergedAt = status === 'merged' ? new Date(updatedAt.getTime() + Math.random() * 86400000) : null;
    const closedAt = (status === 'merged' || status === 'closed') ? mergedAt || updatedAt : null;
    
    prs.push({
      id: `pr${i + 1}`,
      title: `PR #${i + 1}: ${[
        'Add new feature',
        'Fix bug in',
        'Update dependencies for',
        'Improve performance of',
        'Refactor',
        'Implement',
        'Optimize',
      ][Math.floor(Math.random() * 7)]} ${[
        'authentication',
        'dashboard',
        'API integration',
        'user interface',
        'database queries',
        'error handling',
        'documentation',
      ][Math.floor(Math.random() * 7)]}`,
      number: i + 1,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      mergedAt: mergedAt?.toISOString() || null,
      closedAt: closedAt?.toISOString() || null,
      status,
      author: developers[Math.floor(Math.random() * developers.length)].id,
      repository: repoId,
      comments: Math.floor(Math.random() * 10),
      additions: Math.floor(Math.random() * 500),
      deletions: Math.floor(Math.random() * 200)
    });
  }
  
  return prs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const mockPullRequests = generatePRs('repo1');

// Generate PR timeline data for chart
export const generateTimelineData = (repoId: string = "repo1") => {
  const prs = generatePRs(repoId);
  
  return {
    labels: prs.map(pr => new Date(pr.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Pull Requests',
        data: prs.map((pr, index) => ({ 
          x: new Date(pr.createdAt).toISOString(), 
          y: index + 1,
          pr: pr 
        })),
        backgroundColor: prs.map(pr => {
          switch(pr.status) {
            case 'merged': return '#8B5CF6';
            case 'closed': return '#EF4444';
            case 'open': return '#3B82F6';
            default: return '#3B82F6';
          }
        }),
        borderColor: '#0EA5E9',
        borderWidth: 1
      }
    ]
  };
};