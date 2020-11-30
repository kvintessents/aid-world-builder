<template>
    <div>
        <EditWorld />
    </div>
</template>

<script>
    import EditWorld from '~/components/EditWorld/EditWorld';

    export default {
        layout: 'default',
        components: { EditWorld },
        async asyncData({ store, route }) {
            await store.dispatch('world/fetchWorld', route.params.id);
            return {};
        },
        computed: {},
        methods: {}
    }
</script>