import codesApiClient from './codesApiClient';
import type {
  Code,
  AddCodeRequest,
  AddCodeResponse,
  CodesListResponse,
  CodesListParams,
  DeleteCodeResponse,
  UpdateNowResponse,
  CodeDetailsResponse,
  CodeStatus,
} from '../types';

export const codesService = {
  // Add codes (single or multiple)
  addCodes: async (data: AddCodeRequest): Promise<AddCodeResponse> => {
    const response = await codesApiClient.post<AddCodeResponse>('/api/codes', data);
    return response.data;
  },

  // List codes with pagination and filter
  listCodes: async (params: CodesListParams = {}): Promise<CodesListResponse> => {
    if (USE_MOCK) {
      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 600));

      const { page = 1, limit = 10, status = 'all' } = params;

      const allCodes = getMockCodes();
      const userId = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!).id
        : 'unknown';

      // Filter by user and status
      let filtered = allCodes.filter((c) => c.userId === userId);

      if (status !== 'all') {
        filtered = filtered.filter((c) => c.status === status);
      }

      // Sort by most recent first
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCodes = filtered.slice(startIndex, endIndex);

      return {
        codes: paginatedCodes,
        total: filtered.length,
        page,
        limit,
        hasMore: endIndex < filtered.length,
      };
    }

    // Real API implementation
    const response = await codesApiClient.get<CodesListResponse>('/api/codes', { params });
    return response.data;
  },

  // Delete a code
  deleteCode: async (codeId: string): Promise<DeleteCodeResponse> => {
    const response = await codesApiClient.delete<DeleteCodeResponse>(`/api/codes/${codeId}`);
    return response.data;
  },

  // List codes with pagination and filter
  listCodes: async (params: CodesListParams = {}): Promise<CodesListResponse> => {
    const response = await codesApiClient.get<CodesListResponse>('/api/codes', { params });
    return response.data;
  },  : 'unknown';

    const code = codes.find((c) => c.id === codeId && c.userId === userId);

    if (!code) {
      throw new Error('Código não encontrado');
    }

    return code;

    // Real implementation:
    // const response = await apiClient.get<Code>(`/codes/${codeId}`);
    // return response.data;
  },

  // Get code consultation details
  getCodeDetails: async (codeId: string): Promise<CodeDetailsResponse> => {
    if (USE_MOCK) {
      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        success: true,
  // Update all codes status now
  updateNow: async (): Promise<UpdateNowResponse> => {
    const response = await codesApiClient.post<UpdateNowResponse>('/api/codes/update-now');
    return response.data;
  },  // Get code consultation details
  getCodeDetails: async (codeId: string): Promise<CodeDetailsResponse> => {
    const response = await codesApiClient.get<CodeDetailsResponse>(`/api/codes/${codeId}/details`);
    return response.data;
  },