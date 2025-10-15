import React from 'react';
// FIX: Import global types to make JSX augmentations available.
import '../../types';

interface AdminEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({ icon, title, description, children }) => {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="text-text-secondary mt-2">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default AdminEmptyState;
