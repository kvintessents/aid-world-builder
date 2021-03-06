<template>
    <div>
        <ul class="list">
            <li
                v-for="(tab, index) in tabs"
                :key="tab.data.attrs.id"
                class="list-item"
            >
                <button
                    class="tab"
                    :aria-selected="index === activeIndex ? 'true' : null"
                    :aria-controls="tab.data.attrs.id"
                    :class="{ active: index === activeIndex }"
                    @click="tabHandler(index)"
                >
                    {{ tab.componentOptions.propsData.name }}
                </button>
            </li>
        </ul>
        <Paper padded-2>
            <slot />
        </Paper>
    </div>
</template>
<script>
    import Paper from '~/components/core/atoms/Paper';

    export default {
        components: { Paper },
        props: {},
        data() {
            return {
                tabs: [],
                activeIndex: 0,
            };
        },
        created() {
            this.tabs = this.$slots.default.filter(
                vnode => vnode.tag && vnode.componentOptions && vnode.componentOptions.propsData.name,
            );
            this.updateActive();
        },
        methods: {
            tabHandler(selectedIndex) {
                this.activeIndex = selectedIndex;
                this.updateActive();
            },

            updateActive() {
                for (let index = 0; index < this.tabs.length; index++) {
                    const tab = this.tabs[index];

                    if (tab.componentInstance) {
                        if (index === this.activeIndex) {
                            tab.componentInstance.isActive = true;
                        } else {
                            tab.componentInstance.isActive = false;
                        }
                    }
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .list {
        margin: 0;
        margin-left: 1px;
        padding: 0;
        display: flex;

        position: relative;
        bottom: -1px;
    }

    .list-item {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .tab {
        background: rgba(255, 255, 255, 0.5);
        border: 0;
        padding: 1em 2em;
        outline: none;
        cursor: pointer;
    }

    .tab:hover {
        background: rgba(255, 255, 255, 0.6);
    }

    .tab.active {
        background: #fff;
        color: #0096ce;
    }
</style>
