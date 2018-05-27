<template>
    <div class="video-container-wrap">
        <div ref="video-recorder" class="video-container"></div>
        <div ref="video-preview" class="video-container"></div>
        <div class="video-controls">
            {{ durationMax / 1000 }} сек.
            <el-button v-if="!isRecording && !answered" @click="startRecording" type="primary">Начать запись</el-button>
            <el-button v-if="isRecording" @click="stopRecording" type="primary">Закончить запись</el-button>
        </div>
    </div>

</template>

<script>
  /* eslint-disable */
  import * as OV from 'openvidu-browser';
  import { Recordings } from '../../src/api';

  const VIDU = new OV.OpenVidu();

  export default {
    name: 'VideoContainer',
    props: {
      'durationMax': {
        type: Number
      },
      'questionId': {
        type: Number
      }
    },
    data() {
      return {
        publisher: {},
        recorder: {},
        recordTimeout: null,
        isRecording: false,
        answered: false
      };
    },
    mounted() {

      this.publisher = VIDU.initPublisher(this.$refs['video-recorder'], {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: undefined, // The source of video. If undefined default webcam
        publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
        publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
        resolution: '640x480',  // The resolution of your video
        frameRate: 30,			// The frame rate of your video
        insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
        mirror: false       	// Whether to mirror your local video or not
      });

      this.recorder = VIDU.initLocalRecorder(this.publisher.stream);
    },

    methods: {
      startRecording() {
        this.recorder.record();
        this.isRecording = true;

        this.recordTimeout = setTimeout(() => {
          this.stopRecording();
          clearTimeout(this.recordTimeout);
        }, this.durationMax);
      },

      stopRecording() {
        clearTimeout(this.recordTimeout);
        this.recorder.stop().then(() => {
          this.isRecording = false;
          this.$refs['video-recorder'].innerHTML = '';
          this.showPreview();
          this.saveRecord();
          this.answered = true;
        });
      },

      saveRecord() {
        const videoFile = new FormData();
        videoFile.append('file', this.recorder.blob, this.recorder.id + '.webm');
        Recordings.upload(videoFile, this.questionId);
      },

      showPreview() {
        const recordingPreview = this.recorder.preview(this.$refs['video-preview']);
        recordingPreview.controls = true;
      }
    }
  };
</script>

<style lang="scss">
    .video-container-wrap {
        float: right;
    }

    video {
        border: 4px solid rebeccapurple;
    }
</style>
