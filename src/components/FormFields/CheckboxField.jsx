import React from 'react';

const CheckboxField = ({ id, name, value, label, register, errors }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        value={value}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        {...register(name)}
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>

      {errors && errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
};

export default CheckboxField;
