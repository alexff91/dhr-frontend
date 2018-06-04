<template>
    <div class="questionnaire">
        <div class="questions-counter">
            Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}
        </div>


        <!--{{currentQuestion}}-->
        <div class="question-row">

            <div class="question-col">


                <!--<div class="read-duration-counter" v-if="isDurationCounterVisible && !timeToReadInterval">-->
                <!--{{ readableDuration(this.currentQuestion.durationToRead) }}-->
                <!--</div>-->

                <div v-if="isQuestionHidden">
                    <div class="message-block">
                        <i class="el-message__icon el-icon-info"></i>
                        <p>Время на подготовку к вопросу ограничено.<br>Запись начнется автоматически через
                            {{readableDuration(this.currentQuestion.durationToRead) }}. Ответ нельзя будет
                            перезаписать. Вы готовы?</p>
                    </div>

                    <el-button class="show-question-button" @click="showQuestion()">
                        Да, показать вопрос
                    </el-button>
                </div>


                <div v-if="!isQuestionHidden" class="message-block message-block-warning el-message--warning">
                    <i class="el-message__icon el-icon-question"></i>
                    <p>{{ currentQuestion.question }}</p>
                </div>


                <div class="autorecord-info" v-if="isDurationCounterVisible && timeToReadInterval">
                    Запись начнется автоматически через {{ readableDuration(durationToReadLeft) }}
                </div>

                <!--<el-button @click="setQuestionIndex(currentQuestionIndex+1)">Следующий вопрос</el-button>-->
                <!--v-if="isQuestionAnswered"-->
            </div>


            <VideoContainer :durationMax="currentQuestion.durationMax"
                            :questionId="currentQuestion.id"
                            :respondId="respondId"
                            :startRecorder="startRecorder"
                            :readyToRecord="!isQuestionHidden"
                            v-on:recording-finished="setQuestionIndex(currentQuestionIndex+1)"
                            v-on:recording-started="isDurationCounterVisible = false"
            ></VideoContainer>

        </div>
    </div>
</template>

<script>

  import { parseMillisecondsIntoReadableTime } from '../utils';
  import VideoContainer from './VideoContainer';

  export default {
    name: 'Questionnaire',
    components: {VideoContainer},
    props: {
      'questions': {
        type: Array,
        default: function() {
          return [];
        }
      },
      'respondId': {
        type: String,
        default: null
      },
      'respondQuestions': {
        type: Array,
        default: function() {
          return [];
        }
      }
    },
    data() {
      return {
        currentQuestion: {},
        isQuestionHidden: true,
        isDurationCounterVisible: true,
        startRecorder: false,
        timeToReadInterval: null,
        timeToReadTimeout: null,
        durationToReadLeft: 0
      };
    },
    computed: {
      currentQuestionIndex() {
        return this.questions.indexOf(this.currentQuestion);
      },
      isQuestionAnswered() {
        return this.respondQuestions.includes(this.currentQuestion);
      }
      // isQuestionHidden() {
      //   return !!this.currentQuestion.durationToRead;
      // }
    },
    methods: {
      initQuestionState() {
        this.durationToReadLeft = 0;
        this.isQuestionHidden = true;
        this.isDurationCounterVisible = true;
        this.startRecorder = false;
        this.timeToReadInterval = clearInterval(this.timeToReadInterval);
        this.timeToReadTimeout = clearTimeout(this.timeToReadTimeout);

        if (this.isQuestionAnswered || !this.currentQuestion.durationToRead) {
          this.isQuestionHidden = false;
        }
      },

      readableDuration(ms) {
        return parseMillisecondsIntoReadableTime(ms);
      },

      setQuestionIndex(index) {
        // if (!this.questions[index]) {
        if (index === 2) {
          this.$emit('response-finished');
          return;
        }
        this.currentQuestion = this.questions[index];
        this.initQuestionState();
      },

      showQuestion() {
        this.isQuestionHidden = false;
        this.durationToReadLeft = this.currentQuestion.durationToRead || 0;

        this.timeToReadInterval = setInterval(() => {
          this.durationToReadLeft -= 1000;
        }, 1000);

        this.timeToReadTimeout = setTimeout(() => {
          this.timeToReadInterval = clearInterval(this.timeToReadInterval);
          this.hideDurationCounter();
          this.startRecorder = true;
        }, this.currentQuestion.durationToRead);
      },

      hideDurationCounter() {
        this.isDurationCounterVisible = false;
      }
    },
    mounted() {
      this.currentQuestion = this.questions[0];

      this.initQuestionState();
    }
  };
</script>

<style lang="scss" scoped>
    .questions-counter {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 2rem;
    }

    .question-row {
        display: flex;
        text-align: left;
    }

    .message-block {
        border-width: 1px;
        border-style: solid;
        border-color: #ebeef5;
        background-color: #edf2fc;
        padding: 15px 15px 15px 20px;
        display: flex;
        align-items: center;
        margin-bottom: 1rem;

        &.message-block-warning {
            background-color: #fdf6ec;
            border-color: #faecd8;
        }

        .el-message__icon {
            margin-right: 10px;

            &.el-icon-info {
                color: #909399;
            }

            &.el-icon-question {
                color: #e6a23c;
            }
        }

        p {
            margin: 0;
            font-size: 16px;
            line-height: 1.42;
        }
    }

    .question-col {
        width: 60%;
        margin-right: 3rem;
    }

    .autorecord-info {
        padding-left: 1rem;
    }

    .show-question-button {
        margin-left: 1rem;
        font-size: 18px;
    }

    @media screen and (max-width: 768px) {
        .questionnaire {
            padding-bottom: 200px;
        }

        .autorecord-info {
            padding-left: 0;
            margin-bottom: .5rem;
        }

        .show-question-button {
            margin-left: 0;
        }

        .question-row {
            flex-direction: column;

            .question-col {
                width: 100%;
                margin: 0;
            }
        }

    }
</style>