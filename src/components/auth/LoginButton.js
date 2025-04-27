"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn("google", { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading || isSigningIn) {
    return (
      <button
        disabled
        className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        <span className="h-4 w-4 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></span>
        Đang tải...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-sm sm:flex">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "Avatar"}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {session.user.name?.charAt(0) || "U"}
            </div>
          )}
          <span className="hidden lg:inline">{session.user.name}</span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <Image src="/google-logo.svg" alt="Google" width={16} height={16} />
      <span>Đăng nhập</span>
    </button>
  );
} 