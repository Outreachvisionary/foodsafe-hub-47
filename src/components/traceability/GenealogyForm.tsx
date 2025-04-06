
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product, Component, ProductGenealogy } from '@/types/traceability';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const genealogySchema = z.object({
  product_id: z.string().min(1, 'Product is required'),
  component_id: z.string().min(1, 'Component is required'),
  quantity: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type GenealogyFormValues = z.infer<typeof genealogySchema>;

interface GenealogyFormProps {
  initialData?: Partial<ProductGenealogy>;
  products: Product[];
  components: Component[];
  preselectedProductId?: string;
  onSubmit: (data: GenealogyFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const GenealogyForm: React.FC<GenealogyFormProps> = ({
  initialData,
  products,
  components,
  preselectedProductId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const form = useForm<GenealogyFormValues>({
    resolver: zodResolver(genealogySchema),
    defaultValues: {
      product_id: preselectedProductId || initialData?.product_id || '',
      component_id: initialData?.component_id || '',
      quantity: initialData?.quantity || undefined,
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = (values: GenealogyFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData?.id ? 'Edit Genealogy Link' : 'Add Component to Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!preselectedProductId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.batch_lot_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="component_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a component" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {components.map((component) => (
                        <SelectItem key={component.id} value={component.id}>
                          {component.name} ({component.batch_lot_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter quantity (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter notes (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : initialData?.id ? 'Update Link' : 'Add Component to Product'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GenealogyForm;
