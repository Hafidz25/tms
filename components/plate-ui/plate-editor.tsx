"use client";

import { useRef, forwardRef } from "react";
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

// butuh refactor
const PlateEditor = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  return (
    // @ts-ignore
    <Plate plugins={plugins} editorRef={ref} {...props}>
      <div
        ref={containerRef}
        className={cn(
          "relative z-0",
          // Block selection
          "[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4"
        )}
      >
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>

        <Editor
          placeholder="Insert text..."
          className="px-8 py-8"
          // autoFocus
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
  );
});

PlateEditor.displayName = "PlateEditor";

export { PlateEditor };
