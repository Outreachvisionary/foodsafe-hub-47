import jest from '../mocks/jest.mock';
import { fetchNonConformances } from '@/services/nonConformanceService';

jest.mock('@/services/nonConformanceService');

describe('NonConformanceService', () => {
  it('should fetch non-conformances successfully', async () => {
    const mockNonConformances = [
      { id: '1', title: 'Test NC 1' },
      { id: '2', title: 'Test NC 2' },
    ];
    (fetchNonConformances as jest.Mock).mockResolvedValue(mockNonConformances);

    const nonConformances = await fetchNonConformances();
    expect(nonConformances).toEqual(mockNonConformances);
  });

  it('should handle errors when fetching non-conformances', async () => {
    const errorMessage = 'Failed to fetch non-conformances';
    (fetchNonConformances as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchNonConformances()).rejects.toThrow(errorMessage);
  });
});
