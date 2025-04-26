-- Tạo bảng api_keys trong Supabase

create table api_keys (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null,
  key text not null unique,
  usage integer default 0,
  created_at timestamp with time zone default now(),
  last_used_at timestamp with time zone
); 