import { useState } from 'react';
import { PropertyRecord } from '../../../types';

export interface Column {
  key: keyof PropertyRecord;
  label: string;
  visible: boolean;
  sortable?: boolean;
}

export interface SortConfig {
  key: keyof PropertyRecord | null;
  direction: 'asc' | 'desc';
}

export function useTableState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    // { key: 'id', label: '', visible: true, sortable: true },
    { key: 'checkbox', label: '', visible: true },
    { key: 'serial_number', label: 'क्रम', visible: true, sortable: true },
    { key: 'scheme_name', label: 'योजना का नाम', visible: true, sortable: true },
    { key: 'property_unique_id', label: 'Property Unique ID', visible: true, sortable: true },
    { key: 'allottee_name', label: 'आवंटी का नाम', visible: true, sortable: true },
    // { key: 'fatherName', label: 'पिता/पति का नाम', visible: true, sortable: true },
    // { key: 'permanentAddress', label: 'स्थायी पता', visible: true },
    // { key: 'currentAddress', label: 'वर्तमान पता', visible: true },
    // { key: 'mobile', label: 'मोबाइल नंबर', visible: true },
    { key: 'property_category', label: 'श्रेणी', visible: true, sortable: true },
    { key: 'property_number', label: 'भूखंड संख्या', visible: true },
    { key: 'registration_amount', label: 'पंजीकरण धनराशि', visible: true, sortable: true },
    { key: 'registration_date', label: 'पंजीकरण दिनांक', visible: true },
    // { key: 'applicationAmount', label: 'आवेदन धनराशि', visible: true, sortable: true },
    // { key: 'applicationDate', label: 'आवेदन दिनांक', visible: true }
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: null, 
    direction: 'asc' 
  });

  const toggleColumnVisibility = (key: keyof PropertyRecord) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSort = (key: keyof PropertyRecord) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    showColumnSelector,
    setShowColumnSelector,
    showFilters,
    setShowFilters,
    columns,
    setColumns,
    sortConfig,
    setSortConfig,
    toggleColumnVisibility,
    handleSort
  };
}



// import { useState } from 'react';
// import { PropertyRecord } from '../../../types';

// export interface Column {
//   key: keyof PropertyRecord;
//   label: string;
//   visible: boolean;
//   sortable?: boolean;
// }

// export interface SortConfig {
//   key: keyof PropertyRecord | null;
//   direction: 'asc' | 'desc';
// }

// export function useTableState() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [showColumnSelector, setShowColumnSelector] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [columns, setColumns] = useState<Column[]>([
//     // { key: 'id', label: '', visible: true, sortable: true },
//     { key: 'checkbox', label: '', visible: true },
//     { key: 'serial_number', label: 'क्रम', visible: true, sortable: true },
//     { key: 'scheme_name', label: 'योजना का नाम', visible: true, sortable: true },
//     { key: 'property_unique_id', label: 'Property Unique ID', visible: true, sortable: true },
//     { key: 'owner_name', label: 'आवंटी का नाम', visible: true, sortable: true },
//     // { key: 'fatherName', label: 'पिता/पति का नाम', visible: true, sortable: true },
//     // { key: 'permanentAddress', label: 'स्थायी पता', visible: true },
//     // { key: 'currentAddress', label: 'वर्तमान पता', visible: true },
//     // { key: 'mobile', label: 'मोबाइल नंबर', visible: true },
//     { key: 'category', label: 'श्रेणी', visible: true, sortable: true },
//     { key: 'property_number', label: 'भूखंड संख्या', visible: true },
//     { key: 'registration_amount', label: 'पंजीकरण धनराशि', visible: true, sortable: true },
//     { key: 'registration_date', label: 'पंजीकरण दिनांक', visible: true },
//     // { key: 'applicationAmount', label: 'आवेदन धनराशि', visible: true, sortable: true },
//     // { key: 'applicationDate', label: 'आवेदन दिनांक', visible: true }
//   ]);

//   const [sortConfig, setSortConfig] = useState<SortConfig>({ 
//     key: null, 
//     direction: 'asc' 
//   });

//   const toggleColumnVisibility = (key: keyof PropertyRecord) => {
//     setColumns(prevColumns =>
//       prevColumns.map(col =>
//         col.key === key ? { ...col, visible: !col.visible } : col
//       )
//     );
//   };

//   const handleSort = (key: keyof PropertyRecord) => {
//     setSortConfig({
//       key,
//       direction:
//         sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
//     });
//   };

//   return {
//     searchTerm,
//     setSearchTerm,
//     currentPage,
//     setCurrentPage,
//     itemsPerPage,
//     showColumnSelector,
//     setShowColumnSelector,
//     showFilters,
//     setShowFilters,
//     columns,
//     setColumns,
//     sortConfig,
//     setSortConfig,
//     toggleColumnVisibility,
//     handleSort
//   };
// }