// HEADER COMPONENT
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/DraggableHeader.tsx

import React from "react";

const DraggableHeader: React.FC = () => {
  return (
    <div className="flex h-9 items-center justify-between px-2 bg-zinc-50 dark:bg-zinc-800">
      {/* Title or Logo */}
      <div className="flex-1 leading-none">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          SoloPro
        </span>
      </div>
      {/* Right side content */}
      <div>
        {/* Future: theme toggle or other controls can go here */}
      </div>
    </div>
  );
};

export default DraggableHeader;