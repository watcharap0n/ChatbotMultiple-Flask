new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        user: {},
        products: [],
        subjects: ['สนใจสินค้าและบริการ', 'สอบถามการใช้งาน', 'แจ้งปัญหาโปรแกรม', 'ร้องเรียนการให้บริการ'],
        spinBtn: false,
    },
    delimiters: ["[[", "]]"],
    async created() {
        await this.initializedLIFF()
    },
    methods: {
        initializedLIFF() {
            liff.init({liffId: '1655208213-9mgJj1Ak'}, () => {
                    if (liff.isLoggedIn()) {
                        liff.getProfile()
                            .then((profile) => {
                                this.user.user_id = profile.userId
                                this.user.display_name = profile.displayName
                                this.user.img = profile.pictureUrl
                                this.user.email = liff.getDecodedIDToken().email
                                this.validationSave(this.user);
                            })
                    } else {
                        liff.login();
                    }
                }
            )
        },
        validationSave(user) {
            axios.post(`/MKT/notify/users/id/save`, user)
                .then((res) => {
                    this.getProfile(user)
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        getProfile(item) {
            const path = `/MKT/notify/users/${item.user_id}/obj/notify`
            axios.get(path)
                .then((res) => {
                    this.user = res.data.data
                    this.products = res.data.products
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        save() {
            this.spinBtn = true
            this.updateObj(this.user)
        },
        updateObj(item) {
            const path = `/MKT/notify/users/${item.user_id}/obj/notify`
            axios.put(path, item)
                .then((res) => {
                    this.spinBtn = false
                    Swal.fire(
                        'Success!',
                        'You will receive a notification after being approved!',
                        'success'
                    ).then(() => {
                        liff.closeWindow();
                    })
                })
                .catch((err) => {
                    console.error(err)
                })
        },

    },
})