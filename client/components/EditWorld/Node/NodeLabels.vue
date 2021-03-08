<template>
    <div v-show="showLabels" class="labels-wrapper">
        <input
            v-show="editing"
            ref="input"
            v-model="editString"
            type="text"
            class="label-input"
            @blur="onBlur"
            @focus="onFocus"
            @change="onChange"
            @keydown="onKeyDown"
        >
        <p v-show="editing" class="label-description">
            Labels are separated by comma. Color is automatic. <br>
            These labels don't get exported and are only for organizing.
        </p>
        <span v-show="!editing" @click="editLabels">
            <span
                v-for="label in node.labels"
                :key="label.value"
                class="label"
                :style="getLabelStyle(label)"
            >{{ label.value }}</span>
        </span>
    </div>
</template>
<script>
    import Vue from 'vue';

    /**
     * https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
     * @param {number} a
     * @return {function}
     */
    function mulberry32(a) {
        return function() {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    export default {
        props: {
            hub: {
                type: Vue,
                required: true,
            },
            node: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                editing: false,
                editString: '',
            };
        },
        computed: {
            showLabels() {
                const hasLabels = this.node.labels && this.node.labels.length;
                return hasLabels || this.editing;
            },
        },
        created() {
            this.hub.$on('NodeMenu-editLabels', this.editLabels.bind(this));
        },
        methods: {
            getLabelStyle(label) {
                const color = label.color;
                return {
                    background: color ? `rgba(${color[0]}, ${color[1]}, ${color[2]})` : null,
                };
            },
            editLabels() {
                this.editing = true;

                if (Array.isArray(this.node.labels)) {
                    this.editString = this.node.labels.map(l => l.value).join(', ');
                } else {
                    this.editString = '';
                }

                setTimeout(() => {
                    this.$refs.input.focus();
                });
            },
            onBlur() {
                this.editing = false;
            },
            onFocus() {
                this.editing = true;
            },
            onKeyDown(event) {
                if (event.key === 'Enter') {
                    this.$refs.input.blur();
                    this.editing = false;
                }
            },
            onChange() {
                const labelValues = [...new Set(
                    this.editString
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => !!s),
                )];

                const labels = labelValues.map(value => {
                    const numericString = value.substring(0, 10).split('').map(c => c.charCodeAt(0)).join('');
                    const numeric = parseInt(numericString, 10);
                    const generator = mulberry32(numeric);

                    const color = [
                        220 + Math.floor(35 * generator()),
                        220 + Math.floor(35 * generator()),
                        220 + Math.floor(35 * generator()),
                    ];

                    return { value, color };
                });

                this.$store.dispatch('world/setLabels', {
                    node: this.node,
                    labels: labels,
                });
            },
        },
    };
</script>
<style scoped>
    .labels-wrapper {
        margin-top: 1em;
        width: 100%;
    }

    .label  {
        background: rgba(0, 134, 229, 0.2);
        margin-right: 0.2em;
        padding: 0.2em 0.75em;
        border-radius: 0.5em;
        display: inline-block;
    }

    .label-input {
        padding: 0.2em 0.75em;
        display: block;
        width: 100%;
        box-sizing: border-box;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
    }

    .label-description {
        font-size: 0.9em;
        line-height: 1.5em;
        margin-top: 0.5em;
        margin-bottom: 0;
    }
</style>
