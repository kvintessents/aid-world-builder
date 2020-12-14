<template>
    <div class="attributes-wrapper" ref="wrapper">
        <table class="attributes">
            <tbody>
                <NodeAttribute
                    v-for="(attribute, index) in node.properties"
                    :key="`${id}#${index}`"
                    :node="node"
                    :attribute="attribute"
                    :index="index"
                    :data-order="index"
                    ref="nodeRefs"
                    @startReorder="reorderStart"
                    :sizeCacheBreaker="sizeCacheBreaker"
                />
            </tbody>
        </table>

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
import NodeAttribute from '~/components/EditWorld/Node/NodeAttribute';

export default {
    components: { NodeAttribute },
    props: {
        node: {
            type: Object,
            required: true,
        },
        sizeCacheBreaker: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            reorderBox: null,
            reorderingAttribute: null,
            dropoffPoints: [],
            id: `node-${Math.floor(Math.random() * 1000000)}`
        }
    },
    computed: {
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
    methods: {
        getDropoffPointStyle(point) {
            const thiccness = 2;

            return {
                height: `${thiccness}px`,
                left: `0`,
                right: `0`,
                top: `${point.y - (thiccness / 2)}px`,
            }
        },

        reorderStart({ event, component }) {
            const listBox = this.$refs.wrapper.getBoundingClientRect();
            const startPosition = component.$el.getBoundingClientRect();

            this.reorderingAttribute = component;

            this.reorderBox = Vue.observable({
                x: startPosition.x - listBox.x,
                y: startPosition.y - listBox.y,
                width: startPosition.width,
                height: startPosition.height,
            });

            this.updateDropoffPoints();
            window.addEventListener('mousemove', this.reorderUpdate);
            window.addEventListener('mouseup', this.reorderStop);
        },

        reorderStop(event) {
            this.reorderNode();

            this.reorderBox = null;
            this.dropoffPoints = [];
            this.reorderingAttribute = null;
            window.removeEventListener('mousemove', this.reorderUpdate);
            window.removeEventListener('mouseup', this.reorderStop);
        },

        reorderUpdate(event) {
            this.reorderBox.x += event.movementX;
            this.reorderBox.y += event.movementY;

            this.updateActiveDropoffPoint();
        },

        updateDropoffPoints() {
            const points = [];
            const listBox = this.$refs.wrapper.getBoundingClientRect();

            let lastRightPoint = null;

            for (const component of this.$refs.nodeRefs) {
                const bBox = component.$el.getBoundingClientRect();
                const order = parseInt(component.$el.dataset.order, 10);

                const leftPoint = {
                    x: bBox.x - listBox.x + (bBox.width / 2),
                    y: bBox.y - listBox.y,
                    key: `${Math.random()}`,
                    index: order,
                };

                const rightPoint = {
                    x: bBox.x - listBox.x + (bBox.width / 2),
                    y: bBox.y - listBox.y + bBox.height,
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

        inRadiusOf(A, B, r) {
            return Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2) <= Math.pow(r, 2);
        },

        reorderNode() {
            const closest = this.dropoffPoints.find(n => n.closest);
            
            this.$store.dispatch('world/reorderNodeAttribute', {
                node: this.node,
                currentIndex: parseInt(this.reorderingAttribute.$el.dataset.order, 10),
                targetIndex: closest.index,
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .attributes-wrapper {
        position: relative;
    }

    .attributes {
        padding: 0;
        margin: 0;
        border-spacing: 0;
        width: 100%;
    }

    .dropoffPoint {
        position: absolute;
        // background: rgba(0, 0, 255, 0.5);
    }

    .dropoffPoint.closest {
        background: rgba(0, 0, 255, 0.5);
    }

    .reorder-box {
        position: absolute;
        background: rgba(0, 0, 255, 0.1);
        cursor: grabbing;
    }
</style>