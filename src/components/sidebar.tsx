"use-client";
import React from "react";
import { PageLink } from "./nav/page-link";

const Sidebar: React.FC = () => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Sidebar</h1>
        <PageLink href="/overview/backlog">Backlog</PageLink>
        <PageLink href="/overview/active-sprint"> Active sprint</PageLink>
        <PageLink href="/overview/all-issues"> All issues</PageLink>
      </div>
    </div>
  );
};

export default Sidebar;
