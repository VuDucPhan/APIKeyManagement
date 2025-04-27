"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../api-keys/Sidebar";

// Component riêng để xử lý phần phụ thuộc vào useSearchParams
function ProtectedContent() {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [keyData, setKeyData] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("key");

  useEffect(() => {
    if (!apiKey) {
      router.push("/playground");
      return;
    }

    const validateApiKey = async () => {
      try {
        setIsValidating(true);
        
        // Gọi API để xác thực API key
        const response = await fetch('/api/validate-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: apiKey }),
        });
        
        const data = await response.json();
        
        // Kiểm tra kết quả từ API
        const isKeyValid = response.ok && data.valid;
        
        setIsValid(isKeyValid);
        setKeyData(isKeyValid ? data.keyData : null);
        setIsValidating(false);
        
        // Hiển thị thông báo
        setNotificationType(isKeyValid ? "success" : "error");
        setNotificationMessage(data.message);
        setShowNotification(true);
        
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
        
      } catch (error) {
        console.error("Lỗi khi xác thực API key:", error);
        setIsValidating(false);
        setIsValid(false);
        setNotificationType("error");
        setNotificationMessage("Invalid API key");
        setShowNotification(true);
      }
    };

    validateApiKey();
  }, [apiKey, router]);

  // Format thời gian
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      {/* Hiển thị thông báo */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center ${
          notificationType === "success" ? "bg-green-600" : "bg-red-600"
        } text-white py-2 px-4 rounded shadow-lg`}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="mr-2"
          >
            {notificationType === "success" ? (
              <path d="M20 6L9 17l-5-5"></path>
            ) : (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            )}
          </svg>
          <span>{notificationMessage}</span>
          <button 
            onClick={() => setShowNotification(false)}
            className="ml-3 text-white hover:text-white/80"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {isValidating ? (
          <div className="flex flex-col items-center justify-center py-8">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-700">Đang xác thực API key...</p>
          </div>
        ) : isValid ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Truy cập được cấp phép</h2>
            <p className="text-gray-600 mb-6">
              API key của bạn hợp lệ và bạn có thể truy cập vào nội dung được bảo vệ này.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="font-medium text-gray-700 mb-4">Thông tin API Key của bạn:</h3>
              <div className="space-y-3">
                <div className="flex border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-600 w-32">Key:</span>
                  <span className="font-mono text-gray-800">{apiKey?.slice(0, 4)}...{apiKey?.slice(-4)}</span>
                </div>
                {keyData && (
                  <>
                    <div className="flex border-b border-gray-200 pb-2">
                      <span className="font-medium text-gray-600 w-32">Tên:</span>
                      <span className="text-gray-800">{keyData.name}</span>
                    </div>
                    <div className="flex border-b border-gray-200 pb-2">
                      <span className="font-medium text-gray-600 w-32">Loại:</span>
                      <span className="text-gray-800">
                        {keyData.type === 'dev' ? 'Development' : 'Production'}
                      </span>
                    </div>
                    <div className="flex border-b border-gray-200 pb-2">
                      <span className="font-medium text-gray-600 w-32">Số lần sử dụng:</span>
                      <span className="text-gray-800">{keyData.usage || 0}</span>
                    </div>
                    <div className="flex border-b border-gray-200 pb-2">
                      <span className="font-medium text-gray-600 w-32">Ngày tạo:</span>
                      <span className="text-gray-800">{formatDate(keyData.createdAt)}</span>
                    </div>
                  </>
                )}
                <div className="flex pt-1">
                  <span className="font-medium text-gray-600 w-32">Trạng thái:</span>
                  <span className="text-green-600 font-medium">Đang hoạt động</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => router.push("/playground")}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              >
                Quay lại Playground
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Truy cập bị từ chối</h2>
            <p className="text-gray-600 mb-6">
              API key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại hoặc tạo một key mới.
            </p>
            
            <button
              onClick={() => router.push("/playground")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Quay lại Playground
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Component chính để render trang protected
export default function ProtectedPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 p-6 relative">
        {/* Thanh điều hướng */}
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <span>Pages</span>
          <span className="mx-2">/</span>
          <span>Protected</span>
        </div>

        {/* Tiêu đề trang */}
        <h1 className="text-3xl font-bold mb-6">Trang được bảo vệ</h1>

        {/* Bọc nội dung phụ thuộc useSearchParams trong Suspense */}
        <Suspense fallback={
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg text-gray-700">Đang tải...</p>
            </div>
          </div>
        }>
          <ProtectedContent />
        </Suspense>
      </div>
    </div>
  );
} 