import React from 'react';
import AssessmentPage from './assessment/page'; // correct relative import (was '@/src/app/assessment/page.tsx' causing src/src)

const Entry: React.FC = () => {
  return <AssessmentPage />;
};

export default Entry;
