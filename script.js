document.addEventListener('DOMContentLoaded', () => {
    const cards = document.getElementsByClassName('card');
    const playButtons = document.getElementsByClassName('playButton');
    const songListContainer = document.getElementById('songList');

    // Convert HTMLCollection to Array
    const cardsArray = Array.from(cards);
    const playButtonsArray = Array.from(playButtons);

    cardsArray.forEach((card, index) => {
        // Ensure there is a corresponding playButton for each card
        
            const playButton = playButtonsArray[index];

            card.addEventListener('mouseenter', () => {
                playButton.style.opacity = '1';
                playButton.style.top = '105px';
            });

            card.addEventListener('mouseleave', () => {
                playButton.style.opacity = '0';
                playButton.style.top = '140px';
            });

            card.addEventListener('click', async () => {
                let songs;
                if (card.id === 'card1') {
                    songs = await getPlayList1();
                } else if (card.id === 'card2') {
                    songs = await getPlayList2();
                }
                console.log(songs); // For debugging
                // Store the playlist globally
                window.currentPlaylist = songs;
                window.currentSongIndex = 1;

                displaySongs(songs,songListContainer)
            });

        
    });
});

function displaySongs(songs, container) {
    // Clear the container first
    container.innerHTML = '';
    
    // Check if songs array has more than 1 element
    if (songs.length > 1) {
        // Loop through the songs array starting from index 1
        for (let index = 1; index < songs.length; index++) {
            const song = songs[index];
            const li = document.createElement('li');
            const img = document.createElement('img');
            const songName = document.createElement('p');
            const songTime = document.createElement('p');
            const playButton = document.createElement('img');

            img.src = "https://w7.pngwing.com/pngs/156/858/png-transparent-girl-listen-music-with-headphone-thumbnail.png";
            img.alt = "";
 
            // Extracting Name form URL  
            const url = new URL(song);
            const pathname = url.pathname;
            let name = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.lastIndexOf('.mp3'));
            name = decodeURIComponent(name); // Decode percent-encoded characters
            name = name.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, ''); // Ensure it starts and ends with alphabets

            songName.textContent = name;

            // Add click event listener to the list item
            li.addEventListener('click', () => {
                playSong(song, playButton);
                window.currentSongIndex = index;
                document.getElementById('name1').textContent = name;
            });
          
            playButton.src = "red_play.svg";
            playButton.alt = "";

            li.appendChild(img);
            li.appendChild(songName);
            li.appendChild(songTime);
            li.appendChild(playButton);

            container.appendChild(li);
        }
    } else {
        // Handle the case when there are no songs to display from index 1
        console.log("Not enough songs to display starting from index 1");
    }
}

function playSong(songUrl, playButton) {
    let masterPlay = document.getElementById("letsPlay")
    const gif = document.getElementById("gif")
    const progressBar = document.getElementById("progressBar")
    // Check if the song is already playing

    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.src = ''; // Remove the source to stop the audio
        window.currentAudio.load(); // Reload the audio element to ensure it stops
        window.currentAudio.playButton.src = "red_play.svg"; // Change to your play icon
        masterPlay.src = "green.png";
        gif.style.opacity = "0";
    }

    // if (window.currentAudio && window.currentAudio.src === songUrl) {
    //     // If the song is currently playing, pause it and change the icon to play
    //     if (!window.currentAudio.paused) {
    //         window.currentAudio.pause();
    //         playButton.src = "red_play.svg";
    //         masterPlay.src = "green.png";
    //         gif.style.opacity = "0";
    //     } else {
    //         // If the song is paused, play it and change the icon to pause
    //         window.currentAudio.play();
    //         playButton.src = "red_pause.svg";
    //         masterPlay.src = "Gpause.png";
    //         gif.style.opacity = "1";
    //     }
    // } else {
    //     // Pause any currently playing audio
    //     if (window.currentAudio) {
    //         window.currentAudio.pause();
    //         window.currentAudio.playButton.src = "red_play.svg";
    //         masterPlay.src = "green.png";
    //     }

        // Play the selected song
        const audio = new Audio(songUrl);
        audio.play();
        gif.style.opacity = "1";

        playButton.src = "red_pause.svg"; // Change to your pause icon
        masterPlay.src = "Gpause.png";
        window.currentAudio = audio;
        window.currentAudio.playButton = playButton;

        // Handle the end of the song
        audio.addEventListener('ended', () => {
            playButton.src = "red_play.svg"; // Change back to play icon
            masterPlay.src = "green.png";
            gif.style.opacity = "0"
        });

        audio.addEventListener('timeupdate', () => {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressBar.value = percentage;
        });

        progressBar.addEventListener('input', () => {
            const seekTime = (progressBar.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        });
}


function toggleMasterPlay() {
    masterPlay = document.getElementById("letsPlay")
    const currentAudio = window.currentAudio;
 

    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
            currentAudio.playButton.src = "red_pause.svg";
            masterPlay.src = "Gpause.png";
            document.getElementById("gif").style.opacity = "1";
        } else {
            currentAudio.pause();
            currentAudio.playButton.src = "red_play.svg";
            masterPlay.src = "green.png";
            document.getElementById("gif").style.opacity = "0";
        }
    }
}

async function getPlayList1() {
    let data = await fetch("http://127.0.0.1:3002/playlist1/");
    let content = await data.text();

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    let anchors = tempDiv.getElementsByTagName("a");
    let linksArray = Array.from(anchors).map(anchor => anchor.href);
    
    return linksArray;
}
async function getPlayList2() {
    let data = await fetch("http://127.0.0.1:3002/playlist2/");
    let content = await data.text();

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    let anchors = tempDiv.getElementsByTagName("a");
    let linksArray = Array.from(anchors).map(anchor => anchor.href);
    
    return linksArray;
}

const createPlaylist = () => {
    const container = document.getElementById('container');
    const text = document.getElementById('name').value;

    const newDiv = document.createElement('div');
    newDiv.classList.add('card');
    
    newDiv.innerHTML = `
    <img class="playButton" src="playButton.svg" alt="">
    <img class="img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUXXDmVgmG3UPU1u7BtNeIbLpCAiw_Y_fdJg&s" alt="this img">
    <h2>${text}</h2>
    <p>Hits to boost your mood and fill your heart with happiness</p>
            `;
            
    // Add event listeners for the new card
    const playButton = newDiv.querySelector('.playButton');
    newDiv.addEventListener('mouseenter', () => {
        playButton.style.opacity = '1';
        playButton.style.top = '105px';
    });

    newDiv.addEventListener('mouseleave', () => {
        playButton.style.opacity = '0';
        playButton.style.top = '140px';
    });

    container.appendChild(newDiv);
};

function developer() { 
  window.location.href = "./new.html";  
}

