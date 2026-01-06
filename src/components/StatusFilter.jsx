import React from 'react';
import { filterStatusOptions } from '../constants';

const StatusFilter = ({ value, onChange, label = 'Filtrar por:' }) => (
  <div className="flex items-center gap-2">
    <label htmlFor="filtro-status" className="text-sm text-gray-600">
      {label}
    </label>
    <select
      id="filtro-status"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {filterStatusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default StatusFilter;
