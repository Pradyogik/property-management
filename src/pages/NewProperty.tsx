import React from 'react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useTranslation } from "../hooks/useTranslation";
import TableV3 from "../components/tables/TableV3";
import AddPropertyForm from '../components/forms/AddPropertyForm';

import { Toaster } from 'react-hot-toast';
import TableV4 from '../components/tables/TableV4';
import NewAddPropertyForm from '../components/forms/NewAddPropertyForm';

export function NewProperty() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="p-8 max-w-full">
        <div className="mb-8 flex justify-between items-center">
          <div>
          <h1 className="text-2xl font-bold">{t('bidamartPropertyDetails')}</h1>
          <p className="text-gray-600">
            {t('bidamartManageProperties')}
          </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>{t('bidamartAddProperty')}</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <TableV4 />
        </div>
        
        {showAddForm && <NewAddPropertyForm onClose={() => setShowAddForm(false)} />}
      </div>
    </DashboardLayout>
  );
}