import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, CheckCircle, XCircle, Loader2, Download, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import { extractInvoiceData } from '../lib/gemini';
import { cn } from '../lib/utils';

interface InvoiceFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'success' | 'error';
  data?: any;
  error?: string;
}

export function InvoiceExtractor() {
  const [files, setFiles] = useState<InvoiceFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'pending' as const,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '');
        if ((encoded!.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded!.length % 4));
        }
        resolve(encoded!);
      };
      reader.onerror = error => reject(error);
    });
  };

  const processFiles = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'success') continue;

      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'processing' } : f));

      try {
        const base64 = await fileToBase64(files[i].file);
        const data = await extractInvoiceData(base64);
        
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'success', data } : f));
      } catch (error: any) {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error', error: error.message } : f));
      }
    }
    
    setIsProcessing(false);
  };

  const exportToCSV = () => {
    const allData: any[] = [];
    
    files.forEach(f => {
      if (f.status === 'success' && f.data) {
        const baseData = {
          'File Name': f.file.name,
          'Invoice Number': f.data.invoiceNumber,
          'Date': f.data.date,
          'Vendor Name': f.data.vendorName,
          'Total Amount': f.data.totalAmount,
          'Tax Amount': f.data.taxAmount,
        };

        if (f.data.lineItems && f.data.lineItems.length > 0) {
          f.data.lineItems.forEach((item: any) => {
            allData.push({
              ...baseData,
              'Item Description': item.description,
              'Item Quantity': item.quantity,
              'Item Unit Price': item.unitPrice,
              'Item Total': item.total,
            });
          });
        } else {
          allData.push(baseData);
        }
      }
    });

    const csv = Papa.unparse(allData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Invoice Extractor</h2>
          <p className="text-sm text-gray-500 mt-1">Upload PDF invoices to extract structured data for your accountant.</p>
        </div>
        <div className="flex gap-3">
          {files.some(f => f.status === 'success') && (
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          )}
          <button
            onClick={processFiles}
            disabled={isProcessing || files.length === 0 || files.every(f => f.status === 'success')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Invoices'
            )}
          </button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        )}
      >
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 justify-center">
            <input {...getInputProps()} />
            <p className="pl-1"><span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF up to 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <div className="ml-4 truncate">
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">{file.file.name}</p>
                          <p className="ml-1 flex-shrink-0 text-gray-500 font-normal">
                            ({(file.file.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        </div>
                        {file.status === 'success' && file.data && (
                          <div className="mt-1 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="truncate">
                                {file.data.vendorName || 'Unknown Vendor'} • {file.data.invoiceNumber || 'No Inv #'} • ${file.data.totalAmount || '0.00'}
                              </span>
                            </div>
                          </div>
                        )}
                        {file.status === 'error' && (
                          <div className="mt-1 flex">
                            <div className="flex items-center text-sm text-red-500">
                              <span className="truncate">{file.error}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5 flex items-center gap-4">
                      {file.status === 'pending' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>}
                      {file.status === 'processing' && <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />}
                      {file.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {file.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <span className="sr-only">Remove</span>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
