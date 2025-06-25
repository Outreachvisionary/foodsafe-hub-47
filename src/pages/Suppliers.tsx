
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCcw, MapPin, Phone, Mail } from 'lucide-react';
import ModuleLayout from '@/components/shared/ModuleLayout';
import DataTable from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  compliance_status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  products: string[];
  status: string;
  risk_score: number;
  last_audit_date?: string;
  created_at: string;
}

const Suppliers: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, suppliers]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Fresh Produce Co.',
          category: 'Raw Materials',
          country: 'USA',
          compliance_status: 'Compliant',
          contact_name: 'John Smith',
          contact_email: 'john@freshproduce.com',
          contact_phone: '+1-555-0123',
          products: ['Vegetables', 'Fruits'],
          status: 'Active',
          risk_score: 85,
          last_audit_date: '2024-01-15',
          created_at: '2023-06-01'
        }
      ];
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...suppliers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.category.toLowerCase().includes(query) ||
        supplier.country.toLowerCase().includes(query)
      );
    }

    setFilteredSuppliers(filtered);
  };

  const handleSupplierClick = (supplier: Supplier) => {
    navigate(`/suppliers/${supplier.id}`);
  };

  const getStats = () => {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'Active').length;
    const compliant = suppliers.filter(s => s.compliance_status === 'Compliant').length;
    const highRisk = suppliers.filter(s => s.risk_score < 70).length;

    return [
      { label: 'Total Suppliers', value: total, color: 'text-blue-600', bgColor: 'bg-blue-500' },
      { label: 'Active', value: active, color: 'text-green-600', bgColor: 'bg-green-500' },
      { label: 'Compliant', value: compliant, color: 'text-green-600', bgColor: 'bg-green-500' },
      { label: 'High Risk', value: highRisk, color: 'text-red-600', bgColor: 'bg-red-500' }
    ];
  };

  const columns = [
    {
      key: 'name',
      label: 'Supplier',
      render: (value: string, item: Supplier) => (
        <div className="cursor-pointer hover:text-primary" onClick={() => handleSupplierClick(item)}>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.country}
          </div>
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    { key: 'compliance_status', label: 'Compliance' },
    { key: 'status', label: 'Status' },
    {
      key: 'risk_score',
      label: 'Risk Score',
      render: (value: number) => (
        <Badge className={value >= 80 ? 'bg-green-100 text-green-800' : value >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
          {value}/100
        </Badge>
      )
    },
    { key: 'last_audit_date', label: 'Last Audit' }
  ];

  const actions = (
    <Button variant="outline" onClick={fetchSuppliers} disabled={loading}>
      <RefreshCcw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
  );

  return (
    <div className="p-6">
      <ModuleLayout
        title="Supplier Management"
        subtitle="Manage and monitor supplier relationships and compliance"
        searchPlaceholder="Search suppliers by name, category, or country..."
        onSearch={setSearchQuery}
        onCreateNew={() => navigate('/suppliers/create')}
        createButtonText="Add Supplier"
        stats={getStats()}
        actions={actions}
      >
        <DataTable
          columns={columns}
          data={filteredSuppliers}
          loading={loading}
          onView={handleSupplierClick}
          emptyMessage="No suppliers found"
        />
      </ModuleLayout>
    </div>
  );
};

export default Suppliers;
