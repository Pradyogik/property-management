import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarSchemeListProps {
  isCollapsed: boolean;
}

const schemes = [
  { id: 'property', name: 'Hariyanv', type: 'Residential' },
  { id: 'bida-mart', name: 'Bida Mart', type: 'Commercial' },
  { id: 'jamunipur', name: 'Jamunipur', type: 'Mixed Use' },
];

export function SidebarSchemeList({ isCollapsed }: SidebarSchemeListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isCollapsed) {
    return (
      <div className="py-2">
        <div className="h-px bg-blue-700 my-2" />
        {schemes.map((scheme) => (
          <NavLink
            key={scheme.id}
            to={`/${scheme.id}`}
            className={({ isActive }) =>
              cn(
                'flex justify-center p-3 rounded-lg transition-colors relative group',
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded hidden group-hover:block whitespace-nowrap">
              {scheme.name}
            </div>
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-blue-200 hover:text-white transition-colors"
      >
        <span>Scheme List</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isExpanded ? 'transform rotate-180' : ''
          )}
        />
      </button>

      {isExpanded && (
        <div className="space-y-1">
          {schemes.map((scheme) => (
            <NavLink
              key={scheme.id}
              to={`/schemes/${scheme.id}`}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 p-3 pl-6 rounded-lg transition-colors',
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50'
                )
              }
            >
              <ChevronRight className="h-4 w-4 text-blue-300" />
              <div>
                <span>{scheme.name}</span>
                {/* <p className="text-xs text-blue-300">{scheme.type}</p> */}
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
