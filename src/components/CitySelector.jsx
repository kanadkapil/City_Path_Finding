import React from 'react';

/**
 * CitySelector component containing the dropdown list of available city networks.
 */
export default function CitySelector({ cities, selectedCity, onCityChange, disabled }) {
  return (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text text-xs text-gray-400">Select City Network</span>
      </label>
      <select
        className="select select-bordered select-sm select-primary w-full bg-base-100 text-sm font-semibold"
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        disabled={disabled}
      >
        {cities.map((city) => (
          <option key={city} value={city}>
            {city} Network
          </option>
        ))}
      </select>
    </div>
  );
}
