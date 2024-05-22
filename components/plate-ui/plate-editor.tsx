"use client";

import { useRef } from "react";
import { cn } from "@udecode/cn";
import { Plate } from "@udecode/plate-common";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { MENTIONABLES } from "@/lib/plate/mentionables";
import { plugins } from "@/lib/plate/plate-plugins";
import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { FixedToolbarButtons } from "./fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { MentionCombobox } from "@/components/plate-ui/mention-combobox";

export default function PlateEditor() {
  const containerRef = useRef(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate plugins={plugins}>
        <div
          ref={containerRef}
          className={cn(
            "relative",
            // Block selection
            "[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4"
          )}
        >
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>

          <Editor
            placeholder="Masukan text..."
            className="px-14 py-16"
            autoFocus
            focusRing={false}
            variant="ghost"
            size="md"
          />

          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>

          <MentionCombobox items={MENTIONABLES} />
          <CursorOverlay containerRef={containerRef} />
        </div>
      </Plate>
    </DndProvider>
  );
}
