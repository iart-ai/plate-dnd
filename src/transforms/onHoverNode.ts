import { collapseSelection, focusEditor, isExpanded, TReactEditor, Value } from "@udecode/plate-common";
import { DropTargetMonitor } from "react-dnd";

import { UseDropNodeOptions } from "../hooks/useDropNode";
import { DragItemNode } from "../types";
import { getHoverDirection, getNewDirection } from "../utils";
import { dndStore } from "../dndStore";

/**
 * Callback called when dragging a node and hovering nodes.
 */
export const onHoverNode = <V extends Value>(
  editor: TReactEditor<V>,
  {
    dragItem,
    monitor,
    nodeRef,
    onChangeDropLine,
    dropLine,
    id,
  }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
  } & Pick<UseDropNodeOptions, "nodeRef" | "onChangeDropLine" | "id" | "dropLine">
) => {
alert(editor.id);
  const direction = getHoverDirection({
    dragItem,
    monitor,
    nodeRef,
    id,
  });
  const dropLineDir = getNewDirection(dropLine, direction);
  if (dropLineDir) onChangeDropLine(dropLineDir);

  if (direction && isExpanded(editor.selection)) {
    focusEditor(editor);
    collapseSelection(editor);
  }
  if (direction) {
    dndStore.set.editorId(editor.id);
  }
  console.log("测试drop22", direction, dropLineDir, editor.id, monitor.getHandlerId());
};
