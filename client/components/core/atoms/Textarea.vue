<template>
    <label class="wrapper">
        <div v-if="label" class="label">
            {{ label ? label : '' }}
        </div>
        <textarea
            v-bind="$attrs"
            ref="textarea"
            class="textarea"
            @input="input"
            v-on="listeners"
        />
    </label>
</template>

<script>
    export default {
        inheritAttrs: false,
        props: {
            loading: { type: Boolean, default: false },
            type: { type: String, default: 'text' },
            label: { type: String, default: null },
            value: { type: String, default: '' },
            textareaClass: { type: String, default: '' },
            autofocus: { type: Boolean, default: false },
        },
        computed: {
            listeners() {
                const listeners = {
                    ...this.$listeners,
                };
                delete listeners.input;
                return listeners;
            },
        },
        mounted() {
            if (this.autofocus) {
                setTimeout(() => this.$refs.textarea.focus(), 0);
            }
        },
        methods: {
            input(event) {
                this.$emit('input', event.target.value);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .textarea {
        padding: 1em;
        border: 1px solid #dadada;
        font-size: 1em;
        width: 100%;
        box-sizing: border-box;
        font-family: inherit;
        font-weight: inherit;
        outline: none;
    }

    .textarea:focus {
        border: 1px solid #aaa;
    }

    .wrapper {
        display: block;
        margin-bottom: 1em;
    }

    .wrapper[no-margin] {
        margin-bottom: 0;
    }

    .label {
        margin-bottom: 0.5em;
    }
</style>
