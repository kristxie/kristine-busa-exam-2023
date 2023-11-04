<script>
    import { useAuthStore } from './stores/auth.js';
    import NavigationComponent from './components/NavigationComponent.vue';

    export default {
        components: {
            NavigationComponent
        },
        computed: {
            isAuthenticated () {
                const store = useAuthStore();
                return store.authenticated;
            }
        }
    }
</script>

<template>
    <!--  HEADER  -->
    <Header v-if="isAuthenticated"></Header>
    <!--  HEADER END  -->

    <!--  BODY  -->
    <div id="section-body">
        <NavigationComponent v-if="isAuthenticated"/>
        <router-view class="section-router"></router-view>
    </div>
    <!--  BODY END  -->

    <!--  PLAYER  -->
    <div id="section-player" v-if="isAuthenticated">
        <AudioPlayer></AudioPlayer>
    </div>
    <!--  PLAYER END  -->
</template>
