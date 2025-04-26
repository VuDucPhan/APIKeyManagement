export interface ApiKey {
  id: string;
  name: string;
  type: string;
  usage: number;
  key: string;
  created_at: string;
  last_used_at: string | null;
} 