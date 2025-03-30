
import React, { useState, useEffect } from 'react';
import { ICountry, IState, ICity } from 'country-state-city/lib/interface';
import { 
  getAllCountries, 
  getStatesForCountry, 
  getCitiesForState,
  validateZipcode,
  getZipcodeExample
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
  SelectValue
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
  className
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    initialData?.countryCode
  );
  const [selectedState, setSelectedState] = useState<string | undefined>(
    initialData?.stateCode
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    initialData?.city
  );
  const [address, setAddress] = useState<string | undefined>(
    initialData?.address
  );
  const [zipcode, setZipcode] = useState<string | undefined>(
    initialData?.zipcode
  );
  
  const [zipcodeError, setZipcodeError] = useState<string | null>(null);

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const allCountries = getAllCountries();
        console.log('Loaded countries:', allCountries.length);
        setCountries(allCountries);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCountries();
  }, []);

  // Set initial values from initialData when component mounts
  useEffect(() => {
    if (initialData) {
      console.log('Setting initial location data:', initialData);
      if (initialData.countryCode) {
        setSelectedCountry(initialData.countryCode);
      }
      if (initialData.stateCode) {
        setSelectedState(initialData.stateCode);
      }
      if (initialData.city) {
        setSelectedCity(initialData.city);
      }
      if (initialData.address) {
        setAddress(initialData.address);
      }
      if (initialData.zipcode) {
        setZipcode(initialData.zipcode);
      }
    }
  }, [initialData]);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      console.log('Loading states for country:', selectedCountry);
      const statesForCountry = getStatesForCountry(selectedCountry);
      console.log('Loaded states:', statesForCountry.length);
      setStates(statesForCountry);
      
      // Reset state and city if country changes
      if (!initialData || selectedCountry !== initialData.countryCode) {
        setSelectedState(undefined);
        setSelectedCity(undefined);
      }
    } else {
      setStates([]);
      setSelectedState(undefined);
      setSelectedCity(undefined);
    }
  }, [selectedCountry, initialData]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      console.log('Loading cities for state:', selectedState, 'in country:', selectedCountry);
      const citiesForState = getCitiesForState(selectedCountry, selectedState);
      console.log('Loaded cities:', citiesForState.length);
      setCities(citiesForState);
      
      // Reset city if state changes
      if (!initialData || selectedState !== initialData.stateCode) {
        setSelectedCity(undefined);
      }
    } else {
      setCities([]);
      setSelectedCity(undefined);
    }
  }, [selectedCountry, selectedState, initialData]);

  // Validate zipcode
  useEffect(() => {
    if (zipcode && selectedCountry) {
      const isValid = validateZipcode(zipcode, selectedCountry);
      if (!isValid) {
        setZipcodeError(`Invalid format. Example: ${getZipcodeExample(selectedCountry)}`);
      } else {
        setZipcodeError(null);
      }
    } else {
      setZipcodeError(null);
    }
  }, [zipcode, selectedCountry]);

  // Update parent component with location data
  useEffect(() => {
    const selectedCountryObj = countries.find(c => c.isoCode === selectedCountry);
    const selectedStateObj = states.find(s => s.isoCode === selectedState);
    
    const locationData: LocationData = {
      countryCode: selectedCountry,
      country: selectedCountryObj?.name,
      stateCode: selectedState,
      state: selectedStateObj?.name,
      city: selectedCity,
      zipcode,
      address
    };
    
    console.log('Location data updated:', locationData);
    onChange(locationData);
  }, [selectedCountry, selectedState, selectedCity, zipcode, address, countries, states, onChange]);

  const handleCountryChange = (value: string) => {
    console.log('Country selected:', value);
    setSelectedCountry(value);
  };

  const handleStateChange = (value: string) => {
    console.log('State selected:', value);
    setSelectedState(value);
  };

  const handleCityChange = (value: string) => {
    console.log('City selected:', value);
    setSelectedCity(value);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select
              value={selectedCountry}
              onValueChange={handleCountryChange}
              disabled={disabled || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country">
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
        </div>
        
        <div>
          <FormItem>
            <FormLabel>State/Province</FormLabel>
            <Select
              value={selectedState}
              onValueChange={handleStateChange}
              disabled={disabled || !selectedCountry || states.length === 0}
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
                    <SelectLabel>States</SelectLabel>
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
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormItem>
            <FormLabel>City</FormLabel>
            <Select
              value={selectedCity}
              onValueChange={handleCityChange}
              disabled={disabled || !selectedState || cities.length === 0}
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
                    <SelectLabel>Cities</SelectLabel>
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
        </div>
        
        <div>
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
        </div>
      </div>
      
      <div>
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
    </div>
  );
};

export default LocationForm;
