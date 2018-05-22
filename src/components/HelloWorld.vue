<template>
    <div class="hello">

        <div id="video-container"></div>

        ты хуй

    </div>
</template>

<script>
  /* eslint-disable */
  // import OpenVidu from 'openvidu-browser';
  import * as OV from 'openvidu-browser';

  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    mounted() {
      let vidi = new OV.OpenVidu();

      const publisher = vidi.initPublisher('video-container', {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: undefined, // The source of video. If undefined default webcam
        publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
        publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
        resolution: '640x480',  // The resolution of your video
        frameRate: 30,			// The frame rate of your video
        insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
        mirror: false       	// Whether to mirror your local video or not
      });

      const recorder = vidi.initLocalRecorder(publisher.stream);

      setTimeout(() => {
        recorder.record();
      }, 1500);

      setTimeout(() => {
        recorder.stop().then(() => {
          const recordingPreview = recorder.preview('video-container');
          recordingPreview.controls = true;
        });
      }, 5000);

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    h3 {
        margin: 40px 0 0;
        color: rebeccapurple;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>

<!--let session = vidi.initSession();-->
<!--// const backendURL = 'https://46.101.110.5:5000';-->
<!--const backendURL = 'https://' + location.hostname + ':4443';-->
<!--fetch(`${backendURL}/api/sessions`, {-->
<!--method: 'post',-->
<!--headers: new Headers({-->
<!--'Authorization': 'Basic ' + btoa('OPENVIDUAPP:MY_SECRET'),-->
<!--'Content-Type': 'application/json'-->
<!--}),-->
<!--body: JSON.stringify({customSessionId: 'SessionA'})-->
<!--}).then(res => res.json());-->

<!--const BACK_SESSION = 'SessionA';-->

<!--const createToken = (session) => {-->

<!--};-->
