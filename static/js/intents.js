new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        icons: [
            {
                icon: 'mdi-facebook',
                href: 'https://www.facebook.com/mangoconsultant/'
            },
            {
                icon: 'mdi-twitter',
                href: ''
            },
            {
                icon: 'mdi-linkedin',
                href: ''
            },
            {
                icon: 'mdi-instagram',
                href: 'https://www.instagram.com/mangoconsultant/'
            },
        ],
        navigatorAppbar: false,
        selectedList: 2,
        itemsAppbar: [
            {text: 'Mango', icon: 'mdi-database'},
            {text: 'Dashboard', icon: 'mdi-monitor-dashboard'},
            {text: 'Intents', icon: 'mdi-account'},
        ],
        userAuth: {
            name: '',
            picture: '',
            email: '',
            uid: '',
        },
        notify_today: [],
        selectedNotify: 0,

        loaderSpin: true,
        loaderData: false,
        //================================

        items: [
            {
                icon: 'mdi-inbox',
                text: 'Webhook',
            },
            {
                icon: 'mdi-human-child',
                text: 'สอนบอทแมงโก้'
            },
            {
                icon: 'mdi-chat-plus',
                text: 'สอนบอทด้วยไลน์อื่น',
            },
            {
                icon: 'mdi-chat-alert',
                text: 'RuleBased',
            },
            {
                icon: 'mdi-android-messages',
                text: 'QuickReply'
            }
        ],
        modelList: 0,
        showWebhook: true,
        showIntent: false,
        showBotMango: false,
        showRuleBased: false,
        showQuickReply: false,

        spinAuth: false,
        hasSaved: false,
        isEditing: null,
        ACCESS_TOKEN: '',
        SECRET_LINE: '',
        validWebhook: false,
        webhook: '',
        spinWebhook: true,
        rules: [v => !!v || 'require!'],

        treeHidden: false,
        hiddenIntent: false,
        hiddenAccess: true,
        nameIntent: '',
        nameAccestoken: '',
        mangoAccess: '',
        validAccess: false,
        dialogIntent: false,
        dialogDeleteIntent: false,
        dialogAcesstoken: false,
        question: '',
        answer: '',
        active: [],
        open: [],
        users: [],
        spinIntent: true,
        dataAppend: {
            id: '',
            uid: '',
            name: '',
            question: [],
            answer: [],
            access_token: '',
            type: false,
            contents: '',
        },
        //IntentMango
        dialogIntentMango: false,
        dialogDeleteMango: false,

        // rule based
        nameRuleBased: '',
        answerRuleBased: '',
        hiddenRuleBased: false,
        active_r: [],
        user_r: [],
        open_r: [],
        text: '',
        snackbar: false,
        timeout: 2000,
        dialogRuleBased: false,
        dialogDeleteRuleBased: false,
        dialogQuickReply: false,
        checkbox: true,
        colorSnackbar: '',

        // quick reply
        dialogDeleteQuick: false,
        choice_intents: [],
        user_quick: [],
        active_quick: [],
        open_quick: [],
        hiddenQuickReply: false,
        textQuick: '',
        labelQuick: '',
        quickData: {
            id: '',
            name: '',
            texts: [],
            labels: [],
            reply: '',
            quick_name: '',
            access_token: '',
        }

    },
    delimiters: ["[[", "]]"],

    beforeCreate() {
        const path = '/secure/read'
        axios.get(path)
            .then((res) => {
                this.loaderSpin = false
                this.loaderData = true
                let user = this.userAuth
                user.name = res.data.name
                user.picture = res.data.picture
                user.email = res.data.email
                user.uid = res.data.uid
            })
    },
    computed: {
        datetimeNow() {
            const today = new Date();
            return today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        },
        itemsIntent() {
            return [
                {
                    name: 'Intents',
                    children: this.users,
                },
            ]
        },
        itemRuleBased() {
            return [
                {
                    name: 'Rule Based',
                    children: this.user_r
                }
            ]
        },
        itemQuickReply() {
            return [
                {
                    name: 'Quick Reply',
                    children: this.user_quick
                }
            ]
        },
        selectedIntent() {
            if (!this.active.length) return undefined
            const id = this.active[0]
            return this.users.find(user => user.id === id)
        },
        selectedRuleBased() {
            if (!this.active_r.length) return undefined
            const id = this.active_r[0]
            return this.user_r.find(user => user.id === id)
        },
        selectedQuickReply() {
            if (!this.active_quick.length) return undefined
            const id = this.active_quick[0]
            return this.user_quick.find(user => user.id === id)
        },
    },
    methods: {
        saveWebhook() {
            this.spinWebhook = false
            let form = this.$refs.formWebhook.validate();
            if (form === true) {
                let data = {ACCESS_TOKEN: this.ACCESS_TOKEN, SECRET_LINE: this.SECRET_LINE}
                const path = '/callback/save'
                axios.post(path, data)
                    .then((res) => {
                        this.webhook = res.data.webhook
                        this.hasSaved = true;
                        this.spinWebhook = true
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
        },

        logout() {
            return window.location = '/secure/logout'
        },

        // start intent
        formAccessToken() {
            this.hiddenAccess = false
            this.dialogAcesstoken = false
            this.treeHidden = true
        },
        async quickReply(item) {
            const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
            await pause(1500)
            if (this.showQuickReply === true) {
                return this.getQuickReply(null, item)
            }
        },

        getQuickReply(data, item) {
            const path = `quick_reply/get`
            return axios.post(path, data)
                .then((res) => {
                    item.children.push(...res.data)
                    this.hiddenQuickReply = true
                    let path = 'quick_reply/get_intents'
                    axios.get(path)
                        .then((res) => {
                            res.data.forEach((val) => {
                                this.choice_intents.push(val.name)
                            })
                        })
                        .catch((err) => {
                            console.error(err)
                        })
                })
                .catch((err) => console.error(err))
        },
        createQuickReply() {
            this.spinIntent = false
            this.addQuickReply(this.quickData)
        },

        addQuickReply(data) {
            const path = `/quick_reply/create`
            axios.post(path, data)
                .then((res) => {
                    Object.assign(this.quickData, {})
                    this.spinIntent = true
                    this.user_quick.push(res.data)
                    this.dialogQuickReply = false
                })
                .catch((err) => {
                    Object.assign(this.quickData, {})
                    this.spinIntent = true
                    this.dialogQuickReply = false
                    console.error(err)
                })
        },
        async sendQuickReply() {
            this.spinIntent = false
            this.selectedQuickReply.texts.push(this.textQuick)
            await this.putQuickReply()
            this.textQuick = ''
            this.spinIntent = true
        },
        async removeQuickReply(item) {
            this.spinIntent = false
            this.selectedQuickReply.texts.splice(this.selectedQuickReply.texts.indexOf(item), 1)
            await this.putQuickReply()
            this.spinIntent = true
        },
        async sendLabelQuick() {
            this.spinIntent = false
            this.selectedQuickReply.labels.push(this.labelQuick)
            await this.putQuickReply()
            this.labelQuick = ''
            this.spinIntent = true
        },
        async removeLabelQuick(item) {
            this.spinIntent = false
            this.selectedQuickReply.labels.splice(this.selectedQuickReply.labels.indexOf(item), 1)
            await this.putQuickReply()
            this.spinIntent = true
        },

        async putQuickReply() {
            const path = `quick_reply/update/${this.selectedQuickReply.id}`
            await axios.put(path, this.selectedQuickReply)
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        deleteQuickReply(item) {
            this.spinIntent = false
            const path = `/quick_reply/delete/${item.id}`
            axios.delete(path)
                .then((res) => {
                    this.active_quick = []
                    this.user_quick.splice(this.user_quick.indexOf(item), 1)
                    this.dialogDeleteQuick = false
                    this.spinIntent = true
                })
                .catch((err) => {
                    console.error(err)
                    this.active_quick = []
                    this.dialogDeleteQuick = false
                    this.spinIntent = true
                })

        },

        async ruleBased(item) {
            const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
            await pause(1500)
            if (this.showRuleBased === true) {
                return this.getRuleBased(null, item)
            }
        },
        getRuleBased(data, item) {
            const path = `/callback/mango/get_rule_based`
            return axios.post(path, data)
                .then((res) => {
                    item.children.push(...res.data)
                    this.hiddenRuleBased = true
                })
                .catch((err) => console.error(err))
        },
        createRuleBased() {
            this.spinIntent = false
            let data = {
                keyword: '',
                name: this.nameRuleBased,
                contents: '',
                status: false,
            }
            this.addRuleBased(data)

        },
        addRuleBased(data) {
            const path = `/callback/mango/match_rule_based`
            axios.post(path, data)
                .then((res) => {
                    this.nameRuleBased = ''
                    this.spinIntent = true
                    this.user_r.push(res.data)
                    this.dialogRuleBased = false
                })
                .catch((err) => {
                    console.error(err)
                })
        },

        saveRuleBased() {
            const path = `/callback/mango/update_rule_based/${this.selectedRuleBased.id}`
            axios.put(path, this.selectedRuleBased)
                .then((res) => {
                    if (res.data.status) {
                        this.colorSnackbar = 'success'
                        this.text = 'บันทึกสำเร็จ'
                        this.snackbar = true
                    } else if (!res.data.status) {
                        this.colorSnackbar = 'red'
                        this.text = 'Keyword ซ้ำ! โปรดเปลี่ยน Keyword'
                        this.snackbar = true
                    }
                })
                .catch((err) => {
                    this.colorSnackbar = 'red'
                    this.text = 'มีบางอย่างผิดพลาด keyword อาจซ้ำ!'
                    this.snackbar = true
                    console.error(err)
                })
        },

        deleteRuleBased(item) {
            this.spinIntent = false
            const path = `/callback/mango/delete_rule_based/${item.id}`
            axios.delete(path)
                .then(() => {
                    this.user_r.splice(this.user_r.indexOf(item), 1)
                    this.active_r = []
                    this.dialogDeleteRuleBased = false
                    this.spinIntent = true
                })
                .catch((err) => {
                    console.error(err)
                    this.active_r = []
                    this.dialogDeleteRuleBased = false
                    this.spinIntent = true
                })

        },

        async intents(item) {
            const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
            await pause(1500)
            if (this.showIntent === true) {
                let data = {'access_token': this.nameAccestoken}
                return this.getIntents(data, item)
            } else if (this.showBotMango === true) {
                return this.getIntents(null, item)
            }
        },

        getIntents(data, item) {
            const path = `/intent/data`
            return axios.post(path, data)
                .then((res) => {
                    item.children.push(...res.data)
                    this.hiddenIntent = true
                })
                .catch((err) => console.error(err))
        },

        createIntent() {
            if (this.showIntent === true) {
                this.spinIntent = false
                this.dataAppend.name = this.nameIntent
                this.dataAppend.uid = this.userAuth.uid
                this.dataAppend.access_token = this.nameAccestoken
                this.addIntent(this.dataAppend)
            } else if (this.showBotMango === true) {
                this.spinIntent = false
                this.dataAppend.name = this.nameIntent
                this.dataAppend.uid = this.userAuth.uid
                this.dataAppend.access_token = null
                this.addIntent(this.dataAppend)
            }
        },
        addIntent(data) {
            const path = '/intent/add'
            axios.post(path, data)
                .then((res) => {
                    this.nameIntent = ''
                    this.spinIntent = true
                    this.users.push(res.data)
                    this.dialogIntent = false
                    this.dialogIntentMango = false
                })
                .catch((err) => {
                    console.error(err)
                    this.dialogIntent = false
                    this.dialogIntentMango = false
                    this.nameIntent = ''
                    this.spinIntent = true
                })
        },
        deleteIntent(item) {
            this.spinIntent = false
            const path = `/intent/delete_intent/${item.id}`
            axios.delete(path)
                .then((res) => {
                    this.active = []
                    this.users.splice(this.users.indexOf(item), 1)
                    this.dialogDeleteIntent = false
                    this.dialogDeleteMango = false
                    this.spinIntent = true
                })
                .catch((err) => {
                    console.error(err)
                    this.active = []
                    this.dialogDeleteIntent = false
                    this.dialogDeleteMango = false
                    this.spinIntent = true
                })

        },
        async sendQuestion() {
            this.spinIntent = false
            this.selectedIntent.question.push(this.question)
            await this.updateIntent()
            this.spinIntent = true
        },
        async sendAnswer() {
            this.spinIntent = false
            this.selectedIntent.answer.push(this.answer)
            await this.updateIntent()
            this.spinIntent = true
        },
        async removeAnswer(item) {
            this.selectedIntent.answer.splice(this.selectedIntent.answer.indexOf(item), 1)
            await this.updateIntent();
        },
        async removeQuestion(item) {
            this.selectedIntent.question.splice(this.selectedIntent.question.indexOf(item), 1)
            await this.updateIntent();
        },
        async updateIntent() {
            const path = `/intent/update_intent/${this.selectedIntent.id}`
            await axios.put(path, this.selectedIntent)
                .then((res) => {
                    this.question = ''
                    this.answer = ''
                    this.colorSnackbar = 'success'
                    this.text = 'สำเร็จ'
                    this.snackbar = true
                })
                .catch((err) => {
                    this.colorSnackbar = 'red'
                    this.text = 'เกิดข้อผิดพลาด โปรดลองใหม่!'
                    this.snackbar = true
                    console.error(err)
                })
        },

        // listModel
        listModel(data) {
            if (data === 'Webhook') {
                this.nameAccestoken = ''
                this.mangoAccess = ''
                this.showIntent = false
                this.showWebhook = true
                this.showBotMango = false
                this.showRuleBased = false
                this.showQuickReply = false
            } else if (data === 'สอนบอทด้วยไลน์อื่น') {
                this.nameAccestoken = ''
                this.mangoAccess = ''
                this.showWebhook = false
                this.showIntent = true
                this.showBotMango = false
                this.showRuleBased = false
                this.showQuickReply = false
            } else if (data === 'สอนบอทแมงโก้') {
                this.nameAccestoken = ''
                this.mangoAccess = 'mango'
                this.showWebhook = false
                this.showIntent = false
                this.showBotMango = true
                this.showRuleBased = false
                this.showQuickReply = false
            } else if (data === 'RuleBased') {
                this.nameAccestoken = ''
                this.mangoAccess = 'mango'
                this.showWebhook = false
                this.showIntent = false
                this.showBotMango = false
                this.showRuleBased = true
                this.showQuickReply = false
            } else if (data === 'QuickReply') {
                this.nameAccestoken = ''
                this.mangoAccess = 'mango'
                this.showWebhook = false
                this.showIntent = false
                this.showBotMango = false
                this.showRuleBased = false
                this.showQuickReply = true
            }
        },

        redirectPage(item) {
            console.log(item)
            if (item.text === 'Mango')
                window.location = '/'
            if (item.text === 'Intents')
                window.location = '/intents'
            if (item.text === 'Dashboard')
                window.location = '/dashboard'
        },
    }
})