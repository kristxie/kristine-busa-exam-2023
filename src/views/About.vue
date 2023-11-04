<template>
    <div id="about-view">
        <div class="wrapper-header">
            <h1>ABOUT ME</h1>
            <div class="settings">
            <button id="btn-edit" @click="toggleEditing" :class="{ active: editing }">{{ editing ? 'Cancel' : 'Edit Form' }}</button>
            <button id="btn-save" v-if="editing" @click="saveInformation">Save Form</button>
            </div>
        </div>
        <form>
        <div class="wrapper-input">
            <label>NAME</label>
            <input id="input-name" v-if="editing" v-model="name" />
            <p id="txt-name" v-if="!editing">{{ name }}</p>
        </div>
        <div class="wrapper-input">
            <label>SURNAME</label>
            <input id="input-surname" v-if="editing" v-model="surname" />
            <p id="txt-surname" v-if="!editing">{{ surname }}</p>
        </div>
        <div class="wrapper-input">
            <label>STUDENT CODE</label>
            <input id="input-code" v-if="editing" v-model="code" />
            <p id="txt-code" v-if="!editing">{{ code }}</p>
        </div>
        <div class="wrapper-songs">
            <label>FAVORITE SONGS</label>
            <ul v-if="!noFavoriteSongs">
            <li v-for="song in sortedFavoriteSongs" :key="song.id">
                <img id="img-album" :src="song.album.images[1].url" />
                <div class="song-info">
                <p id="txt-song" class="song-name">{{ song.name }}</p>
                <p id="txt-artist" class="song-artists">{{ getArtists(song.artists) }}</p>
                </div>
            </li>
            </ul>
            <div id="txt-empty" class="empty" v-if="filteredFavoriteSongs.length === 0">NO SONGS FOUND</div>
        </div>
        </form>
    </div>
</template>
  
<script>
    import { useAuthStore } from '../stores/auth.js';
    import songsData from '../data/songs.js';
    
    export default {
        data() {
        const state = useAuthStore();
        return {
            editing: false,
            name: state.user.name,
            surname: state.user.surname,
            code: state.user.code,
            songsData: songsData,
            favoriteList: state.getFavoriteSongs,
        };
        },
        computed: {
        noFavoriteSongs() {
            return this.favoriteList.length === 0;
        },
        filteredFavoriteSongs() {
            const favoriteIds = this.favoriteList.map((song) => song.id);
            const filterSongs = this.songsData.filter((song) => favoriteIds.includes(song.id));
            return filterSongs;
        },
        sortedFavoriteSongs() {
            return this.songsData.filter((song) => this.favoriteList.includes(String(song.id)));
        },
        },
        methods: {
        toggleEditing() { 
            this.editing = !this.editing;
        },
        saveInformation() {
            this.editing = false;
            const updated = useAuthStore();
            updated.user.name = this.name;
            updated.user.surname = this.surname;
            updated.user.code = this.code;
        },
        getArtists(artists) {
            return artists.map((artist) => artist.name).join(', ');
        },
        },
    };
</script>