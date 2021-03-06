<template>
    <textarea
        v-bind="$attrs"
        ref="textarea"
        class="textarea"
        rows="1"
        @input="input"
        v-on="listeners"
    />
</template>

<script>
    export default {
        inheritAttrs: false,
        props: {
            sizeCacheBreaker: {
                type: [Number, String],
                default: '',
            },
        },
        computed: {
            listeners() {
                const listeners = { ...this.$listeners };
                delete listeners.input;
                return listeners;
            },
        },
        watch: {
            sizeCacheBreaker() {
                this.resize();
            },
        },
        mounted() {
            this.resize();
        },
        methods: {
            input(event) {
                this.resize();
                this.$emit('input', event);
            },
            resize() {
                const node = this.$refs.textarea;
                node.style.height = 'auto';
                node.style.height = node.scrollHeight + 'px';
            },
        },
    };
</script>

<style lang="scss" scoped>
    .textarea {
        resize: none;
        max-width: 100%;
    }
</style>
