<template>
  <v-row
    v-if="selectedOrganisation || !$route.params.organisation"
  >
    <v-col
      cols="12"
    >
      <v-card
        color="customGreyBg"
        tile
      >
        <v-card-text>
          <v-row
            class="mb-3"
          >
            <v-col
              class="text-h5 font-weight-bold"
            >
              {{$t('organisation')}} {{ selectedOrganisation ? $t('editButton').toLowerCase() : $t('createButton').toLowerCase()}}
            </v-col>
          </v-row>
          <v-form
            v-model="isValid"
          >
            <v-row
              dense
            >
              <v-col
                cols="12"
              >
                <v-text-field
                  ref="tabStart"
                  dense
                  outlined
                  color="customGrey"
                  :label="$t('name')"
                  background-color="#fff"
                  v-model="name"
                  :rules="[rules.required]"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row
              dense
            >
              <v-col
                cols="12"
              >
                <v-textarea
                  dense
                  outlined
                  color="customGrey"
                  v-model="description"
                  background-color="#fff"
                  :label="$t('description') + ' ' + $t('optionalLabelExtension')"
                  :rules="[rules.longText]"
                >
                </v-textarea>
              </v-col>
            </v-row>
            <v-row
              dense
            >
              <v-col
                cols="12"
              >
                <v-text-field
                  dense
                  outlined
                  color="customGrey"
                  v-model="website"
                  background-color="#fff"
                  :label="$t('website') + ' ' + $t('optionalLabelExtension')"
                  :rules="[rules.shortText, rules.webLink]"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row
              dense
            >
              <v-col>
                <v-checkbox
                  color="customGrey"
                  v-model="isActive"
                  :label="$t('organisationActiveCheckbox')"
                >
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
              >
                <v-card
                  flat
                  color="customGreyBg"
                >
                  <v-row>
                    <v-col
                      class="subtitle-1"
                      cols="12"
                    >
                      {{$t('pic')}} {{$t('optionalLabelExtension')}}
                    </v-col>
                  </v-row>
                  <v-row
                    dense
                  >
                    <v-col
                      cols="12"
                      tabIndex="0"
                      @keypress="$refs.vueDropzone.$el.click()"
                    >
                      <vue-dropzone
                        ref="vueDropzone"
                        id="vueDropzone"
                        :options="dropzoneOptions"
                        :headers="dropzoneOptions.headers"
                        @vdropzone-success="uploadSuccess"
                        @vdropzone-removed-file="removeFile"
                        @vdropzone-mounted="dropzoneMounted"
                        @vdropzone-files-added="updateQueuedFiles"
                        @vdropzone-sending="addUuid"
                        @vdropzone-queue-complete="queueComplete"
                        :destroyDropzone="false"
                      >
                      </vue-dropzone>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-row
              v-if="pic"
            >
              <v-col
                cols="12"
              >
                <v-card
                  flat
                  color="customGreyBg"
                >
                  <v-row>
                    <v-col
                      cols="12"
                      class="subtitle-1"
                    >
                      {{$t('copyrightOwner')}}
                    </v-col>
                  </v-row>
                  <v-row
                    dense
                  >
                    <v-col>
                      <v-alert
                        icon="fas fa-info-circle"
                        color="customGrey"
                        dark
                        outlined
                      >
                        {{$t('publicHint')}}
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row
                    dense
                    class="align-center"
                  >
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        dense
                        color="customGrey"
                        item-color="customGrey"
                        v-model="pic.credit"
                        :label="$t('copyrightOwner') + ' ' + $t('pic') + ' ' + 1"
                        outlined
                        :rules="[rules.required]"
                        background-color="#fff"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-divider
              :class="pic ? 'mb-9 mt-3' : 'my-9'"
            ></v-divider>
          </v-form>
          <v-card-actions
            class="px-0"
          >
            <v-btn
              block
              large
              :dark="isValid"
              color="customGrey"
              :loading="isLoading"
              :disabled="!isValid"
              @click="saveOrganisation()"
            >
              {{$t('saveDataButton')}}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

const server = process.env.VUE_APP_SERVER_URL

export default {
  name: 'OrganisationEditor',

  components: {
    vueDropzone: vue2Dropzone
  },

  data: () => ({
    isQueued: false,
    selectedOrganisation: undefined,
    isLoading: false,
    isValid: false,
    name: undefined,
    description: undefined,
    pic: undefined,
    website: undefined,
    isActive: undefined
  }),

  async mounted () {
    await this.adapt()
    this.$refs.tabStart.focus()
  },

  methods: {
    ...mapMutations({
      setSnackbar: 'SET_SNACKBAR'
    }),
    ...mapActions('organisations', {
      patchOrganisation: 'patch',
      createOrganisation: 'create',
      requestOrganisation: 'get'
    }),
    ...mapActions('uploads', {
      removeUpload: 'remove'
    }),
    addUuid (file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)
    },
    updateQueuedFiles (files) {
      this.isQueued = true
      this.$nextTick(() => {
        if (files[0].status !== 'error') {
          this.pic = { credit: undefined, url: files[0].upload.uuid }
        }
      })
    },
    dropzoneMounted () {
      if (this.selectedOrganisation && this.selectedOrganisation.pic) {
        var url = this.s3 + this.selectedOrganisation.pic.url
        var mockFile = {
          name: '',
          size: '',
          type: 'image/jpeg',
          accepted: true
        }
        this.$refs.vueDropzone.manuallyAddFile(mockFile, url)
      }
    },
    async adapt () {
      if (this.$route.params.organisation) {
        let selectedOrganisation = this.getOrganisation(this.$route.params.organisation)
        if (!selectedOrganisation) {
          selectedOrganisation = await this.requestOrganisation([this.$route.params.organisation])
        }
        this.selectedOrganisation = selectedOrganisation
      }
      if (this.selectedOrganisation) {
        this.pic = this.selectedOrganisation.pic
        this.name = this.selectedOrganisation.name
        this.description = this.selectedOrganisation.description
        this.website = this.selectedOrganisation.website
        this.isActive = this.selectedOrganisation.isActive
      }
    },
    async uploadSuccess (file, response) {
      this.pic = {
        url: response.id,
        credit: this.pic.credit
      }
      this.isQueued = false
      this.saveOrganisation()
    },
    async removeFile (file, error, xhr) {
      try {
        if (file.status === 'queued') {
          this.pic = undefined
          this.isQueued = false
        } else if (file.status !== 'error') {
          await this.removeUpload([this.pic.url, {}, {}])
          await this.patchOrganisation([this.selectedOrganisation._id, { pic: null }])
          this.pic = undefined
          this.setSnackbar({ text: this.$t('snackbarSaveSuccess'), color: 'success' })
        }
      } catch (e) {
        if (this.loading) {
          this.setSnackbar({ text: this.$t('snackbarSaveError'), color: 'error' })
        }
      }
    },
    queueComplete () {
      if (this.isQueued) {
        let hasErrors = false
        for (const file of this.$refs.vueDropzone.getAcceptedFiles()) {
          const newPic = this.pics
          if (!newPic) {
            file.previewElement.querySelector('.dz-error-message > span').innerHTML = this.$t('uploadFailed')
            hasErrors = true
            if (this.isLoading) {
              this.setSnackbar({ text: this.$t('snackbarSaveError'), color: 'error' })
            }
          }
          if (hasErrors) {
            this.isLoading = false
            return
          }
          this.$refs.vueDropzonePics.removeFile(file)
          const tmpMockFile = JSON.parse(JSON.stringify(this.mockFile))
          tmpMockFile.name = newPic.url
          this.$refs.vueDropzonePics.manuallyAddFile(tmpMockFile, this.s3 + newPic.url)
        }
        this.isQueued = false
        if (this.isLoading) {
          this.saveOrganisation()
        }
      }
    },
    async saveOrganisation () {
      this.isLoading = true
      if (this.isQueued) {
        await this.$refs.vueDropzone.processQueue()
      } else {
        const map = {
          name: this.name,
          description: this.description,
          website: this.website,
          isActive: this.isActive
        }
        if (this.pic && this.pic.url && this.pic.credit) {
          map.pic = this.pic
        }
        try {
          if (this.selectedOrganisation) {
            await this.patchOrganisation([this.selectedOrganisation._id, map, {}])
          } else {
            await this.createOrganisation([map, {}])
          }
          this.isLoading = false
          this.setSnackbar({ text: this.$t('snackbarSaveSuccess'), color: 'success' })
          this.$router.go(-1)
        } catch (e) {
          this.isLoading = false
          this.setSnackbar({ text: this.$t('snackbarSaveError'), color: 'error' })
        }
      }
    }
  },

  computed: {
    ...mapGetters([
      'rules',
      's3'
    ]),
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapGetters('organisations', {
      getOrganisation: 'get'
    }),
    dropzoneOptions () {
      return {
        url: server + 'uploads',
        maxFilesize: 0.5,
        maxFiles: 1,
        paramName: 'uri',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('feathers-jwt')
        },
        autoProcessQueue: false,
        addRemoveLinks: true,
        dictDefaultMessage: '<i style="font-size: 40px" class="fas fa-images"></i><br><br><span class="v-label"><span class="font-weight-bold">' + this.$t('dropFilesHeadline', { filesize: '0.5' }) + '</span><br><br>' + this.$t('dropFilesBody', { resolution: '400x400' }) + '</span>',
        dictRemoveFile: '<i style="font-size: 40px" class="fas fa-times"></i>',
        dictCancelUpload: '<i style="font-size: 40px" class="fas fa-times"></i>',
        dictFileTooBig: this.$t('fileTooBigError'),
        dictInvalidFileType: this.$t('fileTypeNotAcceptedError'),
        dictMaxFilesExceeded: this.$t('noMorePicsError'),
        acceptedMimeTypes: 'image/png, image/jpeg',
        resizeWidth: 400,
        resizeHeight: 400,
        resizeMethod: 'contain',
        resizeQuality: 0.5
      }
    }
  }
}
</script>
