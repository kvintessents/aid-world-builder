<template>
    <Paper class="container">
        <h1 class="title" v-if="title">{{ title }}</h1>

        <div class="form-wrapper">
            <slot></slot>
        </div>
    </Paper>
</template>

<script>
import Paper from '~/components/core/atoms/Paper';

export default {
    components: { Paper },
    props: {
        title: {
            type: String,
            default: null,
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        padding: 2em 0;
    }

    .title {
        text-align: center;
    }

    .form-wrapper {
        display: grid;
        justify-content: center;
        align-content: center;
        grid-template-columns: 25em;
    }
</style>