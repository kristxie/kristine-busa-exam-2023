<template>
    <div id="songs-view" @scroll="scrolling">
        <div class="wrapper-header">
            <h1>SONGS</h1>
            <div class="wrapper-search">
            <input id="input-search" placeholder="Search by title..." v-model="searchText" />
            </div>
            <div class="wrapper-settings">
            <button id="btn-show-favorites" @click="toggleShowingFavorites" :class="{ active: show_favorites }">Show Favorites</button>
            </div>
        </div>
        <div class="wrapper-songs">
            <table cellspacing="0" cellpadding="0">
            <tr ref="header">
                <th id="th-id">#</th> 
                <th id="th-title" @click="sortBy('title')" :class="{ active: sortColumn === 'title' }">
                Title
                <IconCaretUp :class="{ 'flip-vertical': sortColumn === 'title' && sortDirections.title === 'desc' }" v-if="sortColumn === 'title'" />
                </th>
                <th id="th-artist" @click="sortBy('artist')" :class="{ active: sortColumn === 'artist' }">
                Artist
                <IconCaretUp :class="{ 'flip-vertical': sortColumn === 'artist' && sortDirections.artist === 'desc' }" v-if="sortColumn === 'artist'" />
                </th>
                <th id="th-album" @click="sortBy('album')" :class="{ active: sortColumn === 'album' }">
                Album
                <IconCaretUp :class="{ 'flip-vertical': sortColumn === 'album' && sortDirections.album === 'desc' }" v-if="sortColumn === 'album'" />
                </th>
                <th id="th-duration" @click="sortBy('duration')" :class="{ active: sortColumn === 'duration' }">
                Duration
                <IconCaretUp :class="{ 'flip-vertical': sortColumn === 'duration' && sortDirections.duration === 'desc' }" v-if="sortColumn === 'duration'" />
                </th>
            </tr> 
            <tr class="song" v-for="(song, index) in filteredPlusSorted" :key="song.id" @dblclick="selectSong(song)" :class="{ active: currentlyPlaying(song) }">
                <td id="td-index">
                <span v-if="currentlyPlaying(song)">
                    <IconPlay :class="{ active: currentlyPlaying(song) }"/>
                </span> 
                <span id="txt-index" v-if="!currentlyPlaying(song)">{{ index + 1 }}</span>
                </td>
                <td id="td-title" :class="{ active: currentlyPlaying(song) }">
                <img :src="song.album.images[1].url" />
                {{ song.name }}
                </td>
                <td id="td-artist" :class="{ active: currentlyPlaying(song) }">{{ getAllArtists(song.artists) }}</td>
                <td id="td-album">{{ song.album.name || '' }}</td>
                <td id="td-duration">
                {{ getTime(song.duration_ms) }}
                <IconHeart :class="{ active: songIsFavorite(song) }" @click="toggleIfFavorite(song)" />
                </td>
            </tr>
            </table>
        </div>
    </div>
 </template>
  
<script> 
    import songsData from '../data/songs.js';
    import IconCaretUp from '../components/icons/IconCaretUp.vue';
    import IconPlay from '../components/icons/IconPlay.vue';
    import IconHeart from '../components/icons/iconHeart.vue';
    import { useAuthStore } from '../stores/auth';
    import { usePlayerStore } from '@/stores/player';
    
    export default {
        components: {
        IconCaretUp,
        IconPlay,
        IconHeart,
        },
        data() {
        return {
            searchText: '',
            sortColumn: '',
            SongsData: songsData,
            activeHeartStatus: {},
            show_favorites: false,
            sortDirections: {
            title: 'asc',
            artist: 'asc', 
            album: 'asc',
            duration: 'asc', 
            },
        };
        },
    
        computed: {
        filteredPlusSorted () {
            let filteredSongs = this.filterSongs(this.SongsData, this.searchText);
    
            if (this.show_favorites) {
            filteredSongs = filteredSongs.filter((song) => this.songIsFavorite(song));
            }
            const sortedSongs = this.sortSongs(filteredSongs, this.sortColumn, this.sortDirections[this.sortColumn]);
    
            return sortedSongs;
        },
    
        currentlyPlaying () {
            const sng = usePlayerStore();
            return (song) => song.id === sng.getNowPlayingSongId;
        },

        songIsFavorite () {
            const auth = useAuthStore();
            return (song) => {
            const songIdString = String(song.id);
            return auth.getFavoriteSongs.includes(songIdString);
            };
        },

        },
    
        methods: {
        scrolling (event) {
            this.$refs.header.classList.value = event.target.scrollTop > 100 ? 'scrolled' : '';
        },
    
        toggleShowingFavorites () {
            this.show_favorites = !this.show_favorites;
        },
    
        filterSongs (songs, searchText) {
            return songs.filter((song) => {
            const songTitle = song.name.toLowerCase();
            const search = searchText.toLowerCase();
            return songTitle.startsWith(search);
            });
        },
    
        sortSongs (songs, column, direction) {
            let sortedSongs = [...songs];
    
            if (column === 'title') {
            sortedSongs.sort((a, b) => {
                return direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            });
            } else if (column === 'artist') {
            sortedSongs.sort((a, b) => {
                return direction === 'asc' ? a.artists[0].name.localeCompare(b.artists[0].name) : b.artists[0].name.localeCompare(a.artists[0].name);
            });
            } else if (column === 'album') {
            sortedSongs.sort((a, b) => {
                return direction === 'asc' ? a.album.name.localeCompare(b.album.name) : b.album.name.localeCompare(a.album.name);
            });
            } else if (column === 'duration') {
            sortedSongs.sort((a, b) => {
                return direction === 'asc' ? a.duration_ms - b.duration_ms : b.duration_ms - a.duration_ms;
            });
            }
    
            return sortedSongs;
        },
    
        sortBy (column) {
            if (this.sortColumn === column) {
            this.sortDirections[column] = this.sortDirections[column] === 'asc' ? 'desc' : 'asc';
            } else {
            this.sortColumn = column; 
            }
        },
        // i couldnt really get sorting to work as intended
        isHeartActive (song) {
            const songIdString = String(song.id);
            const favoriteSongs = useAuthStore.getFavoriteSongs || [];
            return favoriteSongs.includes(songIdString);
        },
    
        toggleIfFavorite (song) {
            const songIdString = String(song.id);
            const auth = useAuthStore();
            auth.toggleFavorite(songIdString);
            this.activeHeartStatus[song.id] = !this.activeHeartStatus[song.id];
        },
    
        getTime (duration_ms) {
            const totalSeconds = Math.floor(duration_ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
            return `${minutes}:${formattedSeconds}`;
        },
        
        getAllArtists (artists) {
            return artists.map((artist) => artist.name).join(', ');
        },

        selectSong (song) {
            const player = usePlayerStore();
            this.click++;
            if (this.click === 1) {
            this.timer = setTimeout(() => {
                this.click = 0;
            }, 500);
            } else {
            clearTimeout(this.timer);
            player.setNowPlaying(song);
            this.click = 0;
            }
        },
        },
    };
</script>