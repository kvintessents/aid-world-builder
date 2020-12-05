<template>
    <FormWrapper title="Log in">
        <AuthForm @submit="loginUserHandler" buttonLabel="Log in" />
    </FormWrapper>
</template>

<script>
    import FormWrapper from '~/components/AuthForm/FormWrapper.vue';
    import AuthForm from '~/components/AuthForm/AuthForm.vue';
    import Paper from '~/components/core/atoms/Paper.vue';

    export default {
        layout: 'default',
        components: { FormWrapper, AuthForm, Paper },
        methods: {
            async loginUserHandler(user) {
                try {
                    const response = await this.$auth.loginWith('local', {
                        data: user
                    });
                } catch (e) {
                    if (e.response.data && e.response.data.validation) {
                        alert(e.response.data.validation.body.message);
                    }
                    
                    else if (e.response.data.message) {
                        alert(e.response.data.message);
                    }

                    else if (typeof e.response.data.error === 'string') {
                        alert(e.response.data.error);
                    }

                    else {
                        alert(e.response.data);
                    }

                    console.log(e);
                }
            }
        }
    }
</script>