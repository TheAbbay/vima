<template>
  <div>
    <v-row>
      <v-col>
        <v-select
          v-model="sortDesc"
          color="customGrey"
          item-color="customTeal"
          :label="$t('orderLabel')"
          outlined
          dense
          hide-details
          :items="[
            { text: $t('orderOldFirst'), value: 1 },
            { text: $t('orderNewFirst'), value: -1 }
          ]"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          color="customGreyBg"
        >
          <v-card-text>
            <v-sheet
              id="messageContainer"
              min-height="100px"
              style="overflow-y: auto; overflow-x: hidden"
              class="pa-4"
            >
              <v-row>
                <v-col
                  v-if="!computedDiscussionMessages || computedDiscussionMessages.length === 0"
                >
                  <template v-if="isFindDiscussionMessagesPending || init">
                    <v-progress-linear
                      color="customGrey"
                      indeterminate
                    ></v-progress-linear>
                    <v-col
                      class="text-center customGrey--text body-1 mt-4"
                    >
                      {{$t('loadingPosts')}}
                    </v-col>
                  </template>
                  <v-col
                    v-else
                    class="text-center customGrey--text body-1 mt-3"
                  >
                    {{$t('noPostsYet')}}
                    <v-icon
                      color="customGrey"
                      class="ml-2 mb-1"
                    >
                      fas fa-heart-broken
                    </v-icon>
                  </v-col>
                </v-col>
                <template
                  v-else
                >
                  <v-col
                    v-for="(message, i) in computedDiscussionMessages"
                    :key="i"
                    cols="12"
                    class="pa-2"
                    :class="isOwnMessage(message) ? '': 'message'"
                    :name="message._id"
                    :id="'replyInput' + message._id"
                  >
                    <v-sheet
                      class="pa-4 foreign-sheet"
                      :class="showRepliesObj[message._id] ? 'elevation-12 my-4' : 'elevation-0'"
                      :color="getBGColor(message)"
                    >
                      <!-- User -->
                      <v-row
                        dense
                      >
                        <v-col
                          :class="showRepliesObj[message._id] ? 'white--text' : 'grey--text'"
                        >
                          <v-list-item
                            class="px-0"
                          >
                            <v-list-item-avatar>
                              <v-avatar
                                color="customGreyLight"
                              >
                                <v-img
                                  v-if="getUser(message.author).pic"
                                  :src="s3 + getUser(message.author).pic.url"
                                  :alt="$t('userPic') + ' ' + $t('by') + ' ' + getUser(message.author).userName"
                                  :title="getUser(message.author).pic.credit ? '© ' + getUser(message.author).pic.credit : ''"
                                >
                                </v-img>
                                <v-icon
                                  v-else
                                  color="white"
                                >
                                  fas fa-user
                                </v-icon>
                              </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title
                                @click="!isOwnMessage(message) ? $router.push({name: 'User', params: { user: message.author}}) : ''"
                                :class="!isOwnMessage(message) ? 'pointer' : ''"
                              >
                                {{getUser(message.author).userName}}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                               {{$moment(message.createdAt).format('DD.MM.YYYY, HH:mm')}} {{$t('oClock')}} {{message.editedAt ? '(' + $t('editedAt') + ' ' + $moment(message.editedAt).format('DD.MM.YYYY, HH:mm') + ' ' + $t('oClock') + ')': ''}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                      </v-row>
                      <!-- Message and ellipsis-button -->
                      <v-row
                        dense
                        class="align-center body-1"
                      >
                        <v-col
                          cols="12"
                        >
                          <v-sheet
                            v-html="$sanitize(newTab(message.text.replace(/(?:\r\n|\r|\n)/g, '<br />')))"
                            color="transparent"
                            class="pa-1"
                          >
                          </v-sheet>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-tooltip
                            color="customGrey"
                            top
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                v-bind="attrs"
                                v-on="on"
                                icon
                                color="customGrey"
                                class="mb-2 customGreyBg elevation-1"
                                @click="toggleShowReplies(message._id)"
                                :title="$t('replies')"
                              >
                                <v-icon
                                  size="14"
                                >
                                  {{ showRepliesObj[message._id] ? 'fas fa-chevron-up' : 'fas fa-reply' }}
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>{{$t('replies')}}</span>
                          </v-tooltip>
                          <v-menu
                            offset-y
                            open-on-hover
                            v-if="isOwnMessage(message)"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                class="mb-2 ml-2 customGreyBg elevation-1"
                              >
                                <v-icon
                                  size="14"
                                >
                                  fas fa-ellipsis-v
                                </v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-text>
                                <v-row
                                  dense
                                >
                                  <v-col>
                                    <v-btn
                                      block
                                      outlined
                                      small
                                      color="customGrey"
                                      @click="editMessage(message)"
                                    >
                                      {{$t('editButton')}}
                                      <v-icon
                                        size="14"
                                        class="ml-2"
                                      >
                                        fas fa-pen
                                      </v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                                <v-row
                                  dense
                                >
                                  <v-col>
                                    <v-btn
                                      block
                                      outlined
                                      small
                                      color="customGrey"
                                      @click="deleteMessage(message._id)"
                                    >
                                      {{$t('deleteButton')}}
                                      <v-icon
                                        size="14"
                                        class="ml-2"
                                      >
                                        fas fa-trash
                                      </v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-menu>
                          <v-menu
                            offset-y
                            open-on-hover
                            v-else-if="!isOwnMessage(message) && user"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                class="mb-2 ml-2 customGreyBg elevation-1"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon
                                  size="14"
                                >
                                  fas fa-ellipsis-v
                                </v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-text>
                                <v-btn
                                  block
                                  outlined
                                  small
                                  color="customGrey"
                                  @click="openReportDialog(message)"
                                >
                                  {{$t('reportButton')}}
                                  <v-icon
                                    size="14"
                                    class="ml-2"
                                  >
                                    fas fa-exclamation-triangle
                                  </v-icon>
                                </v-btn>
                              </v-card-text>
                            </v-card>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <!-- Replies -->
                      <v-expand-transition
                        mode="in-out"
                      >
                        <v-row
                          v-if="showRepliesObj[message._id]"
                        >
                          <v-col
                            class="pt-0"
                          >
                            <DiscussionReplies
                              :mainMessage="message"
                              :discussion="discussion"
                              @checkVisibleMessages="checkVisibleMessages"
                              @report="openReportDialog"
                              :computedOwnSubscriberStatusContainer="computedOwnSubscriberStatusContainer"
                              :computedGroupStatus="computedGroupStatus"
                            ></DiscussionReplies>
                          </v-col>
                        </v-row>
                      </v-expand-transition>
                      <!-- Reply button -->
                      <v-row
                        v-if="message.replies && message.replies.length > 0"
                      >
                        <v-col
                          class="pt-0"
                          cols="12"
                        >
                          <v-btn
                            @click="toggleShowReplies(message._id)"
                            :color="showRepliesObj[message._id] ? 'customGrey' : 'customGreyLight'"
                            :dark="showRepliesObj[message._id]"
                            block
                            :x-small="!$vuetify.breakpoint.smAndUp"
                            class="my-2 py-4 elevation-1"
                          >
                            {{$t('older')}}
                            {{$t('replies')}}
                            {{showRepliesObj[message._id] ? $t('hideButton') : $t('showButton')}}
                            <v-icon
                              size="18"
                              class="ml-3"
                            >
                              {{ showRepliesObj[message._id] ? 'fas fa-chevron-up' : 'fas fa-chevron-down' }}
                            </v-icon>
                            <v-sheet
                              color="customLimeBg"
                              class="ml-4 px-2 pt-1"
                              v-if="computedOwnSubscriberStatusContainer && message.replies.filter(obj => computedOwnSubscriberStatusContainer.unread.map(unread => unread.id).includes(obj)).length > 0"
                            >
                              {{message.replies.filter(obj => computedOwnSubscriberStatusContainer.unread.map(unread => unread.id).includes(obj)).length}}
                              <span>
                                {{$t('newMultiple')}}
                                <v-icon
                                  size="18"
                                  class="ml-1"
                                  style="margin-bottom: 3px"
                                >
                                  far fa-envelope
                                </v-icon>
                              </span>
                            </v-sheet>
                          </v-btn>
                        </v-col>
                        <v-col
                          v-if="!showRepliesObj[message._id]"
                          cols="12"
                        >
                          <v-alert
                            color="customGreyMedium"
                            outlined
                          >
                            <v-list-item
                              class="px-0"
                            >
                              <v-list-item-avatar>
                                <v-avatar
                                  color="customGreyLight"
                                >
                                  <v-img
                                    v-if="getUser(message.latestAnswers.author).pic"
                                    :src="s3 + getUser(message.latestAnswers.author).pic.url"
                                    :alt="$t('userPic') + ' ' + $t('by') + ' ' + getUser(message.latestAnswers.author).userName"
                                    :title="getUser(message.latestAnswers.author).pic.credit ? '© ' + getUser(message.latestAnswers.author).pic.credit : ''"
                                  >
                                  </v-img>
                                  <v-icon
                                    v-else
                                    color="white"
                                  >
                                    fas fa-user
                                  </v-icon>
                                </v-avatar>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-row>
                                  <v-col
                                    cols="12"
                                    class="subtitle-1 pb-0"
                                    style="line-height:20px"
                                    @click="!isOwnMessage(message.latestAnswers) ? $router.push({name: 'User', params: { user: message.latestAnswers.author}}) : ''"
                                    :class="!isOwnMessage(message.latestAnswers) ? 'pointer' : ''"
                                  >
                                    {{$t('newestAnswerFrom')}} {{getUser(message.latestAnswers.author).userName}}
                                  </v-col>
                                  <v-col
                                    class="pt-0 caption"
                                  >
                                    {{$moment(message.latestAnswers.createdAt).format('DD.MM.YYYY, HH:mm')}} {{$t('oClock')}} {{message.latestAnswers.editedAt ? '(' + $t('editedAt') + ' ' + $moment(message.latestAnswers.editedAt).format('DD.MM.YYYY, HH:mm') + ' ' + $t('oClock') + ')': ''}}
                                  </v-col>
                                </v-row>
                              </v-list-item-content>
                            </v-list-item>
                            <v-alert
                              v-html="$sanitize(newTab(message.latestAnswers.text))"
                            >
                            </v-alert>
                          </v-alert>
                        </v-col>
                      </v-row>
                    </v-sheet>
                  </v-col>
                </template>
              </v-row>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      style="bottom: 180px; right: calc(50% - 90px);"
      absolute
      dark
      color="customTeal"
      @click="goToNewMessages()"
      v-if="hasNewMessages"
    >
      {{$t('newMultiple')[0].toUpperCase() + $t('newMultiple').substr(1)}} {{$t('posts')}}
      <v-icon
        class="ml-3"
        size="18"
      >
        fas fa-arrow-right
      </v-icon>
    </v-btn>
    <v-row>
      <v-col>
        <v-pagination
          color="customTeal"
          v-model="page"
          :length="Math.ceil(total / itemsPerPage)"
          :total-visible="6"
        ></v-pagination>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider class="mb-6"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-if="!user"
      >
        <v-alert
          dark
          icon="fas fa-info-circle"
          color="customTeal"
        >
          <v-row>
            <v-col>
              {{$t('loginForDiscussions')}}
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                class="elevation-1 customGrey--text"
                color="white"
                :to="{ name: 'Signup' }"
              >
                {{$t('createProfileButton')}}
                <v-icon
                  class="ml-3"
                  size="18"
                >
                  fa fa-user-plus
                </v-icon>
              </v-btn>
              <v-btn
                class="elevation-1 ml-3 customGrey--text"
                color="white"
                :to="{ name: 'Login' }"
              >
                {{$t('login')}}
                <v-icon
                  class="ml-3"
                  size="18"
                >
                  fa fa-sign-in-alt
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
      <v-col
        v-else-if="discussion.group && !computedGroupStatus.isMember"
      >
        <v-alert
          dark
          icon="fas fa-info-circle"
          color="customTeal"
        >
          <v-row>
            <v-col>
              {{$t('applyForGroup')}}
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                class="elevation-1 customGrey--text"
                color="white"
                :to="{ name: 'Group',  params: { group: discussion.group } }"
              >
                {{$t('group')}} {{$t('viewButton')}}
                <v-icon
                  class="ml-3"
                  size="18"
                >
                  fa fa-arrow-right
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
      <v-col
        v-else
      >
        <v-form
          ref="messagesForm"
          v-model="isValid"
        >
          <v-row dense>
            <v-col
              class="font-weight-bold"
              cols="12"
            >
              {{$t('writeNewPostTitle')}}:
            </v-col>
          </v-row>
          <v-row
            class="align-end"
          >
            <v-col
              class="grow pr-1"
            >
              <tiptap-vuetify
                :editor-properties="{
                  disableInputRules: true,
                  disablePasteRules: true
                }"
                color="customGreyBg"
                v-model="message"
                :card-props="{ tile: true, flat: true }"
                style="border: 1px solid #aaa;"
                :extensions="extensions"
                :placeholder="$t('writeNewPost')"
                id="messageInput"
              >
              </tiptap-vuetify>
            </v-col>
            <v-col
              class="shrink px-3"
            >
              <v-btn
                fab
                :loading="isSending"
                :disabled="!message || message.replace(/(\r\n|\n|\r)/gm, '').replaceAll('<p>', '').replaceAll('</p>', '').replaceAll(' ', '') === ''"
                @click="sendMessage()"
                color="customTeal"
                :title="$t('sendButton')"
              >
                <template
                  slot="loader"
                >
                  <v-progress-circular
                    color="white"
                    width="3"
                    indeterminate
                  ></v-progress-circular>
                </template>
                <v-icon
                  size="18"
                  color="white"
                >
                  fas fa-paper-plane
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <ViolationDialog
      :type="discussion.group ? 'groups': 'discussions'"
      :discussion="discussion"
      :message="itemToReport"
      :showViolationDialog="showViolationDialog"
      :key="JSON.stringify(itemToReport)"
      @closeViolationDialog="itemToReport = undefined"
    ></ViolationDialog>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import DiscussionReplies from '@/components/DiscussionReplies.vue'
import ViolationDialog from '@/components/ViolationDialog.vue'
import { TiptapVuetify, Bold, Blockquote, BulletList, OrderedList, ListItem, Link } from 'tiptap-vuetify'

export default {
  name: 'DiscussionCore',

  components: {
    DiscussionReplies,
    TiptapVuetify,
    ViolationDialog
  },

  props: ['discussion'],

  data: () => ({
    itemToReport: undefined,
    showViolationDialog: false,
    checkForNewPage: false,
    hasNewMessages: false,
    triggerNewMessage: 1,
    isFindDiscussionMessagesPending: false,
    sortDesc: 1,
    isUpdating: false,
    isEditMessage: undefined,
    showRepliesObj: {},
    init: true,
    manualLoad: false,
    isValid: false,
    message: undefined,
    isSending: false,
    search: '',
    page: 1,
    loading: true,
    total: 0,
    itemsPerPage: 10,
    intersectionOptions: {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 1]
    },
    extensions: [
      Bold,
      Blockquote,
      ListItem,
      BulletList,
      OrderedList,
      Link
    ]
  }),

  async mounted () {
    if (this.init) {
      // Init listeners
      this.$nextTick(() => {
        window.addEventListener('scroll', this.checkVisibleMessages)
        document.querySelector('#messageContainer').addEventListener('scroll', this.checkVisibleMessages)
      })
    }
    this.$nextTick(() => {
      this.$nextTick(() => {
        this.checkVisibleMessages()
      })
    })
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.checkVisibleMessages)
    if (document.querySelector('#messageContainer')) {
      document.querySelector('#messageContainer').removeEventListener('scroll', this.checkVisibleMessages)
    }
  },

  methods: {
    ...mapMutations({
      setSnackbar: 'SET_SNACKBAR'
    }),
    ...mapActions('discussion-messages', {
      createMessage: 'create',
      patchMessage: 'patch',
      removeMessage: 'remove',
      findDiscussionMessages: 'find'
    }),
    ...mapActions('status-container-helper', {
      patchDiscussionMessageNotifications: 'patch'
    }),
    openReportDialog (message) {
      this.itemToReport = message
    },
    goToNewMessages () {
      this.page = Math.ceil(this.total / this.itemsPerPage)
      this.hasNewMessages = false
    },
    getBGColor (message) {
      if (this.showRepliesObj[message._id]) {
        return '#B0BEC5'
      } else {
        if (this.isOwnMessage(message)) {
          if (this.isEditMessage === message._id) {
            return '#ffeac2'
          } else {
            return '#f0f0f0'
          }
        } else {
          if (this.computedOwnSubscriberStatusContainer && this.computedOwnSubscriberStatusContainer.unread.map(unread => unread.id).includes(message._id)) {
            return 'customLimeBg'
          } else {
            return '#f6f6f6'
          }
        }
      }
    },
    toggleShowReplies (messageId) {
      const tmpState = !this.showRepliesObj[messageId]
      this.showRepliesObj = {}
      if (tmpState) {
        this.$set(this.showRepliesObj, messageId, true)
        setTimeout(() => {
          document.querySelector('#replyInput' + messageId).scrollIntoView({ block: 'end', behavior: 'smooth' })
        }, 500)
      }
    },
    isOwnMessage (message) {
      if (this.user) {
        return message.author === this.user._id
      } else {
        return false
      }
    },
    async deleteMessage (messageId) {
      try {
        await this.removeMessage(messageId)
        this.setSnackbar({ text: this.$t('snackbarDeleteSuccess'), color: 'success' })
        this.manualLoad = 'delete'
        this.triggerNewMessage = Date.now()
      } catch (e) {
        this.setSnackbar({ text: this.$t('snackbarDeleteError'), color: 'error' })
      }
    },
    async editMessage (message) {
      this.isEditMessage = message._id
      this.message = message.text
      document.querySelector('#messageInput').scrollIntoView({ block: 'start', behavior: 'smooth' })
    },
    async sendMessage () {
      this.isSending = true
      if (!this.isEditMessage) {
        this.manualLoad = 'create'
        try {
          await this.createMessage(
            [
              {
                discussion: this.discussion._id,
                author: this.user._id,
                text: this.message
              }
            ]
          )
          this.setSnackbar({ text: this.$t('snackbarSendSuccess'), color: 'success' })
          this.$refs.messagesForm.reset()
          this.$nextTick(() => {
            this.$nextTick(() => {
              document.querySelector('#messageContainer').scrollTop = document.querySelector('#messageContainer').scrollHeight
              this.checkVisibleMessages()
            })
          })
          this.message = undefined
          this.triggerNewMessage = Date.now()
        } catch (e) {
          this.setSnackbar({ text: this.$t('snackbarSendError'), color: 'error' })
        }
      } else {
        // TODO:
        this.manualLoad = 'patch'
        try {
          await this.patchMessage(
            [
              this.isEditMessage,
              {
                text: this.message,
                editedAt: new Date()
              }
            ]
          )
          this.setSnackbar({ text: this.$t('snackbarEditSuccess'), color: 'success' })
          this.$refs.messagesForm.reset()
          this.message = undefined
          this.isEditMessage = undefined
          this.triggerNewMessage = Date.now()
        } catch (e) {
          this.setSnackbar({ text: this.$t('snackbarEditError'), color: 'error' })
        }
      }
      this.isSending = false
    },
    async checkVisibleMessages () {
      document.querySelectorAll('.message').forEach(async message => {
        if (
          this.isVisibleInsideDocument(message) &&
          this.isVisibleInsideContainer(message, document.querySelector('#messageContainer'))
        ) {
          const tmpDiscussionMessage = this.allDiscussionMessages.find(obj => obj._id === message.getAttribute('name'))
          if (
            tmpDiscussionMessage &&
            !this.isUpdating &&
            !this.isOwnMessage(tmpDiscussionMessage) &&
            this.computedOwnSubscriberStatusContainer &&
            this.computedOwnSubscriberStatusContainer.unread.map(unread => unread.id).includes(tmpDiscussionMessage._id)
          ) {
            this.isUpdating = true
            await this.patchDiscussionMessageNotifications(
              [
                'pullUnreadById',
                {
                  containerId: this.computedOwnSubscriberStatusContainer._id,
                  ids: [tmpDiscussionMessage._id]
                }
              ]
            )
            this.isUpdating = false
          }
        }
      })
      document.querySelectorAll('.reply').forEach(async message => {
        if (
          this.isVisibleInsideDocument(message) &&
          this.isVisibleInsideContainer(message, document.querySelector('#messageContainer')) &&
          this.isVisibleInsideContainer(message, document.querySelector('#replyContainer'))
        ) {
          const tmpDiscussionMessage = this.allDiscussionMessages.find(obj => obj._id === message.getAttribute('name'))
          if (
            tmpDiscussionMessage &&
            !this.isUpdating &&
            !this.isOwnMessage(tmpDiscussionMessage) &&
            this.computedOwnSubscriberStatusContainer &&
            this.computedOwnSubscriberStatusContainer.unread.map(unread => unread.id).includes(tmpDiscussionMessage._id)
          ) {
            this.isUpdating = true
            await this.patchDiscussionMessageNotifications(
              [
                'pullUnreadById',
                {
                  containerId: this.computedOwnSubscriberStatusContainer._id,
                  ids: [tmpDiscussionMessage._id]
                }
              ]
            )
            this.isUpdating = false
          }
        }
      })
    },
    isVisibleInsideDocument (ele) {
      const { top, bottom } = ele.getBoundingClientRect()
      const vHeight = (window.innerHeight - 150 || document.documentElement.clientHeight - 150)
      const res = (
        (top > 0 || bottom > 0) &&
        top < vHeight
      )
      return res
    },
    isVisibleInsideContainer (ele, container) {
      const { bottom, height, top } = ele.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      return top <= containerRect.top
        ? (containerRect.top - top <= height)
        : (bottom - containerRect.bottom <= height)
    }
  },

  computed: {
    ...mapGetters([
      's3',
      'rules',
      'relationItems',
      'newTab'
    ]),
    ...mapGetters('auth', {
      user: 'user'
    }),
    ...mapGetters('users', {
      getUser: 'get'
    }),
    ...mapGetters('status-containers', {
      statusContainers: 'list'
    }),
    ...mapGetters('discussion-messages', {
      allDiscussionMessages: 'list'
    }),
    computedOwnStatusContainers () {
      return this.statusContainers.filter(obj => obj.reference === this.discussion._id && obj.user === this.user._id)
    },
    computedOwnSubscriberStatusContainer () {
      return this.computedOwnStatusContainers.find(obj => obj.relation === 'subscriber')
    },
    computedDiscussionMessages () {
      if (this.computedDiscussionMessagesData && this.computedDiscussionMessagesData.data) {
        return this.computedDiscussionMessagesData.data
      } else {
        return []
      }
    },
    computedGroupStatus () {
      if (this.computedStatusContainers) {
        if (this.computedStatusContainers.find(obj => obj.relation === 'owner')) {
          return this.relationItems.owner
        } if (this.computedStatusContainers.find(obj => obj.relation === 'moderator')) {
          return this.relationItems.moderator
        } else if (this.computedStatusContainers.find(obj => obj.relation === 'member')) {
          return this.relationItems.member
        } else if (this.computedStatusContainers.find(obj => obj.relation === 'applicant')) {
          return this.relationItems.applicant
        } else {
          return this.relationItems.apply
        }
      } else {
        return this.relationItems.apply
      }
    },
    computedStatusContainers () {
      return this.statusContainers.filter(obj => obj.reference === this.discussion.group && obj.user === this.user._id)
    }
  },

  asyncComputed: {
    async computedDiscussionMessagesData () {
      if (this.triggerNewMessage) {}
      this.isFindDiscussionMessagesPending = true
      return await this.findDiscussionMessages(
        {
          query: {
            discussion: this.discussion._id,
            repliesTo: { $exists: false },
            $limit: this.itemsPerPage,
            $skip: (this.page - 1) * this.itemsPerPage,
            $sort: { createdAt: this.sortDesc }
          }
        }
      )
    }
  },

  watch: {
    page () {
      if (this.page === Math.ceil(this.total / this.itemsPerPage)) {
        this.hasNewMessages = false
      }
    },
    allDiscussionMessages (newValue, oldValue) {
      const newDiscussionValue = newValue.filter(obj => obj.discussion === this.discussion._id)
      const oldDiscussionValue = oldValue.filter(obj => obj.discussion === this.discussion._id)
      if (!this.isFindDiscussionMessagesPending && oldDiscussionValue.filter(obj => !obj.repliesTo).length !== newDiscussionValue.filter(obj => !obj.repliesTo).length && !this.init && !this.manualLoad) {
        this.triggerNewMessage = Date.now()
        this.checkForNewPage = true
      }
    },
    computedDiscussionMessages (newValue, oldValue) {
      //
      this.total = this.computedDiscussionMessagesData.total
      //
      if (this.manualLoad === 'create') {
        this.page = Math.ceil(this.total / this.itemsPerPage)
      } else if (this.page > Math.ceil(this.total / this.itemsPerPage)) {
        this.page = Math.ceil(this.total / this.itemsPerPage)
      }
      //
      this.isFindDiscussionMessagesPending = false
      //
      if (document.querySelector('#messageContainer')) {
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.checkVisibleMessages()
            this.manualLoad = false
          })
        })
      }
    },
    isFindDiscussionMessagesPending () {
      if (
        !this.isFindDiscussionMessagesPending &&
        this.computedDiscussionMessagesData
      ) {
        //
        if (this.checkForNewPage) {
          if (this.page < Math.ceil(this.total / this.itemsPerPage)) {
            this.hasNewMessages = true
          }
        }
        this.checkForNewPage = false
        //
        this.loading = false
      } else {
        this.loading = true
        setTimeout(() => {
          this.init = false
        }, 1000)
      }
    },
    message () {
      if (this.message) {
        this.message = this.$sanitize(this.message)
        this.message = this.message.replaceAll('<blockquote>', '<blockquote class="blockquote">')
      }
    },
    showViolationDialog () {
      if (!this.showViolationDialog) {
        this.itemToReport = undefined
      }
    },
    itemToReport () {
      if (this.itemToReport) {
        this.showViolationDialog = true
      } else {
        this.showViolationDialog = false
      }
    }
  }
}
</script>
