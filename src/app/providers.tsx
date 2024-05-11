"use client";
import { type PropsWithChildren } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "sonner";

export const Providers = ({ children }: PropsWithChildren) => (
  <DndProvider backend={HTML5Backend}>
    {children}
    <Toaster richColors />
  </DndProvider>
);
