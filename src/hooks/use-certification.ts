
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

type CertificationType = 'spc-basics' | 'spc-advanced' | 'quality-management' | 'compliance' | 'safety';

// This would typically connect to your backend API to verify certifications
// For now, we'll simulate this with local data
const mockCertifications: Record<string, { valid: boolean, expiryDate: string | null }> = {
  'spc-basics': { valid: true, expiryDate: '2024-09-30' },
  'spc-advanced': { valid: false, expiryDate: null },
  'quality-management': { valid: true, expiryDate: '2024-10-15' },
  'compliance': { valid: true, expiryDate: '2024-12-31' },
  'safety': { valid: true, expiryDate: '2025-02-28' }
};

export function useCertification(certificationType: CertificationType) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to check certification status
    const checkCertification = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would be an API call
        // await new Promise(resolve => setTimeout(resolve, 500));
        
        const certData = mockCertifications[certificationType];
        
        if (!certData) {
          setIsValid(false);
          setExpiryDate(null);
        } else {
          setIsValid(certData.valid);
          setExpiryDate(certData.expiryDate);
        }
        
        setError(null);
      } catch (err) {
        setError('Error checking certification status');
        toast({
          title: 'Error',
          description: 'Failed to verify certification status',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkCertification();
  }, [certificationType]);

  return {
    isValid,
    expiryDate,
    isLoading,
    error,
    daysUntilExpiry: expiryDate 
      ? Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null
  };
}
