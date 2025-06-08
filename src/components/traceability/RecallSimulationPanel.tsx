
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { RecallSimulation, RecallType } from '@/types/traceability';
import { toast } from 'sonner';

interface RecallSimulationPanelProps {
  onRunSimulation: (simulationData: Omit<RecallSimulation, 'id' | 'created_at' | 'updated_at'>) => Promise<RecallSimulation | null>;
  simulations: RecallSimulation[];
}

const RecallSimulationPanel: React.FC<RecallSimulationPanelProps> = ({
  onRunSimulation,
  simulations
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationType, setSimulationType] = useState<RecallType>('Mock');
  const [affectedProducts, setAffectedProducts] = useState('');
  const [notes, setNotes] = useState('');

  const handleRunSimulation = async () => {
    if (!affectedProducts.trim()) {
      toast.error('Please specify affected products');
      return;
    }

    setIsRunning(true);
    try {
      const simulationData = {
        recall_id: undefined,
        simulation_date: new Date().toISOString(),
        results: {
          affected_products: affectedProducts.split(',').map(p => p.trim()),
          simulation_type: simulationType,
          notes: notes
        },
        duration: Math.floor(Math.random() * 60) + 15, // Random duration 15-75 minutes
        success_rate: Math.random() * 30 + 70, // Random success rate 70-100%
        bottlenecks: 'Communication delays, inventory verification',
        created_by: 'current_user'
      };

      const result = await onRunSimulation(simulationData);
      if (result) {
        toast.success('Recall simulation completed successfully');
        setAffectedProducts('');
        setNotes('');
      }
    } catch (error) {
      console.error('Error running simulation:', error);
      toast.error('Failed to run recall simulation');
    } finally {
      setIsRunning(false);
    }
  };

  const getSuccessRateColor = (rate: number | undefined) => {
    if (!rate) return 'bg-gray-100 text-gray-800';
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Run Recall Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="simulation-type">Simulation Type</Label>
              <Select value={simulationType} onValueChange={(value: RecallType) => setSimulationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mock">Mock Recall</SelectItem>
                  <SelectItem value="Test">Test Recall</SelectItem>
                  <SelectItem value="Actual">Actual Recall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="affected-products">Affected Products (comma-separated)</Label>
              <Input
                id="affected-products"
                placeholder="Product A, Product B, Product C"
                value={affectedProducts}
                onChange={(e) => setAffectedProducts(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Simulation Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific notes or scenarios for this simulation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleRunSimulation} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Simulations</CardTitle>
        </CardHeader>
        <CardContent>
          {simulations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No simulations run yet</p>
              <p className="text-sm">Run your first recall simulation to see results here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {simulations.slice(0, 5).map((simulation) => (
                <div key={simulation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Simulation {simulation.id?.slice(0, 8)}</span>
                    </div>
                    <Badge className={getSuccessRateColor(simulation.success_rate)}>
                      {simulation.success_rate?.toFixed(1)}% Success Rate
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Duration:</span> {simulation.duration} minutes
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(simulation.simulation_date || '').toLocaleDateString()}
                    </div>
                  </div>
                  {simulation.bottlenecks && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700">Bottlenecks:</span> {simulation.bottlenecks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecallSimulationPanel;
