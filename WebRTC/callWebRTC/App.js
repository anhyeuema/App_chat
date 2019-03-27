/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,


  //
  getUserMedia,
  //
} from 'react-native-webrtc';

import io from 'socket.io-client/dist/socket.io.js';
//yarn add react-native-socket.io-client //  yarn add socket.io-client
//yarn add react-native-socket.io-client// yarn add socket.io-client

var e;



/*
function createPC(socketId, isOffer) {
  const peer = new RTCPeerConnection(configuration);
  pcPeers[socketId] = peer;

  peer.onicecandidate = function (event) {
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    peer.createOffer(function(desc) {
      console.log('createOffer', desc);
      peer.setLocalDescription(desc, function () {
        console.log('setLocalDescription', peer.localDescription);
        socket.emit('exchange', {'to': socketId, 'sdp': peer.localDescription });
      }, logError);
    }, logError);
  }

  peer.onnegotiationneeded = function () {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }

  peer.oniceconnectionstatechange = function(event) {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };
  peer.onsignalingstatechange = function(event) {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  peer.onaddstream = function (event) {
    console.log('onaddstream', event.stream);
    container.setState({info: 'One peer join!'});

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList: remoteList });
  };
  peer.onremovestream = function (event) {
    console.log('onremovestream', event.stream);
  };

  peer.addStream(localStream);
  function createDataChannel() {
    if (peer.textDataChannel) {
      return;
    }
    const dataChannel = peer.createDataChannel("text");

    dataChannel.onerror = function (error) {
      console.log("dataChannel.onerror", error);
    };

    dataChannel.onmessage = function (event) {
      console.log("dataChannel.onmessage:", event.data);
      container.receiveTextData({user: socketId, message: event.data});
    };

    dataChannel.onopen = function () {
      console.log('dataChannel.onopen');
      container.setState({textRoomConnected: true});
    };

    dataChannel.onclose = function () {
      console.log("dataChannel.onclose");
    };

    peer.textDataChannel = dataChannel;
  }
  return peer;
}

this.socket.on('exchange', function(data){
  const fromId = data.from;
  let peer;
  if (fromId in pcPeers) {
    peer = pcPeers[fromId];
  } else {
    peer = createPC(fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    peer.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (peer.remoteDescription.type == "offer")
      peer.createAnswer(function(desc) {
          console.log('createAnswer', desc);
          peer.setLocalDescription(desc, function () {
            console.log('setLocalDescription', peer.localDescription);
            this.socket.emit('exchange', {'to': fromId, 'sdp': peer.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
});
this.socket.on('leave', function(socketId){
  //leave(socketId);
  console.log('leave', socketId);
  const peer = pcPeers[socketId];
  const viewIndex = peer.viewIndex;
  peer.close();
  delete pcPeers[socketId];

  const remoteList = container.state.remoteList;
  delete remoteList[socketId]
  container.setState({ remoteList: remoteList });
  container.setState({info: 'One peer leave!'});

});

this.socket.on('connect', function(data) {
  console.log('connect');
  getLocalStream(true, function(stream) {
    localStream = stream;
    container.setState({selfViewSrc: stream.toURL()});
    // container.setState({status: 'ready', info: 'Please enter or create room ID'});
  });
});
*/

function getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    // MediaStreamTrack.getSources(sourceInfos => {
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log("sourceInfos: ", sourceInfos);

      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }
  mediaDevices.getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640, // Provide your own width, height and frame rate here
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
    }
  }, function (stream) {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, logError => {
    console.log(logError);
  });
}


function join(roomID) { //room phong
  e.socket.emit('join', roomID, function (socketIds) {
    console.log('join', socketIds);
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  });
}

const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
const pcPeers = {};
//let localStream;

function getStats() {
  const peer = pcPeers[Object.keys(pcPeers)[0]];
  console.log('getStats getStats getStats getStats getStats peer', peer)
  if (peer.getRemoteStreams()[0] && peer.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = peer.getRemoteStreams()[0].getAudioTracks()[0];
    console.log('track', track);
    peer.getStats(track, function (report) {
      console.log('getStats report', report);
    }, logError);
  }
}


function createPC(socketId, isOffer) { //tao peer
  const peer = new RTCPeerConnection(configuration);
  console.log('peer createPC createPC peer ', peer);
  pcPeers[socketId] = peer;

  console.log('pcPeers[socketId] createPC peer ', pcPeers[socketId]);

  console.log('peer.onicecandidate ', peer.onicecandidate);
  peer.onicecandidate = function (event) {
    console.log('onicecandidate createPC createPC createPC createPC createPC', event.candidate);
    if (event.candidate) {
      //  this.socket.emit('exchange', { 'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    peer.createOffer(function (desc) {
      console.log('createOffer', desc);
      peer.setLocalDescription(desc, function () {
        console.log('setLocalDescription', peer.localDescription);
        //  this.socket.emit('exchange', { 'to': socketId, 'sdp': peer.localDescription });
      }, logError);
    }, logError);
  }

  console.log('peer.onnegotiationneeded', peer.onnegotiationneeded);
  peer.onnegotiationneeded = function () {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }

  console.log('peer.oniceconnectionstatechange', peer.oniceconnectionstatechange);
  peer.oniceconnectionstatechange = function (event) {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };

  console.log('peer.onsignalingstatechange', peer.onsignalingstatechange);
  peer.onsignalingstatechange = function (event) {
    console.log('onsignalingstatechange', event.target.signalingState);
  };


  console.log('peer.onaddstream', peer.onaddstream);
  peer.onaddstream = function (event) {
    console.log('onaddstream', event.stream);
    e.setState({ info: 'One peer join!' });

    const { remoteList } = this.state;
    remoteList[socketId] = event.stream.toURL();
    e.setState({ remoteList: remoteList });
  };

  console.log('peer.onremovestream', peer.onremovestream);
  peer.onremovestream = function (event) {
    console.log('onremovestream', event.stream);
  };




  peer.addStream(this.state.localStream);

  console.log('this.state.localStream', this.state.localStream);


  /*
  function createDataChannel() {
    if (peer.textDataChannel) {
      return;
    }
    const dataChannel = peer.createDataChannel("text");
 
    console.log('dataChannel createDataChannel createDataChannel', dataChannel);
 
    dataChannel.onerror = function (error) {
      console.log("dataChannel.onerror", error);
    };
 
    dataChannel.onmessage = function (event) {
      console.log("dataChannel.onmessage:", event.data);
      e.receiveTextData({ user: socketId, message: event.data });
    };
 
    dataChannel.onopen = function () {
      console.log('dataChannel.onopen');
      e.setState({ textRoomConnected: true });
    };
 
    dataChannel.onclose = function () {
      console.log("dataChannel.onclose");
    };
 
    
    peer.textDataChannel = dataChannel;
    console.log(' peer.textDataChannel',  peer.textDataChannel);
    
  }
  */

  return peer;
}


/*
function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function (desc) {
          console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            console.log('setLocalDescription', pc.localDescription);
            socket.emit('exchange', { 'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  console.log('leave', socketId);
  const pc = pcPeers[socketId];
  const viewIndex = pc.viewIndex;
  pc.close();
  delete pcPeers[socketId];

  const remoteList = container.state.remoteList;
  delete remoteList[socketId]
  e.setState({ remoteList: remoteList });
  e.setState({ info: 'One peer leave!' });
} 
*/



function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}

import Canvas from 'react-native-canvas';

//yarn add react-native-callkeep
//react-native link react-native-callkeep
//import RNCallKeep from 'react-native-callkeep';

export default class WebRTC2 extends Component {

  constructor(props) {

    super(props);

    this.socket = io('http://192.168.29.2:2100', { jsonp: false });

    e = this;
    this.state = {
      roomID: 'lan',
      isFront: true,
      videoURL: null,
      remoteStreams: null,
      remoteList: {}, // cai ma nhan duoc tu server gui len

      info: '',
      localStream: '',
      dataIma: '',

      videoURL1: null,
      videoURL2: null,
      selfViewSrc: null,
    }

    this.socket.on('exchange-Answer', data => {
      console.log('exchange-Answer exchange-Answer exchange-Answer000000', data);
      console.log('exchange-Answer data.sdp = null ', (data.sdp = null));
      console.log('exchange-Answer data.sdp =  ', (data.sdp = ''));
      if (data.sdp = null) {

      } else if (data.sdp != null) {

        peer = new RTCPeerConnection(configuration);

        //    e.setState({ localStream: localStream });
        //   const { localStream } = this.state;
        //       console.log('this.state.localStream::::', this.state.localStream);
        // peer.addStream(localStream);




        function createOffer() {
          peer.createOffer(function (desc) {
            console.log('createOffer', desc);
            peer.setLocalDescription(desc, function () {
             // console.log('setLocalDescription', pc.localDescription);
              this.socket.emit('exchange', { 'to': socketId, 'sdp': pc.localDescription });
            }, logError);
          }, logError);
        }

        peer.onnegotiationneeded = function () {
          console.log('onnegotiationneeded');
          if (isOffer) {
            createOffer();
          }
        }

        peer.oniceconnectionstatechange = function (event) {
          console.log('oniceconnectionstatechange', event.target.iceConnectionState);
          if (event.target.iceConnectionState === 'completed') {
            setTimeout(() => {
              getStats();
            }, 1000);
          }
          if (event.target.iceConnectionState === 'connected') {
            createDataChannel();
          }
        };
        peer.onsignalingstatechange = function (event) {
          console.log('onsignalingstatechange', event.target.signalingState);
        };

        peer.onaddstream = function (event) {
          console.log('onaddstream', event.stream);
          container.setState({ info: 'One peer join!' });

          const remoteList = container.state.remoteList;
          remoteList[socketId] = event.stream.toURL();
          container.setState({ remoteList: remoteList });
        };
        peer.onremovestream = function (event) {
          console.log('onremovestream', event.stream);
        };

        peer.addStream(localStream);
        function createDataChannel() {
          if (peer.textDataChannel) {
            return;
          }
          const dataChannel = peer.createDataChannel("text");

          dataChannel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
          };

          dataChannel.onmessage = function (event) {
            console.log("dataChannel.onmessage:", event.data);
            container.receiveTextData({ user: socketId, message: event.data });
          };

          dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
            container.setState({ textRoomConnected: true });
          };

          dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
          };

          peer.textDataChannel = dataChannel;
        }





        peer.onsignalingstatechange = event => {
          console.log('event onsignalingstatechange v onsignalingstatechange onsignalingstatechange v', event)
          if (
            peer.signalingState === 'stable' &&
            peer.remoteDescription &&
            peer.localDescription
          ) {
            logInfo('CALL CONNECTED!!!');
            peer &&
              peer
                .getStats()
                .then(s => logInfo('RTC stats from onsignalingstatechange', s));
            dispatch(callConnected());
            clearInterval(checkConnection);
          }
        };



        peer.onaddstream = (event => {
          console.log('event..............', event);
          console.log('event.stream 11111111111111111111111111111111111111111111111111111111111111111111111', event.stream);
          var stream2 = event.stream
          // getLocalStream( isFront,event.stream);
          getLocalStream(true, function (stream2) {
            event.stream = stream;
            console.log('stream getLocalStream getLocalStream getLocalStreamv', stream)
            e.setState({ selfViewSrc: stream2.toURL() });
            // container.setState({status: 'ready', info: 'Please enter or create room ID'});
          });

        });

        console.log('(data.sdp.type == answer)', (data.sdp.type == 'answer'));
        console.log('(data.sdp.type == offer)', (data.sdp.type == 'offer'));
        if (data.sdp.type == 'offer') {
          peer.setRemoteDescription(new RTCSessionDescription(data.sdp)) //9999 Goi ham setRemoteDecription sau do goi createAnswer
            .then(() =>
              // {
              peer.createAnswer()

            )
            .then(answer => {
              peer.setLocalDescription(answer); //10 goi setLocalDescripttion
              console.log('answer::::answer answer answer answer xchange-Answer exchange-Answer ', answer);

            })
            .then(() => {

              /*=
          
              var videoSourceId = data.from;
    
              mediaDevices.enumerateDevices().then(sourceInfos => {
              // console.log('mediaDevices.enumerateDevices:::', sourceInfos);
    
                let videoSourceId;
                // console.log('sourceInfos.length sourceInfos.length sourceInfos.length  v v sourceInfos.length', sourceInfos.length);
                for (let i = 0; i < sourceInfos.length; i++) {
                 // console.log('sourceInfos sourceInfos 1111111111111111111111', sourceInfos);
                  const sourceInfo = sourceInfos[i];
                 // console.log('sourceInfos 11111111111111', sourceInfos);
                  if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                   // console.log('videoSourceId videoSourceId 11111111111111111 ', videoSourceId);
    
                  }
                }
                videoConfig = {
                  mandatory: {
                    minWidth: 240,
                    minHeight: 300,
                    minFrameRate: 30
                  },
                  facingMode: (isFront ? "user" : "environment"),
                  optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
                var remoteStreams = peer._remoteStreams;
               // console.log('_remoteStreams:::', remoteStreams);
                // e.setState({ _remoteStreams: peer._remoteStreams});
    
                var reactTag = remoteStreams[0].reactTag;
               // console.log('id::::::', reactTag);
                e.setState({
                  remoteStreams: reactTag,
                });
    
             //   peer.addStream(reactTag);
    
              });
              */

            });



        }
        else if (data.sdp.type == 'answer') {
          console.log('(data.sdp == answer)', (data.sdp == 'answer'));
          peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
      }



      /*
      this.socket.on('connect', function (data) { //neu co ket noi la mo stream ngay
        console.log('connect');
        getLocalStream(true, function (stream) {
          console.log('getLocalStream v v v getLocalStream getLocalStream',stream);
          localStream = stream;
          e.setState({ videoURL: stream.toURL() });
          // container.setState({status: 'ready', info: 'Please enter or create room ID'});
        });
      }); 
      */



    })


    var { roomID } = this.state;
    this.socket.emit('join', roomID, function (socketIds) {
      console.log('join', socketIds);
      for (const i in socketIds) {
        const socketId = socketIds[i];
        createPC(socketId, true);
      }
    });

    this.socket.on('exchange', function (data) {
      console.log(' data.videoURL::::', data);

      //   console.log('exchange exchange exchange exchange', data)
      // exchange(data);
      var localStream = data.videoURL;
      const fromId = data.from;
      let peer;
      if (fromId in pcPeers) {
        //     console.log('peer exchange0000000111');
        peer = pcPeers[fromId];
        console.log('peer exchange0', peer);
      } else {
        //    console.log('peer exchange111111111111');
        //  peer = createPC(fromId, false); //fromid la socket id do

        peer = new RTCPeerConnection(configuration);

        e.setState({ localStream: localStream });
        //   const { localStream } = this.state;
        //       console.log('this.state.localStream::::', this.state.localStream);
        peer.addStream(localStream);




        //     console.log('peer exchange1', peer);
      }


      // if (peer.remoteDescription.type == "offer")
      console.log('createAnswer createAnswer createAnswer createAnswer createAnswer', peer.createAnswer);


      peer.onaddstream = (event => {
        console.log('event..............', event);
        console.log('event.stream 11111111111111111111111111111111111111111111111111111111111111111111111', event.stream);


        /*
        mediaDevices.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 100, // Provide your own width, height and frame rate here
              minHeight: 100,
              minFrameRate: 30
            },
            facingMode: (isFront ? "user" : "environment"),
            optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
          }
        })
          .then(stream1 => {
            // Got stream!
            console.log('stream:::::::', stream1);
            console.log('stream.toURL() stream.toURL() stream.toURL() stream.toURL():::::::', stream1.toURL());
  
            e.setState({
              videoURL2: (event.stream).toURL(),
            });
  
           peer.addStream(stream);
  
  
          })
  
        /*
        friendsVideo.srcObject = event.stream;
        friendsVideo.onloadedmetadata = function (e) {
          friendsVideo.play();
        };
        */

      });


      peer.onaddstream = (event => {
        console.log('event..............', event);
        console.log('event.stream 11111111111111111111111111111111111111111111111111111111111111111111111', event.stream);
        var stream2 = event.stream
        // getLocalStream( isFront,event.stream);
        getLocalStream(true, function (stream2) {
          event.stream = stream;


          e.setState({ selfViewSrc: stream2.toURL() });


          // container.setState({status: 'ready', info: 'Please enter or create room ID'});
        });

      });


      console.log('(data.sdp.type == answer)', (data.sdp.type == 'answer'));
      console.log('(data.sdp.type == offer)', (data.sdp.type == 'offer'));
      if (data.sdp.type == 'offer') {
        peer.setRemoteDescription(new RTCSessionDescription(data.sdp)) //9999 Goi ham setRemoteDecription sau do goi createAnswer
          .then(() =>
            // {
            peer.createAnswer()

          )
          .then(answer => {
            peer.setLocalDescription(answer); //10 goi setLocalDescripttion
            console.log('answer::::answer answer answer answer ', answer);

          })
          .then(() => {

            /*
        
            var videoSourceId = data.from;
  
            mediaDevices.enumerateDevices().then(sourceInfos => {
            // console.log('mediaDevices.enumerateDevices:::', sourceInfos);
  
              let videoSourceId;
              // console.log('sourceInfos.length sourceInfos.length sourceInfos.length  v v sourceInfos.length', sourceInfos.length);
              for (let i = 0; i < sourceInfos.length; i++) {
               // console.log('sourceInfos sourceInfos 1111111111111111111111', sourceInfos);
                const sourceInfo = sourceInfos[i];
               // console.log('sourceInfos 11111111111111', sourceInfos);
                if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                  videoSourceId = sourceInfo.id;
                 // console.log('videoSourceId videoSourceId 11111111111111111 ', videoSourceId);
  
                }
              }
              videoConfig = {
                mandatory: {
                  minWidth: 240,
                  minHeight: 300,
                  minFrameRate: 30
                },
                facingMode: (isFront ? "user" : "environment"),
                optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
              }
              var remoteStreams = peer._remoteStreams;
             // console.log('_remoteStreams:::', remoteStreams);
              // e.setState({ _remoteStreams: peer._remoteStreams});
  
              var reactTag = remoteStreams[0].reactTag;
             // console.log('id::::::', reactTag);
              e.setState({
                remoteStreams: reactTag,
              });
  
           //   peer.addStream(reactTag);
  
            });
            */

          });



      }
      else if (data.sdp.type == 'answer') {
        console.log('(data.sdp == answer)', (data.sdp == 'answer'));
        peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }

    });

    /*
    this.socket.on('leave', function (socketId) {
      // leave(socketId);
      console.log('leave', socketId);
      const peer = pcPeers[socketId];
  //    const viewIndex = peer.viewIndex;
  //    peer.close();
      delete pcPeers[socketId];
   
      var  {remoteList} = this.state;
      delete remoteList[socketId];
      e.setState({ remoteList: remoteList });
      e.setState({ info: 'One peer leave!' });
    }); 
    */

    // const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    const peer = new RTCPeerConnection(configuration); //pc=peer

    let { isFront } = this.state;

    //  MediaStreamTrack.getSources(sourceInfos => {
    //  console.log('MediaStreamTrack.getSources:::',sourceInfos);
    // console.log('mediaDevices::::::::::', mediaDevices);
    mediaDevices.enumerateDevices().then(sourceInfos => {
      // console.log('mediaDevices.enumerateDevices:::', sourceInfos);

      let videoSourceId;
      //  console.log('sourceInfos.length sourceInfos.length sourceInfos.length  v v sourceInfos.length', sourceInfos.length);
      for (let i = 0; i < sourceInfos.length; i++) {
        // console.log('sourceInfos sourceInfos 0000000000000000000', sourceInfos);
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
          // console.log('videoSourceId 00000000000000000000 ', videoSourceId);

        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 100, // Provide your own width, height and frame rate here
            minHeight: 100,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      })
        .then(stream => {
          // Got stream!
          // console.log('stream:::::::', stream);
          // console.log('stream.toURL() stream.toURL() stream.toURL() stream.toURL():::::::', stream.toURL());

          e.setState({
            videoURL: stream.toURL(),
          });

          peer.addStream(stream);

          peer.createOffer().then(desc => { //7 CRAETEOffer
            // console.log('desc:createOffer().then:::', desc)
            peer.setLocalDescription(desc).then(() => { //8// setLocalDescription
              // Send pc.localDescription to peer
              // console.log('setLocalDescription', peer.localDescription);
              //  var dataEmitStream =  {'to': fromId, 'sdp': peer.localDescription };
              var dataEmitStream = { 'sdp': peer.localDescription, 'videoURL': this.state.videoURL };
              //    console.log('dataEmitStream:::::', dataEmitStream);
              this.socket.emit('exchange', dataEmitStream); //GUI CHO THANG M
              console.log('dataEmitStream: dataEmitStream dataEmitStream::::', dataEmitStream);

            });
          });

          peer.onicecandidate = function (event) {
            // send event.candidate to peer
            // console.log('event:pc.onicecandidate :::::', event);
            // console.log('onicecandidate', event.candidate);
            if (event.candidate) {
              // var dataexhange = {'to': socketId, 'candidate': event.candidate };
              var dataexhange = { 'candidate': event.candidate };
              //   this.socket.emit('exchange',dataexhange);
              //   console.log('dataexchange dataexhange dataexhange', dataexhange);
            }

          };

          //  console.log('peer peer peer peer::::::', peer)

          // console.log(' peer.addStream(stream)  peer.addStream(stream)::::::', peer.addStream(stream))

          //  console.log('this.state.videoURL:::::', this.state.videoURL);
        })
        .catch(error => {
          // Log error
        });
      /*
    //   const ctx = canvas.getContext('2d');
    //   ctx.fillStyle = 'purple';
    //   ctx.fillRect(0, 0, 100, 100);
    var canvas = document.getElementById("preview");
    var context = canvas.getContext('2d');
    //  var context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100)
    //  context.drawImage(video, 0, 0, 640, 480);
     
    e.setState({
      dataIma: canvas.toDataURL(),
    })
    */

    });



    mediaDevices.enumerateDevices().then(sourceInfos => {
      // console.log('mediaDevices.enumerateDevices:::', sourceInfos);

      let videoSourceId;
      //  console.log('sourceInfos.length sourceInfos.length sourceInfos.length  v v sourceInfos.length', sourceInfos.length);
      for (let i = 0; i < sourceInfos.length; i++) {
        //  console.log('sourceInfos sourceInfos 0000000000000000000', sourceInfos);
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
          //   console.log('videoSourceId 00000000000000000000 ', videoSourceId);

        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 300, // Provide your own width, height and frame rate here
            minHeight: 400,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      })
        .then(stream => {
          // Got stream!
          //  console.log('stream:::::::', stream);
          //  console.log('stream.toURL() stream.toURL() stream.toURL() stream.toURL():::::::', stream.toURL());

          e.setState({
            videoURL1: stream.toURL(),
          });

          peer.addStream(stream);

          peer.createOffer().then(desc => { //7 CRAETEOffer
            // console.log('desc:createOffer().then:::', desc)
            peer.setLocalDescription(desc).then(() => { //8// setLocalDescription
              // Send pc.localDescription to peer
              // console.log('setLocalDescription', peer.localDescription);
              //  var dataEmitStream =  {'to': fromId, 'sdp': peer.localDescription };
              var dataEmitStream = { 'sdp': peer.localDescription, 'videoURL': this.state.videoURL };
              //    console.log('dataEmitStream:::::', dataEmitStream);
              //   this.socket.emit('exchange', dataEmitStream); //GUI CHO THANG M
              //    console.log('dataEmitStream: dataEmitStream dataEmitStream::::', dataEmitStream);

            });
          });

          peer.onicecandidate = function (event) {
            // send event.candidate to peer
            // console.log('event:pc.onicecandidate :::::', event);
            //  console.log('onicecandidate', event.candidate);
            if (event.candidate) {
              // var dataexhange = {'to': socketId, 'candidate': event.candidate };
              var dataexhange = { 'candidate': event.candidate };
              //   this.socket.emit('exchange',dataexhange);
              //    console.log('dataexchange dataexhange dataexhange', dataexhange);
            }

          };

          //  console.log('peer peer peer peer::::::', peer)

          //  console.log(' peer.addStream(stream)  peer.addStream(stream)::::::', peer.addStream(stream))

          //  console.log('this.state.videoURL:::::', this.state.videoURL);
        })
        .catch(error => {
          // Log error
        });
    });


  }




  switchVideoType() {
    const isFront = !this.state.isFront;
    this.setState({ isFront });
    getLocalStream(isFront, function (stream) {
      if (localStream) {
        for (const id in pcPeers) {
          const peer = pcPeers[id];
          peer && peer.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      e.setState({ videoURL: stream.toURL() });

      for (const id in pcPeers) {
        const peer = pcPeers[id];
        peer && peer.addStream(localStream);
      }
    });
  }


  handleCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
  }

  componentDidMount() {

    //  this.socket = io('http://192.168.216.2:2800', { jsonp: false });

    //this.socket = io('http://192.168.29.2:2100', { jsonp: false });

    /*
    _press(event) {
      this.refs.roomID.blur();
      this.setState({status: 'connect', info: 'Connecting'});
      join(this.state.roomID);
    } */

    // join(this.state.roomID); ====  this.socket.emit('join', ..{});

    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')


  }

  render() {
    return (
      <View style={{ flex: 1, }} >

        { /*   <Canvas ref={this.handleCanvas} />
          */
        }

        < View style={{ flex: 4, }}>
          <View style={{ flex: 1, flexDirection: 'row' }} >
            <RTCView streamURL={this.state.videoURL} style={styles.selfView} />
            {/*   <RTCView streamURL={this.state.videoURL2} style={styles.selfView} /> */}
            <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView} />

          </View>

          <View style={{ flex: 1 }}>
            <RTCView streamURL={this.state.remoteStreams} style={styles.selfView} />
            <RTCView streamURL={this.state.videoURL1} style={styles.selfView1} />
          </View>


          { /*
          mapHash(this.state.remoteList, function(remote, index) {
            return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
          }) */
          }
        </View >


        <View style={{ flex: 1, }}>
          <Text>cmd</Text>
          <TouchableOpacity onPress={() => {
            this.switchVideoType();
          }}>
            <Text>cccamera0000</Text>
          </TouchableOpacity>
        </View>
      </View >

    );
  }
}

const styles = StyleSheet.create({
  selfView: {
    width: 100,
    height: 100,

  },
  selfView1: {
    width: 300,
    height: 400,

  },
  remoteView: {
    width: 200,
    height: 150,
  },
});










/*

const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

const pcPeers = {};
let localStream;

function getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    MediaStreamTrack.getSources(sourceInfos => {
      console.log("sourceInfos: ", sourceInfos);

      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }
  getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640, // Provide your own width, height and frame rate here
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
    }
  }, function (stream) {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, logError);
}

function join(roomID) {
  socket.emit('join', roomID, function(socketIds){
    console.log('join', socketIds);
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  });
}

function createPC(socketId, isOffer) {
  const pc = new RTCPeerConnection(configuration);
  pcPeers[socketId] = pc;

  pc.onicecandidate = function (event) {
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    pc.createOffer(function(desc) {
      console.log('createOffer', desc);
      pc.setLocalDescription(desc, function () {
        console.log('setLocalDescription', pc.localDescription);
        socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
      }, logError);
    }, logError);
  }

  pc.onnegotiationneeded = function () {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }

  pc.oniceconnectionstatechange = function(event) {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };
  pc.onsignalingstatechange = function(event) {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  pc.onaddstream = function (event) {
    console.log('onaddstream', event.stream);
    container.setState({info: 'One peer join!'});

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList: remoteList });
  };
  pc.onremovestream = function (event) {
    console.log('onremovestream', event.stream);
  };

  pc.addStream(localStream);
  function createDataChannel() {
    if (pc.textDataChannel) {
      return;
    }
    const dataChannel = pc.createDataChannel("text");

    dataChannel.onerror = function (error) {
      console.log("dataChannel.onerror", error);
    };

    dataChannel.onmessage = function (event) {
      console.log("dataChannel.onmessage:", event.data);
      container.receiveTextData({user: socketId, message: event.data});
    };

    dataChannel.onopen = function () {
      console.log('dataChannel.onopen');
      container.setState({textRoomConnected: true});
    };

    dataChannel.onclose = function () {
      console.log("dataChannel.onclose");
    };

    pc.textDataChannel = dataChannel;
  }
  return pc;
}

function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function(desc) {
          console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            console.log('setLocalDescription', pc.localDescription);
            socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  console.log('leave', socketId);
  const pc = pcPeers[socketId];
  const viewIndex = pc.viewIndex;
  pc.close();
  delete pcPeers[socketId];

  const remoteList = container.state.remoteList;
  delete remoteList[socketId]
  container.setState({ remoteList: remoteList });
  container.setState({info: 'One peer leave!'});
}

socket.on('exchange', function(data){
  exchange(data);
});
socket.on('leave', function(socketId){
  leave(socketId);
});

socket.on('connect', function(data) {
  console.log('connect');
  getLocalStream(true, function(stream) {
    localStream = stream;
    container.setState({selfViewSrc: stream.toURL()});
    container.setState({status: 'ready', info: 'Please enter or create room ID'});
  });
});

function logError(error) {
  console.log("logError", error);
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}

function getStats() {
  const pc = pcPeers[Object.keys(pcPeers)[0]];
  if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    console.log('track', track);
    pc.getStats(track, function(report) {
      console.log('getStats report', report);
    }, logError);
  }
}

let container;

const RCTWebRTCDemo = React.createClass({
  getInitialState: function() {
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
    return {
      info: 'Initializing',
      status: 'init',
      roomID: '',
      isFront: true,
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
    };
  },
  componentDidMount: function() {
    container = this;
  },
  _press(event) {
    this.refs.roomID.blur();
    this.setState({status: 'connect', info: 'Connecting'});
    join(this.state.roomID);
  },
  _switchVideoType() {
    const isFront = !this.state.isFront;
    this.setState({isFront});
    getLocalStream(isFront, function(stream) {
      if (localStream) {
        for (const id in pcPeers) {
          const pc = pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      container.setState({selfViewSrc: stream.toURL()});

      for (const id in pcPeers) {
        const pc = pcPeers[id];
        pc && pc.addStream(localStream);
      }
    });
  },
  receiveTextData(data) {
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push(data);
    this.setState({textRoomData, textRoomValue: ''});
  },
  _textRoomPress() {
    if (!this.state.textRoomValue) {
      return
    }
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push({user: 'Me', message: this.state.textRoomValue});
    for (const key in pcPeers) {
      const pc = pcPeers[key];
      pc.textDataChannel.send(this.state.textRoomValue);
    }
    this.setState({textRoomData, textRoomValue: ''});
  },
  _renderTextRoom() {
    return (
      <View style={styles.listViewContainer}>
        <ListView
          dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
          renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
          />
        <TextInput
          style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
          onChangeText={value => this.setState({textRoomValue: value})}
          value={this.state.textRoomValue}
        />
        <TouchableHighlight
          onPress={this._textRoomPress}>
          <Text>Send</Text>
        </TouchableHighlight>
      </View>
    );
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.info}
        </Text>
        {this.state.textRoomConnected && this._renderTextRoom()}
        <View style={{flexDirection: 'row'}}>
          <Text>
            {this.state.isFront ? "Use front camera" : "Use back camera"}
          </Text>
          <TouchableHighlight
            style={{borderWidth: 1, borderColor: 'black'}}
            onPress={this._switchVideoType}>
            <Text>Switch camera</Text>
          </TouchableHighlight>
        </View>
        { this.state.status == 'ready' ?
          (<View>
            <TextInput
              ref='roomID'
              autoCorrect={false}
              style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({roomID: text})}
              value={this.state.roomID}
            />
            <TouchableHighlight
              onPress={this._press}>
              <Text>Enter room</Text>
            </TouchableHighlight>
          </View>) : null
        }
        <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView}/>
        {
          mapHash(this.state.remoteList, function(remote, index) {
            return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
          })
        }
      </View>
    );
  }
});

const styles = StyleSheet.create({
  selfView: {
    width: 200,
    height: 150,
  },
  remoteView: {
    width: 200,
    height: 150,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
  },
});

AppRegistry.registerComponent('RCTWebRTCDemo', () => RCTWebRTCDemo);


*/


/*
    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    const peer = new RTCPeerConnection(configuration); //pc=peer

    let {isFront} = this.state;
  
   //  MediaStreamTrack.getSources(sourceInfos => {
    //  console.log('MediaStreamTrack.getSources:::',sourceInfos);
    mediaDevices.enumerateDevices().then(sourceInfos => {
    console.log('mediaDevices.enumerateDevices:::',sourceInfos);
    
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      })
        .then(stream => {
          // Got stream!
          console.log('stream:::::::', stream);

          this.setState({
            videoURL: stream.toURL(),
          });
          peer.addStream(stream);

          console.log('pc::::::', peer)

          console.log('this.state.videoURL:::::', this.state.videoURL);
        })
        .catch(error => {
          // Log error
        });
    });

    peer.createOffer().then(desc => {
      console.log('desc:createOffer().then:::',desc)
      peer.setLocalDescription(desc).then(() => {
        // Send pc.localDescription to peer
      });
    });

    peer.onicecandidate = function (event) {
      // send event.candidate to peer
      console.log('event:pc.onicecandidate :::::', event);
    };

    */


/*
componentDidMount() {
  const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
  const peer = new RTCPeerConnection(configuration); //pc=peer

  let { isFront } = this.state;

  //  MediaStreamTrack.getSources(sourceInfos => {
  //  console.log('MediaStreamTrack.getSources:::',sourceInfos);
  mediaDevices.enumerateDevices().then(sourceInfos => {
    console.log('mediaDevices.enumerateDevices:::', sourceInfos);

    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
        videoSourceId = sourceInfo.id;
      }
    }
    mediaDevices.getUserMedia({
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30
        },
        facingMode: (isFront ? "user" : "environment"),
        optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
      }
    })
      .then(stream => {
        // Got stream!
        console.log('stream:::::::', stream);

        this.setState({
          videoURL: stream.toURL(),
        });

        peer.addStream(stream);

        console.log('peer peer peer peer::::::', peer)

        console.log('this.state.videoURL:::::', this.state.videoURL);
      })
      .catch(error => {
        // Log error
      });
  });

  peer.createOffer().then(desc => {
   // console.log('desc:createOffer().then:::', desc)
    peer.setLocalDescription(desc).then(() => {
      // Send pc.localDescription to peer
    });
  });

  peer.onicecandidate = function (event) {
    // send event.candidate to peer
   // console.log('event:pc.onicecandidate :::::', event);
  };
}
*/



/*
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

const pcPeers = {};
let localStream;

function getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    MediaStreamTrack.getSources(sourceInfos => {
      console.log("sourceInfos: ", sourceInfos);

      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }
  getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640, // Provide your own width, height and frame rate here
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
    }
  }, function (stream) {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, logError);
}

function join(roomID) {
  socket.emit('join', roomID, function (socketIds) {
    console.log('join', socketIds);
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  });
}

function createPC(socketId, isOffer) {
  const pc = new RTCPeerConnection(configuration);
  pcPeers[socketId] = pc;

  pc.onicecandidate = function (event) {
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.emit('exchange', { 'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    pc.createOffer(function (desc) {
      console.log('createOffer', desc);
      pc.setLocalDescription(desc, function () {
        console.log('setLocalDescription', pc.localDescription);
        socket.emit('exchange', { 'to': socketId, 'sdp': pc.localDescription });
      }, logError);
    }, logError);
  }

  pc.onnegotiationneeded = function () {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }

  pc.oniceconnectionstatechange = function (event) {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };
  pc.onsignalingstatechange = function (event) {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  pc.onaddstream = function (event) {
    console.log('onaddstream', event.stream);
    container.setState({ info: 'One peer join!' });

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList: remoteList });
  };
  pc.onremovestream = function (event) {
    console.log('onremovestream', event.stream);
  };

  pc.addStream(localStream);
  function createDataChannel() {
    if (pc.textDataChannel) {
      return;
    }
    const dataChannel = pc.createDataChannel("text");

    dataChannel.onerror = function (error) {
      console.log("dataChannel.onerror", error);
    };

    dataChannel.onmessage = function (event) {
      console.log("dataChannel.onmessage:", event.data);
      container.receiveTextData({ user: socketId, message: event.data });
    };

    dataChannel.onopen = function () {
      console.log('dataChannel.onopen');
      container.setState({ textRoomConnected: true });
    };

    dataChannel.onclose = function () {
      console.log("dataChannel.onclose");
    };

    pc.textDataChannel = dataChannel;
  }
  return pc;
}


function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function(desc) {
          console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            console.log('setLocalDescription', pc.localDescription);
            socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  console.log('leave', socketId);
  const pc = pcPeers[socketId];
  const viewIndex = pc.viewIndex;
  pc.close();
  delete pcPeers[socketId];

  const remoteList = container.state.remoteList;
  delete remoteList[socketId]
  container.setState({ remoteList: remoteList });
  container.setState({info: 'One peer leave!'});
}

socket.on('exchange', function(data){
  exchange(data);
});
socket.on('leave', function(socketId){
  leave(socketId);
});

socket.on('connect', function(data) {
  console.log('connect');
  getLocalStream(true, function(stream) {
    localStream = stream;
    container.setState({selfViewSrc: stream.toURL()});
    container.setState({status: 'ready', info: 'Please enter or create room ID'});
  });
});

function logError(error) {
  console.log("logError", error);
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}

function getStats() {
  const pc = pcPeers[Object.keys(pcPeers)[0]];
  if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    console.log('track', track);
    pc.getStats(track, function(report) {
      console.log('getStats report', report);
    }, logError);
  }
}

let container;
*/



/*


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
  Platform,
} from 'react-native';


import io from 'socket.io-client/dist/socket.io.js';

// const socket = io.connect('https://react-native-webrtc.herokuapp.com', {transports: ['websocket']});

//yarn add react-native-socket.io-client //  yarn add socket.io-client
//yarn add react-native-socket.io-client// yarn add socket.io-client

const socket = io.connect('https://192.168.29.2', { jsonp: false });

import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

//const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

const pcPeers = {};
let localStream;

function getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    MediaStreamTrack.getSources(sourceInfos => {
      console.log("sourceInfos: ", sourceInfos);

      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }
  getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640, // Provide your own width, height and frame rate here
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
    }
  }, function (stream) {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, logError);
}

function join(roomID) {
  socket.emit('join', roomID, function (socketIds) {
    console.log('join', socketIds);
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  });
}

function createPC(socketId, isOffer) {
  const pc = new RTCPeerConnection(configuration);
  pcPeers[socketId] = pc;

  pc.onicecandidate = function (event) {
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.emit('exchange', { 'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    pc.createOffer(function (desc) {
      console.log('createOffer', desc);
      pc.setLocalDescription(desc, function () {
        console.log('setLocalDescription', pc.localDescription);
        socket.emit('exchange', { 'to': socketId, 'sdp': pc.localDescription });
      }, logError);
    }, logError);
  }

  pc.onnegotiationneeded = function () {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }

  pc.oniceconnectionstatechange = function (event) {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };
  pc.onsignalingstatechange = function (event) {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  pc.onaddstream = function (event) {
    console.log('onaddstream', event.stream);
    container.setState({ info: 'One peer join!' });

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList: remoteList });
  };
  pc.onremovestream = function (event) {
    console.log('onremovestream', event.stream);
  };

  pc.addStream(localStream);
  function createDataChannel() {
    if (pc.textDataChannel) {
      return;
    }
    const dataChannel = pc.createDataChannel("text");

    dataChannel.onerror = function (error) {
      console.log("dataChannel.onerror", error);
    };

    dataChannel.onmessage = function (event) {
      console.log("dataChannel.onmessage:", event.data);
      container.receiveTextData({ user: socketId, message: event.data });
    };

    dataChannel.onopen = function () {
      console.log('dataChannel.onopen');
      container.setState({ textRoomConnected: true });
    };

    dataChannel.onclose = function () {
      console.log("dataChannel.onclose");
    };

    pc.textDataChannel = dataChannel;
  }
  return pc;
}

function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function (desc) {
          console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            console.log('setLocalDescription', pc.localDescription);
            socket.emit('exchange', { 'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  console.log('leave', socketId);
  const pc = pcPeers[socketId];
  const viewIndex = pc.viewIndex;
  pc.close();
  delete pcPeers[socketId];

  const remoteList = container.state.remoteList;
  delete remoteList[socketId]
  container.setState({ remoteList: remoteList });
  container.setState({ info: 'One peer leave!' });
}

socket.on('exchange', function (data) {
  exchange(data);
});
socket.on('leave', function (socketId) {
  leave(socketId);
});

socket.on('connect', function (data) {
  console.log('connect');
  getLocalStream(true, function (stream) {
    localStream = stream;
    container.setState({ selfViewSrc: stream.toURL() });
    container.setState({ status: 'ready', info: 'Please enter or create room ID' });
  });
});

function logError(error) {
  console.log("logError", error);
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}

function getStats() {
  const pc = pcPeers[Object.keys(pcPeers)[0]];
  if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    console.log('track', track);
    pc.getStats(track, function (report) {
      console.log('getStats report', report);
    }, logError);
  }
}

let container;



export default class RCTWebRTCDemo extends Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });

    this.state = {
      info: 'Initializing',
      status: 'init',
      roomID: '',
      isFront: true,
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
    }
  }

  componentDidMount() {
    container = this;
  }
  _press(event) {
    this.refs.roomID.blur();
    this.setState({ status: 'connect', info: 'Connecting' });
    join(this.state.roomID);
  }
  _switchVideoType() {
    //  const isFront = !(this.state.isFront);
    let { isFront } = this.state;
  //  this.setState({ isFront: isFront });
    getLocalStream(isFront, function (stream) {
      if (localStream) {
        for (const id in pcPeers) {
          const pc = pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      container.setState({ selfViewSrc: stream.toURL() });

      for (const id in pcPeers) {
        const pc = pcPeers[id];
        pc && pc.addStream(localStream);
      }
    });
  }
  receiveTextData(data) {
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push(data);
    this.setState({ textRoomData, textRoomValue: '' });
  }
  _textRoomPress() {
    if (!this.state.textRoomValue) {
      return
    }
    const textRoomData = this.state.textRoomData.slice();
    textRoomData.push({ user: 'Me', message: this.state.textRoomValue });
    for (const key in pcPeers) {
      const pc = pcPeers[key];
      pc.textDataChannel.send(this.state.textRoomValue);
    }
    this.setState({ textRoomData, textRoomValue: '' });
  }
  _renderTextRoom() {
    return (
      <View style={styles.listViewContainer}>
        <ListView
          dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
          renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
        />
        <TextInput
          style={{ width: 200, height: 30, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={value => this.setState({ textRoomValue: value })}
          value={this.state.textRoomValue}
        />
        <TouchableHighlight
          onPress={this._textRoomPress}>
          <Text>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.info}
        </Text>
        {this.state.textRoomConnected && this._renderTextRoom()}
        <View style={{ flexDirection: 'row' }}>
          <Text>
            {this.state.isFront ? "Use front camera" : "Use back camera"}
          </Text>
          <TouchableHighlight
            style={{ borderWidth: 1, borderColor: 'black' }}
            onPress={() =>{ this._switchVideoType() }}>
            <Text>Switch camera</Text>
          </TouchableHighlight>
        </View>
        {this.state.status == 'ready' ?
          (<View>
            <TextInput
              ref='roomID'
              autoCorrect={false}
              style={{ width: 200, height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.setState({ roomID: text })}
              value={this.state.roomID}
            />
            <TouchableHighlight
              onPress={this._press}>
              <Text>Enter room</Text>
            </TouchableHighlight>
          </View>) : null
        }
        <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView} />
        {
          mapHash(this.state.remoteList, function (remote, index) {
            return <RTCView key={index} streamURL={remote} style={styles.remoteView} />
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selfView: {
    width: 200,
    height: 150,
  },
  remoteView: {
    width: 200,
    height: 150,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
  },
});

*/