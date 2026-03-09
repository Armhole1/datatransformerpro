import React, { useState } from 'react';
import { InvoiceExtractor } from './components/InvoiceExtractor';
import { LayoutDashboard, FileSpreadsheet, Settings } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState('invoice');

  return (
    <div className="min-h-screen bg-gray-950 flex text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileSpreadsheet className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">Data Transformer</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Modules</div>
          <button
            onClick={() => setActiveModule('invoice')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeModule === 'invoice'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <FileSpreadsheet className={`mr-3 flex-shrink-0 h-5 w-5 ${activeModule === 'invoice' ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
            Invoice Extractor
          </button>
          <button
            onClick={() => setActiveModule('dashboard')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeModule === 'dashboard'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <LayoutDashboard className={`mr-3 flex-shrink-0 h-5 w-5 ${activeModule === 'dashboard' ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
            More Modules
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="w-full text-gray-400 hover:bg-gray-800 hover:text-gray-200 group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors">
            <Settings className="text-gray-500 group-hover:text-gray-400 mr-3 flex-shrink-0 h-5 w-5" />
            Settings
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {activeModule === 'invoice' && <InvoiceExtractor />}
            {activeModule === 'dashboard' && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800">
                  <LayoutDashboard className="h-8 w-8 text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold text-white">More Modules Coming Soon</h2>
                <p className="mt-3 text-gray-400 max-w-md mx-auto">This app is designed to be modular. Future modules like Receipt Scanner or Bank Statement Parser will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
