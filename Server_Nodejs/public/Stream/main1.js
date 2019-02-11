



function openStream() {
    const config = {
        audio: true,
        video: true
    };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idvideoTag, stream) {
    const video = document.getElementById(idvideoTag);
    // window.localStream = stream;
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
        video.play();
        video.muted = true;
    };
}

var peer = new Peer({ key: 'tk5g2acaree6666669udi' }); //thay no la;  key: socket.id
//const peer = new Peer();

peer.on('open', id => {
    $("#my-peer").append(id);

    console.log('id:;: open pree', id);

    /*
    $('#btnSignUp').click( () => {
        var Username = $('#txtUsername').val();
        var dataStream = {
            ten: Username,
            peerId: id,
        } 
     //  socket.emit('NGUOI_DUNG_DANG_KY_STREAM_PREE',dataStream);
        console.log('dataStream::::', dataStream);
    }) */

});

var myStream;
navigator.getUserMedia({ video: true, audio: true }, function (stream) {
    myStream = stream;
}, function (err) {
    console.log('Failed to get local stream', err);
});




$('#btnCall').click(function () {

    const id = $('#remoteId').val();
    console.log('id:::::::', id);


    playStream('localStream', myStream); //myStream = stream

    var call = peer.call(id, myStream);
    console.log('call: nguoi goi btnCall 0000000::::::', call);
    console.log('call.on call.on call.on call.on 000000', call.on())
  //  call.answer(myStream);
    call.on('stream', function (remoteStream) {

        console.log('remoteStream::nguoi goi 0000000:::', remoteStream);
        // Show stream in some <video> element.
        playStream('remoteStream', remoteStream);
        
    });




    openStream()
        .then(stream => {

            console.log('stream::nguoi goi:111111::', stream);

          //  playStream('localStream', stream);


            var call = peer.call(id, stream);
            console.log('call: nguoi goi btnCall:1111111:::::', call);

            console.log('call.on call.on call.on call.on 111111', call.on())
            call.on('stream', function (remoteStream) {
                console.log('remoteStream::nguoi goi:11111::', remoteStream);
                playStream('remoteStream', remoteStream);
                //console.log('remoteStream::nguoi goi:11111::', remoteStream);
            });
        });
})

peer.on('call', function (call) {
    console.log('peer.on(call 22222222', call);
    console.log('openStream()>>>222222::::', openStream())


    playStream('localStream', myStream);
    /*
    openStream()
        .then(stream => {
            console.log('stream::nguoi goi:::', stream);
            playStream('localStream', stream);
        }).catch(e => console.log('eeeeeee', e)); */


    call.answer(myStream); // Answer the call with an A/V stream.
    call.on('stream', function (remoteStream) {
        // Show stream in some <video> element.
        console.log('remoteStream::nguoi goi::22222222:', remoteStream);
        playStream('remoteStream', remoteStream);
  
    });
});




/*

$('#btnCall').on("click", function() {
     alert('12');
    const id = $('#remoteId').val();
    console.log('id:::::::', id);
    openStream()
        .then(stream => {

            console.log('stream::nguoi goi:::', stream);

            playStream('localStream', stream);
            var call = peer.call(id, stream);
            console.log('call: nguoi goi btnCall::::::', call);
            
            console.log('call.on call.on call.on call.on', call.on())
            call.on('stream', function(remoteStream) {
                playStream('remoteStream', remoteStream);
                console.log('remoteStream::nguoi goi:::', remoteStream);
            });
        });
})




peer.on('call', function(call) {
    console.log('peer.on(call', call);
    console.log('openStream()>>>::::',openStream())
    openStream()
        .then( (stream) => {
            console.log('stream::answer goi:::', stream)
            call.answer(stream)
            playStream('localStream', stream)
            call.on('stream', function(remoteStream) {
                console.log('remoteStream::answer goi:::', remoteStream);
                playStream('remoteStream', remoteStream)
            })
        })
})
*/

/*

$('#btnCall').click(() => {
    alert('12');
    const id = $('#remoteId').val();
    console.log('id:::::::', id);

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
    getUserMedia({ video: true, audio: false }, function (stream) {
        PlayStream('localStream', stream);
        var call = peer.call(id, stream);
        call.on('stream', function (remoteStream) {
            // Show stream in some video/canvas element.
            PlayStream('remoteStream', remoteStream);
            console.log('remoteStream::nguoi goi:::', remoteStream);
     
        });
    }, function (err) {
        console.log('Failed to get local stream', err);
    });

})


peer.on('call', function(call) {

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
  getUserMedia({video: true, audio: false}, function(stream) {
    call.answer(stream); // Answer the call with an A/V stream.
    PlayStream('localStream', stream);
    call.on('stream', function(remoteStream) {
        PlayStream('remoteStream', remoteStream);
        console.log('remoteStream::nguoi goi:::', remoteStream);
      // Show stream in some video/canvas element.
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});   */





