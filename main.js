

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const cd = $('.cd');
    const heading = $('header  h2');
    const cdThumb = $('.cd-thumb');
    const audio = $('#audio');
    const player = $('.player');
    const playBtn = $('.btn-toggle-play');
    const progress = $('#progress');
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat');
    const playlist = $('.playlist');


const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    songs: [
        {
            name: '7 Years',
            singer: 'Lukas Grahan',
            path: './assets/music/song1.mp3',
            img: './assets/img/img1.jfif'
        },
        {
            name: 'Dancing with your ghost',
            singer: 'Sasha Alex Sloan',
            path: './assets/music/song2.mp3',
            img: './assets/img/img2.jpg'
        },
        {
            name: 'Dừng Thương',
            singer: 'DatKaa',
            path: './assets/music/song3.mp3',
            img: './assets/img/img3.jpg'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path: './assets/music/song4.mp3',
            img: './assets/img/img4.jfif'
        },
        {
            name: 'Yêu từ đâu mà ra',
            singer: 'Lil Zpoet',
            path: './assets/music/song5.mp3',
            img: './assets/img/img5.jpg'
        },
        {
            name: 'Just give me a reason',
            singer: 'Pink',
            path: './assets/music/song6.mp3',
            img: './assets/img/img6.jpg'
        },
        {
            name: 'Take me to your heart',
            singer: 'Micheal Learns to Rock',
            path: './assets/music/song7.mp3',
            img: './assets/img/img7.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
          </div>
        `
        })
        playlist.innerHTML = htmls.join('') 
    },

    

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth;
        
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const cdNewWidth = cdWidth - scrollTop 
            cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0
            cd.style.opacity = cdNewWidth / cdWidth
        }
        
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
        }

        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            } 
        }

        progress.onchange = function(e) {
            const seekTime =  audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        },

        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
           
        }

        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
            
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        playlist.onclick = function (e) {
            const songNote =  e.target.closest('.song:not(.active)')
            if (songNote || e.target.closest('.option')) {
                if (songNote) {
                 _this.currentIndex = Number(songNote.dataset.index)
                 _this.loadCurrentSong()
                 _this.render()
                 audio.play()
                }

                if (e.target.closest('.option')) {

                }
                
            }
        }

    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
        setTimeout( function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 300)   
    },


    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`
        audio.src = this.currentSong.path
    },

    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)

        this.currentIndex = newIndex

        this.loadCurrentSong()

    },


    start: function () {
        this.defineProperties()
        this.loadCurrentSong()
        
        this.handleEvents()

        this.render()
    }
}

app.start()