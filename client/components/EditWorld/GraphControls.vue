<template>
    <nav class="graph-controls">
        <ul class="list">
            <li class="list-item" v-if="isOwner">
                <Button small create @click="$store.dispatch('world/addNode')">Add Entry</Button>
            </li>
            <li class="list-item">
                <Button link small download="AID-WORLD.json" :href="zaltysContents" title="Download in Zaltys format (recommended)">Download Zaltys</Button>
            </li>
            <li class="list-item">
                <Button link small download="AID-WORLD.json" :href="jsonContents" title="Download in JSON format (not recommended for now)">Download JSON</Button>
            </li>
            <li class="list-item">
                <Checkbox label="Node view" @click="setNodeView" :checked="$store.state.world.isNodeView" />
            </li>
            <li class="list-item" v-if="isOwner">
                <Checkbox label="Publicly viewable" @click="setPublic" :checked="$store.state.world.isPublic" title="If checked, any non-registered user will be able to view this board, but not be able to edit it." />
            </li>
            <li class="list-item" v-if="!isOwner">
                <span class="read-only">Read only mode</span>
            </li>
        </ul>
    </nav>
</template>

<script>
import Button from '~/components/core/atoms/Button';
import Checkbox from '~/components/core/atoms/Checkbox';
import jsonFormatter from '~/utils/formatters/jsonFormatter';
import ZaltysFormatter from '~/utils/formatters/ZaltysFormatter';

export default {
    components: { Button, Checkbox },
    data() {
        return {
            isMounted: false,
        }
    },
    mounted() {
        this.isMounted = true;
    },
    computed: {
        isOwner() {
            return this.$store.state.world.isOwner
        },
        jsonContents() {
            if (this.isMounted) {
                return this.makeDownloadableString(this.$store.state.world.nodes.map(jsonFormatter));
            }
            return '';
        },
        zaltysContents() {
            if (this.isMounted) {
                return this.makeDownloadableString(this.$store.state.world.nodes.map(ZaltysFormatter));
            }

            return '';
        },
    },
    methods: {
        setNodeView(event) {
            this.$store.dispatch('world/setNodeView', event.target.checked);
        },
        setPublic(event) {
            this.$store.dispatch('world/setPublic', event.target.checked);
        },
        makeDownloadableString(object) {
            return URL.createObjectURL(new Blob([JSON.stringify(object, null, 2)]))
        }
    }
}
</script>
<style lang="scss" scoped>
    .list {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .list-item {
        display: inline-block;
    }

    .read-only {
        background: #9eda42;
        color: #fff;
        margin-left: 1em;
        padding: 0.2em 0.5em;
    }
</style>