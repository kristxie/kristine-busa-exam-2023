<template>
    <div id="login-view">
      <form class="login-form">
        <div class="wrapper-logo">
          <img src="@/assets/logo.svg" />
          <div>KRAKEN.FM</div>
        </div>
        <input id="input-email" placeholder="E-mail" v-model="user_form.email"/>
        <input id="input-password" placeholder="Password" type="password" v-model="user_form.password"/>
        <button id="btn-submit" @click="clickLogin" :disabled="buttonOff">LOGIN</button>
      </form>
    </div>
</template>
  
  <script>
  import { useAuthStore } from '../stores/auth';
    export default {
        data() {
        return {
            user_form: {
                email: '',
                password: ''
            },
            useAuthStore,
        };
        },

    computed: {
        buttonOff() {
            return this.user_form.email.trim().length === 0 || this.user_form.password.trim().length <= 5;
        },
        clickLogin(){
            const store = useAuthStore();
            return store.authenticate(this.user_form.email, this.user_form.password);
        },
    },
    };
  </script>