

/*
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
} */

/*
var Peer  = require('http://192.168.216.2:2800/Stream/peer.js');
var uid = require('uid');
var peer = new Peer(uid(10), {host: 'localhost', port: 2800, secure: true});
*/



function openStream(cb) {

	if (navigator.mediaDevices === undefined) {
		navigator.mediaDevices = {};
	  }
	  
	  // Some browsers partially implement mediaDevices. We can't just assign an object
	  // with getUserMedia as it would overwrite existing properties.
	  // Here, we will just add the getUserMedia property if it's missing.
	  if (navigator.mediaDevices.getUserMedia === undefined) {
		navigator.mediaDevices.getUserMedia = function(constraints) {
	  
		  // First get ahold of the legacy getUserMedia, if present
		  var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	  
		  // Some browsers just don't implement it - return a rejected promise with an error
		  // to keep a consistent interface
		  if (!getUserMedia) {
			return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		  }
	  
		  // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
		  return new Promise(function(resolve, reject) {
			getUserMedia.call(navigator, constraints, resolve, reject);
		  });
		}
	  }
	  
	  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
	  .then(function(stream) {
		var video = document.querySelector('video');
		// Older browsers may not have srcObject
		if ("srcObject" in video) {
		  video.srcObject = stream;
		} else {
		  // Avoid using this in new browsers, as it is going away.
		  video.src = window.URL.createObjectURL(stream);
		}
		video.onloadedmetadata = function(e) {
		  video.play();
		};
	  })
	  .catch(function(err) {
		console.log(err.name + ": " + err.message);
	  });

	// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
	/*
	var getUserMedia = navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.mozGetUserMedia;
	
	return navigator.mediaDevices.getUserMedia({audio: true, video: true}); 
	*/


	/*
    return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });

    /*
    .then(stream => {
        cb(stream);
    })
    .catch(e => console.log(e)); */
}


function playStream(idvideoTag, stream) {
    const video = document.getElementById(idvideoTag);
    // window.localStream = stream;
    video.srcObject = stream;
    video.onloadedmetadata = function () {
        video.play();
        video.muted = true;
    };
} 






var peer = new Peer({ key: 'tk5g2acaree6666669udi' }); //thay no la;  key: socket.id
//const peer = new Peer();


peer.on('open', id => {
    $("#my-peer").append(id);

    console.log('id:;: open pree', id);


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
//	window.existingCall = call;
    call.on('stream', function (remoteStream) {

        console.log('remoteStream::nguoi goi 0000000:::', remoteStream);
        // Show stream in some <video> element.
        playStream('remoteStream', remoteStream);

    }); 


	/*
    openStream()
        .then(stream => {
            console.log('stream::nguoi goi:111111::', stream);
           playStream('localStream', stream);
			var call = peer.call(id, stream);
            console.log('call: nguoi goi btnCall:1111111:::::', call);
			console.log('call.on call.on call.on call.on 111111', call.on())
		//	window.existingCall = call;
            call.on('stream', function (remoteStream) {
                console.log('remoteStream::nguoi goi:11111::', remoteStream);
                playStream('remoteStream', remoteStream);
                //console.log('remoteStream::nguoi goi:11111::', remoteStream);
            });
        }); */
})

peer.on('call', function (call) {
    console.log('peer.on(call 22222222', call);
    console.log('openStream()>>>222222::::', openStream())


	/*
    openStream()
        .then(stream => {
            console.log('stream::nguoi goi:::', stream);
            playStream('localStream', stream);
			console.log(' playStream(localStream', playStream('localStream', myStream))
			call.on('stream', function (remoteStream) {
				// Show stream in some <video> element.
				console.log('remoteStream::nguoi goi::22222222:', remoteStream);
				playStream('remoteStream', remoteStream);
		
			});
        }).catch(e => console.log('eeeeeee', e));  */

	playStream('localStream', myStream);
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





