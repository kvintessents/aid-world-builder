<template>
    <nav class="header">
        <div class="logo-container">
            <nuxt-link to="/" class="logo-link">
                <h1 v-if="isFrontpage" class="logo">Fiid</h1>
                <div v-else class="logo">Fiid</div>
            </nuxt-link>
        </div>
        

        <div class="search">
            <!-- <Input no-margin class="search-input" type="search" placeholder="Otsing" /> -->
        </div>

        <div class="user-controls">
            <UserControls />
        </div>
    </nav>
</template>

<script>
    import UserControls from '~/components/NavBar/UserControls';
    import Input from '~/components/core/atoms/Input';

    export default {
        components: { UserControls, Input },
        props: {
            isFrontpage: {
                type: Boolean,
                default: false,
            }
        }
    }
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

        height: 20px;
        position: relative;
        top: -3px;
    }

    .search {
        flex-grow: 1;
    }
</style>