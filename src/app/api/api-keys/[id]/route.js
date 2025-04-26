import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// Lấy thông tin của 1 API key
export async function GET(request, { params }) {
  try {
    const { id } = await params;
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

    // Ẩn key đầy đủ
    const safeData = {
      ...data,
      key: data.key.substring(0, 8) + '...' + data.key.substring(data.key.length - 4)
    };

    return NextResponse.json(safeData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Cập nhật thông tin API key
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body; // Chỉ cho phép cập nhật tên

    if (!name) {
      return NextResponse.json({ error: 'Thiếu thông tin name' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'API key không tồn tại' }, { status: 404 });
    }

    // Ẩn key đầy đủ
    const safeData = {
      ...data[0],
      key: data[0].key.substring(0, 8) + '...' + data[0].key.substring(data[0].key.length - 4)
    };

    return NextResponse.json(safeData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Tạo lại API key
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    // Lấy thông tin API key hiện tại
    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!existingKey) {
      return NextResponse.json({ error: 'API key không tồn tại' }, { status: 404 });
    }

    // Tạo API key mới với cùng prefix
    const prefix = existingKey.type === 'dev' ? 'tvly-dev-' : 'tvly-prod-';
    const randomString = Array(32)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
    const newKey = prefix + randomString;

    // Cập nhật key
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        key: newKey,
        last_used_at: null
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trả về key đầy đủ khi tạo lại
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xóa API key
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 