import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store'
import Multiguard from 'vue-router-multiguard'

import Home from '@/views/Home.vue'
import Site from '@/views/Site.vue'
import Faq from '@/views/Faq.vue'
import CategoryListAdmin from '@/views/CategoryListAdmin.vue'
import CategoryEditor from '@/views/CategoryEditor.vue'
import TagListAdmin from '@/views/TagListAdmin.vue'
import TagEditor from '@/views/TagEditor.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Verify from '@/views/Verify.vue'
import ResendVerify from '@/views/ResendVerify.vue'
import Confirm from '@/views/Confirm.vue'
import Unsubscribe from '@/views/Unsubscribe.vue'
import Reset from '@/views/Reset.vue'
import Renew from '@/views/Renew.vue'
import UserEditor from '@/views/UserEditor.vue'
import User from '@/components/UserCard.vue'
import PreferencesEditor from '@/views/PreferencesEditor.vue'
import ApiKeyEditor from '@/views/ApiKeyEditor.vue'
import Forbidden from '@/views/Forbidden.vue'
import NotFound from '@/views/NotFound.vue'
import UserList from '@/views/UserList.vue'
import UserListAdmin from '@/views/UserListAdmin.vue'
import SiteEditor from '@/views/SiteEditor.vue'
import SiteListAdmin from '@/views/SiteListAdmin.vue'
import News from '@/views/News.vue'
import NewsEditor from '@/views/NewsEditor.vue'
import NewsListAdmin from '@/views/NewsListAdmin.vue'
import ViolationListAdmin from '@/views/ViolationListAdmin.vue'
import Organisations from '@/views/Organisations.vue'
import Organisation from '@/components/OrganisationCard.vue'
import OrganisationListAdmin from '@/views/OrganisationListAdmin.vue'
import OrganisationEditor from '@/views/OrganisationEditor.vue'
import Participate from '@/views/Participate.vue'
import CategoriesListView from '@/views/CategoriesListView.vue'
import NewsEntry from '@/components/NewsCard.vue'
import Ad from '@/components/AdCard.vue'
import AdsListView from '@/views/AdsListView.vue'
import AdEditor from '@/views/AdEditor.vue'
import Events from '@/views/Events.vue'
import Event from '@/components/EventCard.vue'
import EventEditor from '@/views/EventEditor.vue'
import EventList from '@/views/EventList.vue'
import EventListAdmin from '@/views/EventListAdmin.vue'
import AdList from '@/views/AdList.vue'
import AdListAdmin from '@/views/AdListAdmin.vue'
import Group from '@/components/GroupCard.vue'
import Groups from '@/views/Groups.vue'
import GroupList from '@/views/GroupList.vue'
import GroupListAdmin from '@/views/GroupListAdmin.vue'
import GroupEditor from '@/views/GroupEditor.vue'
import Discussion from '@/components/DiscussionCard.vue'
import Discussions from '@/views/Discussions.vue'
import DiscussionList from '@/views/DiscussionList.vue'
import DiscussionListAdmin from '@/views/DiscussionListAdmin.vue'
import DiscussionEditor from '@/views/DiscussionEditor.vue'
import ChatList from '@/views/ChatList.vue'
import Chat from '@/views/Chat.vue'
import helpItems from '@/data/help.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      breadCrumbTextKey: 'welcomePage',
      breadCrumbPredecessors: []
    },
    beforeEnter: Multiguard([
      (to, from, next) => {
        if (!from.name && localStorage.getItem('skipWelcome')) {
          next({ name: 'Participate' })
        } else {
          localStorage.setItem('skipWelcome', true)
          next()
        }
      }
    ])
  },
  // Auth
  {
    path: '/einloggen',
    name: 'Login',
    component: Login,
    meta: {
      helpItems: [
        helpItems.resendVerify,
        helpItems.forgotPassword,
        helpItems.noAccount
      ],
      breadCrumbTextKey: 'login',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/registrieren',
    name: 'Signup',
    component: Signup,
    meta: {
      helpItems: [
        helpItems.resendVerify,
        helpItems.hasAccount
      ],
      breadCrumbTextKey: 'createAccount',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/verifizieren/:token',
    name: 'Verify',
    component: Verify,
    meta: {
      breadCrumbTextKey: 'confirmEmailAddress',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/verifizierung',
    name: 'ResendVerify',
    component: ResendVerify,
    meta: {
      breadCrumbTextKey: 'verificationMail',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/bestaetigen/:id/:token',
    name: 'Confirm',
    component: Confirm,
    meta: {
      breadCrumbTextKey: 'confirmEmailAddress',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/austragen/:id',
    name: 'Unsubscribe',
    component: Unsubscribe,
    meta: {
      breadCrumbTextKey: 'unsubscription',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/vergessen',
    name: 'Reset',
    component: Reset,
    meta: {
      breadCrumbTextKey: 'resetPassword',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/vergessen/:token/:isInvitationProcess?',
    name: 'Renew',
    component: Renew,
    meta: {
      breadCrumbTextKey: 'setNewPassword',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  //
  // Lists
  //
  {
    path: '/chats',
    name: 'ChatList',
    component: ChatList,
    meta: {
      breadCrumbTextKey: 'chats',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  {
    path: '/chats/:chat?/user/:user?/username/:username?',
    name: 'UserNameChat',
    component: Chat,
    meta: {
      breadCrumbTextKey: 'chatDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['ChatList']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  {
    path: '/chats/:chat?',
    name: 'IdChat',
    component: Chat,
    meta: {
      breadCrumbTextKey: 'chatDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['ChatList']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  //
  // Editors
  //
  {
    path: '/admin/mitglieder/editor/:user?',
    name: 'UserAdminEditor',
    component: UserEditor,
    meta: {
      breadCrumbTextKey: 'editProfile',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/mitglieder/editor/:user',
    name: 'UserEditor',
    component: UserEditor,
    meta: {
      breadCrumbTextKey: 'editProfile',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkOwn
    ])
  },
  {
    path: '/mitglieder/einstellungen/editor/:user',
    name: 'PreferencesEditor',
    component: PreferencesEditor,
    meta: {
      breadCrumbTextKey: 'editSettings',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdminOwn
    ])
  },
  {
    path: '/apischluessel/editor/:organisation',
    name: 'ApiKeyEditor',
    component: ApiKeyEditor,
    meta: {
      breadCrumbTextKey: 'editApiKey',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdminPartner,
      checkOwnerModeratorMember
    ])
  },
  {
    path: '/admin/neuigkeiten/editor/:id?',
    name: 'NewsEditor',
    component: NewsEditor,
    meta: {
      breadCrumbTextKey: 'editNews',
      breadCrumbPredecessors: [
        ['Participate'],
        ['NewsListAdmin']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/organisationen/editor/:organisation?',
    name: 'OrganisationAdminEditor',
    component: OrganisationEditor,
    meta: {
      breadCrumbTextKey: 'editOrganisation',
      breadCrumbPredecessors: [
        ['Participate'],
        ['OrganisationListAdmin']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/organisationen/editor/:organisation?',
    name: 'OrganisationEditor',
    component: OrganisationEditor,
    meta: {
      breadCrumbTextKey: 'editOrganisation',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdminPartner,
      checkOwnerModeratorMember
    ])
  },
  {
    path: '/admin/inhaltsseiten/editor/:site?',
    name: 'SiteEditor',
    component: SiteEditor,
    meta: {
      breadCrumbTextKey: 'editSite',
      breadCrumbPredecessors: [
        ['Participate'],
        ['SiteListAdmin']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/kategorien/editor/:id?',
    name: 'CategoryEditor',
    component: CategoryEditor,
    meta: {
      breadCrumbTextKey: 'editCategory',
      breadCrumbPredecessors: [
        ['Participate'],
        ['CategoryListAdmin']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/schlagwoerter/editor/:id?',
    name: 'TagEditor',
    component: TagEditor,
    meta: {
      breadCrumbTextKey: 'editTag',
      breadCrumbPredecessors: [
        ['Participate'],
        ['TagListAdmin']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/veranstaltungen/editor/:organisation/:event?',
    name: 'EventEditor',
    component: EventEditor,
    meta: {
      breadCrumbTextKey: 'editEvent',
      breadCrumbPredecessors: [
        ['Participate'],
        ['EventList', 'EventListAdmin']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdminPartner,
      checkOwnerModeratorMemberOrNew
    ])
  },
  {
    path: '/suchebiete/editor/:id?',
    name: 'AdEditor',
    component: AdEditor,
    meta: {
      step: 'ads',
      breadCrumbTextKey: 'editAd',
      breadCrumbPredecessors: [
        ['Participate'],
        ['AdList', 'AdsListView']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkOwnerModeratorMemberOrNew
    ])
  },
  {
    path: '/gruppendiskussionen/editor/:group/:id?',
    name: 'GroupDiscussionEditor',
    component: DiscussionEditor,
    meta: {
      step: 'groups',
      breadCrumbTextKey: 'editGroupDiscussion',
      breadCrumbPredecessors: [
        ['Participate'],
        ['Groups', 'DiscussionList']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkOwnerModeratorMember
    ])
  },
  {
    path: '/diskussionsforen/editor/:id?',
    name: 'DiscussionEditor',
    component: DiscussionEditor,
    meta: {
      step: 'discussions',
      breadCrumbTextKey: 'editForumDiscussion',
      breadCrumbPredecessors: [
        ['Participate'],
        ['Discussions', 'DiscussionList']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/interessengruppen/editor/:id?',
    name: 'GroupEditor',
    component: GroupEditor,
    meta: {
      step: 'groups',
      breadCrumbTextKey: 'editInterestGroup',
      breadCrumbPredecessors: [
        ['Participate'],
        ['Groups', 'GroupList']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkOwnerOrNew
    ])
  },
  // Overviews
  {
    path: '/mitglieder/uebersicht',
    name: 'UserList',
    component: UserList,
    meta: {
      breadCrumbTextKey: 'memberOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  {
    path: '/suchebiete/uebersicht',
    name: 'AdList',
    component: AdList,
    meta: {
      step: 'ads',
      breadCrumbTextKey: 'myAds',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  {
    path: '/admin/veranstaltungen/uebersicht',
    name: 'EventListAdmin',
    component: EventListAdmin,
    meta: {
      breadCrumbTextKey: 'eventsOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/veranstaltungen/uebersicht/:organisation',
    name: 'EventList',
    component: EventList,
    meta: {
      breadCrumbTextKey: 'eventsOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdminPartner,
      checkOwnerModeratorMember
    ])
  },
  {
    path: '/diskussionsthemen/uebersicht',
    name: 'DiscussionList',
    component: DiscussionList,
    meta: {
      breadCrumbTextKey: 'myDiscussions',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  {
    path: '/interessengruppen/uebersicht',
    name: 'GroupList',
    component: GroupList,
    meta: {
      step: 'groups',
      breadCrumbTextKey: 'myInterestGroups',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  // Admin lists
  {
    path: '/admin/suchebiete/uebersicht',
    name: 'AdListAdmin',
    component: AdListAdmin,
    meta: {
      step: 'ads',
      breadCrumbTextKey: 'adsAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/diskussionsthemen/uebersicht',
    name: 'DiscussionListAdmin',
    component: DiscussionListAdmin,
    meta: {
      step: 'discussions',
      breadCrumbTextKey: 'forumDiscussionsAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/interessengruppen/uebersicht',
    name: 'GroupListAdmin',
    component: GroupListAdmin,
    meta: {
      step: 'groups',
      breadCrumbTextKey: 'interestGroupsAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/mitglieder/uebersicht',
    name: 'UserListAdmin',
    component: UserListAdmin,
    meta: {
      breadCrumbTextKey: 'membersAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/neuigkeiten/uebersicht',
    name: 'NewsListAdmin',
    component: NewsListAdmin,
    meta: {
      breadCrumbTextKey: 'newsAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/verstoesse/uebersicht',
    name: 'ViolationListAdmin',
    component: ViolationListAdmin,
    meta: {
      breadCrumbTextKey: 'violationsAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/organisationen/uebersicht',
    name: 'OrganisationListAdmin',
    component: OrganisationListAdmin,
    meta: {
      breadCrumbTextKey: 'organisationsAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/inhaltsseiten/uebersicht',
    name: 'SiteListAdmin',
    component: SiteListAdmin,
    meta: {
      breadCrumbTextKey: 'sitesAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/kategorien/uebersicht',
    name: 'CategoryListAdmin',
    component: CategoryListAdmin,
    meta: {
      breadCrumbTextKey: 'categoriesAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  {
    path: '/admin/schlagwoerter/uebersicht',
    name: 'TagListAdmin',
    component: TagListAdmin,
    meta: {
      breadCrumbTextKey: 'tagsAdminOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn,
      checkAdmin
    ])
  },
  // Allgemeine Überblicke
  {
    path: '/kategorien/:type',
    name: 'CategoryList',
    component: CategoriesListView,
    meta: {
      breadCrumbTextKey: 'categories',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    },
    beforeEnter: Multiguard([
      (to, from, next) => {
        if (!to.params) {
          to.params = {}
        }
        if (!to.params.type) {
          to.params.type = from.meta.step
        }
        next()
      }
    ])
  },
  {
    path: '/mitmachen',
    name: 'Participate',
    component: Participate,
    meta: {
      breadCrumbTextKey: 'overview',
      breadCrumbPredecessors: [
      ]
    }
  },
  {
    path: '/kooperationspartner',
    name: 'Organisations',
    component: Organisations,
    meta: {
      breadCrumbTextKey: 'organisationsOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/veranstaltungen',
    name: 'Events',
    component: Events,
    meta: {
      breadCrumbTextKey: 'eventsOverview',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/suchebiete',
    name: 'AdsListView',
    component: AdsListView,
    meta: {
      step: 'ads',
      breadCrumbTextKey: 'ads',
      breadCrumbPredecessors: [
        ['Participate'],
        ['CategoryList']
      ]
    }
  },
  {
    path: '/diskussionsforen',
    name: 'Discussions',
    component: Discussions,
    meta: {
      step: 'discussions',
      breadCrumbTextKey: 'discussionForums',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/interessengruppen',
    name: 'Groups',
    component: Groups,
    meta: {
      step: 'groups',
      breadCrumbTextKey: 'interestGroups',
      breadCrumbPredecessors: [
        ['Participate'],
        ['CategoryList']
      ]
    }
  },
  {
    path: '/neuigkeiten',
    name: 'News',
    component: News,
    meta: {
      breadCrumbTextKey: 'news',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  // Detail
  {
    path: '/suchebiete/:id',
    name: 'Ad',
    component: Ad,
    meta: {
      helpItems: [
        helpItems.answerAd,
        helpItems.answerOwnAd
      ],
      breadCrumbTextKey: 'adDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['AdsListView', 'AdList', 'AdListAdmin']
      ],
      step: 'ads'
    }
  },
  {
    path: '/diskussionsforen/:id',
    name: 'Discussion',
    component: Discussion,
    meta: {
      breadCrumbTextKey: 'discussionForumDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['$Discussions', '$DiscussionList', '$DiscussionListAdmin']
      ],
      step: 'discussions'
    }
  },
  {
    path: '/interessengruppen/:group',
    name: 'Group',
    component: Group,
    meta: {
      breadCrumbTextKey: 'interestGroupDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['Groups', 'GroupList', 'GroupListAdmin']
      ],
      step: 'groups'
    }
  },
  {
    path: '/kooperationspartner/:organisation',
    name: 'Organisation',
    component: Organisation,
    meta: {
      breadCrumbTextKey: 'organisationDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['Organisations']
      ]
    }
  },
  {
    path: '/veranstaltungen/:event',
    name: 'Event',
    component: Event,
    meta: {
      breadCrumbTextKey: 'eventDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['Events']
      ]
    }
  },
  {
    path: '/interessengruppen/:group/gruppendiskussionen/:id',
    name: 'GroupDiscussion',
    component: Discussion,
    meta: {
      breadCrumbTextKey: 'interestGroupForumDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['Groups', '$DiscussionList', '$DiscussionListAdmin'],
        ['Group']
      ],
      step: 'groups'
    }
  },
  {
    path: '/neuigkeiten/:id',
    name: 'NewsEntry',
    component: NewsEntry,
    meta: {
      breadCrumbTextKey: 'newsDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['News']
      ]
    }
  },
  {
    path: '/mitglieder/:user',
    name: 'User',
    component: User,
    meta: {
      breadCrumbTextKey: 'memberDetail',
      breadCrumbPredecessors: [
        ['Participate'],
        ['UserList', 'UserListAdmin', 'ChatList', 'Chat', 'Discussion', 'AdList']
      ]
    },
    beforeEnter: Multiguard([
      checkLoggedIn
    ])
  },
  {
    path: '/impressum',
    name: 'Imprint',
    component: Site,
    meta: {
      breadCrumbTextKey: 'imprint',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/vima',
    name: 'Vima',
    component: Site,
    meta: {
      breadCrumbTextKey: 'aboutVima',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/ileu',
    name: 'Ileu',
    component: Site,
    meta: {
      breadCrumbTextKey: 'aboutIleu',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/vives',
    name: 'Vives',
    component: Site,
    meta: {
      breadCrumbTextKey: 'aboutVives',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/kommunikationsregeln',
    name: 'CommunicationRules',
    component: Site,
    meta: {
      breadCrumbTextKey: 'communicationRules',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/datenschutz',
    name: 'Privacy',
    component: Site,
    meta: {
      breadCrumbTextKey: 'privacy',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/kontakt',
    name: 'Contact',
    component: Site,
    meta: {
      breadCrumbTextKey: 'contact',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '/haeufige-fragen',
    name: 'Faq',
    component: Faq,
    meta: {
      breadCrumbTextKey: 'faq',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  // Special
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: {
      breadCrumbTextKey: '403',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      breadCrumbTextKey: '404',
      breadCrumbPredecessors: [
        ['Participate']
      ]
    }
  }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  Object.keys(to.params).forEach(key => to.params[key] === undefined && delete to.params[key])
  if (!router.prevRoutes) {
    router.prevRoutes = []
  }
  if (from.name && from.name !== to.name) {
    router.prevRoutes.push(from)
  }
  if (router.prevRoutes.length > 3) {
    router.prevRoutes.shift()
  }
  if (Store.getters.showTour && to.name === 'Participate') {
    Store.commit('SET_SHOW_TOUR', true)
  } else {
    Store.commit('SET_SHOW_TOUR', false)
  }
  await init(to, from, next)
})

async function init (to, from, next) {
  // Load active fair
  if (Store.getters.firstLoad) {
    // Not logged in - log in
    if (!Store.getters['auth/user']) {
      try {
        await Store.dispatch('auth/authenticate')
        await Store.dispatch('status-containers/find', { query: { user: Store.getters['auth/user']._id } })
        let i = 0
        const matomoInterval = setInterval(() => {
          if (Vue.prototype.$matomo) {
            Vue.prototype.$matomo.setUserId(Store.getters['auth/user']._id)
            Vue.prototype.$matomo.setCustomVariable(1, 'Rolle', Store.getters['auth/user'].role, 'visit')
            Store.commit('SET_HAS_MATOMO', true)
            clearInterval(matomoInterval)
          }
          if (i > 20) {
            clearInterval(matomoInterval)
          }
          ++i
        }, 100)
      } catch (e) {
        let i = 0
        const matomoInterval = setInterval(() => {
          if (Vue.prototype.$matomo) {
            Vue.prototype.$matomo.setUserId(undefined)
            Vue.prototype.$matomo.setCustomVariable(1, 'Rolle', 'anonymous', 'visit')
            Store.commit('SET_HAS_MATOMO', true)
            clearInterval(matomoInterval)
          }
          if (i > 20) {
            clearInterval(matomoInterval)
          }
          ++i
        }, 100)
        localStorage.removeItem('feathers-jwt')
      }
    }
    // Load stuff
    await Store.dispatch('categories/find', { query: {}, $paginate: false })
    const query = {}
    if (!Store.getters['auth/user'] || (Store.getters['auth/user'] && Store.getters['auth/user'].role !== 'admins')) {
      query.isActive = true
      query.isAccepted = true
    }
    await Store.dispatch('tags/find', { query, $paginate: false })
    // If logged in load stuff if not there
    if (Store.getters['auth/user']) {
      try {
        //
      } catch (e) {
        await Store.dispatch('logging/create', { type: 'error', route: window.location.pathname, user: (Store.getters['auth/user'] ? Store.getters['auth/user']._id : '-'), method: 'init', message: e.message })
      }
    }
    Store.commit('SET_FIRST_LOAD', false)
  }
  // Go
  next()
}

// Check if user can update
function checkLoggedIn (to, from, next) {
  if (!Store.getters['auth/user']) {
    return next({ name: 'Login', query: { redirect: to.path } })
  }
  next()
}

function checkOwn (to, from, next) {
  if (to.params[Object.keys(to.params)[0]] !== Store.getters['auth/user']._id) {
    return next({ name: 'Forbidden', query: { redirect: from.path } })
  }
  next()
}

function checkAdminOwn (to, from, next) {
  if (
    Store.getters['auth/user'].role !== 'admins' &&
    to.params[Object.keys(to.params)[0]] !== Store.getters['auth/user']._id
  ) {
    return next({ name: 'Forbidden', query: { redirect: from.path } })
  }
  next()
}

function checkAdmin (to, from, next) {
  if (Store.getters['auth/user'].role !== 'admins') {
    return next({ name: 'Forbidden', query: { redirect: from.path } })
  }
  next()
}

function checkAdminPartner (to, from, next) {
  if (
    Store.getters['auth/user'].role !== 'admins' &&
    Store.getters['auth/user'].role !== 'partners'
  ) {
    return next({ name: 'Forbidden', query: { redirect: from.path } })
  }
  next()
}

function checkOwnerOrNew (to, from, next) {
  if (
    Object.keys(to.params)[Object.keys(to.params).length - 1] &&
    !Store.getters['status-containers/list'].find(
      obj =>
        obj.reference === to.params[Object.keys(to.params)[0]] &&
        obj.user === Store.getters['auth/user']._id &&
        obj.relation === 'owner'
    )
  ) {
    return next({ name: 'Forbidden', query: { redirect: from.path } })
  }
  next()
}

function checkOwnerModeratorMember (to, from, next) {
  if (
    !Store.getters['status-containers/list'].find(
      obj =>
        obj.reference === to.params[Object.keys(to.params)[0]] &&
          obj.user === Store.getters['auth/user']._id &&
          (
            obj.relation === 'member' ||
            obj.relation === 'moderator' ||
            obj.relation === 'owner'
          )
    )
  ) {
    return next({ name: 'Forbidden', query: { redirect: from.path } })
  }
  next()
}

function checkOwnerModeratorMemberOrNew (to, from, next) {
  if (
    Object.keys(to.params)[Object.keys(to.params).length - 1] &&
    !Store.getters['status-containers/list'].find(
      obj =>
        obj.reference === to.params[Object.keys(to.params)[0]] &&
          obj.user === Store.getters['auth/user']._id &&
          (
            obj.relation === 'member' ||
            obj.relation === 'moderator' ||
            obj.relation === 'owner'
          )
    )
  ) {
    return next({ name: 'Forbidden', query: { redirect: from.path } })
  }
  next()
}

export default router
