"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClipboardIcon, EyeIcon, EyeSlashIcon, RefreshIcon } from "./icons";

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "default",
      type: "dev",
      usage: 0,
      key: "tvly-dev-abcdefghijklmnopqrstuvwxyz1234",
      createdAt: "2025-04-26T10:30:00Z",
      lastUsed: "2025-04-26T10:30:00Z",
    },
  ]);

  const [showKey, setShowKey] = useState({});
  const [copied, setCopied] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [keyType, setKeyType] = useState("development");
  const [monthlyLimit, setMonthlyLimit] = useState("1000");

  const toggleShowKey = (id) => {
    setShowKey((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopied({ [id]: true });
    setTimeout(() => {
      setCopied({});
    }, 2000);
  };

  const createNewKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey = {
      id: Math.random().toString(36).substring(2, 9),
      name: newKeyName,
      type: keyType === "development" ? "dev" : "prod",
      usage: 0,
      key: `tvly-${keyType === "development" ? "dev" : "prod"}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };
    
    setApiKeys([...apiKeys, newKey]);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setNewKeyName("");
    setKeyType("development");
    setMonthlyLimit("1000");
    setIsCreating(false);
  };

  const regenerateKey = (id) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? {...key, key: `tvly-${key.type}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`} 
        : key
    ));
  };

  const deleteKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Create a new API key</h2>
            <p className="text-sm text-gray-500 mb-6">Enter a name and limit for the new API key.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Key Name — <span className="text-gray-500 font-normal">A unique name to identify this key</span>
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key Name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Key Type — <span className="text-gray-500 font-normal">Choose the environment for this key</span>
              </label>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  onClick={() => setKeyType("production")}
                  className={`p-3 border rounded-md flex items-center justify-center ${
                    keyType === "production" 
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16 12l-4 4-4-4" />
                    </svg>
                    <span className="text-xs font-medium">Production</span>
                    <span className="text-xs mt-1">Rate limited to 1,000 requests/minute</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setKeyType("development")}
                  className={`p-3 border rounded-md flex items-center justify-center ${
                    keyType === "development" 
                      ? "bg-blue-50 border-blue-200 text-blue-700" 
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v6m0 12v2" />
                      <path d="M17.5 6.5L14 10" />
                      <path d="M19 12h-2" />
                      <path d="M15.5 17.5L12 14" />
                      <path d="M7 12H4" />
                      <path d="M6.5 6.5L10 10" />
                    </svg>
                    <span className="text-xs font-medium">Development</span>
                    <span className="text-xs mt-1">Rate limited to 100 requests/minute</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Limit monthly usage*</label>
              <input
                type="text"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={resetCreateForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-blue-400"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

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
                      {showKey[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 10) + "*".repeat(30)}
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
                    {copied[apiKey.id] && (
                      <span className="text-xs text-green-600 dark:text-green-400">Đã sao chép!</span>
                    )}
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
                      onClick={() => deleteKey(apiKey.id)}
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
      
      {/* Phần Tavily Expert */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Tavily Expert</h2>
        <p className="text-gray-600 mb-4">
          Your expert is a specialized agent, always up to date with Tavily's latest documentation and best practices. To be used
          in AI-native IDEs to accurately implement and test Tavily tools within your application.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Get your Tavily Expert
        </button>
      </div>
    </div>
  );
} 