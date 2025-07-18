
import React from 'react';
import { Infographic, DisplayCategory } from '../src/types';
import SharedInfographicLayout from './SharedInfographicLayout';

interface TechnologyPageProps {
  infographics: Infographic[];
}

const TechnologyPage: React.FC<TechnologyPageProps> = ({ infographics }) => {
  return (
    <SharedInfographicLayout 
      infographics={infographics} 
      pageType="technology"
      filterByCategory={DisplayCategory.TECHNOLOGY}
      showBackButton={true}
      itemsPerPage={20}
    />
  );
};

export default TechnologyPage;
    