"use client";
import { PropsWithChildren } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from 'sonner';
import { NextAuthProvider } from "@/providers/session-provider";
export function Providers({ children }: PropsWithChildren) {
  return (
    <DndProvider backend={HTML5Backend}>
      <NextAuthProvider>
        {children}
        <Toaster richColors />
      </NextAuthProvider>
    </DndProvider>);
}
