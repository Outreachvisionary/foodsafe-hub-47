import React, { useState, useEffect } from 'react';
import { ICountry, IState, ICity } from 'country-state-city/lib/interface';
import {
  getAllCountries,
  getStatesForCountry,
  getCitiesForState,
  validateZipcode,
  getZipcodeExample,
} from '@/utils/locationUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export interface LocationData {
  country?: string;
  countryCode?: string;
  state?: string;
  stateCode?: string;
  city?: string;
  zipcode?: string;
  address?: string;
}

interface LocationFormProps {
  initialData?: LocationData;
  onChange: (data: LocationData) => void;
  showValidationErrors?: boolean;
  disabled?: boolean;
  className?: string;
}

const LocationForm: React.FC<LocationFormProps> = ({
  initialData,
  onChange,
  showValidationErrors = false,
  disabled = false,
  className,
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true);
  const [loadingStates, setLoadingStates] = useState<boolean>(false);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);

  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(initialData?.countryCode);
  const [selectedState, setSelectedState] = useState<string | undefined>(initialData?.stateCode);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(initialData?.city);
  
  const [address, setAddress] = useState<string | undefined>(initialData?.address);
  const [zipcode, setZipcode] = useState<string | undefined>(initialData?.zipcode);
  
  const [zipcodeError, setZipcodeError] = useState<string | null>(null);

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const allCountries = getAllCountries();
        setCountries(allCountries);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true);
      try {
        const statesForCountry = getStatesForCountry(selectedCountry);
        setStates(statesForCountry);
        setSelectedState(undefined); // Reset state when country changes
        setSelectedCity(undefined); // Reset city when country changes
      } catch (error) {
        console.error('Error loading states:', error);
      } finally {
        setLoadingStates(false);
      }
    } else {
      setStates([]);
      setSelectedState(undefined);
      setSelectedCity(undefined);
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoadingCities(true);
      try {
        const citiesForState = getCitiesForState(selectedCountry, selectedState);
        setCities(citiesForState);
        setSelectedCity(undefined); // Reset city when state changes
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCities([]);
      setSelectedCity(undefined);
    }
  }, [selectedCountry, selectedState]);

  // Validate zipcode
  useEffect(() => {
    if (zipcode && selectedCountry) {
      const isValid = validateZipcode(zipcode, selectedCountry);
      if (!isValid) {
        const example = getZipcodeExample(selectedCountry) || 'N/A';
        setZipcodeError(`Invalid format. Example: ${example}`);
      } else {
        setZipcodeError(null);
      }
    } else {
      setZipcodeError(null);
    }
  }, [zipcode, selectedCountry]);

  // Notify parent component of location data changes
  useEffect(() => {
    const selectedCountryObj = countries.find((c) => c.isoCode === selectedCountry);
    const selectedStateObj = states.find((s) => s.isoCode === selectedState);

    onChange({
      countryCode: selectedCountry,
      country: selectedCountryObj?.name,
      stateCode: selectedState,
      state: selectedStateObj?.name,
      city: selectedCity,
      zipcode,
      address,
    });
  }, [selectedCountry, selectedState, selectedCity, zipcode, address]);

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Country Selector */}
      <FormItem>
        <FormLabel>Country</FormLabel>
        <Select
          value={selectedCountry}
          onValueChange={setSelectedCountry}
          disabled={disabled || loadingCountries}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country">
              {loadingCountries && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Countries</SelectLabel>
              {countries.map((country) => (
                <SelectItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormItem>

      {/* State Selector */}
      <FormItem>
        <FormLabel>State/Province</FormLabel>
        <Select
          value={selectedState}
          onValueChange={setSelectedState}
          disabled={disabled || !selectedCountry || loadingStates}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {states.length === 0 ? (
              <SelectItem value="no-states" disabled>
                {selectedCountry ? 'No states available' : 'Select a country first'}
              </SelectItem>
            ) : (
              <SelectGroup>
                {states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      </FormItem>

      {/* City Selector */}
      <FormItem>
        <FormLabel>City</FormLabel>
        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
          disabled={disabled || !selectedState || loadingCities}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.length === 0 ? (
              <SelectItem value="no-cities" disabled>
                {selectedState ? 'No cities available' : 'Select a state first'}
              </SelectItem>
            ) : (
              <SelectGroup>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      </FormItem>

      {/* Zip Code Input */}
      <FormItem>
        <FormLabel>Postal/Zip Code</FormLabel>
        <Input
          placeholder="Enter postal code"
          value={zipcode || ''}
          onChange={(e) => setZipcode(e.target.value)}
          disabled={disabled || !selectedCountry}
        />
        {showValidationErrors && zipcodeError && (
          <FormMessage>{zipcodeError}</FormMessage>
        )}
      </FormItem>

      {/* Address Input */}
      <FormItem>
        <FormLabel>Address</FormLabel>
        <Input
          placeholder="Enter street address"
          value={address || ''}
          onChange={(e) => setAddress(e.target.value)}
          disabled={disabled}
        />
      </FormItem>

    </div>
  );
};

export default LocationForm;
