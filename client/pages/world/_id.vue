<template>
    <div>
        <EditWorld v-if="$store.state.world" />
    </div>
</template>

<script>
    import EditWorld from '~/components/EditWorld/EditWorld';

    export default {
        layout: 'default',
        components: { EditWorld },
        async asyncData({ store, route, error }) {
            await store.dispatch('world/fetchWorld', route.params.id);
            return {};
        },
    }
</script>