<template>
    <div class="previewContents">
        <pre>{{ output }}</pre>
    </div>
</template>
<script>
import jsonFormatter from '~/utils/formatters/jsonFormatter';

export default {
    props: {
        node: {
            type: Object,
        }
    },
    computed: {
        output() {
            return jsonFormatter(this.node, { isPreview: true });
        }
    }
}
</script>
<style lang="scss" scoped>
    .previewContents {
        padding: 1em;
        overflow: auto;
    }
</style>