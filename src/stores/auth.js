import { defineStore } from 'pinia'
import router from "../router"

export const useAuthStore = defineStore ('authentication', {
    state: () => ({
        user: {
            name: 'Kristīne', //'NAME',
            surname: 'Buša', //'SURNAME',
            code: 'IT21037', //'CODE1234',
            favorite_songs: [],
        },
        authenticated: false,
    }),

    getters: {
        getFavoriteSongs () {
            return this.user.favorite_songs; 
        },
        isAuthenticated () {
            return this.authenticated || localStorage.getItem('is_authenticated') === 'true';
        },
    },

    actions: {
        setUserData (name, surname, code) {
            this.user.name = name;
            this.user.surname = surname;
            this.user.code = code;
        },
        authenticate (email, password) {
            if (email === 'kristine.busa@va.lv' && password === '123456') {

                //localStorage.setItem('is_authenticated', true);
                localStorage.authenticated = true;
                this.authenticated = true;
                router.push('/');
            }
        },
        logout () {
            localStorage.clear();
            this.authenticated = false;
            router.push('/login');
        },
        toggleFavorite (songID) {
            const index = this.user.favorite_songs.indexOf(songID);
            
            if (index === -1) {
                this.user.favorite_songs.push(songID);
            } else {
                this.user.favorite_songs.splice(index, 1);
            }
            localStorage.favorite_songs = this.user.favorite_songs;
        },
    },

});