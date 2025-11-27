import codesApiClient from './codesApiClient';
import type {
  AddCodeRequest,
  AddCodeResponse,
  CodesListResponse,
  CodesListParams,
  DeleteCodeResponse,
  UpdateNowResponse,
  CodeDetailsResponse,
} from '../types';

export const codesService = {
  // Add codes (single or multiple)
  addCodes: async (data: AddCodeRequest): Promise<AddCodeResponse> => {
    const response = await codesApiClient.post<AddCodeResponse>('/api/codes', data);
    return response.data;
  },

  // List codes with pagination and filter
  listCodes: async (params: CodesListParams = {}): Promise<CodesListResponse> => {
    const response = await codesApiClient.get<CodesListResponse>('/api/codes', { params });
    return response.data;
  },

  // Delete a code
  deleteCode: async (codeId: string): Promise<DeleteCodeResponse> => {
    const response = await codesApiClient.delete<DeleteCodeResponse>(`/api/codes/${codeId}`);
    return response.data;
  },

  // Update all codes status now
  updateNow: async (): Promise<UpdateNowResponse> => {
    const response = await codesApiClient.post<UpdateNowResponse>('/api/codes/update-now');
    return response.data;
  },

  // Get code consultation details
  getCodeDetails: async (codeId: string): Promise<CodeDetailsResponse> => {
    const response = await codesApiClient.get<CodeDetailsResponse>(`/api/codes/${codeId}/details`);
    return response.data;
  },
};