
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city/lib/interface';

// Get all countries
export const getAllCountries = (): ICountry[] => {
  return Country.getAllCountries();
};

// Get states for a country
export const getStatesForCountry = (countryCode: string): IState[] => {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode);
};

// Get cities for a state and country
export const getCitiesForState = (countryCode: string, stateCode: string): ICity[] => {
  if (!countryCode || !stateCode) return [];
  return City.getCitiesOfState(countryCode, stateCode);
};

// Capitalize location name
export const capitalizeLocation = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Zipcode validation patterns by country
export const zipcodePatterns: Record<string, { pattern: RegExp, example: string }> = {
  'US': { pattern: /^\d{5}(-\d{4})?$/, example: '12345 or 12345-6789' },
  'CA': { pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, example: 'A1A 1A1' },
  'GB': { pattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/, example: 'AB1 1AB' },
  'IN': { pattern: /^\d{6}$/, example: '123456' },
  'DE': { pattern: /^\d{5}$/, example: '12345' },
  'default': { pattern: /^[A-Za-z0-9 -]{3,10}$/, example: 'Valid postal code' }
};

// Validate zipcode based on country
export const validateZipcode = (zipcode: string, countryCode: string): boolean => {
  const pattern = zipcodePatterns[countryCode]?.pattern || zipcodePatterns.default.pattern;
  return pattern.test(zipcode);
};

// Get zipcode validation example for a country
export const getZipcodeExample = (countryCode: string): string => {
  return zipcodePatterns[countryCode]?.example || zipcodePatterns.default.example;
};
