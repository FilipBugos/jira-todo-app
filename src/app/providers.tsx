"use client";
import { type PropsWithChildren } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "sonner";

import { NextAuthProvider } from "@/providers/session-provider";
export const Providers = ({ children }: PropsWithChildren) => (
  <DndProvider backend={HTML5Backend}>
    <NextAuthProvider>
      {children}

      <Toaster richColors />
    </NextAuthProvider>
  </DndProvider>
);
