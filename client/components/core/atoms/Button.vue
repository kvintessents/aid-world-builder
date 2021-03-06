<template>
    <component
        :is="tagType"
        class="button"
        :class="{
            loading: loading
        }"

        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot />
    </component>
</template>

<script>
    export default {
        inheritAttrs: false,
        props: {
            loading: {
                type: Boolean,
                required: false,
            },
            link: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            tagType() {
                return this.link ? 'a' : 'button';
            },
        },
    };
</script>

<style lang="scss" scoped>
    .button {
        background-color: #00a7e5;
        border: none;
        border-radius: 0.25em;
        padding: 1em 2em;
        color: #fff;
        font-size: 1em;
        text-decoration: none;
    }

    .button[disabled] {
        background-color: #ddd;
    }

    .button[small] {
        padding: 0.5em 1em;
    }

    .button[tiny] {
        padding: 0.25em 0.5em;
    }

    .button[create] {
        background-color: #13bb5e;
    }
</style>
