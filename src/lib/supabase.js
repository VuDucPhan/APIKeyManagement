import { createClient } from '@supabase/supabase-js';

// Lấy giá trị từ biến môi trường hoặc sử dụng giá trị cứng trong trường hợp biến môi trường không hoạt động
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kecyufofrwkqftmgswee.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlY3l1Zm9mcndrcWZ0bWdzd2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDgzNDgsImV4cCI6MjA2MTIyNDM0OH0.OjXkpfvlvNKOWGUNleisgSAGtv1UfZypeFEN4MM3lSg';

console.log('Supabase URL being used:', supabaseUrl);

// Khởi tạo Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey); 