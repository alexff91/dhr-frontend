<template>
    <div>
        <div class="questions-counter">
            Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}
        </div>


        <!--{{currentQuestion}}-->

        <div class="question-row">

            <div class="question-col">
                <div class="read-duration-counter" v-if="isDurationCounterVisible">
                    {{ readableDuration(durationToReadLeft) }}
                </div>

                <div v-if="!isQuestionHidden" class="question-content">
                    {{ currentQuestion.question }}
                </div>

                <div v-if="isQuestionHidden">
                    Время на подготовку к вопросу ограничено. Ответ нельзя будет перезаписать. Вы готовы?

                    <br>
                    <el-button @click="showQuestion()">Показать вопрос</el-button>
                </div>

                <el-button v-if="isQuestionAnswered" @click="setQuestionIndex(currentQuestionIndex+1)">Следующий вопрос</el-button>
            </div>


            <VideoContainer :durationMax="currentQuestion.durationMax"
                            :questionId="currentQuestion.id"
                            :respondId="respondId"
                            :readyToRecord="readyToRecord"
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
        readyToRecord: false,
        timeToReadInterval: null,
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
      readableDuration(ms) {
        return parseMillisecondsIntoReadableTime(ms);
      },

      setQuestionIndex(index) {
        this.currentQuestion = this.questions[index];
      },

      showQuestion() {
        this.isQuestionHidden = false;

        this.durationToReadLeft = this.currentQuestion.durationToRead || 0;

        this.timeToReadInterval = setInterval(() => {
          this.durationToReadLeft -= 1000;
        }, 1000);

        setTimeout(() => {
          this.timeToReadInterval = clearInterval(this.timeToReadInterval);
          this.hideDurationCounter();
        }, this.currentQuestion.durationToRead);
      },

      hideDurationCounter() {
        this.isDurationCounterVisible = false
      }
    },
    mounted() {
      this.currentQuestion = this.questions[0];

      if (this.isQuestionAnswered || !this.currentQuestion.durationToRead) {
        this.isQuestionHidden = false;
      }
    }

  };
</script>

<style scoped>
    .questions-counter {
        font-size: 1.2rem;
        font-weight: bold;
    }

    .question-row {
        display: flex;
        text-align: left;
    }

    .read-duration-counter {
        display: inline-block;
        background-color: #f2f2f2;
        padding: 3px;
        font-weight: bold;
        font-size: 1.2rem;
    }
</style>