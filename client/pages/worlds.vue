<template>
    <div class="worlds">
        <Paper padded-2 class="create-world">
            <form @submit.prevent="onSubmit" :disabled="creating">
                <FormRow>
                    <Input label="New World Name" v-model="worldName" />
                    <Button type="submit">Create</Button>
                </FormRow>
            </form>
        </Paper>
        <Paper padded-2 class="world-list">
            <div v-for="world in worlds" :key="world.id">
                <nuxt-link :to="`world/${world.id}`">{{ world.name }}</nuxt-link>
            </div>
        </Paper>
    </div>
</template>

<script>
    import Paper from '~/components/core/atoms/Paper';
    import FormRow from '~/components/core/atoms/FormRow';
    import Input from '~/components/core/atoms/Input';
    import Button from '~/components/core/atoms/Button';

    async function fetchWorlds($axios, $auth) {
        let response;

        try {
            response = await $axios.get('/worlds/', {
                params: {
                    user_id: $auth.user.id
                }
            });
        } catch (e) { console.error(e); }

        return response.data.data;
    }

    export default {
        layout: 'default',
        components: { Input, Button, FormRow, Paper },
        data() {
            return {
                creating: false,
                worldName: '',
                worlds: [],
            };
        },
        computed: {},
        async asyncData({ $axios, $auth }) {
            const worlds = await fetchWorlds($axios, $auth);
            return { worlds };
        },
        methods: {
            async onSubmit() {
                this.creating = true;
                let response;

                try {
                    response = await this.$axios.post('/worlds/', {
                        name: this.worldName,
                        isPublic: false,
                    });

                    this.worlds = await fetchWorlds(this.$axios, this.$auth);
                } catch (e) { console.error(e); }

                this.creating = false;
            },
        }
    }
</script>
<style lang="scss" scoped>
    .worlds {
        max-width: 1000px;
        margin: 0 auto;
    }

    .world-list, .create-world {
        margin-top: 2em;
    }
</style>