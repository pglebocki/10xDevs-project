import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitFork, Star, Code } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import { Repository } from '../../data/mockData';

interface RepositoryCardProps {
  repository: Repository;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ 
  repository, 
  selected = false,
  onSelect
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(repository.id);
    }
    navigate(`/repositories/${repository.id}/developers`);
  };
  
  return (
    <Card 
      hoverable 
      selectable={!!onSelect}
      selected={selected}
      onClick={handleClick}
      className="h-full transition-transform transform hover:scale-[1.01] cursor-pointer"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{repository.name}</CardTitle>
            <CardDescription className="mt-1">
              <a 
                href={repository.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {repository.url}
              </a>
            </CardDescription>
          </div>
          <Badge variant="primary">{repository.language}</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4">{repository.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            <span>{repository.stars}</span>
          </div>
          
          <div className="flex items-center">
            <GitFork className="h-4 w-4 mr-1" />
            <span>{repository.forks}</span>
          </div>
          
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-1" />
            <span>{repository.language}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;