import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Danh sách đường dẫn công khai không cần xác thực
  const publicPaths = ["/", "/auth/signin"];
  const isPublicPath = publicPaths.includes(path);
  
  // Kiểm tra xem có phải đường dẫn cần xác thực không (api-keys, protected)
  const isProtectedPath = path.startsWith('/api-keys') || path.startsWith('/protected');
  
  // Nếu không phải đường dẫn công khai và không cần xác thực, cho phép truy cập
  if (!isPublicPath && !isProtectedPath) {
    return NextResponse.next();
  }

  // Kiểm tra token người dùng
  let token;
  try {
    token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log(`Middleware kiểm tra đường dẫn: ${path}, token hợp lệ: ${!!token}`);
  } catch (error) {
    console.error(`Lỗi xác thực token cho đường dẫn ${path}:`, error);
    // Trong trường hợp lỗi, cho phép truy cập vào trang công khai
    if (isPublicPath) {
      return NextResponse.next();
    }
  }

  // Chuyển hướng người dùng chưa đăng nhập đến trang đăng nhập
  if (!token && isProtectedPath) {
    console.log(`Chuyển hướng từ ${path} đến trang đăng nhập vì chưa xác thực`);
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Chuyển hướng người dùng đã đăng nhập khỏi trang đăng nhập
  if (token && path === "/auth/signin") {
    console.log('Người dùng đã đăng nhập, chuyển hướng khỏi trang đăng nhập');
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các đường dẫn này
export const config = {
  matcher: [
    /*
     * Các đường dẫn cần kiểm tra xác thực
     * - Trang đăng nhập
     * - Trang quản lý API key
     * - Trang được bảo vệ
     */
    "/",
    "/auth/signin",
    "/api-keys/:path*",
    "/protected/:path*",
  ],
}; 