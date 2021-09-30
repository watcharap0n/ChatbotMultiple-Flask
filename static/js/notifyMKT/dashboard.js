new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        roleList: false,
        search: '',
        roles: ['ADMIN', 'MEMBER', 'STAY'],
        selectedItem: '',
        selectedList: 0,
        headers: [
            {text: 'Image', value: 'img', align: 'right', width: 50},
            {text: 'Info', value: 'display_name', align: 'center', width: 100},
            {text: 'Approval', value: 'approval_status', align: 'center', width: 120},
            {text: 'Role', value: 'role', align: 'center'},
            {text: 'Model', value: 'model', align: 'center', width: 50},
            {text: 'Date', value: 'date', align: 'center'},
        ],
        transaction: [],
        user: {}

    },
    delimiters: ["[[", "]]"],
    async mounted() {
        await this.initializedLIFF()
    },
    methods: {
        async validationSave() {
            const path = `/MKT/notify/users/${this.user.user_id}/save`
            await axios.get(path)
                .then((res) => {
                    console.log(res.data)
                    this.validationUser()
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        async validationUser() {
            console.log(this.user)
            const path = `/MKT/notify/users/${this.user.user_id}/validation`
            await axios.get(path)
                .then((res) => {
                    console.log(res.data)
                    this.initialized()
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        async initialized() {
            const path = '/MKT/notify/users'
            await axios.get(path)
                .then((res) => {
                    this.transaction = res.data
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        initializedLIFF() {
            liff.init({liffId: '1655208213-k48wpvK9'}, () => {
                    if (liff.isLoggedIn()) {
                        liff.getProfile()
                            .then((profile) => {
                                console.log(profile)
                                this.user.user_id = profile.userId
                                this.user.display_name = profile.displayName
                                this.user.img = profile.pictureUrl
                                this.user.email = liff.getDecodedIDToken().email
                                console.log(this.user)
                            })
                    } else {
                        liff.login();
                    }
                }
            )
        },
        roleUpdate(item, role) {
            item.role = role
            this.updateObj(item)
        },
        updateObj(item) {
            const path = `/MKT/notify/users/${item.user_id}/obj/notify`
            axios.put(path, item)
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        },

    },
})