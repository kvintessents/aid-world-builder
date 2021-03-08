<template>
    <label :title="title">
        <input
            type="checkbox"
            class="checkbox"

            v-bind="$attrs"
            v-on="$listeners"
        >
        <span class="label">{{ label }}</span>
    </label>
</template>

<script>
    export default {
        inheritAttrs: false,
        props: {
            label: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                default: null,
            },
        },
    };
</script>

<style lang="scss" scoped>
    .checkbox {
        position: relative;
    }
</style>
