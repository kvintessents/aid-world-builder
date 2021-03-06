<template>
    <nav class="header">
        <div class="logo-container">
            <nuxt-link to="/" class="logo-link">
                <h1 v-if="isFrontpage" class="logo">
                    AID WB
                </h1>
                <div v-else class="logo">
                    {{ isEditPage ? 'AID WB' : 'AID WB' }}
                </div>
            </nuxt-link>
            <input v-if="isEditPage" class="logo world-input" :value="worldName" :size="worldName.length" @input="onWorldNameInput">
        </div>

        <div class="user-controls">
            <UserControls />
        </div>
    </nav>
</template>

<script>
    import UserControls from '~/components/NavBar/UserControls';

    export default {
        components: { UserControls },
        props: {
            isFrontpage: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            worldName() {
                return this.$store.state.world.name;
            },
            isEditPage() {
                return this.$route.name === 'world-id';
            },
        },
        methods: {
            onWorldNameInput(event) {
                this.$store.dispatch('world/nameChange', event.target.value);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .header {
        background: #fff;
        padding: 1em;
        box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.2);

        display: flex;
        flex-wrap: nowrap;
    };

    .logo-link {
        text-decoration: none;
    }

    .logo {
        color: #444;
        font-size: 2em;
        font-family: 'Palatino';
        font-variant: small-caps;
        font-weight: 400;

        position: relative;
        top: -3px;
        display: inline-block;
    }

    .world-input {
        border: none;
        font-size: 1.5em;
        margin-left: 1em;
    }

    .search {
        flex-grow: 1;
    }
</style>
