<template>
    <div ref="graph" class="graph" :style="style">
        <div :style="offsetStyle">
            <Node v-for="node in $store.state.world.nodes" :key="node.id" :node="node" :positioned="true" />
            <div v-if="selecting" class="selection" :style="selectionStyle" />
        </div>
    </div>
</template>

<script>
    import Node from '~/components/EditWorld/Node/Node';

    export default {
        components: { Node },
        data() {
            return {
                selecting: false,
                selection: { x: 0, y: 0, width: 0, height: 0 },
                offsetting: false,
                offset: { x: 0, y: 0 },
            };
        },
        computed: {
            style() {
                return {
                    'background-position': `${this.offset.x}px ${this.offset.y}px`,
                };
            },
            offsetStyle() {
                return {
                    left: `${this.offset.x}px`,
                    top: `${this.offset.y}px`,
                    position: 'relative',
                };
            },
            selectionStyle() {
                const boundingBox = this.selectionBoundingBox;

                return {
                    left: `${boundingBox.x}px`,
                    top: `${boundingBox.y}px`,
                    width: `${boundingBox.width}px`,
                    height: `${boundingBox.height}px`,
                };
            },
            selectionBoundingBox() {
                let { x, y } = this.selection;
                const { width, height } = this.selection;

                x -= this.offset.x;
                y -= this.offset.y;

                if (width >= 0 && height >= 0) {
                    return { x: x, y: y, width: width, height: height };
                }

                if (width >= 0 && height < 0) {
                    return { x: x, y: y + height, width: width, height: -height };
                }

                if (width < 0 && height < 0) {
                    return { x: x + width, y: y + height, width: -width, height: -height };
                }

                if (width < 0 && height >= 0) {
                    return { x: x + width, y: y, width: -width, height: height };
                }

                return null;
            },
            nodes() {
                return this.$store.state.world.nodes;
            },
        },
        created() {
        },
        mounted() {
            window.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('keydown', this.deselectOnKey);
        },
        beforeDestroy() {
            window.removeEventListener('mousedown', this.onMouseDown);
        },
        methods: {
            onMouseDown(event) {
                event.preventDefault();

                if (event.shiftKey) {
                    this.startSelect(event);
                } else {
                    this.startOffset(event);
                }

                return false;
            },
            startSelect(event) {
                this.clearSelection();
                this.selecting = true;
                const graphOffset = this.$refs.graph.getBoundingClientRect();
                this.selection.x = event.clientX - graphOffset.x;
                this.selection.y = event.clientY - graphOffset.y;
                this.selection.width = 0;
                this.selection.height = 0;
                window.addEventListener('mouseup', this.endSelect);
                window.addEventListener('mousemove', this.select);
            },
            endSelect() {
                this.selecting = false;
                window.removeEventListener('mousemove', this.select);
                window.removeEventListener('mouseup', this.endSelect);
            },
            clearSelection() {
                this.$store.commit('world/clearSelection');
            },
            select(event) {
                this.selection.width += event.movementX;
                this.selection.height += event.movementY;
                const boundingBox = this.selectionBoundingBox;
                const selected = this.nodes.filter(node => {
                    return this.overlaps({
                        x: node.position.x,
                        y: node.position.y,
                        width: node.size.width,
                        height: node.size.height,
                    }, boundingBox);
                });

                this.$store.commit('world/selectNodes', selected);
            },
            deselectOnKey(event) {
                if ((event.key === 'd' || event.key === 'D') && event.ctrlKey) {
                    return this.clearSelection();
                }

                return true;
            },
            overlaps(a, r) {
                return a.x < r.x + r.width && a.x + a.width > r.x && a.y < r.y + r.height && a.y + a.height > r.y;
            },
            startOffset() {
                this.offsetting = true;
                window.addEventListener('mouseup', this.endOffset);
                window.addEventListener('mousemove', this.updateOffset);
            },
            endOffset() {
                this.offsetting = false;
                window.removeEventListener('mouseup', this.endOffset);
                window.removeEventListener('mousemove', this.updateOffset);
            },
            updateOffset(event) {
                this.offset.x += event.movementX;
                this.offset.y += event.movementY;
            },
        },
    };
</script>

<style scoped>
    .graph {
        position: relative;
        user-select: none;

        background: url('~assets/Solid256grid1_32_translucent.png');
        width: 100%;
        height: 100%;
    }

    .selection {
        position: absolute;
        background: rgba(0, 0, 255, 0.2);
    }
</style>
