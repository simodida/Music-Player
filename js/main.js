const wrapper = document.getElementById("wrapper"),
        nameMusicBig = document.getElementById("name-music"),
        img = document.getElementById("img"),
        audio = document.getElementById("audio"),
        playBtn = document.getElementById("play-btn"),
        prevMusicBtn = document.getElementById("prev-music"),
        nextMusicBtn = document.getElementById("next-music"),
        repeatBtn = document.getElementById("repeat-btn"),
        listMusicBtn = document.getElementById("list-music-btn"),
        listMusic = document.getElementById("list-music"),
        closeListBtn = document.getElementById("close-list-music"),
        progressArea = document.getElementById("progress-area"),
        progressBar = document.getElementById("progress-bar");
// DOM change position
const downBtn = document.getElementById("down"),
        bigPlayer = document.getElementById("big-player"),
        smallPlayer = document.getElementById("small-player"),
        imgSmallPlayer = document.getElementById("img-sp"),
        nameMusicSmall = document.getElementById("name-music-sp"),
        playBtnSP = document.getElementById("play-btn-sp"),
        nextMusicBtnSP = document.getElementById("next-btn-sp");
// DOM change position

let indexMusic = 0;

getRequest();

function getRequest() {
    const request = new XMLHttpRequest();
    request.addEventListener("readystatechange", () => {
        if(request.readyState == 4 && request.status == 200) {
            const requestJSON = JSON.parse(request.responseText);
            loadMusic(requestJSON, indexMusic);

            window.addEventListener("load", () => {
                playingNow(requestJSON);
            });

            // Start Previous Music
            prevMusicBtn.addEventListener('click', () => {
                prevMusic(requestJSON);
            });
            // End Previous Music
            // Start Next Music
            nextMusicBtn.addEventListener('click', () => {
                nextMusic(requestJSON);
            });
            nextMusicBtnSP.addEventListener("click", () => {
                nextMusic(requestJSON);
            });
            // End Next Music
            // Music ended
            audio.addEventListener("ended", () => {
                const getInnerIcon = repeatBtn.innerText;
                switch(getInnerIcon) {
                    case "repeat": nextMusic(requestJSON); playingNow(requestJSON); break;
                    case "repeat_one": audio.currentTime = 0; playMusic(); break;
                    case "shuffle": let randMusic;
                                    do {
                                        randMusic = Math.floor(Math.random() * requestJSON.length);
                                    } while(randMusic == indexMusic);
                                    indexMusic = randMusic;
                                    loadMusic(requestJSON, indexMusic);
                                    playMusic();
                                    playingNow(requestJSON);
                                    break;
                }
            });
            // Music ended
            // Start list music
            const ulListMusic = document.getElementById("ul");
            for (let i = 0; i < requestJSON.length; i++) {
                let liTags = `
                                <li data-index="${i}" id="li">
                                    <div class="row">
                                        <p>${requestJSON[i].name}</p>
                                    </div>
                                    <audio id="music-${i}" src="../Music/${requestJSON[i].src}.mp3"></audio>
                                    <span class="audio-duration" id="audio-duration-${i}">0:00</span>
                                </li>
                            `;
                ulListMusic.insertAdjacentHTML("beforeend", liTags);
    
                const audDuration = document.getElementById(`audio-duration-${i}`);
                const allAudio = document.getElementById(`music-${i}`);
                
                audioDuration(audDuration, allAudio);
                
                // Start prepare all li
                playingNow(requestJSON);
                // End prepare all li
            }
            // End list music
        }
    });
    request.open("GET", "../Music.json", true);
    request.send();
}

// Start Function load music
function loadMusic(req, index) {
    nameMusicBig.innerText = req[index].name;
    img.src = `../Images/${req[index].image}.jpg`;
    audio.src = `../Music/${req[index].src}.mp3`;
    imgSmallPlayer.src = `../Images/${req[index].image}.jpg`;
    nameMusicSmall.innerText = req[index].name;
}
// End Function load music
musicPlay(playBtn);
musicPlay(playBtnSP);
function musicPlay(element) {
    element.addEventListener('click', () => {
        const isMusicPlayed = wrapper.classList.contains("playing");
        isMusicPlayed ? pauseMusic() : playMusic()
    });
}

function playMusic() {
    wrapper.classList.add("playing");
    playBtn.className = "fa-solid fa-pause";
    playBtnSP.className = "fa-solid fa-pause sp";
    audio.play();
    document.getElementById("image").style.animationPlayState = "running";
}

function pauseMusic() {
    wrapper.classList.remove("playing");
    playBtn.className = "fa-solid fa-play";
    playBtnSP.className = "fa-solid fa-play sp";
    audio.pause();
    document.getElementById("image").style.animationPlayState = "paused";
}

function prevMusic(req) {
    indexMusic--;
    indexMusic < 0 ? indexMusic = req.length - 1 : indexMusic = indexMusic;
    loadMusic(req, indexMusic);
    playMusic();
    playingNow(req);
}

function nextMusic(req) {
    indexMusic++;
    indexMusic > req.length - 1 ? indexMusic = 0 : indexMusic = indexMusic;
    loadMusic(req, indexMusic);
    playMusic();
    playingNow(req); 
} 

audio.addEventListener('timeupdate', () => {
    const setCurrentTime = document.getElementById("current-time");
    const setDuration = document.getElementById("duration");
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    // Start Progress area
    progressBar.style.width = `${currentTime / duration * 100}%`;
    // End Progress area
    audioDuration(setDuration, audio);
    const minuteCurrentTime = Math.floor(currentTime / 60);
    const secondCurrentTime = Math.floor(currentTime % 60);
    setCurrentTime.innerText = `${minuteCurrentTime}:${secondCurrentTime < 10 ? `0${secondCurrentTime}` : secondCurrentTime}`;
});

function audioDuration(innerElement, aud) {
    aud.addEventListener("loadeddata", () => {
        const loadedDuration = aud.duration;
        const minuteDuration = Math.floor(loadedDuration / 60);
        const secondDuration = Math.floor(loadedDuration % 60);
        innerElement.innerText = `${minuteDuration}:${secondDuration < 10 ? `0${secondDuration}` : secondDuration}`;
        innerElement.setAttribute("data-duration", `${minuteDuration}:${secondDuration < 10 ? `0${secondDuration}` : secondDuration}`);
    });
}

progressArea.addEventListener("click", ({ offsetX }) => {
    const progressWidth = progressArea.clientWidth;
    audio.currentTime = (offsetX / progressWidth) * audio.duration;
    playMusic();
});

repeatBtn.addEventListener('click', () => {
    const getInnerIcon = repeatBtn.innerText;
    const tooltipText = repeatBtn.parentElement.lastElementChild;
    console.log(tooltipText);
    switch(getInnerIcon) {
        case "repeat": repeatBtn.innerText = "repeat_one"; tooltipText.innerText = "Single loop mode"; break;
        case "repeat_one": repeatBtn.innerText = "shuffle"; tooltipText.innerText = "Random play mode"; break;
        case "shuffle": repeatBtn.innerText = "repeat"; tooltipText.innerText = "looped"; break;
    }
});

listMusicBtn.addEventListener("click", () => {
    listMusic.classList.toggle("show");
});

closeListBtn.addEventListener("click", () => {
    listMusicBtn.click();
});

function playingNow(req) {
    const allLi = document.querySelectorAll("#li");
    for(let j = 0; j < allLi.length; j++) {
        const audDuration = allLi[j].querySelector(`.audio-duration`);
        if(allLi[j].classList.contains("playing-now")) {
            allLi[j].classList.remove("playing-now");
            audDuration.innerText = audDuration.dataset.duration;
        }
        if(allLi[j].dataset.index == indexMusic) {
            allLi[j].classList.add("playing-now");
            audDuration.innerText = "Playing";
        }
        allLi[j].addEventListener('click', ({ currentTarget }) => {
            clickedMusic(currentTarget, req);
        });
    }
}

function clickedMusic(element, req) {
    const liDataset = element.dataset.index;
    indexMusic = liDataset;
    loadMusic(req, indexMusic);
    playMusic();
    playingNow(req);
}

downBtn.addEventListener("click", () => {
    bigPlayer.classList.remove("unchanged");
    bigPlayer.classList.add("changed");
});

smallPlayer.addEventListener("click", ({ target }) => {
    if(target.className == "play-area sp" || target.className == "fa-solid fa-pause sp" || target.className == "fa-solid fa-play sp" || target.className == "fa-solid fa-forward-step sp") {
        return 0;
    } else {
        bigPlayer.classList.remove("changed");
        bigPlayer.classList.add("unchanged");
    }
});