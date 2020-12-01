<template>
    <div
        class="Node"
        @mousedown="dragStart"
        :style="style"
        ref="node"
    >
        <header class="header">
            <input class="input name" @input="handleNameChange" :value="node.name" @mousedown="stopPropagation" />
        </header>

        <section class="body">
            <div class="contents" @mousedown="stopPropagation">
                <input class="input tags" @input="handleTagsChange" :value="node.tags">

                <table class="attributes">
                    <tbody>
                        <tr
                            v-for="(attribute, index) in node.properties"
                            :key="`${id}#${index}`"
                            class="attribute"
                        >
                            <td>
                                <input
                                    class="input key"
                                    :property-index="index"
                                    @input="handleKeyChange"
                                    @keydown="onValueKeyDown"
                                    :value="attribute.key" />
                            </td>
                            <td>
                                <ValueTextarea
                                    class="input value"
                                    :property-index="index"
                                    @input="handleValueChange"
                                    @keydown="onKeyKeyDown"
                                    :value="attribute.value"
                                    :rows="1"
                                    :sizeCacheBreaker="sizeCacheBreaker"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <footer class="footer">
            <NodeLabelControl :node="node" />
        </footer>

        <div class="resize" @mousedown="resizeStart" @dblclick="resizeReset">X</div>
    </div>
</template>

<script>
import NodeLabelControl from '~/components/EditWorld/Node/NodeLabelControl';
import ValueTextarea from '~/components/EditWorld/Node/ValueTextarea';

export default {
    components: { NodeLabelControl, ValueTextarea },
    props: {
        node: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dragging: false,
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

            return style;
        },
        sizeCacheBreaker() {
            if (!this.node.size) {
                return '';
            }

            return this.node.size.width;
        }
    },
    beforeMount() {
        
    },
    beforeDestroy() {
        
    },
    methods: {
        dragStart(event) {
            this.dragging = true;
            window.addEventListener('mousemove', this.reposition);
            window.addEventListener('mouseup', this.dragStop);
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

            this.$store.dispatch('world/setNodePosition', {
                node: this.node,
                position: {
                    x: this.node.position.x + event.movementX,
                    y: this.node.position.y + event.movementY,
                }
            });
        },
        resizeStart(event) {
            event.stopPropagation();
            this.resizing = true;
            window.addEventListener('mousemove', this.resize);
            window.addEventListener('mouseup', this.resizeStop);
        },
        resizeStop(event) {
            event.stopPropagation();
            this.resizing = false;
            window.removeEventListener('mousemove', this.resize);
            window.removeEventListener('mouseup', this.resizeStop);
        },
        resize() {
            if (!this.resizing) {
                return;
            }

            let currentSize = this.node.size;

            console.log(currentSize);

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
        resizeReset(event) {
            this.$store.dispatch('world/removeNodeSize', this.node);
        },
        handleNameChange(event) {
            this.$store.dispatch('world/setAttributes', {
                node: this.node,
                attributes: { name: event.target.value }
            });
        },
        handleTagsChange(event) {
            this.$store.dispatch('world/setAttributes', {
                node: this.node,
                attributes: { tags: event.target.value }
            });
        },
        handleKeyChange(event) {
            this.$store.dispatch('world/setProperty', {
                node: this.node,
                index: event.target.getAttribute('property-index'),
                key: event.target.value
            });
        },
        handleValueChange(event) {
            this.$store.dispatch('world/setProperty', {
                node: this.node,
                index: event.target.getAttribute('property-index'),
                value: event.target.value
            });
        },
        onKeyKeyDown(event) {
            if (event.key !== 'Tab') {
                return true;
            }

            const index = parseInt(event.target.getAttribute('property-index'), 10);
            const lastIndex = this.node.properties.length - 1;

            if (index === lastIndex) {
                this.$store.commit('world/appendNewProperty', this.node);
            }

            return true;
        },
        onValueKeyDown(event) {
            if (event.key !== 'Backspace') {
                return true;
            }

            const index = parseInt(event.target.getAttribute('property-index'), 10);

            if (
                this.node.properties[index].value.trim() === '' &&
                this.node.properties[index].key.trim() === ''
            ) {
                this.$store.dispatch('world/removeProperty', {
                    node: this.node,
                    propertyIndex: index
                });
            }

            return true;
        },
        stopPropagation(event) {
            event.stopPropagation();
        }
    },
}
</script>
<style lang="scss" scoped>
    $radius: 5px;

    .Node {
        background: #fff;
        border: 1px solid #000;
        position: absolute;
        cursor: grab;
        user-select: none;
    }

    .input {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        background: transparent;
        font-family: inherit;
    }

    .body {
        padding: 0 1.5em 1.5em 1.5em;
    }

    .contents {
        cursor: initial;
    }

    .header {
        padding: 1em 1.5em;
        text-align: center;
        background: rgba(0, 0, 0, 0.05);
    }

    .name {
        width: 100%;
        text-align: center;
    }

    .tags {
        text-align: center;
        padding: 1em;
    }

    div[contenteditable], td[contenteditable] {
        cursor: text;
    }

    .attributes {
        padding: 0;
        margin: 0;
        border-spacing: 0;
        width: 100%;
    }

    .attributes tr:nth-child(odd) {
        background: rgba(0, 0, 0, 0.05);
    }

    .attribute td {
        padding: 0.5em;
    }

    .key {
        font-weight: 600;
        width: 6em;
    }

    .value {
        resize: none;
    }

    .resize {
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: ew-resize;
    }
</style>