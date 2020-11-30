<template>
    <FormWrapper @submit="submitHandler" submitLabel="Määra">
        <h2>Määra kasutajanimi</h2>
        <Paragraph>
            Postituse tegemiseks pead valima endale kasutajanime.
            Kasutajanimi võib sisaldada suuri ja väikeseid tähti, täpitähti, numbreid, kriipsu ning alamkriipsu.
        </Paragraph>
        <FormRow>
            <Input v-model="displayName" placeholder="ntx. partyboi69" />
        </FormRow>
    </FormWrapper>
</template>

<script>
import FormWrapper from '~/components/core/molecules/FormWrapper';
import FormRow from '~/components/core/atoms/FormRow';
import Paragraph from '~/components/core/atoms/Paragraph';
import Input from '~/components/core/atoms/Input';

export default {
    components: { FormWrapper, Paragraph, Input, FormRow },
    data() {
        return {
            loading: false,
            displayName: '',
        };
    },
    methods: {
        async submitHandler(e) {
            if (this.displayName.length < 3) {
                alert('Kasutajanimi peab olema vähemalt 3 tähemärki pikk.');
                return;
            }

            this.loading = true; 
            try {
                await this.$axios.put(`/users/${this.$auth.user.id}`, {
                    display_name: this.displayName
                });

                this.$auth.setUser({
                    ...this.$auth.user,
                    display_name: this.displayName
                });
            } catch (e) {
                console.error(e.response);
            }
            this.loading = false;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>