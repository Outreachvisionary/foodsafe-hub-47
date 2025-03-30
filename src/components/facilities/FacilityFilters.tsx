import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Country, State } from 'country-state-city';
import { ICountry, IState } from 'country-state-city/lib/interface';
import { X } from 'lucide-react';

interface FacilityFiltersProps {
  onFilterChange: (filters: { country?: string; state?: string; city?: string }) => void;
  className?: string;
}

const FacilityFilters: React.FC<FacilityFiltersProps> = ({ onFilterChange, className }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedState, setSelectedState] = useState<string>();

  // Load countries on initial mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
    } else {
      setStates([]);
    }
    // Reset dependent selections
    setSelectedState(undefined);
  }, [selectedCountry]);

  // Notify parent of filter changes
  useEffect(() => {
    const countryObj = countries.find(c => c.isoCode === selectedCountry);
    const stateObj = states.find(s => s.isoCode === selectedState);
    
    onFilterChange({
      country: countryObj?.name,
      state: stateObj?.name,
      city: undefined // Reserved for future implementation
    });
  }, [selectedCountry, selectedState]);

  const clearFilters = () => {
    setSelectedCountry(undefined);
    setSelectedState(undefined);
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
          aria-label="Clear filters"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium mb-1 block">Country</Label>
          <Select
            value={selectedCountry}
            onValueChange={(value: string) => setSelectedCountry(value)}
          >
            <SelectTrigger aria-label="Select country">
              <SelectValue placeholder="Any country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countries.map((country) => (
                  <SelectItem 
                    key={country.isoCode} 
                    value={country.isoCode}
                    aria-label={country.name}
                  >
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
            onValueChange={(value: string) => setSelectedState(value)}
            disabled={!selectedCountry}
          >
            <SelectTrigger aria-label="Select state/province">
              <SelectValue 
                placeholder={selectedCountry ? "Any state" : "Select country first"} 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {states.map((state) => (
                  <SelectItem 
                    key={state.isoCode} 
                    value={state.isoCode}
                    aria-label={state.name}
                  >
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default FacilityFilters;
