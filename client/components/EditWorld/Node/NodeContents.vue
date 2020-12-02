<template>
    <div>
        <header class="header">
            <input class="input name" @input="handleNameChange" :value="node.name" @mousedown="stopPropagation" />
        </header>

        <section class="body" :class="{ minimized: node.minimized }">
            <div class="contents" @mousedown="stopPropagation">
                <ValueTextarea class="input tags" @input="handleTagsChange" :value="node.tags"  :sizeCacheBreaker="sizeCacheBreaker" />

                <table class="attributes">
                    <tbody>
                        <tr
                            v-for="(attribute, index) in node.properties"
                            :key="`${id}#${index}`"
                            class="attribute"
                        >
                            <td class="column-key">
                                <ValueTextarea
                                    class="input key"
                                    :property-index="index"
                                    @input="handleKeyChange"
                                    @keydown="onValueKeyDown"
                                    :value="attribute.key"
                                    :sizeCacheBreaker="sizeCacheBreaker" />
                            </td>
                            <td class="column-value">
                                <ValueTextarea
                                    class="input value"
                                    :property-index="index"
                                    @input="handleValueChange"
                                    @keydown="onKeyKeyDown"
                                    :value="attribute.value"
                                    :sizeCacheBreaker="sizeCacheBreaker"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- <footer class="footer">
            <NodeLabelControl :node="node" />
        </footer> -->
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
        sizeCacheBreaker() {
            let width = ''; 

            if (this.node.size) {
                width = this.node.size.width;
            }

            return `${this.node.minimized}.${width}`;
        }
    },
    methods: {
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

    .input {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        background: transparent;
        font-family: inherit;
        font-size: 1em;
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
    }

    .name {
        width: 100%;
        text-align: center;
    }

    .tags {
        text-align: center;
    }

    .attributes {
        padding: 0;
        margin: 0;
        border-spacing: 0;
        width: 100%;
    }

    .attributes tr:nth-child(odd) {
        background: rgba(0, 0, 0, 0.03);
    }

    .column-key {
        padding: 0.5em;
        padding-right: 0;
        width: 32%;
    }

    .column-value {
        padding: 0.5em;
        width: 68%;
    }

    .key {
        font-weight: 600;
    }

    .tags {
        margin: 1em 0;
    }
</style>