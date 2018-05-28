<template>
    <div class="video-container-wrap">
        <div ref="video-recorder" class="video-container"></div>
        <div ref="video-preview" class="video-container"></div>

        <!--<div class="max-duration-counter">-->
        <!--<slot v-if="isRecording"></slot>-->
        <!--<slot v-if="!isRecording"></slot>-->
        <!--</div>-->

        <div class="video-controls">
            <el-button v-if="!isRecording && !answered" @click="startRecording" type="text">
                <span class="recorder-icon start-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path
                            d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z" /></svg>
                </span>
                Начать запись
                ({{ readableDuration(durationMax) }})
            </el-button>
            <el-button v-if="isRecording" @click="stopRecording" type="danger">
                <span class="recorder-icon stop-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path
                            d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" /></svg>
                    <!--<img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDMwNiAzMDYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMwNiAzMDY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0ic3RvcCI+CgkJPHJlY3Qgd2lkdGg9IjMwNiIgaGVpZ2h0PSIzMDYiIGZpbGw9IiNmNTZjNmMiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />-->
                </span>

                Закончить запись ({{ readableDuration(timeLeft) }})
            </el-button>
        </div>
    </div>

</template>

<script>
  /* eslint-disable */
  import * as OV from 'openvidu-browser';
  import { parseMillisecondsIntoReadableTime } from '../utils';
  import { Recordings } from '../../src/api';

  const VIDU = new OV.OpenVidu();

  export default {
    name: 'VideoContainer',
    props: {
      'durationMax': {
        type: Number
      },
      'respondId': {
        type: String
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
        recordInterval: null,
        isRecording: false,
        answered: false,
        timeLeft: 0
      };
    },

    computed: {},
    mounted() {
      this.initPublisher();
      this.initRecorder();
    },

    created() {
    },

    methods: {
      initPublisher() {
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
      },
      initRecorder() {
        this.recorder = VIDU.initLocalRecorder(this.publisher.stream);
      },
      readableDuration(ms) {
        return parseMillisecondsIntoReadableTime(ms);
      },

      startRecording() {
        this.recorder.record();
        this.isRecording = true;
        this.timeLeft = this.durationMax;

        this.recordInterval = setInterval(() => {
          this.timeLeft -= 1000;
        }, 1000);

        this.recordTimeout = setTimeout(() => {
          this.stopRecording();

        }, this.durationMax);
      },

      stopRecording() {
        this.recordInterval = clearInterval(this.recordInterval);
        this.recordTimeout = clearTimeout(this.recordTimeout);

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
        Recordings.upload(videoFile, this.respondId, this.questionId);
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
        width: 50%;
        text-align: center;
    }

    .recorder-icon {
        font-size: 0;
        display: inline-block;
        vertical-align: baseline;

        svg {
            height: 17px;
        }

        &.stop-icon {
            background-color: #fff;
            fill: #f56c6c;
            border-radius: 50%;
            padding: 4px;


            svg {
                width: 12px;
                height: 12px;
            }
        }
    }

    video {
        max-width: 100%;
    }

    .max-duration-counter {
        position: absolute;
        font-size: 1.5rem;

    }
</style>
