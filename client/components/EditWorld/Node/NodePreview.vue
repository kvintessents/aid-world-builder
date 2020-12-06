<template>
    <div class="previewContents">
        <pre class="previewContentsInner">{{ output }}</pre>
    </div>
</template>
<script>
import jsonFormatter from '~/utils/formatters/jsonFormatter';
import ZaltysFormatter from '~/utils/formatters/ZaltysFormatter';

export default {
    props: {
        node: {
            type: Object,
        },
        type: {
            type: String,
            default: 'json',
        }
    },
    computed: {
        output() {
            if (this.type === 'json') {
                return jsonFormatter(this.node, { isPreview: true }).entry;
            }

            if (this.type === 'zaltys') {
                return ZaltysFormatter(this.node, { isPreview: true }).entry;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .previewContents {
        padding: 1em;
        overflow: auto;
    }

    .previewContentsInner {
        white-space: break-spaces;
        user-select: initial;
    }
</style>