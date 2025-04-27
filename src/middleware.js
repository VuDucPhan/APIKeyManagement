import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Danh sách đường dẫn công khai không cần xác thực
  const publicPaths = ["/", "/auth/signin"];
  const isPublicPath = publicPaths.includes(path);

  // Kiểm tra token người dùng
  let token;
  try {
    token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    // Trong trường hợp lỗi, cho phép truy cập vào trang công khai
    if (isPublicPath) {
      return NextResponse.next();
    }
  }

  // Chuyển hướng người dùng chưa đăng nhập đến trang đăng nhập
  if (!token && !isPublicPath) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Chuyển hướng người dùng đã đăng nhập khỏi trang đăng nhập
  if (token && path === "/auth/signin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các đường dẫn này
export const config = {
  matcher: [
    "/auth/signin",
    "/api-keys/:path*",
    "/protected/:path*",
  ],
}; 