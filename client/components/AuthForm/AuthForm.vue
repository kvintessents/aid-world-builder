<template>
    <form @submit.prevent="$emit('submit', user)">
        <div>
            <Input type="email" v-model="user.email" label="E-mail" />
        </div>
        <div>
            <Input type="password" v-model="user.password" label="Password" />
        </div>
        <div>
            <Button type="submit">{{ buttonLabel || 'Submit' }}</Button> 
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
            }
        },

        data() {
            return {
                user: {
                    email: 'kvintessents@gmail.com',
                    password: 'asdasdasd',
                }
            }
        }
    }
</script>