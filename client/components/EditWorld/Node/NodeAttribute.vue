<template>
    <tr class="attribute">
        <td class="column-key">
            <ValueTextarea
                class="input key"
                @input="handleKeyChange"
                @keydown="onValueKeyDown"
                :value="attribute.key"
                :sizeCacheBreaker="sizeCacheBreaker" />
            <button class="delete-button" @click="removeProperty">ⓧ</button>
        </td>
        <td class="column-value">
            <ValueTextarea
                class="input value"
                @input="handleValueChange"
                @keydown="onKeyKeyDown"
                :value="attribute.value"
                :sizeCacheBreaker="sizeCacheBreaker"
            />
            <div class="reorder-handle" @mousedown="startReorder"><span class="reorder-handle-innard">↕</span></div>
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
    computed: {
        isEmpty() {
            const index = parseInt(this.index, 10);
            return (
                this.node.properties[index].value.trim() === '' &&
                this.node.properties[index].key.trim() === ''
            )
        },
    },
    methods: {
        handleKeyChange(event) {
            this.$store.dispatch('world/setProperty', {
                node: this.node,
                index: this.index,
                key: event.target.value
            });
        },
        handleValueChange(event) {
            this.$store.dispatch('world/setProperty', {
                node: this.node,
                index: this.index,
                value: event.target.value
            });
        },
        onKeyKeyDown(event) {
            if (event.key !== 'Tab') {
                return true;
            }

            const index = parseInt(this.index, 10);
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

            if (this.isEmpty) {
                this.$store.dispatch('world/removeProperty', {
                    node: this.node,
                    propertyIndex: this.index
                });
            }

            return true;
        },
        startReorder(event) {
            event.preventDefault();
            event.stopPropagation();
            this.$emit('startReorder', { event, component: this });
        },
        removeProperty(event) {
            if (!this.isEmpty) {
                const confirmed = window.confirm('Are you sure you want to delete this trait?');
                if (!confirmed) {
                    return;
                }
            }

            this.$store.dispatch('world/removeProperty', {
                node: this.node,
                propertyIndex: this.index
            });
        }
    }
}
</script>

<style scoped lang="scss">
    .attribute:nth-child(odd) {
        background: rgba(0, 0, 0, 0.03);
    }

    .column-key {
        position: relative;
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
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.03);
        height: 100%;
        width: 2em;
        cursor: grab;
        opacity: 0.5;
    }

    .attribute:hover .reorder-handle {
        display: table;
    }

    .reorder-handle-innard {
        display: table-cell;
        text-align: center;
        font-size: 1.5em;
        vertical-align: middle;
        color: #222;
        position: relative;
        top: 2px;
    }

    .reorder-handle:hover {
        opacity: 1;
    }

    .attribute:hover .delete-button {
        color: red;
    }

    .delete-button {
        position: absolute;
        right: 100%;
        top: 0;
        background: white;
        color: white;
        border: none;
        width: 1.5em;
        height: 100%;
        cursor: pointer;
        padding: 0;
    }
</style>