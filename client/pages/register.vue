<template>
    <FormWrapper title="Register a new account">
        <AuthForm button-label="Register a new account" @submit="registerUserHandler" />
    </FormWrapper>
</template>

<script>
    import FormWrapper from '~/components/AuthForm/FormWrapper.vue';
    import AuthForm from '~/components/AuthForm/AuthForm.vue';

    export default {
        components: { FormWrapper, AuthForm },
        layout: 'default',
        methods: {
            async registerUserHandler(user) {
                let response = null;

                try {
                    response = await this.$axios.post('/auth/register', user);
                } catch (e) {
                    if (e.response.data && e.response.data.validation) {
                        alert(e.response.data.validation.body.message);
                    } else if (e.response.data.message) {
                        alert(e.response.data.message);
                    } else if (typeof e.response.data.error === 'string') {
                        alert(e.response.data.error);
                    } else {
                        alert(e.response.data);
                    }

                    return;
                }

                if (response.data.success) {
                    this.$auth.setUserToken(response.data.data.token);
                }
            },
        },
    };
</script>
