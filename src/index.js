import Peer from 'simple-peer';
// module.hot.accept();
const constraints = { audio: false, video: { width: 1280, height: 720 } };

navigator.mediaDevices.getUserMedia(constraints).then(peerFunction);
// navigator.mediaDevices.getDisplayMedia(constraints).then(peerFunction);


function peerFunction(stream) {
    const peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream,
    });

    peer.on('signal', (data) => {
        console.log('signal');

        document.getElementById('yourId').value = JSON.stringify(data);
    });

    document.getElementById('connect').addEventListener('click', ()=>{
        console.log('connect');
        const otherId = JSON.parse(document.getElementById('otherId').value);
        peer.signal(otherId);
    });

    document.getElementById('send').addEventListener('click', () => {
        const yourMessage = document.getElementById('yourMessage').value;
        peer.send(yourMessage);
    });

    peer.on('data', (data)=> {
        document.getElementById('messages').textContent += data + '\n';
    });

    peer.on('stream', (stream)=>{
        const video = document.createElement('video');
        document.body.appendChild(video);
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    });
}

function error(err) {
    console.log('The following error occurred: ' + err.name);
}
