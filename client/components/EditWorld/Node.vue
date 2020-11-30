<template>
    <div
        class="Node"
        @mousedown="dragStart"
        :style="style"
    >
        <input class="input name" @input="handleNameChange" :value="node.name" />

        <div class="body">
            <input class="input tags" @input="handleTagsChange" :value="node.tags">

            <table class="attributes">
                <tbody>
                    <tr
                        v-for="(attribute, index) in node.properties"
                        :key="`${id}#${index}`"
                        class="attribute"
                    >
                        <td>
                            <input class="input key" :property-index="index" @input="handleKeyChange" :value="attribute.key" />
                        </td>
                        <td>
                            <input class="input" :property-index="index" @input="handleValueChange" :value="attribute.value" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        <div class="relation relation-top"></div>
        <div class="relation relation-right"></div>
        <div class="relation relation-bottom"></div>
        <div class="relation relation-left"></div>
    </div>
</template>

<script>
import Node from '~/components/EditWorld/Node';

export default {
    components: { Node },
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
            return {
                left: `${this.node.position.x}px`,
                top: `${this.node.position.y}px`,
            };
        },
    },
    beforeMount() {
        window.addEventListener('mouseup', this.dragStop);
    },
    beforeDestroy() {
        window.removeEventListener('mouseup', this.dragStop);
    },
    methods: {
        dragStart(event) {
            window.addEventListener('mousemove', this.reposition);
            this.dragging = true;
        },
        dragStop(event) {
            window.removeEventListener('mousemove', this.reposition);
            this.dragging = false;
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
    }

    .body {
        padding: 0 1.5em 1.5em 1.5em;
        width: 250px;
    }

    .name {
        text-align: center;
        background: rgba(0, 0, 0, 0.05);
        padding: 1em;
    }

    .tags {
        text-align: center;
        padding: 1em;
    }

    .relation {
        display: none;
        position: absolute;

        background: #547bf185;
        width: $radius * 2;
        height: $radius * 2;
        border-radius: 100%;
        cursor: pointer;
    }

    .relation:hover {
        background: #547bf1ff;
    }

    // .Node:hover .relation {
    //     display: block;
    // }

    .relation-top {
        top: -$radius;
        left: calc(50% - #{$radius});
    }

    .relation-right {
        top: calc(50% - #{$radius});
        right: -$radius;
    }

    .relation-bottom {
        left: calc(50% - #{$radius});
        bottom: -$radius;
    }

    .relation-left {
        top: calc(50% - #{$radius});
        left: -$radius;
    }

    .Node:hover .relations {
        display: block;
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
    }
</style>