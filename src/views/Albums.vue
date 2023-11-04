<template>
    <div id="album-view">
        <div class="wrapper-header">
            <h1>ALBUMS</h1>
            <div class="settings">
            <button id="btn-grid" :class="{ active: isGrid }" @click="toggleGrid(true)">
                <IconGrid />
            </button>
            <button id="btn-list" :class="{ active: !isGrid }" @click="toggleGrid(false)">
                <IconList />
            </button>
            </div>
        </div>
        <ul :class="{ grid: isGrid }" id="list-albums">
            <li
            class="album"
            v-for="album in albums"
            :key="album.id"
            @click="selectAlbum(album.id)"
            :class="{ active: album.id === getAlbumID }"
            >
            <img :src="album.images[1].url" />
            <div class="album-info">
                <h4>{{ album.name }}</h4>
                <p>{{ getArtistName(album.artists) }}</p>
                <div class="album-year">
                <p>{{ getReleaseDate(album.release_date) }}</p>
                <p>{{ getTracklist(album.tracks.length) }}</p>
                </div>
            </div>
            </li>
        </ul>
    </div>
</template>
  
<style scoped>
    ul.grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 20px;
    }
    
    li.album {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
    }
    
    li.album:hover {
        background-color: #f0f0f0;
        cursor: pointer;
    }
</style>
  
  
<script>
    import IconGrid from '../components/icons/IconGrid.vue';
    import IconList from '../components/icons/IconList.vue';
    import { usePlayerStore } from '@/stores/player';
    import songsData from '../data/songs';
    
    export default {
        components: {
            IconGrid,
            IconList,
        },
        data() {
        return {
            isGrid: true,
            click: 0,
        };
        },
        methods: {

        getArtistName(artists) {
            return artists.map((artist) => artist.name).join(', ');
        },

        getReleaseDate(release_date) {
            const year = new Date(release_date);
            return year.getFullYear();
        },

        getTracklist(trackCount) {
            return trackCount > 1 ? `${trackCount} songs` : `${trackCount} song`;
        },

        toggleGrid(value) {
            this.isGrid = value;
        },

        selectAlbum(albumID) {
            const player = usePlayerStore();
            this.click++;
            let timer;
            if (this.click === 1) {
            timer = setTimeout(() => {
                this.click = 0;
            }, 500);
            } else {
                clearTimeout(timer);
                player.setPlaylist(this.albums[albumID].tracks);
                player.setNowPlaying(this.albums[albumID].tracks[0]);
                this.click = 0;
            }
        },

        },
        computed: {
        albums() {
            return songsData.reduce((accumulator, currentlyPlaying) => {
            accumulator[currentlyPlaying.album.id] = accumulator[currentlyPlaying.album.id] || {
                ...currentlyPlaying.album,
                tracks: [],
            };
            accumulator[currentlyPlaying.album.id].tracks.push(currentlyPlaying);
            return accumulator;
            }, {});
        },
        getAlbumID() {
            const album = usePlayerStore();
            return album.getNowPlayingAlbumID;
        },
        },
    };
</script>  