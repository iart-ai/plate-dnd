import {
  findNode,
  focusEditor,
  getQueryOptions,
  insertElements,
  moveNodes,
  TElement,
  TReactEditor,
  Value,
} from '@udecode/plate-common';
import { DropTargetMonitor } from 'react-dnd';
import { Path } from 'slate';

import { UseDropNodeOptions } from '../hooks';
import { DragItemNode } from '../types';
import { getHoverDirection } from '../utils';

// import { insertTodoListItem } from "@udecode/plate-list";

/**
 * Callback called on drag an drop a node with id.
 */
export const onDropNode = <V extends Value>(
  editor: TReactEditor<V>,
  {
    dragItem,
    monitor,
    nodeRef,
    id,
  }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
  } & Pick<UseDropNodeOptions, 'nodeRef' | 'id'>
) => {
  const direction = getHoverDirection({ dragItem, monitor, nodeRef, id });
  if (!direction) return;

  const isInsert = dragItem.editorId === undefined; // 分为拖拽和插入两种
  const dragEntry = findNode(editor, {
    at: [],
    // match: { id: dragItem.id },
    match: { id: isInsert ? id : dragItem.id },
  });
  if (!dragEntry) return;
  const [, dragPath] = dragEntry;

  focusEditor(editor);

  let dropPath: Path | undefined;
  if (direction === 'bottom') {
    dropPath = findNode(editor, { at: [], match: { id } })?.[1];
    if (!dropPath) return;

    if (Path.equals(dragPath, Path.next(dropPath))) return;
  }

  if (direction === 'top') {
    const nodePath = findNode(editor, { at: [], match: { id } })?.[1];

    if (!nodePath) return;
    dropPath = [...nodePath.slice(0, -1), nodePath.at(-1)! - 1];

    if (Path.equals(dragPath, dropPath)) return;
  }

  if (direction) {
    const _dropPath = dropPath as Path;

    const before =
      Path.isBefore(dragPath, _dropPath) && Path.isSibling(dragPath, _dropPath);
    const to = before ? _dropPath : Path.next(_dropPath);
    // console.log("测试drop11", dragItem, before, dragPath);

    if (!isInsert) {
      moveNodes(editor, {
        at: dragPath,
        to,
      });
    } else {
      let element: TElement = {
        type: dragItem.id,
        children: [{ text: '' }],
        styles: dragItem.styles,
      };

      if (dragItem.id === 'ol') {
        // 类型设置为p，是因为plate在识别到list的时候，会自动在外层包一层ul/ol和li，因此底下传入的时候不需要提供额外的list标签。
        element = {
          type: 'p',
          children: [{ text: '' }],
          styles: dragItem.styles,
          listStyleType: 'number',
          indent: 2,
        };
      }

      insertElements(
        editor,
        element,
        getQueryOptions(editor, {
          select: true,
          nextBlock: true,
        })
      );
      if (direction === 'top') {
        // 因为插入的是下一格，所以需要上移一步
        moveNodes(editor, {
          at: Path.next(to),
          to,
        });
      }
    }
  }
};
