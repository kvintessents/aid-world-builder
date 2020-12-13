<template>
    <div class="list" ref="list">
        <Node
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            :positioned="false"
            ref="nodeRefs"
            :data-order="node.order"
            @reorderStart="reorderStart"
        />

        <div v-if="reorderBox" class="reorder-box" :style="reorderBoxStyle"></div>

        <div
            v-for="point in dropoffPoints"
            :key="point.key"
            class="dropoffPoint"
            :class="{ closest: point.closest }"
            :style="getDropoffPointStyle(point)"
        ></div>
    </div>
</template>

<script>
import Vue from 'vue';
import Node from '~/components/EditWorld/Node/Node';

export default {
    components: { Node },
    data() {
        return {
            dropoffPoints: [],
            reorderBox: null,
            reorderingNode: null,
            nodeRefs: [],
        }
    },
    computed: {
        nodes() {
            return this.$store.state.world.nodes;
        },

        reorderBoxStyle() {
            if (!this.reorderBox) {
                return null;
            }

            return {
                left: `${this.reorderBox.x}px`,
                top: `${this.reorderBox.y}px`,
                width: `${this.reorderBox.width}px`,
                height: `${this.reorderBox.height}px`,
            };
        }
    },
    mounted() {
        this.updateDropoffPoints();
        window.addEventListener('resize', this.updateDropoffPoints);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateDropoffPoints);
    },
    methods: {
        getDropoffPointStyle(point) {
            const size = 32;
            return {
                width: `${size}px`,
                height: `${size}px`,
                left: `${point.x - (size / 2)}px`,
                top: `${point.y- (size / 2)}px`,
            }
        },
        updateDropoffPoints() {
            const points = [];
            const listBox = this.$refs.list.getBoundingClientRect();
            let lastRightPoint = null;
            // Margin between the nodes in pixels
            const halfMargin = 7;

            for (const component of this.$refs.nodeRefs) {
                const bBox = component.$el.getBoundingClientRect();
                const order = parseInt(component.$el.dataset.order, 10);

                const leftPoint = {
                    x: bBox.x - listBox.x - halfMargin,
                    y: bBox.y - listBox.y + (bBox.height / 2),
                    key: `${Math.random()}`,
                    index: order,
                };

                const rightPoint = {
                    x: bBox.x - listBox.x + bBox.width + halfMargin,
                    y: bBox.y - listBox.y + (bBox.height / 2),
                    key: `${Math.random()}`,
                    index: order + 1,
                };

                if (!lastRightPoint || !this.inRadiusOf(lastRightPoint, leftPoint, 50)) {
                    points.push(Vue.observable(leftPoint));
                }

                points.push(Vue.observable(rightPoint));

                lastRightPoint = rightPoint;
            }

            this.dropoffPoints = points;
        },

        inRadiusOf(A, B, r) {
            return Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2) <= Math.pow(r, 2);
        },

        reorderStart({ node, event, component }) {
            const listBox = this.$refs.list.getBoundingClientRect();
            const startPosition = component.$el.getBoundingClientRect();

            this.reorderBox = Vue.observable({
                x: startPosition.x - listBox.x,
                y: startPosition.y - listBox.y,
                width: startPosition.width,
                height: startPosition.height,
            });

            this.reorderingNode = node;

            this.updateDropoffPoints();
            window.addEventListener('mousemove', this.reorderUpdate);
            window.addEventListener('mouseup', this.reorderStop);
        },

        reorderStop(event) {
            this.reorderNode();

            this.reorderBox = null;
            this.dropoffPoints = [];
            this.reorderingNode = null;
            window.removeEventListener('mousemove', this.reorderUpdate);
            window.removeEventListener('mouseup', this.reorderStop);
        },

        reorderUpdate(event) {
            this.reorderBox.x += event.movementX;
            this.reorderBox.y += event.movementY;

            this.updateActiveDropoffPoint();
        },

        updateActiveDropoffPoint() {
            const center = {
                x: this.reorderBox.width / 2 + this.reorderBox.x,
                y: this.reorderBox.height / 2 + this.reorderBox.y,
            };

            let closestPoint = null;

            for (const point of this.dropoffPoints) {
                point.closest = false;

                const distanceSquared = (
                    Math.pow(point.x - center.x, 2) +
                    Math.pow(point.y - center.y, 2)
                );

                if (!closestPoint || distanceSquared < closestPoint.distanceSquared) {
                    closestPoint = point;
                    closestPoint.distanceSquared = distanceSquared;
                }
            }

            closestPoint.closest = true;
        },

        reorderNode() {
            const closest = this.dropoffPoints.find(n => n.closest);

            this.$store.dispatch('world/reorderNode', {
                node: this.reorderingNode,
                targetIndex: closest.index,
            });
        }
    }
}
</script>

<style scoped lang="scss">
    .list {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        user-select: none;
    }

    .dropoffPoint {
        position: absolute;
        // background: rgba(0, 0, 255, 0.5);
        border-radius: 100%;
    }

    .dropoffPoint.closest {
        background: rgba(0, 0, 255, 0.5);
    }

    .reorder-box {
        position: absolute;
        background: rgba(0, 0, 255, 0.2);
        cursor: grabbing;
    }
</style>