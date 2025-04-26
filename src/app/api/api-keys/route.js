import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Lấy danh sách API keys
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ẩn thông tin API key thật
    const safeData = data.map(key => ({
      ...key,
      key: key.key.substring(0, 8) + '...' + key.key.substring(key.key.length - 4)
    }));

    return NextResponse.json(safeData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Tạo API key mới
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Thiếu thông tin name hoặc type' }, { status: 400 });
    }

    // Tạo API key ngẫu nhiên
    const prefix = type === 'dev' ? 'tvly-dev-' : 'tvly-prod-';
    const randomString = Array(32)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
    const key = prefix + randomString;

    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          type,
          key,
          usage: 0,
          created_at: new Date().toISOString(),
          last_used_at: null
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trả về key đầy đủ cho lần tạo mới
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 