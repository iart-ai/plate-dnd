"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DRAG_ITEM_BLOCK: () => DRAG_ITEM_BLOCK,
  DndScroller: () => DndScroller,
  KEY_DND: () => KEY_DND,
  ScrollArea: () => ScrollArea,
  Scroller: () => Scroller,
  createDndPlugin: () => createDndPlugin,
  dndStore: () => dndStore,
  focusBlockStartById: () => focusBlockStartById,
  getBlocksWithId: () => getBlocksWithId,
  getHoverDirection: () => getHoverDirection,
  getNewDirection: () => getNewDirection,
  getNodesRange: () => getNodesRange,
  onDropNode: () => onDropNode,
  onHoverNode: () => onHoverNode,
  removeBlocksAndFocus: () => removeBlocksAndFocus,
  selectBlockById: () => selectBlockById,
  selectBlocksBySelectionOrId: () => selectBlocksBySelectionOrId,
  useDndBlock: () => useDndBlock,
  useDndNode: () => useDndNode,
  useDragBlock: () => useDragBlock,
  useDragNode: () => useDragNode,
  useDraggable: () => useDraggable,
  useDraggableState: () => useDraggableState,
  useDropBlock: () => useDropBlock,
  useDropNode: () => useDropNode,
  useWithDraggable: () => useWithDraggable,
  withDraggable: () => withDraggable
});
module.exports = __toCommonJS(src_exports);

// src/createDndPlugin.tsx
var import_react4 = __toESM(require("react"));
var import_plate_common2 = require("@udecode/plate-common");

// src/components/Scroller/DndScroller.tsx
var import_react3 = __toESM(require("react"));

// src/dndStore.ts
var import_plate_common = require("@udecode/plate-common");
var dndStore = (0, import_plate_common.createZustandStore)("dnd")({
  isDragging: false
});

// src/components/Scroller/Scroller.tsx
var import_react2 = __toESM(require("react"));

// src/components/Scroller/ScrollArea.tsx
var import_react = __toESM(require("react"));
var import_throttle = __toESM(require("lodash/throttle.js"));
var import_raf = __toESM(require("raf"));
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
  const ref = import_react.default.useRef();
  const scaleYRef = import_react.default.useRef(0);
  const frameRef = import_react.default.useRef(null);
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
      import_raf.default.cancel(frameRef.current);
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
      frameRef.current = (0, import_raf.default)(tick);
    };
    tick();
  };
  const updateScrolling = (0, import_throttle.default)(
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
  import_react.default.useEffect(() => {
    if (!enabled) {
      stopScrolling();
    }
  }, [enabled]);
  if (!enabled)
    return null;
  return /* @__PURE__ */ import_react.default.createElement(
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
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement(ScrollArea, __spreadValues({ placement: "top" }, props)), /* @__PURE__ */ import_react2.default.createElement(ScrollArea, __spreadValues({ placement: "bottom" }, props)));
}

// src/components/Scroller/DndScroller.tsx
function DndScroller(props) {
  const isDragging = dndStore.use.isDragging();
  const [show, setShow] = import_react3.default.useState(false);
  import_react3.default.useEffect(() => {
    if (isDragging) {
      const timeout = setTimeout(() => {
        setShow(true);
      }, 100);
      return () => clearTimeout(timeout);
    }
    setShow(false);
  }, [isDragging, show]);
  return /* @__PURE__ */ import_react3.default.createElement(Scroller, __spreadValues({ enabled: isDragging && show }, props));
}

// src/createDndPlugin.tsx
var KEY_DND = "dnd";
var createDndPlugin = (0, import_plate_common2.createPluginFactory)({
  key: KEY_DND,
  handlers: {
    onDragStart: () => () => dndStore.set.isDragging(true),
    onDragEnd: () => () => dndStore.set.isDragging(false),
    onDrop: (editor) => () => editor.isDragging
  },
  then: (editor, { options }) => ({
    renderAfterEditable: options.enableScroller ? () => /* @__PURE__ */ import_react4.default.createElement(DndScroller, __spreadValues({}, options == null ? void 0 : options.scrollerProps)) : void 0
  })
});

// src/components/useDraggable.ts
var import_react5 = __toESM(require("react"));
var useDraggableState = (props) => {
  const { element, onDropHandler } = props;
  const nodeRef = import_react5.default.useRef(null);
  const [isHovered, setIsHovered] = import_react5.default.useState(false);
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
var import_react6 = __toESM(require("react"));
var import_plate_common3 = require("@udecode/plate-common");
var import_slate_react = require("slate-react");
var useWithDraggable = ({
  editor,
  level = 0,
  filter,
  element,
  allowReadOnly = false,
  draggableProps
}) => {
  const readOnly = (0, import_slate_react.useReadOnly)();
  const path = import_react6.default.useMemo(
    () => (0, import_plate_common3.findNodePath)(editor, element),
    [editor, element]
  );
  const filteredOut = import_react6.default.useMemo(
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
var import_react7 = __toESM(require("react"));
var withDraggable = (Draggable, Component, options) => (
  // eslint-disable-next-line react/display-name
  import_react7.default.forwardRef((props, ref) => {
    const { disabled, draggableProps } = useWithDraggable(__spreadValues(__spreadValues({}, options), props));
    if (disabled) {
      return /* @__PURE__ */ import_react7.default.createElement(Component, __spreadValues({}, props));
    }
    return /* @__PURE__ */ import_react7.default.createElement(Draggable, __spreadValues({ ref }, draggableProps), /* @__PURE__ */ import_react7.default.createElement(Component, __spreadValues({}, props)));
  })
);

// src/hooks/useDndNode.ts
var import_react8 = __toESM(require("react"));
var import_plate_common6 = require("@udecode/plate-common");
var import_react_dnd_html5_backend = require("react-dnd-html5-backend");

// src/hooks/useDragNode.ts
var import_react_dnd = require("react-dnd");
var useDragNode = (editor, _a) => {
  var _b = _a, { id, item } = _b, options = __objRest(_b, ["id", "item"]);
  return (0, import_react_dnd.useDrag)(
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
var import_react_dnd2 = require("react-dnd");

// src/transforms/onDropNode.ts
var import_plate_common4 = require("@udecode/plate-common");
var import_slate = require("slate");

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
  const dragEntry = (0, import_plate_common4.findNode)(editor, {
    at: [],
    match: { id: dragItem.id }
  });
  if (!dragEntry)
    return;
  const [, dragPath] = dragEntry;
  (0, import_plate_common4.focusEditor)(editor);
  let dropPath;
  if (direction === "bottom") {
    dropPath = (_a = (0, import_plate_common4.findNode)(editor, { at: [], match: { id } })) == null ? void 0 : _a[1];
    if (!dropPath)
      return;
    if (import_slate.Path.equals(dragPath, import_slate.Path.next(dropPath)))
      return;
  }
  if (direction === "top") {
    const nodePath = (_b = (0, import_plate_common4.findNode)(editor, { at: [], match: { id } })) == null ? void 0 : _b[1];
    if (!nodePath)
      return;
    dropPath = [...nodePath.slice(0, -1), nodePath.at(-1) - 1];
    if (import_slate.Path.equals(dragPath, dropPath))
      return;
  }
  if (direction) {
    const _dropPath = dropPath;
    const before = import_slate.Path.isBefore(dragPath, _dropPath) && import_slate.Path.isSibling(dragPath, _dropPath);
    const to = before ? _dropPath : import_slate.Path.next(_dropPath);
    (0, import_plate_common4.moveNodes)(editor, {
      at: dragPath,
      to
    });
  }
};

// src/transforms/onHoverNode.ts
var import_plate_common5 = require("@udecode/plate-common");
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
  if (direction && (0, import_plate_common5.isExpanded)(editor.selection)) {
    (0, import_plate_common5.focusEditor)(editor);
    (0, import_plate_common5.collapseSelection)(editor);
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
  return (0, import_react_dnd2.useDrop)(__spreadValues({
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
  const editor = (0, import_plate_common6.useEditorRef)();
  const [dropLine, setDropLine] = import_react8.default.useState("");
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
    preview((0, import_react_dnd_html5_backend.getEmptyImage)(), { captureDraggingState: true });
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
var import_plate_common7 = require("@udecode/plate-common");
var getBlocksWithId = (editor, options) => {
  const _nodes = (0, import_plate_common7.getNodeEntries)(editor, __spreadValues({
    match: (n) => (0, import_plate_common7.isBlock)(editor, n) && !!n.id
  }, options));
  return Array.from(_nodes);
};

// src/queries/getNodesRange.ts
var import_plate_common8 = require("@udecode/plate-common");
var getNodesRange = (editor, nodeEntries) => {
  if (nodeEntries.length === 0)
    return;
  const firstBlockPath = nodeEntries[0][1];
  const lastBlockPath = nodeEntries.at(-1)[1];
  return (0, import_plate_common8.getRange)(editor, firstBlockPath, lastBlockPath);
};

// src/transforms/focusBlockStartById.ts
var import_plate_common9 = require("@udecode/plate-common");
var focusBlockStartById = (editor, id) => {
  var _a;
  const path = (_a = (0, import_plate_common9.findNode)(editor, { at: [], match: { id } })) == null ? void 0 : _a[1];
  if (!path)
    return;
  (0, import_plate_common9.select)(editor, (0, import_plate_common9.getStartPoint)(editor, path));
  (0, import_plate_common9.focusEditor)(editor);
};

// src/transforms/removeBlocksAndFocus.ts
var import_plate_common10 = require("@udecode/plate-common");
var removeBlocksAndFocus = (editor, options) => {
  (0, import_plate_common10.unhangRange)(editor, options == null ? void 0 : options.at, options);
  const nodeEntries = getBlocksWithId(editor, options);
  (0, import_plate_common10.removeNodes)(editor, { at: getNodesRange(editor, nodeEntries) });
  (0, import_plate_common10.focusEditor)(editor);
};

// src/transforms/selectBlockById.ts
var import_plate_common11 = require("@udecode/plate-common");
var selectBlockById = (editor, id) => {
  var _a;
  const path = (_a = (0, import_plate_common11.findNode)(editor, { at: [], match: { id } })) == null ? void 0 : _a[1];
  if (!path)
    return;
  (0, import_plate_common11.select)(editor, (0, import_plate_common11.getRange)(editor, path));
  (0, import_plate_common11.focusEditor)(editor);
};

// src/transforms/selectBlocksBySelectionOrId.ts
var import_plate_common12 = require("@udecode/plate-common");
var selectBlocksBySelectionOrId = (editor, id) => {
  if (!editor.selection)
    return;
  const blockEntries = getBlocksWithId(editor, { at: editor.selection });
  const isBlockSelected = blockEntries.some(
    (blockEntry) => blockEntry[0].id === id
  );
  if (isBlockSelected) {
    (0, import_plate_common12.select)(editor, getNodesRange(editor, blockEntries));
    (0, import_plate_common12.focusEditor)(editor);
  } else {
    selectBlockById(editor, id);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map