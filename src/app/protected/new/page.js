import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      redirect("/auth/signin?callbackUrl=/protected/new");
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <h1 className="text-2xl font-bold">Trang Được Bảo Vệ</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn đã đăng nhập với tên: <span className="font-medium">{session?.user?.name}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Email: <span className="font-medium">{session?.user?.email}</span>
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-red-600">Đã xảy ra lỗi xác thực</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng đảm bảo bạn đã cấu hình NextAuth và Google OAuth chính xác.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }
} 