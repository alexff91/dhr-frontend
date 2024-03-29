<template>
    <div>
        <div v-if="!questions.length">
            По этой вакансии нет вопросов.
        </div>

        <div class="questionnaire" v-if="questions.length">
            <div class="questions-counter">
                Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}
            </div>

            <!--{{currentQuestion}}-->
            <div class="question-row">

                <div class="question-col">

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
                </div>

                <VideoContainer :durationMax="currentQuestion.durationMax"
                                :questionId="currentQuestion.id"
                                :respondId="respondId"
                                :forceRecord="forceRecord"
                                :readyToRecord="!isQuestionHidden"
                                v-on:recording-finished="setQuestionIndex(currentQuestionIndex+1)"
                                v-on:recording-started="isDurationCounterVisible = false"
                ></VideoContainer>
            </div>
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
        forceRecord: false,
        timeToReadInterval: null,
        timeToReadTimeout: null,
        durationToReadLeft: 0
      };
    },
    computed: {
      currentQuestionIndex() {
        return this.questions.indexOf(this.currentQuestion);
      }
    },
    methods: {
      initQuestionState() {
        this.durationToReadLeft = 0;
        this.isQuestionHidden = true;
        this.isDurationCounterVisible = true;
        this.forceRecord = false;
        this.timeToReadInterval = clearInterval(this.timeToReadInterval);
        this.timeToReadTimeout = clearTimeout(this.timeToReadTimeout);

        if (!this.currentQuestion.durationToRead) { // this.isQuestionAnswered ||
          this.isQuestionHidden = false;
        }

        if (this.currentQuestion.durationToRead === 0) {
          this.$nextTick(() => {
            this.forceRecord = true;
          });
        }
      },

      readableDuration(ms) {
        return parseMillisecondsIntoReadableTime(ms);
      },

      setQuestionIndex(index) {
        if (!this.questions[index]) {
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
          this.forceRecord = true;
        }, this.currentQuestion.durationToRead);
      },

      hideDurationCounter() {
        this.isDurationCounterVisible = false;
      }
    },
    mounted() {
      if (this.questions.length) {
        this.currentQuestion = this.questions[0];
        this.initQuestionState();
      }
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
        float: right;
        margin-left: 1rem;
        font-size: 18px;
    }

    @media screen and (max-width: 768px) {
        .questionnaire {
            padding-bottom: 300px;
        }

        .autorecord-info {
            padding-left: 0;
            margin-bottom: .5rem;
        }

        .show-question-button {
            float: none;
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