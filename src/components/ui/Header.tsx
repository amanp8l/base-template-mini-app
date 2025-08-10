"use client";

import { APP_NAME } from "~/lib/constants";
import { useMiniApp } from "@neynar/react";

type HeaderProps = {
  neynarUser?: {
    fid: number;
    score: number;
  } | null;
};

export function Header({ }: HeaderProps) {
  const { context } = useMiniApp();

  return (
    <div className="sticky top-0 z-40 mb-6">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 text-white px-4 py-4 rounded-b-2xl shadow-lg">
        <div className="flex items-center justify-between">
          {/* App Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg">🎨</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{APP_NAME}</h1>
              <p className="text-xs text-white/80">AI Image Studio</p>
            </div>
          </div>

          {/* User Profile */}
          {context?.user && (
            <div className="flex items-center gap-3">
              {context.user.pfpUrl && (
                <img
                  src={context.user.pfpUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white/30 shadow-md"
                />
              )}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {context.user.displayName || context.user.username}
                </p>
                <p className="text-xs text-white/70">
                  @{context.user.username}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-l-4 border-r-4 border-purple-500 px-4 py-2 mx-4 -mt-2 rounded-lg shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            
            {/* User FID */}
            {context?.user && (
              <span className="text-muted-foreground">
                FID: {context.user.fid}
              </span>
            )}
          </div>

          {/* Time/Status */}
          <div className="text-muted-foreground">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}
