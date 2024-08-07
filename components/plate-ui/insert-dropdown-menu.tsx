"use client";

import React from "react";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import { ELEMENT_BLOCKQUOTE } from "@udecode/plate-block-quote";
import {
  focusEditor,
  insertEmptyElement,
  useEditorRef,
} from "@udecode/plate-common";
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from "@udecode/plate-heading";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { MARK_BG_COLOR, MARK_COLOR } from "@udecode/plate-font";
import { Icons } from "@/components/plate-ui/icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";
import { ELEMENT_TABLE, insertTable } from "@udecode/plate-table";
import {
  ELEMENT_CODE_BLOCK,
  insertEmptyCodeBlock,
} from "@udecode/plate-code-block";
import {
  KEY_LIST_STYLE_TYPE,
  toggleIndentList,
} from "@udecode/plate-indent-list";
import { ELEMENT_LINK, triggerFloatingLink } from "@udecode/plate-link";
import { toggleList } from "@udecode/plate-list";
import {
  ELEMENT_IMAGE,
  insertMedia,
  ELEMENT_MEDIA_EMBED,
} from "@udecode/plate-media";
import { ELEMENT_EXCALIDRAW } from "@udecode/plate-excalidraw";

const items = [
  {
    items: [
      // {
      //   description: "Text Color",
      //   icon: Icons.color,
      //   label: "Text Color",
      //   value: ELEMENT_PARAGRAPH,
      // },
      // {
      //   description: "Heading 1",
      //   icon: Icons.h1,
      //   label: "Heading 1",
      //   value: ELEMENT_H1,
      // },
      // {
      //   description: "Heading 2",
      //   icon: Icons.h2,
      //   label: "Heading 2",
      //   value: ELEMENT_H2,
      // },
      // {
      //   description: "Heading 3",
      //   icon: Icons.h3,
      //   label: "Heading 3",
      //   value: ELEMENT_H3,
      // },
      // {
      //   description: "Heading 4",
      //   icon: Icons.h4,
      //   label: "Heading 4",
      //   value: ELEMENT_H4,
      // },
      // {
      //   description: "Heading 5",
      //   icon: Icons.h5,
      //   label: "Heading 5",
      //   value: ELEMENT_H5,
      // },
      // {
      //   description: "Heading 6",
      //   icon: Icons.h6,
      //   label: "Heading 6",
      //   value: ELEMENT_H6,
      // },
      {
        description: "Quote (⌘+⇧+.)",
        icon: Icons.blockquote,
        label: "Quote",
        value: ELEMENT_BLOCKQUOTE,
      },
      // {
      //   value: ELEMENT_TABLE,
      //   label: "Table",
      //   description: "Table",
      //   icon: Icons.table,
      // },
      // {
      //   value: "ul",
      //   label: "Bulleted list",
      //   description: "Bulleted list",
      //   icon: Icons.ul,
      // },
      // {
      //   value: "ol",
      //   label: "Numbered list",
      //   description: "Numbered list",
      //   icon: Icons.ol,
      // },
      // {
      //   value: ELEMENT_HR,
      //   label: 'Divider',
      //   description: 'Divider (---)',
      //   icon: Icons.hr,
      // },
    ],
    label: "Basic blocks",
  },
  {
    label: "Media",
    items: [
      {
        value: ELEMENT_CODE_BLOCK,
        label: "Code",
        description: "Code (```)",
        icon: Icons.codeblock,
      },
      {
        value: ELEMENT_IMAGE,
        label: "Image",
        description: "Image",
        icon: Icons.image,
      },
      {
        value: ELEMENT_MEDIA_EMBED,
        label: "Embed",
        description: "Embed",
        icon: Icons.embed,
      },
      // {
      //   value: ELEMENT_EXCALIDRAW,
      //   label: "Excalidraw",
      //   description: "Excalidraw",
      //   icon: Icons.excalidraw,
      // },
    ],
  },
  {
    label: "Inline",
    items: [
      {
        value: ELEMENT_LINK,
        label: "Link",
        description: "Link",
        icon: Icons.link,
      },
    ],
  },
];

export function InsertDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={openState.open} tooltip="Insert">
          <Icons.add />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto"
      >
        {items.map(({ items: nestedItems, label }, index) => (
          <React.Fragment key={label}>
            {index !== 0 && <DropdownMenuSeparator />}

            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {nestedItems.map(
              ({ icon: Icon, label: itemLabel, value: type }) => (
                <DropdownMenuItem
                  className="min-w-[180px]"
                  key={type}
                  onSelect={() => {
                    switch (type) {
                      case ELEMENT_CODE_BLOCK: {
                        insertEmptyCodeBlock(editor);

                        break;
                      }
                      case ELEMENT_IMAGE: {
                        insertMedia(editor, { type: ELEMENT_IMAGE });

                        break;
                      }
                      case ELEMENT_MEDIA_EMBED: {
                        insertMedia(editor, {
                          type: ELEMENT_MEDIA_EMBED,
                        });

                        break;
                      }
                      case ELEMENT_LINK: {
                        triggerFloatingLink(editor, { focused: true });

                        break;
                      }
                      default: {
                        insertEmptyElement(editor, type, {
                          nextBlock: true,
                          select: true,
                        });
                      }
                    }

                    focusEditor(editor);
                  }}
                >
                  <Icon className="mr-2 size-5" />
                  {itemLabel}
                </DropdownMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
