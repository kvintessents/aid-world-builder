<template>
    <div class="graph" ref="graph">
        <Node v-for="node in $store.state.world.nodes" :key="node.id" :node="node" />
        <div v-if="selecting" class="selection" :style="selectionStyle"></div>
    </div>
</template>

<script>
import Node from '~/components/EditWorld/Node/Node';

export default {
    components: { Node },
    data() {
        return {
            selecting: false,
            selection: { x: 0, y: 0, width: 0, height: 0 }
        }
    },
    created() {
    },
    mounted() {
        window.addEventListener('mousedown', this.startSelect);
    },
    beforeDestroy() {
        window.removeEventListener('mousedown', this.startSelect);
    },
    computed: {
        selectionStyle() {
            const boundingBox = this.boundingBox;

            return {
                left: `${boundingBox.x}px`,
                top: `${boundingBox.y}px`,
                width: `${boundingBox.width}px`,
                height: `${boundingBox.height}px`,
            }
        },
        boundingBox() {
            const {x, y, width, height} = this.selection;

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
        },
        nodes() {
            return this.$store.state.world.nodes;
        }
    },
    methods: {
        startSelect(event) {
            // this.$store.dispatch('world/clearSelection');
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
        select(event) {
            this.selection.width += event.movementX;
            this.selection.height += event.movementY;
            const boundingBox = this.boundingBox;
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
        overlaps(a, r) {
            return a.x < r.x + r.width && a.x + a.width > r.x && a.y < r.y + r.height && a.y + a.height > r.y;
        }
    }
}
</script>

<style scoped>
    .graph {
        position: relative;
        user-select: none;
    }
    .selection {
        position: absolute;
        background: rgba(0, 0, 255, 0.2);
    }
</style>