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
const PlateEditorFeedback = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  return (
    // @ts-ignore
    <Plate plugins={plugins} editorRef={ref} {...props}>
      <div ref={containerRef}>
        <Editor
          // @ts-ignore
          placeholder="Masukan text..."
          className="px-0 py-0 mb-0 min-h-[0px]"
          autoFocus
          focusRing={false}
          variant="ghost"
          size="sm"
        />
      </div>
    </Plate>
  );
});

PlateEditorFeedback.displayName = "PlateEditorFeedback";

export { PlateEditorFeedback };
