import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { key } = body;
    
    if (!key) {
      return NextResponse.json(
        { message: 'Invalid API key' },
        { status: 400 }
      );
    }
    
    // Kiểm tra trực tiếp từ Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 là lỗi "không tìm thấy dữ liệu"
      console.error('Lỗi Supabase:', error);
      return NextResponse.json(
        { message: 'Invalid API key' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json({ message: 'Invalid API key' }, { status: 401 });
    }
    
    // Cập nhật số lần sử dụng và thời gian sử dụng cuối
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({
        usage: (data.usage || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', data.id);
    
    if (updateError) {
      console.warn('Không thể cập nhật thông tin sử dụng API key:', updateError);
    }
    
    return NextResponse.json({
      message: 'Valid API Key',
      valid: true,
      keyData: {
        id: data.id,
        name: data.name,
        type: data.type,
        usage: (data.usage || 0) + 1,
        createdAt: data.created_at
      }
    });
  } catch (error) {
    console.error('Lỗi khi xác thực API key:', error);
    return NextResponse.json(
      { message: 'Invalid API key' },
      { status: 500 }
    );
  }
} 