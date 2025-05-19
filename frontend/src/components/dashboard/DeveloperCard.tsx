import React from 'react';
import { Mail, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import { Developer } from '@10xdevs/shared';

// Additional properties that might come from the API but aren't in the shared type
interface ExtendedDeveloper extends Developer {
  login?: string;
  contributions?: number;
}

interface DeveloperCardProps {
  developer: ExtendedDeveloper;
  repoId?: string;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, repoId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (repoId) {
      navigate(`/repositories/${repoId}/developers/${developer.login || developer.id}/metrics/pr-timeline`);
    }
  };

  return (
    <Card 
      hoverable 
      className="h-full transition-transform transform hover:scale-[1.01] cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <img 
          src={developer.avatarUrl} 
          alt={developer.name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{developer.name}</h3>
          {developer.email && (
            <p className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {developer.email}
            </p>
          )}
          {developer.login && (
            <p className="text-sm text-gray-500 flex items-center">
              <Github className="h-3 w-3 mr-1" />
              {developer.login}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-2">
          {developer.role && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Role:</span>
              <Badge variant="secondary">{developer.role}</Badge>
            </div>
          )}
          
          {developer.contributions && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Contributions:</span>
              <span className="font-medium text-gray-900">{developer.contributions}</span>
            </div>
          )}
          
          {developer.repositories && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Repositories:</span>
              <span className="font-medium text-gray-900">{developer.repositories.length}</span>
            </div>
          )}
          
          <a 
            href={developer.login ? `https://github.com/${developer.login}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="h-4 w-4 mr-1" />
            View GitHub Profile
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeveloperCard;