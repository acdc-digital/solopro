// HEADER COMPONENT
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/DraggableHeader.tsx

import React from "react";

const DraggableHeader: React.FC = () => {
  // Window control functions
  const handleMinimize = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.ipcRenderer) {
      (window as any).electron.ipcRenderer.send('window-minimize');
    }
  };

  const handleMaximize = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.ipcRenderer) {
      (window as any).electron.ipcRenderer.send('window-maximize');
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.ipcRenderer) {
      (window as any).electron.ipcRenderer.send('window-close');
    }
  };

  return (
    <div
      className="flex h-9 items-center justify-between px-3 bg-zinc-50 dark:bg-zinc-800 select-none"
      style={{
        WebkitAppRegion: 'drag',
        userSelect: 'none'
      } as React.CSSProperties & { WebkitAppRegion: string }}
    >
      {/* Left side - macOS window controls */}
      <div
        className="flex space-x-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties & { WebkitAppRegion: string }}
      >
        {/* Close button (red) */}
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
          title="Close"
        >
          <span className="text-red-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</span>
        </button>

        {/* Minimize button (yellow) */}
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"
          title="Minimize"
        >
          <span className="text-yellow-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">−</span>
        </button>

        {/* Maximize button (green) */}
        <button
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
          title="Maximize"
        >
          <span className="text-green-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">+</span>
        </button>
      </div>

      {/* Center - empty draggable area */}
      <div className="flex-1"></div>

      {/* Right side - empty for now */}
      <div>
        {/* Future: theme toggle or other controls can go here */}
      </div>
    </div>
  );
};

export default DraggableHeader;