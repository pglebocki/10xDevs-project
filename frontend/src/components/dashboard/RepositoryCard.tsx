import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitFork, Star, Code } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
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
  
  const handleViewDevelopers = () => {
    navigate(`/repositories/${repository.id}/developers`);
  };
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(repository.id);
    }
  };
  
  return (
    <Card 
      hoverable 
      selectable={!!onSelect}
      selected={selected}
      onClick={onSelect ? handleSelect : undefined}
      className="h-full transition-transform transform hover:scale-[1.01]"
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
      
      <CardFooter>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleViewDevelopers();
          }}
          fullWidth
        >
          View Developers
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RepositoryCard;