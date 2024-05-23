import { withProps } from "@udecode/cn";
import {
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { ELEMENT_BLOCKQUOTE } from "@udecode/plate-block-quote";
import {
  PlateElement,
  PlateLeaf,
  type PlatePluginComponent,
} from "@udecode/plate-common";
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from "@udecode/plate-heading";
import {
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
} from "@udecode/plate-list";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { ELEMENT_TOGGLE } from "@udecode/plate-toggle";

import { BlockquoteElement } from "@/components/plate-ui/blockquote";
import { HeadingElement } from "@/components/plate-ui/heading";
import { ListElement } from "@/components/plate-ui/list";
import { ParagraphElement } from "@/components/plate-ui/paragraph";
import { withPlaceholders } from "@/components/plate-ui/placeholder";
import { TodoListElement } from "@/components/plate-ui/todo-list";
import { ToggleElement } from "@/components/plate-ui/toggle-element";

export const createPlateUI = (
  overrideByKey?: Partial<Record<string, PlatePluginComponent>>,
  {
    draggable,
    placeholder,
  }: { draggable?: boolean; placeholder?: boolean } = {}
) => {
  let components: Record<string, PlatePluginComponent> = {
    [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
    [ELEMENT_H1]: withProps(HeadingElement, { variant: "h1" }),
    [ELEMENT_H2]: withProps(HeadingElement, { variant: "h2" }),
    [ELEMENT_H3]: withProps(HeadingElement, { variant: "h3" }),
    [ELEMENT_H4]: withProps(HeadingElement, { variant: "h4" }),
    [ELEMENT_H5]: withProps(HeadingElement, { variant: "h5" }),
    [ELEMENT_H6]: withProps(HeadingElement, { variant: "h6" }),
    [ELEMENT_LI]: withProps(PlateElement, { as: "li" }),
    [ELEMENT_OL]: withProps(ListElement, { variant: "ol" }),
    [ELEMENT_PARAGRAPH]: ParagraphElement,
    [ELEMENT_TODO_LI]: TodoListElement,
    [ELEMENT_TOGGLE]: ToggleElement,
    [ELEMENT_UL]: withProps(ListElement, { variant: "ul" }),
    [MARK_BOLD]: withProps(PlateLeaf, { as: "strong" }),
    [MARK_ITALIC]: withProps(PlateLeaf, { as: "em" }),
    [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: "s" }),
    [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: "sub" }),
    [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: "sup" }),
    [MARK_UNDERLINE]: withProps(PlateLeaf, { as: "u" }),
  };

  if (overrideByKey) {
    Object.keys(overrideByKey).forEach((key) => {
      (components as any)[key] = (overrideByKey as any)[key];
    });
  }
  if (placeholder) {
    components = withPlaceholders(components);
  }

  return components;
};
