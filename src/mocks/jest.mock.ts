
// Mock of Jest functionality for testing
const createMockFn = () => {
  const mockFn = (...args: any[]) => {
    mockFn.mock.calls.push(args);
    const result = mockFn._implementation ? mockFn._implementation(...args) : undefined;
    return result;
  };

  mockFn.mock = {
    calls: [],
    instances: [],
    invocationCallOrder: [],
    results: [],
    contexts: []
  };

  mockFn._implementation = null;

  mockFn.mockImplementation = (implementation: (...args: any[]) => any) => {
    mockFn._implementation = implementation;
    mockFn.mock.results.push({ type: 'return', value: implementation });
    return mockFn;
  };

  mockFn.mockResolvedValue = (value: any) => {
    return mockFn.mockImplementation(() => Promise.resolve(value));
  };

  mockFn.mockRejectedValue = (error: any) => {
    return mockFn.mockImplementation(() => Promise.reject(error));
  };

  mockFn.mockReturnValue = (value: any) => {
    return mockFn.mockImplementation(() => value);
  };

  return mockFn;
};

const jestMock = {
  fn: createMockFn,
  spyOn: (_obj: any, _method: string) => createMockFn(),
  mock: (_moduleName: string) => ({
    __esModule: true,
    default: createMockFn()
  }),
  resetAllMocks: () => {
    // Reset functionality would be implemented here
    console.log('Mock reset');
  }
};

export default jestMock;
