import React, { useRef, useEffect } from 'react';
import { observer } from 'helpers';
import { useSocket, useStore } from 'helpers/hooks';

const PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
const SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

export default observer(function Call({ peerConnection, toUser }) {
  const user = useStore('user');
  const chats = useSocket('chats', { userId: user.data._id });
  const refAudioLocal = useRef(null);
  const refAudioRemote = useRef(null);

  useEffect(()=> {
    navigator.getUserMedia({ audio: true, video: false },
      gotStream,
      err=> console.log(err));

    function gotStream(stream) {
      peerConnection.current = new PeerConnection(null);

      // add local stream
      peerConnection.current.addStream(stream);
      refAudioLocal.current.srcObject = stream;

      // add remote stream
      peerConnection.current.onaddstream = e=> {
        refAudioRemote.current.srcObject = e.stream;
      };

      peerConnection.current.onicecandidate = e=> {
        if (e.candidate) {
          chats.ws.send(JSON.stringify({
            type: 'call-candidate',
            toUserId: toUser._id,
            data: {
              type: 'candidate',
              id: e.candidate.sdpMid,
              label: e.candidate.sdpMLineIndex,
              candidate: e.candidate.candidate
            }
          }));
        }
      };

      createOffer();
    }
  }, []);

  // WebSocket
  function createOffer() {
    peerConnection.current.createOffer(gotLocalDescription,
      err=> console.log(err),
      { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: false } });
  }

  function gotLocalDescription(description) {
    peerConnection.current.setLocalDescription(description);
    chats.ws.send(JSON.stringify({
      type: `call-${description.type}`,
      toUserId: toUser._id,
      data: description
    }));
  }

  chats.ws.addEventListener('message', message=> {
    const _data = JSON.parse(message.data);

    if (_data.type === 'offer') {
      peerConnection.current.setRemoteDescription(new SessionDescription(_data));
      peerConnection.current.createAnswer(gotLocalDescription,
        err=> console.log(err),
        { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: false } });
    }

    if (_data.type === 'answer') {
      peerConnection.current.setRemoteDescription(new SessionDescription(_data));
    }

    if (_data.type === 'candidate') {
      peerConnection.current.addIceCandidate(new IceCandidate({
        sdpMLineIndex: _data.label,
        candidate: _data.candidate
      }));
    }
  });

  return (
    <>
      <audio ref={refAudioLocal} autoPlay muted />
      <audio ref={refAudioRemote} autoPlay />
    </>
  );
});
