import React, { useState } from 'react';
import { Download, Upload, Eye, Copy, Trash2, Search } from 'lucide-react';

const MobileCodeEditor = () => {
  const [code, setCode] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.txt';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const text = await file.text();
      setCode(text);
    };
    input.click();
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const newWindow = window.open();
    newWindow.document.write(code);
    newWindow.document.close();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleClear = () => {
    setCode('');
  };

  const handleReplace = () => {
    if (!searchText) return;
    const newCode = code.replaceAll(searchText, replaceText);
    setCode(newCode);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <div className="flex justify-between items-center p-2 bg-slate-800">
        <div className="flex space-x-2">
          <button onClick={handleImport} className="p-2 hover:bg-slate-700 rounded">
            <Upload size={20} />
          </button>
          <button onClick={handleExport} className="p-2 hover:bg-slate-700 rounded">
            <Download size={20} />
          </button>
          <button onClick={handlePreview} className="p-2 hover:bg-slate-700 rounded">
            <Eye size={20} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleCopy} className="p-2 hover:bg-slate-700 rounded">
            <Copy size={20} />
          </button>
          <button onClick={handleClear} className="p-2 hover:bg-slate-700 rounded">
            <Trash2 size={20} />
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-slate-700 rounded">
            <Search size={20} />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="flex flex-col p-2 bg-slate-800 space-y-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
            className="p-2 bg-slate-700 rounded"
          />
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace"
            className="p-2 bg-slate-700 rounded"
          />
          <button
            onClick={handleReplace}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Replace All
          </button>
        </div>
      )}

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 p-4 bg-slate-900 text-white font-mono resize-none focus:outline-none"
        placeholder="Enter your HTML code here..."
      />
    </div>
  );
};

export default MobileCodeEditor;
