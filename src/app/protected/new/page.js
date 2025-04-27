import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Link from "next/link";
import { redirect } from "next/navigation";

// Make this a dynamic route to fix the error
export const dynamic = 'force-dynamic';

export default async function ProtectedPage() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      redirect("/auth/signin?callbackUrl=/protected/new");
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <h1 className="text-2xl font-bold">Protected Page</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You are logged in as: <span className="font-medium">{session?.user?.name}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Email: <span className="font-medium">{session?.user?.email}</span>
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Return to home page
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Authentication error:', error);
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please ensure you have correctly configured NextAuth and Google OAuth.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Return to home page
            </Link>
          </div>
        </div>
      </div>
    );
  }
} 