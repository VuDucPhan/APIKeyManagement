"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ClipboardIcon, EyeIcon, EyeSlashIcon, RefreshIcon } from "./icons";
import Sidebar from "./Sidebar";

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showKey, setShowKey] = useState({});
  const [copied, setCopied] = useState({});
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [keyType, setKeyType] = useState("development");
  const [monthlyLimit, setMonthlyLimit] = useState("1000");
  const [deleteKeyData, setDeleteKeyData] = useState(null); // {id, name} của key cần xóa

  // Fetch API keys từ Supabase
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/api-keys');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể tải dữ liệu');
      }
      
      const data = await response.json();
      setApiKeys(data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải API keys:', err);
      setError(err.message || 'Lỗi kết nối với Supabase. Vui lòng kiểm tra cấu hình.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowKey = (id) => {
    if (!showKey[id]) {
      // Khi chuyển từ ẩn sang hiện, gọi API để lấy key đầy đủ
      fetchFullKey(id);
    } else {
      // Khi chuyển từ hiện sang ẩn, chỉ cần cập nhật state
      setShowKey((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  const fetchFullKey = async (id) => {
    try {
      const response = await fetch(`/api/api-keys/full/${id}`);
      
      if (!response.ok) {
        throw new Error('Không thể lấy API key đầy đủ');
      }
      
      const data = await response.json();
      
      // Cập nhật API key đầy đủ trong mảng apiKeys
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, key: data.key } : key
      ));
      
      // Đánh dấu key này là đang hiển thị
      setShowKey((prev) => ({
        ...prev,
        [id]: true,
      }));
    } catch (err) {
      console.error('Lỗi khi lấy API key:', err);
      alert(err.message);
    }
  };

  const copyToClipboard = async (id, key) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopied({ [id]: true });
      setCopiedNotification(true);
      setTimeout(() => {
        setCopied({});
        setCopiedNotification(false);
      }, 2000);
    } catch (err) {
      console.error('Lỗi khi sao chép:', err);
    }
  };

  const createNewKey = async () => {
    if (!newKeyName.trim()) return;
    
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName,
          type: keyType === 'development' ? 'dev' : 'prod'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể tạo API key');
      }
      
      const newKey = await response.json();
      setApiKeys([newKey, ...apiKeys]);
      resetCreateForm();
      
      // Không hiển thị thông báo alert nữa
    } catch (err) {
      console.error('Lỗi khi tạo API key:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  const resetCreateForm = () => {
    setNewKeyName("");
    setKeyType("development");
    setMonthlyLimit("1000");
    setIsCreating(false);
  };

  const regenerateKey = async (id) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể tạo lại API key');
      }
      
      const updatedKey = await response.json();
      setApiKeys(apiKeys.map(key => key.id === id ? updatedKey : key));
      
      // Không hiển thị thông báo alert nữa
    } catch (err) {
      console.error('Lỗi khi tạo lại API key:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  const deleteKey = async () => {
    if (!deleteKeyData) return;
    
    try {
      const response = await fetch(`/api/api-keys/${deleteKeyData.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể xóa API key');
      }
      
      setApiKeys(apiKeys.filter(key => key.id !== deleteKeyData.id));
      setDeleteKeyData(null); // Đóng popup sau khi xóa thành công
    } catch (err) {
      console.error('Lỗi khi xóa API key:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  // Hiển thị popup xác nhận xóa
  const confirmDeleteKey = (id, name) => {
    setDeleteKeyData({ id, name });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa sử dụng';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Return component
  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-60 flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-60 flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-red-500">Lỗi: {error}</div>
            <button 
              onClick={fetchApiKeys}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 p-6">
        {/* Thông báo đã sao chép API key */}
        {copiedNotification && (
          <div className="fixed top-4 right-4 z-50 flex items-center bg-green-600 text-white py-2 px-4 rounded shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            <span>Copied API Key to clipboard</span>
            <button 
              onClick={() => setCopiedNotification(false)}
              className="ml-3 text-white hover:text-white/80"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Thanh điều hướng */}
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <span>Pages</span>
          <span className="mx-2">/</span>
          <span>Overview</span>
        </div>

        {/* Tiêu đề trang */}
        <h1 className="text-3xl font-bold mb-6">Overview</h1>

        {/* Thẻ gradient */}
        <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 rounded-lg p-6 mb-8">
          <div className="flex justify-between mb-8">
            <div>
              <div className="text-xs font-medium mb-1 text-white/90">CURRENT PLAN</div>
              <h2 className="text-4xl font-bold text-white">Researcher</h2>
            </div>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors backdrop-blur-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Manage Plan
            </button>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-white">API Usage</div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white">0 / 1,000 Credits</div>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-0"></div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-300 to-purple-300"></div>
              </div>
              <div className="text-sm font-medium text-white">Pay as you go</div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Khu vực API Keys */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-md text-xl"
          >
            +
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
        </div>

        {/* Popup tạo mới API key */}
        {isCreating && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Create a new API key</h2>
              <p className="text-sm text-gray-600 mb-6">Enter a name and limit for the new API key.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Key Name — <span className="text-gray-500 font-normal">A unique name to identify this key</span>
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Key Type — <span className="text-gray-500 font-normal">Choose the environment for this key</span>
                </label>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div 
                    onClick={() => setKeyType("production")}
                    className={`p-4 border rounded-md flex flex-col items-center cursor-pointer ${
                      keyType === "production" 
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-5 h-5 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    <div className="text-sm font-medium">Production</div>
                    <div className="text-xs text-center mt-1">Rate limited to 1,000 requests/minute</div>
                  </div>
                  
                  <div
                    onClick={() => setKeyType("development")}
                    className={`p-4 border rounded-md flex flex-col items-center cursor-pointer ${
                      keyType === "development" 
                        ? "bg-blue-50 border-blue-200 text-blue-700" 
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-5 h-5 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 9l3 3-3 3" />
                      <path d="M13 15h3a2 2 0 0 0 0-4h-3v-2h3a2 2 0 0 1 0 4h-3v2z" />
                    </svg>
                    <div className="text-sm font-medium">Development</div>
                    <div className="text-xs text-center mt-1">Rate limited to 100 requests/minute</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="limit-monthly"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={true}
                  />
                  <label htmlFor="limit-monthly" className="ml-2 block text-sm font-medium">
                    Limit monthly usage*
                  </label>
                </div>
                <input
                  type="text"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <p className="text-xs text-gray-500 mt-2">
                  * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
                </p>
              </div>
              
              <div className="flex justify-between gap-2">
                <button
                  onClick={resetCreateForm}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewKey}
                  disabled={!newKeyName.trim()}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-blue-400"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup xác nhận xóa API key */}
        {deleteKeyData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button 
                onClick={() => setDeleteKeyData(null)} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <h2 className="text-xl font-semibold mb-4 text-center">Delete API Key &apos;{deleteKeyData.name}&apos;</h2>
              
              <p className="text-gray-600 text-center mb-3">
                Are you sure you want to delete this API key? It will be invalidated and you will need to update it in your applications.
              </p>
              
              <p className="text-gray-600 text-center mb-6">
                This action is irreversible.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={deleteKey}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteKeyData(null)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {apiKeys.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">Chưa có API key nào. Hãy tạo key đầu tiên của bạn.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tạo API Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TYPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USAGE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KEY
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OPTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {apiKey.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {apiKey.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {apiKey.usage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="flex-grow">
                          {showKey[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 8) + "..............."}
                        </span>
                        <button
                          onClick={() => toggleShowKey(apiKey.id)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          aria-label={showKey[apiKey.id] ? "Ẩn API key" : "Hiện API key"}
                        >
                          {showKey[apiKey.id] ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.id, apiKey.key)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          aria-label="Sao chép"
                        >
                          <ClipboardIcon />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => regenerateKey(apiKey.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <RefreshIcon />
                        </button>
                        <button
                          onClick={() => {}}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDeleteKey(apiKey.id, apiKey.name)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Phần Tavily Expert */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tavily Expert</h2>
          <p className="text-gray-600 mb-4">
            Your expert is a specialized agent, always up to date with Tavily&apos;s latest documentation and best practices. To be used
            in AI-native IDEs to accurately implement and test Tavily tools within your application.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Get your Tavily Expert
          </button>
        </div>
      </div>
    </div>
  );
} 