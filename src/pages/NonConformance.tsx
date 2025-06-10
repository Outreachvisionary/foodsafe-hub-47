import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, RefreshCcw, Filter } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { NonConformance as NCType } from '@/types/non-conformance';
import { useNonConformances } from '@/hooks/useNonConformances';
import NCList from '@/components/non-conformance/NCList';
import NCDashboard from '@/components/non-conformance/NCDashboard';
import NCDetailsForm from '@/components/non-conformance/NCDetailsForm';
import SidebarLayout from '@/components/layout/SidebarLayout';

const NonConformance: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNC, setSelectedNC] = useState<NCType | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    nonConformances,
    loading,
    error,
    fetchNonConformances,
    createNonConformance,
    updateNonConformance
  } = useNonConformances();

  useEffect(() => {
    fetchNonConformances();
  }, []);

  useEffect(() => {
    if (id) {
      const nc = nonConformances?.find((nc) => nc.id === id);
      setSelectedNC(nc || null);
    } else {
      setSelectedNC(null);
    }
  }, [id, nonConformances]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredNonConformances = nonConformances?.filter((nc) => {
    const searchStr = `${nc.title} ${nc.description} ${nc.reference_number}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  const handleCreate = async (ncData: Omit<NCType, 'id'>) => {
    try {
      await createNonConformance(ncData);
      setShowCreateForm(false);
      fetchNonConformances();
    } catch (err) {
      console.error('Error creating non-conformance:', err);
    }
  };

  const handleUpdate = async (id: string, ncData: Partial<NCType>) => {
    try {
      await updateNonConformance(id, ncData);
      fetchNonConformances();
      setSelectedNC(prev => prev ? { ...prev, ...ncData } : null);
    } catch (err) {
      console.error('Error updating non-conformance:', err);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Non-Conformance Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage non-conforming events
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => fetchNonConformances()}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create NC
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Non-Conformances</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              {id && <TabsTrigger value="details">Details</TabsTrigger>}
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search NCs..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <NCList
              nonConformances={filteredNonConformances}
              loading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="dashboard">
            <NCDashboard />
          </TabsContent>

          {id && (
            <TabsContent value="details">
              {selectedNC ? (
                <NCDetailsForm
                  nonConformance={selectedNC}
                  onUpdate={handleUpdate}
                />
              ) : (
                <Card>
                  <CardContent>
                    <p>Loading non-conformance details...</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="max-w-2xl w-full">
              <CardHeader>
                <CardTitle>Create Non-Conformance</CardTitle>
              </CardHeader>
              <CardContent>
                <NCDetailsForm onCreate={handleCreate} />
              </CardContent>
              <div className="flex justify-end p-4">
                <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default NonConformance;
