<template>
    <button
        class="button"
        :class="{
            loading: loading
        }"

        v-on="$listeners"
        v-bind="$attrs"
    ><slot></slot></button>
</template>

<script>
export default {
    props: {
        loading: {
            type: Boolean,
            required: false,
        },
    },
    inheritAttrs: false,
}
</script>

<style lang="scss" scoped>
    .button {
        background-color: #00a7e5;
        border: none;
        border-radius: 0.25em;
        padding: 1em 2em;
        color: #fff;
        font-size: 1em;
    }

    .button[disabled] {
        background-color: #ddd;
    }
</style>