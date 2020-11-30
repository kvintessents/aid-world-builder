<template>
    <form @submit.prevent="submitHandler">

        <slot></slot>

        <Button type="submit">{{ submitLabel }}</Button>
    </form>
</template>

<script>
import Button from '~/components/core/atoms/Button';
import Select from '~/components/core/atoms/Select';
import FormRow from '~/components/core/atoms/FormRow';

export default {
    components: { Button, FormRow, Select },
    props: {
        loading: { type: Boolean, default: false },
        submitLabel: { type: String, default: '+ Lisa' }
    },
    methods: {
        submitHandler(event) {
            this.$emit('submit', event);
        }
    }
}
</script>
