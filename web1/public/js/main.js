const createUserBtn = document.getElementById("create-user");
const username = document.getElementById("username");
const allusersHtml = document.getElementById("allusers");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");
const muteBtn = document.getElementById("mute-btn");
const videoBtn = document.getElementById("video-btn");
const switchCameraBtn = document.getElementById("switch-camera-btn");
const messageInput = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const socket = io(); 
let localStream;
let caller = [];
let targetUsername; // Add this to track the target user for chat
let currentCameraIndex = 0;
let videoDevices = [];

// Single Method for peer connection
const PeerConnection = (function(){
    let peerConnection;

    const createPeerConnection = () => {
        const config = {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        };
        peerConnection = new RTCPeerConnection(config);

        // add local stream to peer connection
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        })
        // listen to remote stream and add to peer connection
        peerConnection.ontrack = function(event) {
            const [stream] = event.streams;
            if (stream.getVideoTracks().length > 0) {
                remoteVideo.srcObject = stream;
            }
            if (stream.getAudioTracks().length > 0) {
                const remoteAudio = new Audio();
                remoteAudio.srcObject = stream;
                remoteAudio.play();
            }
        }
        // listen for ice candidate
        peerConnection.onicecandidate = function(event) {
            if(event.candidate) {
                socket.emit("icecandidate", {
                candidate: event.candidate,
                to: targetUsername // Using existing targetUsername variable
                });
            }
        }

        return peerConnection;
    }

    return {
        getInstance: () => {
            if(!peerConnection){
                peerConnection = createPeerConnection();
            }
            return peerConnection;
        }
    }
})();

document.getElementById("fileInput").addEventListener("change", function() {
    sendFile();
});

// handle browser events
createUserBtn.addEventListener("click", (e) => {
    if(username.value !== "") {
        const usernameContainer = document.querySelector(".username-input");
        // In web1/public/js/main.js and web2/public/js/main.js
        socket.emit("join-user", {
            username: username.value,
            room: 'web1' // or 'web2' depending on the client
        });
        usernameContainer.style.display = 'none';
    }
});

username.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && username.value !== "") {
        createUserBtn.click();
    }
});

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && messageInput.value !== "") {
        sendMessage();
    }
});

endCallBtn.addEventListener("click", (e) => {
    socket.emit("call-ended", caller);
    endCall();
})

// Add to index.html
function verifyOTP(room, otp) {
    fetch('/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room, otp })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = `/${room}`;
        } else {
            alert('Invalid OTP. Please try again.');
        }
    });
}

// handle socket events
socket.on("joined", allusers => {
    console.log({ allusers });
    const createUsersHtml = () => {
        allusersHtml.innerHTML = "";

        for(const user in allusers) {
            const li = document.createElement("li");
            li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

            if(user !== username.value) {
                const button = document.createElement("button");
                button.classList.add("call-btn");
                button.addEventListener("click", (e) => {
                    startCall(user);
                    targetUsername = user; // Set the target user for chat
                });
                button.textContent = "Connect";

                li.appendChild(button);
            }

            allusersHtml.appendChild(li);
        }
    }

    createUsersHtml();

});

socket.on("offer", async ({from, to, offer}) => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", {from, to, answer: pc.localDescription});
    // Auto-accept the call
    startCall(from);
});

socket.on("answer", async ({from, to, answer}) => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(answer);
    // show end call button
    endCallBtn.style.display = 'block';
    socket.emit("end-call", {from, to});
    caller = [from, to];
    targetUsername = to; // Set the target user for chat
});
socket.on("icecandidate", async candidate => {
    console.log({ candidate });
    const pc = PeerConnection.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
});
socket.on("end-call", ({from, to}) => {
    endCallBtn.style.display = "block";
});
socket.on("call-ended", (caller) => {
    endCall();
})

// start call method
const startCall = async (user) => {
    const pc = PeerConnection.getInstance();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", {
        from: username.value, 
        to: user, 
        offer: pc.localDescription
    });
    endCallBtn.style.display = 'block'; // Show end call button for caller
    targetUsername = user;
}



const endCall = () => {
    const pc = PeerConnection.getInstance();
    if(pc) {
        pc.close();
        endCallBtn.style.display = 'none';
        localStream.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        
        // Open new page
        window.location.href = 'Dignosis.html'; // This will redirect to the main page
    }
}

// initialize app
const startMyVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log({ stream });
        localStream = stream;
        localVideo.srcObject = stream;
        await getVideoDevices();
    } catch(error) {
        console.error("Error accessing media devices.", error);
    }
}

const getVideoDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoDevices = devices.filter(device => device.kind === 'videoinput');
}

const switchCamera = async () => {
    if (videoDevices.length > 1) {
        currentCameraIndex = (currentCameraIndex + 1) % videoDevices.length;
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: videoDevices[currentCameraIndex].deviceId } },
            audio: true
        });
        const videoTrack = newStream.getVideoTracks()[0];
        const sender = PeerConnection.getInstance().getSenders().find(s => s.track.kind === 'video');
        sender.replaceTrack(videoTrack);
        localStream = newStream;
        localVideo.srcObject = newStream;
    }
}

switchCameraBtn.addEventListener("click", switchCamera);

startMyVideo();

// Function to send chat message
function sendMessage() {
    const message = messageInput.value;
    if (message) {
        socket.emit("chat-message", { 
            from: username.value, 
            to: targetUsername, 
            message,
            room: 'web1' // or 'web2' depending on client
        });
        displayMessage(username.value, message);
        messageInput.value = "";
    }
}

// Function to send file (only images, max size 900KB)
function sendFile() {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
        if (file.size <= 900 * 1024) { // 900KB limit
            const reader = new FileReader();
            reader.onload = function(e) {
                const buffer = e.target.result;
                socket.emit("file-message", { 
                    from: username.value, 
                    to: targetUsername, 
                    file: buffer, 
                    fileName: file.name, 
                    fileType: file.type,
                    room: 'web1' // or 'web2' depending on the client
                });
                displayFile(username.value, file.name, buffer, file.type);
                fileInput.value = ""; // Clear the file input
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('File size exceeds 900KB limit.');
        }
    } else {
        alert('Only image files are allowed.');
    }
}

// Function to display chat message
function displayMessage(from, message) {
    const messageContainer = document.getElementById("messageContainer");
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerHTML = `<strong>${from}:</strong> ${message}`;
    messageContainer.appendChild(messageElement);
}

// Function to display file
function displayFile(from, fileName, buffer, fileType) {
    const messageContainer = document.getElementById("messageContainer");
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    const blob = new Blob([buffer], { type: fileType });
    const url = URL.createObjectURL(blob);
    messageElement.innerHTML = `<strong>${from}:</strong> <a href="${url}" download="${fileName}">${fileName}</a>`;
    messageContainer.appendChild(messageElement);
}

// Event listener for receiving chat messages
socket.on("chat-message", ({ from, message }) => {
    displayMessage(from, message);
});

// Event listener for receiving file messages
socket.on("file-message", ({ from, fileName, file, fileType }) => {
    displayFile(from, fileName, file, fileType);
});

// Mute/Unmute audio
muteBtn.addEventListener("click", () => {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack.enabled) {
        audioTrack.enabled = false;
        muteBtn.textContent = "Unmute";
    } else {
        audioTrack.enabled = true;
        muteBtn.textContent = "Mute";
    }
});

// Start/Stop video
videoBtn.addEventListener("click", () => {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack.enabled) {
        videoTrack.enabled = false;
        videoBtn.textContent = "Start Video";
    } else {
        videoTrack.enabled = true;
        videoBtn.textContent = "Stop Video";
    }
});