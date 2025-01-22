import axios2, { AxiosResponse, AxiosRequestConfig } from "axios";

export const axios = {
  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<AxiosResponse<T> | { status: number; data: any }> {
    try {
      const res: AxiosResponse<T> = await axios2.post<T, AxiosResponse<T>, D>(
        url,
        data,
        config
      );
      return res;
    } catch (error: any) {
      if (axios2.isAxiosError(error) && error.response) {
        return { status: error.response.status, data: error.response.data };
      }
      throw error;
    }
  },

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T> | { status: number; data: any }> {
    try {
      const res: AxiosResponse<T> = await axios2.get<T>(url, config);
      return res;
    } catch (error: any) {
      if (axios2.isAxiosError(error) && error.response) {
        return { status: error.response.status, data: error.response.data };
      }
      throw error;
    }
  },

  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<AxiosResponse<T> | { status: number; data: any }> {
    try {
      const res: AxiosResponse<T> = await axios2.put<T, AxiosResponse<T>, D>(
        url,
        data,
        config
      );
      return res;
    } catch (error: any) {
      if (axios2.isAxiosError(error) && error.response) {
        return { status: error.response.status, data: error.response.data };
      }
      throw error;
    }
  },

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T> | { status: number; data: any }> {
    try {
      const res: AxiosResponse<T> = await axios2.delete<T>(url, config);
      return res;
    } catch (error: any) {
      if (axios2.isAxiosError(error) && error.response) {
        return { status: error.response.status, data: error.response.data };
      }
      throw error;
    }
  },
};
