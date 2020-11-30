<template>
    <div class="paper">
        <slot></slot>
    </div>
</template>
<style lang="scss" scoped>
    .paper {
        background: #fff;
        overflow: hidden;
        box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.05);
    }

    .paper[dimmed] {
        background: #f5f6fb;
    }

    .paper[padded] {
        padding: 1em;
    }

    .paper[padded-15] {
        padding: 1.5em;
    }

    .paper[padded-2] {
        padding: 2em;
    }
</style>