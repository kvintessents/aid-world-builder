<template>
    <form @submit.prevent="$emit('submit', user)">
        <div>
            <Input v-model="user.email" type="email" label="E-mail" />
        </div>
        <div>
            <Input v-model="user.password" type="password" label="Password" />
        </div>
        <div>
            <Button type="submit">
                {{ buttonLabel || 'Submit' }}
            </Button>
        </div>
    </form>
</template>

<script>
    import Input from '~/components/core/atoms/Input';
    import Button from '~/components/core/atoms/Button';

    export default {
        components: { Input, Button },

        props: {
            buttonLabel: {
                type: String,
                required: true,
            },
        },

        data() {
            return {
                user: {
                    email: '',
                    password: '',
                },
            };
        },
    };
</script>
