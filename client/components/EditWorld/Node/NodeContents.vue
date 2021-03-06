<template>
    <div class="node-contents">
        <header class="header" :class="{ selected: node.selected }">
            <input class="input name" :value="node.name" @input="handleNameChange" @mousedown="stopPropagation">
        </header>

        <section class="body" :class="{ minimized: node.minimized }">
            <div class="contents" @mousedown="stopPropagation">
                <ValueTextarea
                    class="input tags"
                    :value="node.tags"
                    :size-cache-breaker="sizeCacheBreaker"
                    @input="handleTagsChange"
                />

                <NodeAttributes v-if="node.properties.length" :node="node" />

                <div class="add-trait">
                    <Button tiny create @click="appendFirstProperty">
                        + Add trait
                    </Button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import ValueTextarea from '~/components/EditWorld/Node/ValueTextarea';
    import Button from '~/components/core/atoms/Button';
    import NodeAttributes from '~/components/EditWorld/Node/NodeAttributes';

    export default {
        components: { ValueTextarea, Button, NodeAttributes },
        props: {
            node: {
                type: Object,
                required: true,
            },
            previewing: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                dragging: false,
            };
        },
        computed: {
            sizeCacheBreaker() {
                let width = '';

                if (this.node.size) {
                    width = this.node.size.width;
                }

                return `${this.node.minimized}.${width}`;
            },
        },
        methods: {
            handleNameChange(event) {
                this.$store.dispatch('world/setAttributes', {
                    node: this.node,
                    attributes: { name: event.target.value },
                });
            },
            handleTagsChange(event) {
                this.$store.dispatch('world/setAttributes', {
                    node: this.node,
                    attributes: { tags: event.target.value },
                });
            },
            stopPropagation(event) {
                event.stopPropagation();
            },
            appendFirstProperty() {
                this.$store.commit('world/appendNewProperty', {
                    node: this.node,
                    initValue: { key: 'trait', value: 'value' },
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    $radius: 5px;

    .node-contents {
        height: 100%;
    }

    .input {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        background: transparent;
        font-family: inherit;
        font-size: 1em;
        color: inherit;
    }

    .body {
        padding: 0 1.5em 1.5em 1.5em;
    }

    .body.minimized {
        display: none;
    }

    .contents {
        cursor: initial;
    }

    .header {
        padding: 1em 1.5em;
        text-align: center;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 0.4em 0.4em 0 0;
    }

    .header.selected {
        background: #00a7e5;
        color: #fff;
    }

    .name {
        text-align: center;
    }

    .tags {
        text-align: center;
        margin: 1em 0;
    }

    .node-contents:hover .add-trait {
        display: block;
    }

    .add-trait {
        display: none;
        position: absolute;
        bottom: -0.75em;
        width: 100%;
        margin-left: -1.4em;
        text-align: center;
    }

    .add-trait > button {
        cursor: pointer;
    }
</style>
