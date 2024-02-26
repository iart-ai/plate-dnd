import * as _udecode_plate_core from '@udecode/plate-core';
import * as _udecode_slate from '@udecode/slate';
import React from 'react';
import * as zustand_x from 'zustand-x';
import { TElement, TEditor, AnyObject, Value, TReactEditor, WithPartial, GetNodeEntriesOptions, TNodeEntry, PlateEditor } from '@udecode/plate-common';
import * as react_dnd from 'react-dnd';
import { ConnectDragSource, DropTargetMonitor, DragSourceHookSpec, DropTargetHookSpec } from 'react-dnd';
import * as slate_react from 'slate-react';
import * as slate from 'slate';
import { Path } from 'slate';

interface ScrollAreaProps {
    placement: 'top' | 'bottom';
    enabled?: boolean;
    height?: number;
    zIndex?: number;
    minStrength?: number;
    strengthMultiplier?: number;
    containerRef?: React.RefObject<any>;
    scrollAreaProps?: React.HTMLAttributes<HTMLDivElement>;
}
declare function ScrollArea({ placement, enabled, height, zIndex, minStrength, strengthMultiplier, containerRef, scrollAreaProps, }: ScrollAreaProps): React.JSX.Element | null;

type ScrollerProps = Omit<ScrollAreaProps, 'placement'>;
/**
 * Set up an edge scroller at the top of the page for scrolling up.
 * One at the bottom for scrolling down.
 */
declare function Scroller(props: ScrollerProps): React.JSX.Element;

declare function DndScroller(props: Partial<ScrollerProps>): React.JSX.Element;

interface DndPlugin {
    enableScroller?: boolean;
    scrollerProps?: Partial<ScrollerProps>;
}
declare const KEY_DND = "dnd";
declare const createDndPlugin: <OP = DndPlugin, OV extends _udecode_slate.Value = _udecode_slate.Value, OE extends _udecode_plate_core.PlateEditor<OV> = _udecode_plate_core.PlateEditor<OV>>(override?: Partial<_udecode_plate_core.PlatePlugin<_udecode_plate_core.NoInfer<OP>, OV, OE>> | undefined, overrideByKey?: _udecode_plate_core.OverrideByKey<OV, OE> | undefined) => _udecode_plate_core.PlatePlugin<_udecode_plate_core.NoInfer<OP>, OV, OE>;

declare const dndStore: zustand_x.StoreApi<"dnd", {
    isDragging: boolean;
}, zustand_x.StateActions<{
    isDragging: boolean;
}>, {}>;

interface DragItemNode {
    /**
     * Required to identify the node.
     */
    id: string;
    [key: string]: unknown;
}
type DropLineDirection = '' | 'top' | 'bottom';
type DropDirection = 'top' | 'bottom' | undefined;

type DraggableState = {
    dropLine: DropLineDirection;
    isHovered: boolean;
    setIsHovered: (isHovered: boolean) => void;
    isDragging: boolean;
    nodeRef: React.RefObject<HTMLDivElement>;
    dragRef: ConnectDragSource;
};
declare const useDraggableState: (props: {
    element: TElement;
    onDropHandler?: ((editor: TEditor, props: {
        monitor: DropTargetMonitor<DragItemNode, unknown>;
        dragItem: DragItemNode;
        nodeRef: any;
        id: string;
    }) => boolean) | undefined;
}) => DraggableState;
declare const useDraggable: (state: DraggableState) => {
    previewRef: React.RefObject<HTMLDivElement>;
    handleRef: ConnectDragSource;
    groupProps: {
        onPointerEnter: () => void;
        onPointerLeave: () => void;
    };
    droplineProps: {
        contentEditable: boolean;
    };
    gutterLeftProps: {
        contentEditable: boolean;
    };
};

interface WithDraggableOptions<T = any> {
    /**
     * Document level where dnd is enabled. 0 = root blocks, 1 = first level of children, etc.
     * Set to null to allow all levels.
     * @default 0
     */
    level?: number | null;
    /**
     * Filter out elements that can't be dragged.
     */
    filter?: (editor: TEditor, path: Path) => boolean;
    /**
     * Enables dnd in read-only.
     */
    allowReadOnly?: boolean;
    draggableProps?: T;
}
declare const useWithDraggable: <T = any>({ editor, level, filter, element, allowReadOnly, draggableProps, }: WithDraggableOptions<T> & _udecode_plate_core.PlateRenderNodeProps<_udecode_slate.Value, _udecode_plate_core.PlateEditor<_udecode_slate.Value>> & Omit<slate_react.RenderElementProps, "element"> & {
    element: _udecode_slate.TElement;
}) => {
    disabled: boolean;
    draggableProps: {
        editor: _udecode_plate_core.PlateEditor<_udecode_slate.Value>;
        element: _udecode_slate.TElement;
    };
};

declare const withDraggable: <T extends AnyObject = AnyObject>(Draggable: React.FC<any>, Component: React.FC<any>, options?: WithDraggableOptions<T> | undefined) => React.ForwardRefExoticComponent<_udecode_plate_core.PlateRenderNodeProps<_udecode_slate.Value, _udecode_plate_core.PlateEditor<_udecode_slate.Value>> & Omit<slate_react.RenderElementProps, "element"> & {
    element: _udecode_slate.TElement;
} & React.RefAttributes<HTMLDivElement>>;

interface UseDragNodeOptions extends DragSourceHookSpec<DragItemNode, unknown, {
    isDragging: boolean;
}> {
    id: string;
}
/**
 * `useDrag` hook to drag a node from the editor. `item` with `id` is required.
 *
 * On drag start:
 * - set `editor.isDragging` to true
 * - add `dragging` class to `body`
 *
 * On drag end:
 * - set `editor.isDragging` to false
 * - remove `dragging` class to `body`
 *
 * Collect:
 * - isDragging: true if mouse is dragging the block
 */
declare const useDragNode: <V extends Value>(editor: TEditor<V>, { id, item, ...options }: UseDragNodeOptions) => [{
    isDragging: boolean;
}, react_dnd.ConnectDragSource, react_dnd.ConnectDragPreview];

interface UseDropNodeOptions extends DropTargetHookSpec<DragItemNode, unknown, {
    isOver: boolean;
}> {
    /**
     * The reference to the node being dragged.
     */
    nodeRef: any;
    /**
     * Id of the node.
     */
    id: string;
    /**
     * Current value of dropLine.
     */
    dropLine: string;
    /**
     * Callback called on dropLine change.
     */
    onChangeDropLine: (newValue: DropLineDirection) => void;
    /**
     * Intercepts the drop handling.
     * If `false` is returned, the default drop behavior is called after.
     * If `true` is returned, the default behavior is not called.
     */
    onDropHandler?: (editor: TEditor, props: {
        monitor: DropTargetMonitor<DragItemNode, unknown>;
        dragItem: DragItemNode;
        nodeRef: any;
        id: string;
    }) => boolean;
}
/**
 * `useDrop` hook to drop a node on the editor.
 *
 * On drop:
 * - get hover direction (top, bottom or undefined), return early if undefined
 * - dragPath: find node with id = dragItem.id, return early if not found
 * - focus editor
 * - dropPath: find node with id = id, its path should be next (bottom) or previous (top)
 * - move node from dragPath to dropPath
 *
 * On hover:
 * - get drop line direction
 * - if differs from dropLine, setDropLine is called
 *
 * Collect:
 * - isOver: true if mouse is over the block
 */
declare const useDropNode: <V extends Value>(editor: TReactEditor<V>, { nodeRef, id, dropLine, onChangeDropLine, onDropHandler, ...options }: UseDropNodeOptions) => [{
    isOver: boolean;
}, react_dnd.ConnectDropTarget];

interface UseDndNodeOptions extends Pick<UseDropNodeOptions, 'id' | 'nodeRef'>, Pick<UseDragNodeOptions, 'type'> {
    drag?: UseDragNodeOptions;
    drop?: UseDropNodeOptions;
    onDropHandler?: (editor: TEditor, props: {
        monitor: DropTargetMonitor<DragItemNode, unknown>;
        dragItem: DragItemNode;
        nodeRef: any;
        id: string;
    }) => boolean;
    preview?: {
        /**
         * Whether to disable the preview.
         */
        disable?: boolean;
        /**
         * The reference to the preview element.
         */
        ref?: any;
    };
}
/**
 * {@link useDragNode} and {@link useDropNode} hooks to drag and drop a node from the editor.
 * A default preview is used to show the node being dragged, which can be customized or removed.
 * Returns the drag ref and drop line direction.
 */
declare const useDndNode: ({ id, type, nodeRef, preview: previewOptions, drag: dragOptions, drop: dropOptions, onDropHandler, }: UseDndNodeOptions) => {
    isDragging: boolean;
    isOver: boolean;
    dropLine: DropLineDirection;
    dragRef: react_dnd.ConnectDragSource;
};

/**
 * {@link useDndNode}
 */
declare const useDndBlock: (options: WithPartial<UseDndNodeOptions, 'type'>) => {
    isDragging: boolean;
    isOver: boolean;
    dropLine: DropLineDirection;
    dragRef: react_dnd.ConnectDragSource;
};

declare const DRAG_ITEM_BLOCK = "block";
/**
 * {@link useDragNode}
 */
declare const useDragBlock: <V extends Value>(editor: TEditor<V>, id: string) => [{
    isDragging: boolean;
}, react_dnd.ConnectDragSource, react_dnd.ConnectDragPreview];

/**
 * {@link useDropNode}
 */
declare const useDropBlock: <V extends Value>(editor: TReactEditor<V>, options: Omit<UseDropNodeOptions, 'accept'>) => [{
    isOver: boolean;
}, react_dnd.ConnectDropTarget];

/**
 * Get blocks with an id
 */
declare const getBlocksWithId: <V extends Value>(editor: TEditor<V>, options: GetNodeEntriesOptions<V>) => _udecode_slate.TNodeEntry<_udecode_slate.ENode<V>>[];

/**
 * Get node entries range.
 */
declare const getNodesRange: <V extends Value>(editor: TEditor<V>, nodeEntries: TNodeEntry[]) => slate.BaseRange | undefined;

/**
 * Select the start of a block by id and focus the editor.
 */
declare const focusBlockStartById: <V extends Value>(editor: TReactEditor<V>, id: string) => void;

/**
 * Callback called on drag an drop a node with id.
 */
declare const onDropNode: <V extends Value>(editor: TReactEditor<V>, { dragItem, monitor, nodeRef, id, }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
} & Pick<UseDropNodeOptions, "id" | "nodeRef">) => void;

/**
 * Callback called when dragging a node and hovering nodes.
 */
declare const onHoverNode: <V extends Value>(editor: TReactEditor<V>, { dragItem, monitor, nodeRef, onChangeDropLine, dropLine, id, }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
} & Pick<UseDropNodeOptions, "id" | "nodeRef" | "dropLine" | "onChangeDropLine">) => void;

/**
 * Remove blocks with an id and focus the editor.
 */
declare const removeBlocksAndFocus: <V extends Value>(editor: TReactEditor<V>, options: GetNodeEntriesOptions<V>) => void;

/**
 * Select the block above the selection by id and focus the editor.
 */
declare const selectBlockById: <V extends Value>(editor: TReactEditor<V>, id: string) => void;

/**
 * Select blocks by selection or by id.
 * If the block with id is not selected, select the block with id.
 * Else, select the blocks above the selection.
 */
declare const selectBlocksBySelectionOrId: <V extends Value>(editor: PlateEditor<V>, id: string) => void;

interface GetHoverDirectionOptions {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
    /**
     * The node ref of the node being dragged.
     */
    nodeRef: any;
    /**
     * Hovering node id.
     */
    id: string;
}
/**
 * If dragging a node A over another node B:
 * get the direction of node A relative to node B.
 */
declare const getHoverDirection: ({ dragItem, id, monitor, nodeRef, }: GetHoverDirectionOptions) => DropDirection;

/**
 * Get new direction if updated
 */

declare const getNewDirection: (previousDir: string, dir?: string) => DropLineDirection | undefined;

export { DRAG_ITEM_BLOCK, DndPlugin, DndScroller, DragItemNode, DraggableState, DropDirection, DropLineDirection, GetHoverDirectionOptions, KEY_DND, ScrollArea, ScrollAreaProps, Scroller, ScrollerProps, UseDndNodeOptions, UseDragNodeOptions, UseDropNodeOptions, WithDraggableOptions, createDndPlugin, dndStore, focusBlockStartById, getBlocksWithId, getHoverDirection, getNewDirection, getNodesRange, onDropNode, onHoverNode, removeBlocksAndFocus, selectBlockById, selectBlocksBySelectionOrId, useDndBlock, useDndNode, useDragBlock, useDragNode, useDraggable, useDraggableState, useDropBlock, useDropNode, useWithDraggable, withDraggable };
