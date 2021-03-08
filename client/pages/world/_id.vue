<template>
    <div>
        <EditWorld v-if="$store.state.world" />
    </div>
</template>

<script>
    import EditWorld from '~/components/EditWorld/EditWorld';

    export default {
        components: { EditWorld },
        layout: 'default',
        async asyncData({ store, route }) {
            await store.dispatch('world/fetchWorld', route.params.id);
            return {};
        },
    };
</script>
