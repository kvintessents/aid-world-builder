<template>
    <tr class="attribute">
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
            <div class="reorder-handle" @mousedown="startReorder"></div>
        </td>
    </tr>
</template>

<script>
import ValueTextarea from '~/components/EditWorld/Node/ValueTextarea';
export default {
    components: { ValueTextarea },
    props: {
        node: {
            type: Object,
            required: true,
        },
        attribute: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        sizeCacheBreaker: {
            type: String,
            default: '',
        }
    },
    methods: {
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
                this.$store.commit('world/appendNewProperty', { node: this.node });
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
        startReorder(event) {
            event.preventDefault();
            event.stopPropagation();
            this.$emit('startReorder', { event, component: this });
        }
    }
}
</script>

<style scoped lang="scss">
    .attribute:nth-child(odd) {
        background: rgba(0, 0, 0, 0.03);
    }

    .column-key {
        padding: 0.25em 0.5em;
        padding-right: 0;
        width: 20%;
        min-width: 6em;
    }

    .column-value {
        position: relative;
        padding: 0.25em 0.5em;
        width: 80%;
    }

    .key {
        font-weight: 600;
    }
    .value {
        line-height: 1.5em;
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

    .reorder-handle {
        position: absolute;
        right: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.1);
        height: 100%;
        width: 1em;
        cursor: grab;
    }
</style>