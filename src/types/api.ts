export interface ApiErrorBody {
  error?: string;
  message?: string;
  [field: string]: unknown;
}
