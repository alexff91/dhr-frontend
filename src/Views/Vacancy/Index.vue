<template>
    <el-row type="flex" justify="center">
        <el-col :xs="24" :sm="22" :md="18" :lg="16" :xl="14" class="main-col">
            <el-container>
                <el-header class="vacancy-header" height="80px">
                    <div class="company-logo">
                        <img v-if="company.companyLogoPath" :src="company.companyLogoPath">
                        <span v-if="!company.companyLogoPath">{{ company.companyName }}</span>
                    </div>
                </el-header>

                <el-main>
                    <el-steps :active="activeStep" finish-status="success" align-center class="steps-wrap">
                        <el-step title="Вакансия"></el-step>
                        <el-step title="Контактные данные"></el-step>
                        <el-step title="Видеоинтервью"></el-step>
                    </el-steps>

                    <div class="step-view text-center">
                        <slot v-if="activeStep === 0">
                            <h1 class="text-center">Видеоинтервью на позицию {{ vacancy.position }}</h1>

                            <div class="vacancy-description">
                                <p v-html="vacancy.description"></p>
                            </div>

                            <el-button type="primary" @click="nextStep">Продолжить</el-button>
                        </slot>

                        <slot v-if="activeStep === 1">

                            <div class="text-center form-description">
                                Введите контактные данные, чтобы мы могли<br> с вами связаться и сообщить о результатах интервью
                            </div>

                            <el-row type="flex" justify="center">
                                <el-col :xs="20" :sm="16" :md="12" :lg="10" :xl="10">
                                    <el-form ref="form" :model="form" label-width="90px" label-position="left">
                                        <el-form-item label="Имя"
                                                      prop="name"
                                                      :rules="[{ required: true, message: 'Введите имя', trigger: 'blur' }]">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                        <el-form-item label="Фамилия"
                                                      prop="lastName"
                                                      :rules="[{ required: true, message: 'Введите фамилию', trigger: 'blur' }]">
                                            <el-input v-model="form.lastName"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="email"
                                                      label="Email"
                                                      :rules="[
                                                      { required: true, message: 'Введите email', trigger: 'blur' },
                                                      { type: 'email', message: 'Email невалиден', trigger: ['blur', 'change'] }
                                                    ]">
                                            <el-input v-model="form.email"></el-input>
                                        </el-form-item>

                                        <br>
                                        <el-button type="primary" @click="sendForm">Продолжить</el-button>
                                    </el-form>
                                </el-col>
                            </el-row>

                        </slot>


                        <div class="respond-wrap" v-if="activeStep === 2">
                            <Questionnaire :questions="vacancy.questions"
                                           :respondQuestions="respond.respondQuestions"
                                           :respondId="respond.respondId"></Questionnaire>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-col>
    </el-row>


</template>

<script>
  import VideoContainer from '../../components/VideoContainer';
  import { Vacancies, Companies, Responds } from '../../api';
  import Questionnaire from '../../components/Questionnaire';

  export default {
    name: 'Index',
    components: {Questionnaire, VideoContainer},
    data() {
      return {
        activeStep: 0,
        form: {
          name: '',
          lastName: '',
          email: ''
        },
        vacancy: {},
        company: {},
        questions: [],
        respond: {}
      };
    },
    computed: {
      vacancyId() {
        return this.$route.params.vacancyId;
      }
    },
    created() {
      // TODO: нужно дергать по vacancy id
      Vacancies.get()
        .then(res => {
          this.vacancy = res.data[0];
          this.questions = this.vacancy.questions;
        });
      // Vacancies.getQuestions(this.vacancyId);

      // TODO: нужно дергать по id компании
      Companies.get()
        .then(res => {
          this.company = res.data[0];
        });
    },
    methods: {
      nextStep() {
        if (this.activeStep === 0) {
          this.activeStep++;
        }
      },
      sendForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const formModel = this.$refs['form'].model;

            Responds.createRespond(this.vacancyId, {
              email: formModel.email,
              name: formModel.name,
              lastName: formModel.lastName
            })
              .then(res => {
                this.respond = res.data;
              });

            this.activeStep++;
          }
        });
      }
    }

  };
</script>

<style scoped lang="scss">
    .vacancy-header {
        line-height: 80px;
    }

    .company-logo {
        line-height: 80px;

        span {
            font-weight: bold;
            font-size: 2rem;
        }

        img {
            max-width: 175px;
            max-height: 80px;
            vertical-align: middle;
        }
    }

    .main-col {
        /*background-color: #f9f9f9;*/
    }

    .steps-wrap {
        margin-bottom: 4rem
    }

    .vacancy-description {
        margin-bottom: 4rem;
        text-align: left;
    }

    .form-description {
        margin-bottom: 2rem;
    }
</style>