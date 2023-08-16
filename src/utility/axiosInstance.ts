import axios, { AxiosInstance } from "axios";

const springAxiosInst: AxiosInstance = axios.create({
    baseURL: 'http://localhost:7777',
    timeout: 2500
})

const fastApiAxiosInst: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 2500
})

export function isAxiosError(error: any): error is import('axios').AxiosError {
    return error.isAxiosError === true;
  }

export default { springAxiosInst, fastApiAxiosInst }