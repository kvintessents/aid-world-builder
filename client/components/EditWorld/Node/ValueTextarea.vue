<template>
    <textarea
        class="textarea"
        @input="input"
        v-on="listeners"
        v-bind="$attrs"
        ref="textarea"
        rows="1"
    ></textarea>
</template>

<script>
export default {
    props: {
        sizeCacheBreaker: {
            type: [Number, String],
            default: '',
        }
    },
    inheritAttrs: false,
    watch: {
        sizeCacheBreaker() {
            this.resize();
        }
    },
    computed: {
        listeners() {
            const { input, ...listeners } = this.$listeners;
            return listeners;
        }
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
        }
    },
}
</script>

<style lang="scss" scoped>
    .textarea {
        resize: none;
        max-width: 100%;
    }
</style>