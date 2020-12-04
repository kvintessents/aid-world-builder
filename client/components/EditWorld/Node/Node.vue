<template>
    <div
        class="Node"
        :class="{ selected: node.selected }"
        :style="style"
        ref="node"
        @mousedown="dragStart"
    >
        <NodePreview v-if="previewing" :node="node" />
        <NodeContents v-else :node="node" />

        <div class="hover-controls" @mousedown="stopPropagation" @click="stopPropagation">
            <div class="resize" @mousedown="resizeStart"></div>
            <div class="delete" @click="deleteNode">ⓧ</div>
            <div class="minimize" @click="minimizeNode">⊝</div>
            <div class="preview" @click="togglePreview">P</div>
        </div>
    </div>
</template>

<script>
import NodeContents from '~/components/EditWorld/Node/NodeContents';
import NodePreview from '~/components/EditWorld/Node/NodePreview';
import NodeLabelControl from '~/components/EditWorld/Node/NodeLabelControl';
import ValueTextarea from '~/components/EditWorld/Node/ValueTextarea';

export default {
    components: { NodeLabelControl, ValueTextarea, NodeContents, NodePreview },
    props: {
        node: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dragging: false,
            previewing: false,
            id: `node-${Math.floor(Math.random() * 1000000)}`
        }
    },
    computed: {
        style() {
            const style = {
                left: `${this.node.position.x}px`,
                top: `${this.node.position.y}px`,
            };

            if (this.node.size) {
                Object.assign(style, {
                    width: `${this.node.size.width}px`,
                }) 
            }

            Object.assign(style, {
                zIndex: this.node.zIndex || 0,
            });

            return style;
        }
    },
    methods: {
        dragStart(event) {
            this.dragging = true;
            window.addEventListener('mousemove', this.reposition);
            window.addEventListener('mouseup', this.dragStop);
            this.sendToTop();
            event.stopPropagation();
        },
        dragStop(event) {
            this.dragging = false;
            window.removeEventListener('mousemove', this.reposition);
            window.removeEventListener('mouseup', this.dragStop);
        },
        reposition(event) {
            if (!this.dragging) {
                return;
            }

            this.$store.dispatch('world/moveNodeBy', {
                node: this.node,
                position: { x: event.movementX, y: event.movementY }
            });
        },
        resizeStart(event) {
            event.stopPropagation();
            this.resizing = true;
            window.addEventListener('mousemove', this.resize);
            window.addEventListener('mouseup', this.resizeStop);
            this.sendToTop();
        },
        resizeStop(event) {
            event.stopPropagation();
            this.resizing = false;
            window.removeEventListener('mousemove', this.resize);
            window.removeEventListener('mouseup', this.resizeStop);
            this.syncNodeHeight();
        },
        resize(force = false) {
            if (!force && !this.resizing) {
                return;
            }

            let currentSize = this.node.size;

            if (!currentSize) {
                const size = this.$refs.node.getBoundingClientRect();
                currentSize = {
                    width: size.width,
                    height: size.height,
                }
            }

            this.$store.dispatch('world/setNodeSize', {
                node: this.node,
                size: {
                    width: currentSize.width + event.movementX,
                    height: currentSize.height,
                }
            });
        },
        syncNodeHeight() {
            const size = this.$refs.node.getBoundingClientRect();

            this.$store.dispatch('world/setNodeSize', {
                node: this.node,
                size: {
                    width: size.width,
                    height: size.height,
                }
            });
        },
        sendToTop() {
            this.$store.dispatch('world/sendToTop', this.node);
        },
        stopPropagation(event) {
            event.stopPropagation();
        },
        deleteNode(event) {
            event.stopPropagation();

            if (window.confirm('Are you sure you wish to delete the entry? This cannot be undone.')) {
                this.$store.dispatch('world/deleteNode', this.node);
            }
        },
        minimizeNode(event) {
            event.stopPropagation();
            this.$store.dispatch('world/minimizeNode', this.node);
            setTimeout(() => {
                this.syncNodeHeight();
            }, 100);
            
        },
        togglePreview(event) {
            this.previewing = !this.previewing;
        }
    },
}
</script>
<style lang="scss" scoped>
    $radius: 5px;

    .Node {
        background: #fff;
        border: 1px solid #ccc;
        position: absolute;
        cursor: grab;
        user-select: none;
        box-shadow: 0 5px 10px #00000020;
        border-radius: 0.4em;
        box-sizing: border-box;
    }

    .Node.selected {
        border: 1px solid #000;
    }

    .input {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        background: transparent;
        font-family: inherit;
    }

    .resize {
        position: absolute;
        right: -2px;
        top: 0;
        cursor: ew-resize;
        height: 100%;
        width: 5px;
    }

    .hover-controls {
        display: none;
    }

    .Node:hover .hover-controls {
        display: block;
        cursor: pointer;
    }

    .delete {
        position: absolute;
        right: 0.3em;
        top: 0.2em;
        color:rgb(255, 0, 0);
    }

    .minimize {
        position: absolute;
        left: 0.2em;
        top: 0.0em;
        font-size: 1.5em;
        color: #cea902;
    }

    .preview {
        left: 2em;
        top: 0.35em;
        position: absolute;
        color: #888;
    }
</style>