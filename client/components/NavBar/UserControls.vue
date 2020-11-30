<template>
    <div class="user">
        <div>
            
        </div>
        <div v-if="$auth.loggedIn">
            <nuxt-link to="/worlds">Your Worlds</nuxt-link>

            {{ $auth.user.display_name || $auth.user.email }}
            <button @click="logout">Log out</button>
        </div>
        <div v-else>
            <nuxt-link to="/login">Your Worlds</nuxt-link>

            <nuxt-link to="/login">Log in</nuxt-link>
            <nuxt-link to="/register">Register</nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        async logout() {
            await this.$auth.logout();
        }
    }
}
</script>