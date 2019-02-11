
// const socket = io('socket.io.js');

// var socket = io.connect('http://localhost:2800');

/*
socket.on('DANH-SACH-USER-PEER', ArrPeerId => {
    console.log('ArrPeerId::::', ArrPeerId);
    ArrPeerId.forEach(dataStream => {
        var { ten, peerId} = dataStream;
        $('#ulUser').append( `<li id="${peerId}">${ten}</li>`)
    });
}) */


function openStream() {
    const config = {
        audio: false,
        video: true
    };
    return navigator.mediaDevices.getUserMedia(config);
}

function PlayStream(idvideoTag, stream) {
    const video = document.getElementById(idvideoTag);
    video.srcObject = stream;
    video.play();
}

/*
openStream()
.then( stream => PlayStream('localStream',stream));
*/

///tk5g2acaree9udi
const peer = new Peer({ key: 'tk5g2acaree6666669udi' }); //thay no la;  key: socket.id

peer.on('open', id => {
    $("#my-peer").append(id);

    console.log('id:;: open pree',id);
    $('#btnSignUp').click( () => {
        var Username = $('#txtUsername').val();
        var dataStream = {
            ten: Username,
            peerId: id,
        } 
     //  socket.emit('NGUOI_DUNG_DANG_KY_STREAM_PREE',dataStream);
        console.log('dataStream::::', dataStream);
    })

});

$('#btnCall').click(() => {
    alert('12');
    var id = $('#remoteId').val();
    console.log('id:::::::', id);
    openStream()
        .then(stream => {

            console.log('stream::nguoi goi:::',stream);

            PlayStream('localStream', stream);
            var call = peer.call(id, stream);
            console.log('call:::::::', call);
            call.on('stream', remoteStream => {
                console.log('remoteStream::nguoi goi:::',remoteStream);
                PlayStream('remoteStream', remoteStream);
            })
        });

})


peer.on('call', call => {
    openStream()
    .then(stream => {
        console.log('stream::answer goi:::',stream);
        call.answer(stream);
        PlayStream('localStream', stream);
        call.on('stream', remoteStream => {
            console.log('remoteStream::answer goi:::',remoteStream);
            PlayStream('remoteStream', remoteStream);
        })
    })
})