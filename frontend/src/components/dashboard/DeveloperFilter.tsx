import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Input from '../ui/Input';

interface DeveloperFilterProps {
  onFilter: (searchTerm: string) => void;
}

const DeveloperFilter: React.FC<DeveloperFilterProps> = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter(value);
  };
  
  return (
    <div className="w-full max-w-md">
      <Input
        placeholder="Search developers by name, GitHub username or role..."
        value={searchTerm}
        onChange={handleSearch}
        icon={<Search className="h-4 w-4 text-gray-400" />}
        className="w-full"
      />
    </div>
  );
};

export default DeveloperFilter;