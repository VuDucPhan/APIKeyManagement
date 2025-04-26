import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  HomeIcon, 
  ApiPlaygroundIcon, 
  UseCasesIcon, 
  BillingIcon, 
  SettingsIcon, 
  DocumentationIcon,
  ExternalLinkIcon
} from "./sidebar-icons";

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/" className="block">
            <div className="text-xl font-bold text-gray-800">HOME</div>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center rounded-md bg-blue-50 p-2">
            <div className="mr-2 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              P
            </div>
            <div className="flex-grow">
              <div className="text-sm font-medium">Personal</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        
        <nav className="space-y-1">
          <Link href="/api-keys" className="flex items-center px-2 py-2 text-sm text-gray-800 rounded-md hover:bg-gray-100 bg-gray-100">
            <HomeIcon />
            <span className="ml-3">Overview</span>
          </Link>
          
          <Link href="/" className="flex items-center px-2 py-2 text-sm text-gray-800 rounded-md hover:bg-gray-100">
            <ApiPlaygroundIcon />
            <span className="ml-3">API Playground</span>
          </Link>
          
          <Link href="/" className="flex items-center px-2 py-2 text-sm text-gray-800 rounded-md hover:bg-gray-100">
            <UseCasesIcon />
            <span className="ml-3">Use Cases</span>
          </Link>
          
          <Link href="/" className="flex items-center px-2 py-2 text-sm text-gray-800 rounded-md hover:bg-gray-100">
            <BillingIcon />
            <span className="ml-3">Billing</span>
          </Link>
          
          <Link href="/" className="flex items-center px-2 py-2 text-sm text-gray-800 rounded-md hover:bg-gray-100">
            <SettingsIcon />
            <span className="ml-3">Settings</span>
          </Link>
          
          <Link href="https://nextjs.org/docs" target="_blank" className="flex items-center px-2 py-2 text-sm text-gray-800 rounded-md hover:bg-gray-100">
            <DocumentationIcon />
            <span className="ml-3">Documentation</span>
            <ExternalLinkIcon className="ml-auto" />
          </Link>
        </nav>
      </div>
    </aside>
  );
} 