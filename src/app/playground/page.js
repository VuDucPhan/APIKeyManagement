"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../api-keys/Sidebar";

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sau khi submit, chuyển hướng đến trang protected với API key qua query param
      router.push(`/protected?key=${encodeURIComponent(apiKey)}`);
    } catch (error) {
      console.error("Lỗi:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 p-6">
        {/* Thanh điều hướng */}
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <span>Pages</span>
          <span className="mx-2">/</span>
          <span>API Playground</span>
        </div>

        {/* Tiêu đề trang */}
        <h1 className="text-3xl font-bold mb-6">API Playground</h1>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">Nhập API Key của bạn</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập API key của bạn ở đây..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Nhập API key của bạn để kiểm tra tính hợp lệ và truy cập vào các tài nguyên được bảo vệ.
              </p>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Xác thực API Key"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 