<template>
    <el-row type="flex" justify="center">
        <el-col :xs="23" :sm="23" :md="23" :lg="20" :xl="20" class="main-col">
            <el-container>
                <el-header class="vacancy-header" height="120px">
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

                            <div class="vacancy-overview">
                                <div class="vacancy-video-container">
                                    <div class="embed-responsive">
                                        <iframe src="https://www.youtube.com/embed/VGIJrXpbt90" class="embed-responsive-item"
                                                frameborder="0"
                                                allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                    </div>
                                </div>


                                <p class="vacancy-description" v-html="vacancy.description"></p>
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
                                                      type="email"
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
                            <Questionnaire v-on:response-finished="nextStep"
                                           :questions="questions"
                                           :respondQuestions="respond.respondQuestions"
                                           :respondId="respond.respondId"></Questionnaire>
                        </div>

                        <div v-if="activeStep === 3" class="finish-wrap">
                            <div class="finished-title">Спасибо за интервью!</div>
                            Мы свяжемся с вами в скором времени.
                            <br>
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
          this.questions = this.vacancy.questions.sort((a, b) => a - b);
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
        this.activeStep++;
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

<style lang="scss">
    header.vacancy-header {
        padding: 30px 0 0 40px;
    }

    .company-logo {
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
        background: #fff;
        box-shadow: 0 4px 70px -18px #707070;
        margin: 1rem 0;
    }

    main.el-main {
        padding: 0 0 4rem 0;
    }

    .steps-wrap {
        margin-bottom: 3rem;
    }

    .vacancy-overview {
        display: flex;
        margin-bottom: 3rem;
        text-align: left;

        .vacancy-video-container {
            width: 47%;
            margin-right: 2rem;
            align-self: center;
        }

        .vacancy-description {
            width: 53%;
            padding-right: 2rem;
        }

    }

    .form-description {
        margin-bottom: 2rem;
    }

    .finish-wrap {

        .finished-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 1.5rem;
        }
    }

    @media screen and (max-width: 768px) {
        main.el-main {
            padding: 1rem;
        }

        header.vacancy-header {
            padding: 1.5rem 0 0 2rem;
        }

        .steps-wrap {
            .el-step__title {
                line-height: 1.4;
            }
        }

        .vacancy-overview {
            flex-direction: column;

            .vacancy-video-container {
                width: 100%;
                margin: 0 0 1.5rem 0;
                align-self: center;
            }

            .vacancy-description {
                width: 100%;
                padding-right: 0;
            }
        }
    }
</style>