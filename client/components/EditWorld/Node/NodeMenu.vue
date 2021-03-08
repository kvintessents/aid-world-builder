<template>
    <div class="menu" @mousedown="stopPropagation">
        <div class="menu-button" :class="{ open }" @click="toggleMenu">
            <span class="menu-icon">☰</span>
        </div>
        <ul v-if="open" class="menu-list" @click="toggleMenu">
            <li
                :class="{checked: previewing && previewType === 'zaltys'}"
                @click="$emit('togglePreview', 'zaltys')"
            >
                Preview Zalty's
            </li>
            <li
                :class="{checked: previewing && previewType === 'json'}"
                @click="$emit('togglePreview', 'json')"
            >
                Preview JSON
            </li>
            <li @click="duplicateNode">
                Duplicate
            </li>
            <li @click="hub.$emit('NodeMenu-editLabels')">
                Edit labels
            </li>
            <li @click="deleteNode">
                Delete
            </li>
        </ul>
    </div>
</template>
<script>
    import Vue from 'vue';

    export default {
        props: {
            node: {
                type: Object,
                required: true,
            },
            previewing: {
                type: Boolean,
                required: true,
            },
            previewType: {
                type: String,
                required: true,
            },
            hub: {
                type: Vue,
                required: true,
            },
        },
        data() {
            return {
                open: false,
            };
        },
        methods: {
            toggleMenu(e) {
                e.stopPropagation();
                this.open = !this.open;

                if (this.open) {
                    window.addEventListener('mousedown', this.closeMenu);
                    this.hub.$on('NodeContents-mouseDown', this.closeMenu);
                } else {
                    window.removeEventListener('mousedown', this.closeMenu);
                    this.hub.$off('NodeContents-mouseDown', this.closeMenu);
                }
            },
            stopPropagation(e) {
                e.stopPropagation();
            },
            closeMenu() {
                this.open = false;
            },
            deleteNode(event) {
                event.stopPropagation();

                if (window.confirm('Are you sure you wish to delete the entry? This cannot be undone.')) {
                    this.$store.dispatch('world/deleteNode', this.node);
                }
            },
            duplicateNode() {
                this.$store.dispatch('world/duplicateNode', this.node);
            },
        },
    };
</script>
<style lang="scss" scoped>
    .menu {
        position: absolute;
        right: 10px;
        top: 8px;
        cursor: pointer;
    }

    .menu-button {
        padding: 4px 8px;
        border-radius: 0.3em;

        &:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        &.open {
            background: rgba(0, 0, 0, 0.05);
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1) inset;

            .menu-icon {
                position: relative;
                top: 1px;
            }
        }
    }

    .menu-list {
        position: absolute;
        right: 0;
        background: #fff;
        padding: 0;
        margin: 0;
        list-style-type: none;
        box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.2);
        border-radius: 0.3em;

        li {
            padding: 0.8em 2em;
            white-space: nowrap;
            min-width: 10em;
            position: relative;
        }

        li.checked::before {
            content: '✓';
            display: block;
            width: 1em;
            height: 1em;
            position: absolute;
            left: 0.7em;
            top: 0.65em;
        }

        li:hover {
            background: rgba(0, 0, 0, 0.1);
        }
    }
</style>
