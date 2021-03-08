<template>
    <form @submit.prevent="submitHandler">
        <slot />

        <Button type="submit">
            {{ submitLabel }}
        </Button>
    </form>
</template>

<script>
    import Button from '~/components/core/atoms/Button';

    export default {
        components: { Button },
        props: {
            loading: { type: Boolean, default: false },
            submitLabel: { type: String, default: '+ Lisa' },
        },
        methods: {
            submitHandler(event) {
                this.$emit('submit', event);
            },
        },
    };
</script>
