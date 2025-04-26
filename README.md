# API Key Management App

Ứng dụng quản lý API key được xây dựng với Next.js và Supabase.

## Tính năng

- Quản lý API keys: xem, tạo mới, cập nhật, xóa
- Phân quyền API keys theo loại: development và production
- Giao diện người dùng hiện đại với Tailwind CSS

## Yêu cầu

- Node.js phiên bản 18 trở lên
- Tài khoản Supabase

## Cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd api-key-management
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Thiết lập Supabase:

   - Đăng ký tài khoản tại [Supabase](https://supabase.com)
   - Tạo project mới
   - Tạo bảng `api_keys` với schema sau:

   ```sql
   create table api_keys (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     type text not null,
     key text not null unique,
     usage integer default 0,
     created_at timestamp with time zone default now(),
     last_used_at timestamp with time zone
   );
   ```

4. Cấu hình biến môi trường:

   - Tạo file `.env.local` tại thư mục gốc
   - Thêm các biến môi trường sau:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Chạy ứng dụng

### Dev

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

Truy cập ứng dụng tại [http://localhost:3000](http://localhost:3000).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
