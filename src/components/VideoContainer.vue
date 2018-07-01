<template>
    <div class="video-container-wrap">
        <div ref="video-recorder" class="video-container">
            <div class="status-recording-icon" v-if="isRecording"></div>
            <div class="status-saving-icon" v-if="savingInProgress">
                <svg width="74px" height="74px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"
                     class="lds-infinity">
                    <path fill="none"
                          d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z"
                          stroke="#ff7c81" stroke-width="7" stroke-dasharray="159.08513549804687 97.50379272460938">
                        <animate attributeName="stroke-dashoffset" calcMode="linear" values="0;256.58892822265625" keyTimes="0;1" dur="1"
                                 begin="0s" repeatCount="indefinite"></animate>
                    </path>
                </svg>
            </div>
        </div>
        <div ref="video-preview" class="video-container"></div>

        <div class="video-controls">
            <el-button class="record-button" v-if="!isRecording && readyToRecord && !savingInProgress" @click="startRecording">
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
        savingInProgress: false,
        timeLeft: 0
      };
    },

    computed: {},
    mounted() {
      this.initPublisher();
      this.initRecorder();
    },

    created() {
      console.log('video container created');
    },
    beforeDestroy() {
      console.log('video container beforeDestroy');
      this.recorder.clean();

      const streamTracks = this.publisher.stream.getMediaStream().getTracks();
      streamTracks.forEach(track => {
        track.stop();
      });

    },

    methods: {
      initPublisher() {
        this.publisher = VIDU.initPublisher(this.$refs['video-recorder'], {
          audioSource: undefined, // The source of audio. If undefined default microphone
          videoSource: undefined, // The source of video. If undefined default webcam
          publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
          publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
          resolution: '480x360',  // The resolution of your video
          frameRate: 14,			// The frame rate of your video
          insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
          mirror: false       	// Whether to mirror your local video or not
        }, () => {
          const videoEl = this.$refs['video-recorder'].querySelector('video');
          if (videoEl) {
            videoEl.setAttribute('playsinline', '');
          }
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
        console.log('recorder.state before stop', this.recorder.state);

        this.recordInterval = clearInterval(this.recordInterval);
        this.recordTimeout = clearTimeout(this.recordTimeout);

        this.recorder.stop()
          .then(() => {
            console.log('recorder.state after stop', this.recorder.state);
            this.isRecording = false;
            // this.$refs['video-recorder'].innerHTML = '';
            // this.showPreview();
            this.savingInProgress = true;
            this.saveRecord()
              .then(() => {
                console.log('saved');
                this.savingInProgress = false;
                this.recorder.clean();
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
      },
      questionId(newVal, oldValue) {
        this.initRecorder();
      }
    }
  };
</script>

<style lang="scss">
    .video-container-wrap {
        width: 40%;
        text-align: center;

        .video-container {
            position: relative;
            margin-bottom: .5rem;
        }

        .video-controls {
            min-height: 50px;
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
        width: 100%;
    }

    .max-duration-counter {
        position: absolute;
        font-size: 1.5rem;
    }

    .status-recording-icon {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 1rem;
        top: 1rem;
        border-radius: 50%;
        background-color: #fc3636;
        animation: 1.5s infinite fade-in;
    }

    .status-saving-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(148, 148, 148, 0.52);

        svg {
            width: 40%;
            height: 40%;
            top: 50%;
            position: relative;
            transform: translateY(-50%);
        }
    }

    @media screen and (max-width: 768px) {
        .video-container-wrap .video-container {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            width: 40%;
        }
    }
</style>
