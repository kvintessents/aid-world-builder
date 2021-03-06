<template>
    <select
        class="select"
        :class="{
            disabled: disabled
        }"
    >
        <slot />
    </select>
</template>

<script>
    export default {
        props: {
            disabled: {
                type: Boolean,
                required: false,
            },
        },
    };
</script>

<style lang="scss" scoped>
    .input {
        padding: calc(1em - 1px) 1.25em;
        border-radius: 0.25em;
        border: 1px solid #aaa;
        font-size: 1em;
        width: 100%;
        box-sizing: border-box;
    }
</style>
