
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Country, State } from 'country-state-city';
import { ICountry, IState } from 'country-state-city/lib/interface';
import { X } from 'lucide-react';

interface FacilityFiltersProps {
  onFilterChange: (filters: { country?: string, state?: string, city?: string }) => void;
  className?: string;
}

const FacilityFilters: React.FC<FacilityFiltersProps> = ({ onFilterChange, className }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  
  // Load countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);
  
  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const statesForCountry = State.getStatesOfCountry(selectedCountry);
      setStates(statesForCountry);
      
      // Reset state and city selections when country changes
      if (selectedState) {
        setSelectedState(undefined);
        setSelectedCity(undefined);
      }
    } else {
      setStates([]);
      setSelectedState(undefined);
      setSelectedCity(undefined);
    }
  }, [selectedCountry]);
  
  // Notify parent component when filters change
  useEffect(() => {
    const selectedCountryObj = countries.find(c => c.isoCode === selectedCountry);
    const selectedStateObj = states.find(s => s.isoCode === selectedState);
    
    onFilterChange({
      country: selectedCountryObj?.name,
      state: selectedStateObj?.name,
      city: selectedCity
    });
  }, [selectedCountry, selectedState, selectedCity, onFilterChange, countries, states]);
  
  const clearFilters = () => {
    setSelectedCountry(undefined);
    setSelectedState(undefined);
    setSelectedCity(undefined);
  };
  
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filter by Location</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="h-8 px-2"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium mb-1 block">Country</Label>
          <Select
            value={selectedCountry}
            onValueChange={setSelectedCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-1 block">State/Province</Label>
          <Select
            value={selectedState}
            onValueChange={setSelectedState}
            disabled={!selectedCountry || states.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedCountry ? "Any state" : "Select a country first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* We could add a city dropdown here, but it would require additional API calls */}
      </div>
    </Card>
  );
};

export default FacilityFilters;
