<template>
    <div
        ref="node"
        class="Node"
        :class="{ selected: node.selected, positioned: positioned, minimized: node.minimized, reordering: reordering }"
        :style="style"
        @mousedown="onMouseDown"
    >
        <NodePreview v-if="previewing" :node="node" :type="previewType" />
        <NodeContents v-else :node="node" :hub="hub" />

        <div class="hover-controls" @mousedown="stopPropagation" @click="stopPropagation">
            <div v-if="positioned" class="resize" @mousedown="resizeStart" />
            <div class="minimize" title="Minimize" @click="minimizeNode">
                ⊝
            </div>
        </div>

        <NodeMenu
            :hub="hub"
            :node="node"
            :previewing="previewing"
            :preview-type="previewType"
            @togglePreview="togglePreview"
        />
    </div>
</template>

<script>
    import Vue from 'vue';
    import NodeContents from '~/components/EditWorld/Node/NodeContents';
    import NodePreview from '~/components/EditWorld/Node/NodePreview';
    import NodeMenu from '~/components/EditWorld/Node/NodeMenu';

    export default {
        components: { NodeContents, NodePreview, NodeMenu },
        props: {
            node: {
                type: Object,
                required: true,
            },
            positioned: {
                type: Boolean,
                required: true,
            },
        },
        data() {
            return {
                dragging: false,
                reordering: false,
                dropoffPoints: null,
                previewType: 'json',
                previewing: false,
                id: `node-${Math.floor(Math.random() * 1000000)}`,
                hub: new Vue(),
            };
        },
        computed: {
            style() {
                if (!this.positioned) {
                    return {
                        position: 'relative',
                        'margin-bottom': '1em',
                        'margin-right': '1em',
                    };
                }

                const style = {
                    position: 'absolute',
                    left: `${this.node.position.x}px`,
                    top: `${this.node.position.y}px`,
                };

                if (this.node.size) {
                    Object.assign(style, {
                        width: `${this.node.size.width}px`,
                    });
                }

                Object.assign(style, {
                    zIndex: this.node.zIndex || 0,
                });

                return style;
            },
        },
        methods: {
            onMouseDown(event) {
                event.stopPropagation();

                if (this.positioned) {
                    this.dragStart(event);
                } else {
                    this.$emit('reorderStart', {
                        node: this.node,
                        event: event,
                        component: this,
                    });
                }
            },

            // NODE VIEW DRAGGING
            dragStart() {
                this.dragging = true;
                window.addEventListener('mousemove', this.reposition);
                window.addEventListener('mouseup', this.dragStop);
                this.sendToTop();
            },
            dragStop() {
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
                    position: { x: event.movementX, y: event.movementY },
                });
            },

            // NODE VIEW RESIZING
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
                    };
                }

                this.$store.dispatch('world/setNodeSize', {
                    node: this.node,
                    size: {
                        width: currentSize.width + event.movementX,
                        height: currentSize.height,
                    },
                });
            },
            syncNodeHeight() {
                const size = this.$refs.node.getBoundingClientRect();

                this.$store.dispatch('world/setNodeSize', {
                    node: this.node,
                    size: {
                        width: size.width,
                        height: size.height,
                    },
                });
            },
            sendToTop() {
                this.$store.dispatch('world/sendToTop', this.node);
            },
            stopPropagation(event) {
                event.stopPropagation();
            },
            minimizeNode(event) {
                event.stopPropagation();
                this.$store.dispatch('world/minimizeNode', this.node);

                if (this.positioned) {
                    setTimeout(() => {
                        this.syncNodeHeight();
                    }, 100);
                }
            },
            togglePreview(type) {
                if (!this.previewing || this.previewType === type) {
                    this.previewing = !this.previewing;
                }

                this.previewType = type;
            },
        },
    };
</script>
<style lang="scss" scoped>
    $radius: 5px;

    .Node {
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 5px 10px #00000020;
        border-radius: 0.4em;
        box-sizing: border-box;
        cursor: grab;
    }

    .Node.positioned {
        user-select: none;
    }

    .Node.selected {
        border: 1px solid #000;
    }

    .Node.minimized {
        height: 46px;
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
        position: absolute;
        left: 2em;
        top: 0.35em;
        color: #888;
    }

    .preview-zaltys {
        position: absolute;
        left: 3.3em;
        top: 0.35em;
        color: #888;
    }

    .duplicate-node {
        position: absolute;
        left: 4.7em;
        top: 0.35em;
        color: #888;
        width: 16px;
        height: 16px;
        background: url('~assets/copy.png');
        background-size: 16px 16px;
    }
</style>
