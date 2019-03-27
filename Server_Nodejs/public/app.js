var n = 10;
console.log(n)
var Peer = require('simple-peer')
var p = new Peer({ initiator: location.hash === '#1', trickle: false })
console.log(p);
