<template>
    <div class="video-container-wrap">
        <div ref="video-recorder" class="video-container"></div>
        <div ref="video-preview" class="video-container"></div>

        <!--<div class="max-duration-counter">-->
        <!--<slot v-if="isRecording"></slot>-->
        <!--<slot v-if="!isRecording"></slot>-->
        <!--</div>-->

        <div class="video-controls">
            <el-button class="record-button" v-if="!isRecording && !answered && readyToRecord" @click="startRecording">
                <i class="icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <circle id="a" cx="11" cy="11" r="11"></circle>
                            <mask id="b" x="0" y="0" width="22" height="22" fill="#fff">
                                <use xlink:href="#a"></use>
                            </mask>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <use stroke="#CCC" mask="url(#b)" stroke-width="2" xlink:href="#a"></use>
                            <circle fill="#F66" cx="11" cy="11" r="8"></circle>
                            <circle fill="#FFF" cx="13.5" cy="8.5" r="1.5"></circle>
                        </g>
                    </svg>
                </i>
                <span>Начать запись ({{ readableDuration(durationMax) }})</span>
            </el-button>

            <el-button class="record-button" v-if="isRecording && readyToRecord" @click="stopRecording" type="danger">
                <i class="icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <circle fill="#FFF" cx="11" cy="11" r="11"></circle>
                            <rect fill="#F66" x="5" y="5" width="12" height="12" rx="1"></rect>
                        </g>
                    </svg>
                </i>
                <span>Закончить запись ({{ readableDuration(timeLeft) }})</span>
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
      },
      'startRecorder': {
        type: Boolean
      },
      'readyToRecord': {
        type: Boolean
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
      console.log('video contaioner created');
    },
    beforeDestroy() {
      console.log('video contaioner beforeDestroy');
      this.recorder.clean();
      this.publisher = null;
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
        this.$emit('recording-started');

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
          this.answered = true;
          // this.showPreview();
          this.saveRecord()
            .then(() => {
              console.log('saved');
              this.$emit('recording-finished');
            });
        });
      },

      saveRecord() {
        const videoFile = new FormData();
        videoFile.append('file', this.recorder.blob, this.recorder.id + '.webm');
        return Recordings.upload(videoFile, this.respondId, this.questionId);
      },

      showPreview() {
        const recordingPreview = this.recorder.preview(this.$refs['video-preview']);
        recordingPreview.autoplay = false;
        recordingPreview.controls = true;
      }
    },
    watch: {
      startRecorder(oldValue) {
        if (oldValue && !this.isRecording) {
          this.startRecording();
        }
      }
    }
  };
</script>

<style lang="scss">
    .video-container-wrap {
        width: 50%;
        text-align: center;

        .video-container {
            margin-bottom: .5rem;
        }
    }

    .record-button {
        stroke: #fff;
        fill: #fff;

        .icon {
            margin-right: 4px;
            vertical-align: middle;

            svg {
                position: relative;
                top: 2px;
            }
        }

        span {
            font-size: 18px;
            line-height: 17px;
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
