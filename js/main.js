/*
1.Render song - done
2. Scroll - no need
3. Play - Pause - done
4. CD rotation - done
5. Change song next|prev - done
6. Random - done -> optimal not to repeat 1 song
7. Next / Repeat song - done
8. Active song - done (optimal)
9. Scroll active song to view - done
10. Play song when clicked
*/

import {roundSeconds, 
        formatSeconds,
        convertPercentToSecond} 
    from './convert.js';



const SONGS = [
    {
        name: 'Completely Yours',
        singer: 'Jade',
        path: '../../music/completely_yours.mp3',
        image: '../../img/completely_yours.jpg',
        end: '04:32'
    },
    {
        name: 'Confused',
        singer: 'mj anpanay',
        path: '../music/confused.mp3',
        image: '../img/confused.jpg',
        end: '02:59'
    },
    {
        name: 'Easily',
        singer: 'Bruno Major',
        path: '../music/easily.mp3',
        image: '../img/easily.jpg',
        end: '03:00'
    },
    {
        name: 'Flower',
        singer: 'Johnny Stimson',
        path: '../music/flower.mp3',
        image: '../img/flower.jpg',
        end: '03:00'
    },
    {
        name: 'Golden Hour',
        singer: 'JVKE',
        path: '../music/golden_hour.mp3',
        image: '../img/golden_hour.jpg',
        end: '03:30'
    },
    {
        name: 'How Do You Think',
        singer: 'CHEEZE',
        path: '../music/how_do_you_think.mp3',
        image: '../img/how_do_you_think.jpg',
        end: '03:29'
    },
    {
        name: 'Manhattanhenge',
        singer: 'Corner Club',
        path: '../music/manhattanhenge.mp3',
        image: '../img/manhattanhenge.jpg',
        end: '02:42'
    },
    {
        name: 'Maybe Baby',
        singer: 'Maye',
        path: '../music/maybe_baby.mp3',
        image: '../img/maybe_baby.jpg',
        end: '03:14'
    },    
    {
        name: 'My Favorite Muse',
        singer: 'ZUHAIR',
        path: '../music/my_favorite_muse.mp3',
        image: '../img/my_favorite_muse.jpg',
        end: '04:21'
    },   
    {
        name: 'Regents Park',
        singer: 'Bruno Major',
        path: '../music/regent_park.mp3',
        image: '../img/regent_park.jpg',
        end: '02:57'
    },
    {
        name: 'Romance',
        singer: 'CHEEZE',
        path: '../music/romance.mp3',
        image: '../img/romance.jpg',
        end: '04:16'
    }
];

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.song-list');
const title = $('.current-title');
const artist = $('.current-artist');
const end = $('.time-count__right');
const img = $('.thumbnail img');
const audio = $('#audio');
const playBtn = $('.btn-pause');
const currentTime = $('.time-count__left');
const circlePoint = $('.time .circle');
const process = $('.time .process');
const processLine = $('.time .process-line');
const nextSongBtn = $('.btn-next');
const prevSongBtn = $('.btn-prev');
const shuffleBtn = $('.btn-shuffle');
const repeatBtn = $('.btn-repeat');

const player = $('.player');

const wave = document.getElementById('wave');

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: SONGS,
    isShuffling: false,
    isRepeating: false,
    unchosenIds: [...Array(SONGS.length).keys()],


    render: function() {

        const htmls = this.songs.map((song, index) => {
            var id = index + 1 < 10 ? '0' + (index + 1).toString() : (index + 1).toString();
            return `                    
                <li class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="song__info">
                        <div class="order">${id}</div>
                        <div class="info">
                            <img class="thumbnail" src="${song.image}" alt="${song.name}">

                            <div class="title">
                                <h4>${song.name}</h4>
                                <p>${song.singer}</p>
                            </div> 
                        </div>
                    </div>

                    <div class="song__time">
                        <p>${song.end}</p>
                    </div>
                </li>
             `
        })

        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    moveToNextSong: function() {
        this.currentIndex++;

        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },

    moveToPrevSong: function() {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },

    updateSongTimeline: function(percent) {
        circlePoint.style.left = percent + '%';
        process.style.width = percent + '%';
    },


    randomizeIndex: function() {
        // choose random from unchosenIds

        // already play all the songs in list randomly
        if (this.unchosenIds.length == 0) {
            // reset the unchosenIds
            this.unchosenIds = [...Array(SONGS.length).keys()];
        }

        let randomIndex = Math.floor(Math.random() * this.unchosenIds.length);
        let value = this.unchosenIds[randomIndex];

        // delete random index out of unchosenIds
        this.unchosenIds = this.unchosenIds.filter(item => {
            return item !== value;
        })

        console.log('VALUE:' + value)
        console.log('LENGTH: ' + this.unchosenIds.length);

        return value;
    },

    moveToRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        console.log(this.randomizeIndex());

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth", 
                block: "center"
            });
        }, 100)
        
    },


    handleEvents: function() {
        const _this = this;

        // handle CD rotation 
        const imgAnimation = img.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })

        imgAnimation.pause();

        // play btn clicked 
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // when song is being played
        audio.onplay = function() {
            _this.isPlaying = true;
            playBtn.classList.add('playing');
            imgAnimation.play();
            wave.classList.add('loader');
        }

        // when song is being paused
        audio.onpause = function() {
            _this.isPlaying = false;
            playBtn.classList.remove('playing');
            imgAnimation.pause();
            wave.classList.remove('loader');

        }

        // when song's process has changed 
        audio.ontimeupdate = function() {

            //console.log(audio.duration);
            if (audio.duration) {
                const progressPercent = Math.round(audio.currentTime / audio.duration * 100);

                _this.updateSongTimeline(progressPercent);
            }
            
            // update current time into UI
            currentTime.innerText = formatSeconds(audio.currentTime);
        }

        // when song is ended  
        audio.onended = function() {
            if (_this.isRepeating) {
                _this.updateSongTimeline(0);
                audio.play();
            } else {
                nextSongBtn.click();
            } 
        }

        // change song currentTime 
        processLine.onclick = function(e) {
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.

            const percent = Math.round(x / processLine.offsetWidth * 100);

            _this.updateSongTimeline(percent);

            audio.currentTime = convertPercentToSecond(percent, audio.duration);
        }

        // next song btn click 
        nextSongBtn.onclick = function() {
            if (_this.isShuffling) {
                _this.moveToRandomSong();
            } else {
                _this.moveToNextSong();
            }

            _this.updateSongTimeline(0);
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // prev song btn click
        prevSongBtn.onclick = function() {
            if (_this.isShuffling) {
                _this.moveToRandomSong();
            } else {
                _this.moveToPrevSong();
            }

            _this.updateSongTimeline(0);
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        
        // shuffle btn click
        shuffleBtn.onclick = function() {
            _this.isShuffling = !_this.isShuffling;
            shuffleBtn.classList.toggle('active', _this.isShuffling);

            // start shuffling mode
            if (_this.isShuffling) {
                // reset the unchosenIds list 
                _this.unchosenIds = [...Array(SONGS.length).keys()]
                // delete the current index out of unchosen list 
                _this.unchosenIds = _this.unchosenIds.filter(id => {
                    return id !== this.currentIndex;
                })
            }

        }

        // repeat 1 song only {
        repeatBtn.onclick = function() {
            _this.isRepeating = !_this.isRepeating;
            repeatBtn.classList.toggle('active', _this.isRepeating);
        }

        // playlist is clicked
        playlist.onclick = function(e) {

            const songNode = e.target.closest('.song:not(.active)');
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();

                _this.updateSongTimeline(0);

                audio.play();
                _this.render();
                _this.scrollToActiveSong();

            }
        }

    },


    loadCurrentSong: function() {
        title.textContent = this.currentSong.name;
        artist.textContent = this.currentSong.singer;
        end.textContent = this.currentSong.end;
        img.src = this.currentSong.image;

        audio.src = this.currentSong.path;
    }, 

    start: function() {
        // define properties obj
        this.defineProperties();

        // deal with DOM events
        this.handleEvents();

        // load the currentSong info into UI when mounted
        this.loadCurrentSong();

        // render the playlist
        this.render();
    }
}

app.start();