/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InvoiceExtractor } from './components/InvoiceExtractor';
import { LayoutDashboard, FileSpreadsheet, Settings } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState('invoice');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Data Transformer Pro</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button
            onClick={() => setActiveModule('invoice')}
            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              activeModule === 'invoice'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FileSpreadsheet className={`mr-3 flex-shrink-0 h-5 w-5 ${activeModule === 'invoice' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
            Invoice Extractor
          </button>
          <button
            onClick={() => setActiveModule('dashboard')}
            className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              activeModule === 'dashboard'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className={`mr-3 flex-shrink-0 h-5 w-5 ${activeModule === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
            More Modules
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
            <Settings className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5" />
            Settings
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {activeModule === 'invoice' && <InvoiceExtractor />}
            {activeModule === 'dashboard' && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-900">More Modules Coming Soon</h2>
                <p className="mt-2 text-gray-500">This app is designed to be modular. Future modules will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
