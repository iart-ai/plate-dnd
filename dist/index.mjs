var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/createDndPlugin.tsx
import React4 from "react";
import { createPluginFactory } from "@udecode/plate-common";

// src/components/Scroller/DndScroller.tsx
import React3 from "react";

// src/dndStore.ts
import { createZustandStore } from "@udecode/plate-common";
var dndStore = createZustandStore("dnd")({
  isDragging: false
});

// src/components/Scroller/Scroller.tsx
import React2 from "react";

// src/components/Scroller/ScrollArea.tsx
import React from "react";
import throttle from "lodash/throttle.js";
import raf from "raf";
var getCoords = (e) => {
  if (e.type === "touchmove") {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
};
function ScrollArea({
  placement,
  enabled = true,
  height = 100,
  zIndex = 1e4,
  minStrength = 0.15,
  strengthMultiplier = 25,
  containerRef,
  scrollAreaProps
}) {
  const ref = React.useRef();
  const scaleYRef = React.useRef(0);
  const frameRef = React.useRef(null);
  const direction = placement === "top" ? -1 : 1;
  const style = __spreadValues({
    position: "fixed",
    height,
    width: "100%",
    opacity: 0,
    zIndex
  }, scrollAreaProps == null ? void 0 : scrollAreaProps.style);
  if (placement === "top") {
    style.top = 0;
  } else if (placement === "bottom") {
    style.bottom = 0;
  }
  const stopScrolling = () => {
    scaleYRef.current = 0;
    if (frameRef.current) {
      raf.cancel(frameRef.current);
      frameRef.current = null;
    }
  };
  const startScrolling = () => {
    const tick = () => {
      var _a;
      const scaleY = scaleYRef.current;
      if (strengthMultiplier === 0 || scaleY === 0) {
        stopScrolling();
        return;
      }
      const container = (_a = containerRef == null ? void 0 : containerRef.current) != null ? _a : window;
      container.scrollBy(0, scaleY * strengthMultiplier * direction);
      frameRef.current = raf(tick);
    };
    tick();
  };
  const updateScrolling = throttle(
    (e) => {
      const container = ref.current;
      if (!container)
        return;
      const { top: y, height: h } = container.getBoundingClientRect();
      const coords = getCoords(e);
      const strength = Math.max(Math.max(coords.y - y, 0) / h, minStrength);
      scaleYRef.current = direction === -1 ? 1 - strength : strength;
      if (!frameRef.current && scaleYRef.current) {
        startScrolling();
      }
    },
    100,
    { trailing: false }
  );
  const handleEvent = (e) => {
    updateScrolling(e);
  };
  React.useEffect(() => {
    if (!enabled) {
      stopScrolling();
    }
  }, [enabled]);
  if (!enabled)
    return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    __spreadValues({
      ref,
      style,
      onDragOver: handleEvent,
      onDragLeave: stopScrolling,
      onDragEnd: stopScrolling,
      onTouchMove: handleEvent
    }, scrollAreaProps)
  );
}

// src/components/Scroller/Scroller.tsx
function Scroller(props) {
  return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(ScrollArea, __spreadValues({ placement: "top" }, props)), /* @__PURE__ */ React2.createElement(ScrollArea, __spreadValues({ placement: "bottom" }, props)));
}

// src/components/Scroller/DndScroller.tsx
function DndScroller(props) {
  const isDragging = dndStore.use.isDragging();
  const [show, setShow] = React3.useState(false);
  React3.useEffect(() => {
    if (isDragging) {
      const timeout = setTimeout(() => {
        setShow(true);
      }, 100);
      return () => clearTimeout(timeout);
    }
    setShow(false);
  }, [isDragging, show]);
  return /* @__PURE__ */ React3.createElement(Scroller, __spreadValues({ enabled: isDragging && show }, props));
}

// src/createDndPlugin.tsx
var KEY_DND = "dnd";
var createDndPlugin = createPluginFactory({
  key: KEY_DND,
  handlers: {
    onDragStart: () => () => dndStore.set.isDragging(true),
    onDragEnd: () => () => dndStore.set.isDragging(false),
    onDrop: (editor) => () => editor.isDragging
  },
  then: (editor, { options }) => ({
    renderAfterEditable: options.enableScroller ? () => /* @__PURE__ */ React4.createElement(DndScroller, __spreadValues({}, options == null ? void 0 : options.scrollerProps)) : void 0
  })
});

// src/components/useDraggable.ts
import React5 from "react";
var useDraggableState = (props) => {
  const { element, onDropHandler } = props;
  const nodeRef = React5.useRef(null);
  const [isHovered, setIsHovered] = React5.useState(false);
  const { dropLine, isDragging, dragRef } = useDndBlock({
    id: element.id,
    nodeRef,
    onDropHandler
  });
  return {
    dropLine,
    isHovered,
    setIsHovered,
    isDragging,
    nodeRef,
    dragRef
  };
};
var useDraggable = (state) => {
  return {
    previewRef: state.nodeRef,
    handleRef: state.dragRef,
    groupProps: {
      onPointerEnter: () => state.setIsHovered(true),
      onPointerLeave: () => state.setIsHovered(false)
    },
    droplineProps: {
      contentEditable: false
    },
    gutterLeftProps: {
      contentEditable: false
    }
  };
};

// src/components/useWithDraggable.ts
import React6 from "react";
import {
  findNodePath
} from "@udecode/plate-common";
import { useReadOnly } from "slate-react";
var useWithDraggable = ({
  editor,
  level = 0,
  filter,
  element,
  allowReadOnly = false,
  draggableProps
}) => {
  const readOnly = useReadOnly();
  const path = React6.useMemo(
    () => findNodePath(editor, element),
    [editor, element]
  );
  const filteredOut = React6.useMemo(
    () => path && (Number.isInteger(level) && level !== path.length - 1 || filter && filter(editor, path)),
    [path, level, filter, editor]
  );
  return {
    disabled: filteredOut || !allowReadOnly && readOnly,
    draggableProps: __spreadValues({
      editor,
      element
    }, draggableProps)
  };
};

// src/components/withDraggable.tsx
import React7 from "react";
var withDraggable = (Draggable, Component, options) => (
  // eslint-disable-next-line react/display-name
  React7.forwardRef((props, ref) => {
    const { disabled, draggableProps } = useWithDraggable(__spreadValues(__spreadValues({}, options), props));
    if (disabled) {
      return /* @__PURE__ */ React7.createElement(Component, __spreadValues({}, props));
    }
    return /* @__PURE__ */ React7.createElement(Draggable, __spreadValues({ ref }, draggableProps), /* @__PURE__ */ React7.createElement(Component, __spreadValues({}, props)));
  })
);

// src/hooks/useDndNode.ts
import React8 from "react";
import { useEditorRef } from "@udecode/plate-common";
import { getEmptyImage } from "react-dnd-html5-backend";

// src/hooks/useDragNode.ts
import { useDrag } from "react-dnd";
var useDragNode = (editor, _a) => {
  var _b = _a, { id, item } = _b, options = __objRest(_b, ["id", "item"]);
  return useDrag(
    () => __spreadValues({
      item(monitor) {
        dndStore.set.isDragging(true);
        editor.isDragging = true;
        document.body.classList.add("dragging");
        const _item = typeof item === "function" ? item(monitor) : item;
        return __spreadValues({
          id,
          editorId: editor.id
        }, _item);
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: () => {
        dndStore.set.isDragging(false);
        editor.isDragging = false;
        document.body.classList.remove("dragging");
      }
    }, options),
    []
  );
};

// src/hooks/useDropNode.ts
import { useDrop } from "react-dnd";

// src/transforms/onDropNode.ts
import {
  findNode,
  focusEditor,
  moveNodes
} from "@udecode/plate-common";
import { Path } from "slate";

// src/utils/getHoverDirection.ts
var getHoverDirection = ({
  dragItem,
  id,
  monitor,
  nodeRef
}) => {
  var _a;
  if (!nodeRef.current)
    return;
  const dragId = dragItem.id;
  if (dragId === id)
    return;
  const hoverBoundingRect = (_a = nodeRef.current) == null ? void 0 : _a.getBoundingClientRect();
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  const clientOffset = monitor.getClientOffset();
  if (!clientOffset)
    return;
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  if (hoverClientY < hoverMiddleY) {
    return "top";
  }
  if (hoverClientY >= hoverMiddleY) {
    return "bottom";
  }
};

// src/utils/getNewDirection.ts
var getNewDirection = (previousDir, dir) => {
  if (!dir && previousDir) {
    return "";
  }
  if (dir === "top" && previousDir !== "top") {
    return "top";
  }
  if (dir === "bottom" && previousDir !== "bottom") {
    return "bottom";
  }
};

// src/transforms/onDropNode.ts
var onDropNode = (editor, {
  dragItem,
  monitor,
  nodeRef,
  id
}) => {
  var _a, _b;
  const direction = getHoverDirection({ dragItem, monitor, nodeRef, id });
  if (!direction)
    return;
  const dragEntry = findNode(editor, {
    at: [],
    match: { id: dragItem.id }
  });
  if (!dragEntry)
    return;
  const [, dragPath] = dragEntry;
  focusEditor(editor);
  let dropPath;
  if (direction === "bottom") {
    dropPath = (_a = findNode(editor, { at: [], match: { id } })) == null ? void 0 : _a[1];
    if (!dropPath)
      return;
    if (Path.equals(dragPath, Path.next(dropPath)))
      return;
  }
  if (direction === "top") {
    const nodePath = (_b = findNode(editor, { at: [], match: { id } })) == null ? void 0 : _b[1];
    if (!nodePath)
      return;
    dropPath = [...nodePath.slice(0, -1), nodePath.at(-1) - 1];
    if (Path.equals(dragPath, dropPath))
      return;
  }
  if (direction) {
    const _dropPath = dropPath;
    const before = Path.isBefore(dragPath, _dropPath) && Path.isSibling(dragPath, _dropPath);
    const to = before ? _dropPath : Path.next(_dropPath);
    moveNodes(editor, {
      at: dragPath,
      to
    });
  }
};

// src/transforms/onHoverNode.ts
import {
  collapseSelection,
  focusEditor as focusEditor2,
  isExpanded
} from "@udecode/plate-common";
var onHoverNode = (editor, {
  dragItem,
  monitor,
  nodeRef,
  onChangeDropLine,
  dropLine,
  id
}) => {
  const direction = getHoverDirection({
    dragItem,
    monitor,
    nodeRef,
    id
  });
  const dropLineDir = getNewDirection(dropLine, direction);
  if (dropLineDir)
    onChangeDropLine(dropLineDir);
  if (direction && isExpanded(editor.selection)) {
    focusEditor2(editor);
    collapseSelection(editor);
  }
};

// src/hooks/useDropNode.ts
var useDropNode = (editor, _a) => {
  var _b = _a, {
    nodeRef,
    id,
    dropLine,
    onChangeDropLine,
    onDropHandler
  } = _b, options = __objRest(_b, [
    "nodeRef",
    "id",
    "dropLine",
    "onChangeDropLine",
    "onDropHandler"
  ]);
  return useDrop(__spreadValues({
    drop: (dragItem, monitor) => {
      const handled = !!onDropHandler && onDropHandler(editor, {
        nodeRef,
        id,
        dragItem,
        monitor
      });
      if (handled)
        return;
      onDropNode(editor, { nodeRef, id, dragItem, monitor });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    hover(item, monitor) {
      onHoverNode(editor, {
        nodeRef,
        id,
        dropLine,
        onChangeDropLine,
        dragItem: item,
        monitor
      });
    }
  }, options));
};

// src/hooks/useDndNode.ts
var useDndNode = ({
  id,
  type,
  nodeRef,
  preview: previewOptions = {},
  drag: dragOptions,
  drop: dropOptions,
  onDropHandler
}) => {
  const editor = useEditorRef();
  const [dropLine, setDropLine] = React8.useState("");
  const [{ isDragging }, dragRef, preview] = useDragNode(editor, __spreadValues({
    id,
    type
  }, dragOptions));
  const [{ isOver }, drop] = useDropNode(editor, __spreadValues({
    accept: type,
    id,
    nodeRef,
    dropLine,
    onChangeDropLine: setDropLine,
    onDropHandler
  }, dropOptions));
  if (previewOptions.disable) {
    drop(nodeRef);
    preview(getEmptyImage(), { captureDraggingState: true });
  } else if (previewOptions.ref) {
    drop(nodeRef);
    preview(previewOptions.ref);
  } else {
    preview(drop(nodeRef));
  }
  if (!isOver && dropLine) {
    setDropLine("");
  }
  return {
    isDragging,
    isOver,
    dropLine,
    dragRef
  };
};

// src/hooks/useDragBlock.ts
var DRAG_ITEM_BLOCK = "block";
var useDragBlock = (editor, id) => useDragNode(editor, {
  id,
  type: DRAG_ITEM_BLOCK
});

// src/hooks/useDndBlock.ts
var useDndBlock = (options) => useDndNode(__spreadValues({
  type: DRAG_ITEM_BLOCK
}, options));

// src/hooks/useDropBlock.ts
var useDropBlock = (editor, options) => useDropNode(editor, __spreadValues({ accept: DRAG_ITEM_BLOCK }, options));

// src/queries/getBlocksWithId.ts
import {
  getNodeEntries,
  isBlock
} from "@udecode/plate-common";
var getBlocksWithId = (editor, options) => {
  const _nodes = getNodeEntries(editor, __spreadValues({
    match: (n) => isBlock(editor, n) && !!n.id
  }, options));
  return Array.from(_nodes);
};

// src/queries/getNodesRange.ts
import { getRange } from "@udecode/plate-common";
var getNodesRange = (editor, nodeEntries) => {
  if (nodeEntries.length === 0)
    return;
  const firstBlockPath = nodeEntries[0][1];
  const lastBlockPath = nodeEntries.at(-1)[1];
  return getRange(editor, firstBlockPath, lastBlockPath);
};

// src/transforms/focusBlockStartById.ts
import {
  findNode as findNode2,
  focusEditor as focusEditor3,
  getStartPoint,
  select
} from "@udecode/plate-common";
var focusBlockStartById = (editor, id) => {
  var _a;
  const path = (_a = findNode2(editor, { at: [], match: { id } })) == null ? void 0 : _a[1];
  if (!path)
    return;
  select(editor, getStartPoint(editor, path));
  focusEditor3(editor);
};

// src/transforms/removeBlocksAndFocus.ts
import {
  focusEditor as focusEditor4,
  removeNodes,
  unhangRange
} from "@udecode/plate-common";
var removeBlocksAndFocus = (editor, options) => {
  unhangRange(editor, options == null ? void 0 : options.at, options);
  const nodeEntries = getBlocksWithId(editor, options);
  removeNodes(editor, { at: getNodesRange(editor, nodeEntries) });
  focusEditor4(editor);
};

// src/transforms/selectBlockById.ts
import {
  findNode as findNode3,
  focusEditor as focusEditor5,
  getRange as getRange2,
  select as select2
} from "@udecode/plate-common";
var selectBlockById = (editor, id) => {
  var _a;
  const path = (_a = findNode3(editor, { at: [], match: { id } })) == null ? void 0 : _a[1];
  if (!path)
    return;
  select2(editor, getRange2(editor, path));
  focusEditor5(editor);
};

// src/transforms/selectBlocksBySelectionOrId.ts
import { focusEditor as focusEditor6, select as select3 } from "@udecode/plate-common";
var selectBlocksBySelectionOrId = (editor, id) => {
  if (!editor.selection)
    return;
  const blockEntries = getBlocksWithId(editor, { at: editor.selection });
  const isBlockSelected = blockEntries.some(
    (blockEntry) => blockEntry[0].id === id
  );
  if (isBlockSelected) {
    select3(editor, getNodesRange(editor, blockEntries));
    focusEditor6(editor);
  } else {
    selectBlockById(editor, id);
  }
};
export {
  DRAG_ITEM_BLOCK,
  DndScroller,
  KEY_DND,
  ScrollArea,
  Scroller,
  createDndPlugin,
  dndStore,
  focusBlockStartById,
  getBlocksWithId,
  getHoverDirection,
  getNewDirection,
  getNodesRange,
  onDropNode,
  onHoverNode,
  removeBlocksAndFocus,
  selectBlockById,
  selectBlocksBySelectionOrId,
  useDndBlock,
  useDndNode,
  useDragBlock,
  useDragNode,
  useDraggable,
  useDraggableState,
  useDropBlock,
  useDropNode,
  useWithDraggable,
  withDraggable
};
//# sourceMappingURL=index.mjs.map