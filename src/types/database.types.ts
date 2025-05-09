export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string
          name: string
          type: string
          key: string
          usage: number
          created_at: string
          last_used_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          key: string
          usage?: number
          created_at?: string
          last_used_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          key?: string
          usage?: number
          created_at?: string
          last_used_at?: string | null
        }
      }
    }
  }
} 