"use client";

import React from "react";

import { logout } from "@/actions/authActions";

type NavButtonProps = {
  name: string;
};

export default function NavButton({
  name,
}: NavButtonProps): React.ReactElement {
  return (
    <button
      onClick={async () => {
        logout();
      }}
      className="flex cursor-pointer items-center justify-between rounded-md bg-gray-600 px-4 py-2 text-center
                                                 text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-700 focus-visible:outline-none 
                                                 focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95"
    >
      <span className="text-left">{name}</span>
    </button>
  );
}
