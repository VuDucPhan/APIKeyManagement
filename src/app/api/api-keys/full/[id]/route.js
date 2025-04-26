import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

// Lấy API key đầy đủ
export async function GET(request, context) {
  try {
    // Await params trước khi truy cập thuộc tính của nó
    const { id } = await context.params;
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'API key không tồn tại' }, { status: 404 });
    }

    // Trả về key đầy đủ, không ẩn
    return NextResponse.json(data);
  } catch (error) {
    console.error('Lỗi khi lấy API key đầy đủ:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 