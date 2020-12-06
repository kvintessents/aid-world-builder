<template>
    <label>
        <input
            type="checkbox"
            class="checkbox"

            v-on="$listeners"
            v-bind="$attrs"
        />
        <span class="label">{{ label }}</span>
    </label>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true,
        },
    },
    inheritAttrs: false,
}
</script>

<style lang="scss" scoped>
    .checkbox {
        position: relative;
    }
</style>