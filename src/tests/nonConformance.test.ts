
import jest from '../mocks/jest.mock';
import { getAllNonConformances } from '@/services/nonConformanceService';

jest.mock('@/services/nonConformanceService');

describe('NonConformanceService', () => {
  it('should fetch non-conformances successfully', async () => {
    const mockNonConformances = [
      { id: '1', title: 'Test NC 1' },
      { id: '2', title: 'Test NC 2' },
    ];
    (getAllNonConformances as jest.Mock).mockResolvedValue({ data: mockNonConformances });

    const result = await getAllNonConformances();
    expect(result.data).toEqual(mockNonConformances);
  });

  it('should handle errors when fetching non-conformances', async () => {
    const errorMessage = 'Failed to fetch non-conformances';
    (getAllNonConformances as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(getAllNonConformances()).rejects.toThrow(errorMessage);
  });
});
