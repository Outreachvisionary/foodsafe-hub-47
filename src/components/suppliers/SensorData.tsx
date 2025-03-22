
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Thermometer, Droplets, AlertTriangle } from 'lucide-react';
import { MonitoringData } from '@/types/supplier';

interface SensorDataProps {
  data: MonitoringData;
  standard: string;
}

const SensorData: React.FC<SensorDataProps> = ({ data, standard }) => {
  // Define temperature threshold based on the FSMS standard
  const getTemperatureThreshold = (standard: string) => {
    switch(standard) {
      case 'HACCP':
        return 4; // 4°C for HACCP cold chain
      case 'BRC GS2':
        return 5; // 5°C for BRC
      default:
        return 5; // Default threshold
    }
  };
  
  const temperatureThreshold = getTemperatureThreshold(standard);
  const isTemperatureAlert = data.temperature > temperatureThreshold;
  
  // Define humidity thresholds
  const isHumidityAlert = data.humidity > 75 || data.humidity < 30;
  
  return (
    <Card className="border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          Sensor Data - {data.locationName}
          {data.status !== 'Normal' && (
            <span className="ml-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </span>
          )}
        </CardTitle>
        <p className="text-xs text-gray-500">
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-md flex items-center space-x-3 ${isTemperatureAlert ? 'bg-red-50' : 'bg-blue-50'}`}>
            <Thermometer className={`h-8 w-8 ${isTemperatureAlert ? 'text-red-500' : 'text-blue-500'}`} />
            <div>
              <p className="text-sm font-medium">Temperature</p>
              <p className={`text-xl font-bold ${isTemperatureAlert ? 'text-red-600' : 'text-blue-600'}`}>
                {data.temperature}°C
              </p>
            </div>
          </div>
          
          <div className={`p-3 rounded-md flex items-center space-x-3 ${isHumidityAlert ? 'bg-amber-50' : 'bg-blue-50'}`}>
            <Droplets className={`h-8 w-8 ${isHumidityAlert ? 'text-amber-500' : 'text-blue-500'}`} />
            <div>
              <p className="text-sm font-medium">Humidity</p>
              <p className={`text-xl font-bold ${isHumidityAlert ? 'text-amber-600' : 'text-blue-600'}`}>
                {data.humidity}%
              </p>
            </div>
          </div>
        </div>
        
        {(isTemperatureAlert || isHumidityAlert) && (
          <Alert variant="destructive" className="mt-4 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Compliance Alert</AlertTitle>
            <AlertDescription>
              {isTemperatureAlert && (
                <p>Temperature exceeds {standard} threshold of {temperatureThreshold}°C.</p>
              )}
              {isHumidityAlert && (
                <p>Humidity is outside acceptable range (30-75%).</p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorData;
