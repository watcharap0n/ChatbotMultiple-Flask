new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        validCheck: [v => !!v || 'กรุณาคลิกเพื่อไปต่อ'],
        validSelect: [v => !!v || 'กรุณาเลือกผลิตภัณฑ์'],
        validEmail: [
            v => !!v || 'กรุณากรอกอีเมล',
            v => /.+@.+\..+/.test(v) || 'กรุณากรอกอีเมลให้ถูกต้อง',
        ],
        validTel: [
            v => !!v || 'กรุณากรอกเบอร์โทร',
            v => (v && v.length <= 10) || 'เบอร์โทรกรอกไม่ครบ',
        ],
        validOther: [v => !!v || 'กรุณากรอกข้อมูลให้ครบถ้วน'],
        checkbox: false,
        formElement: {
            name: '',
            email: '',
            company: '',
            tel: '',
            product: '',
            other: '',
            message: '',
            userId: '',
            email_private: '',
            profile: '',
            picture: '',
            channel: 'MangoCare'
        },
        valid: false,
        spinBtn: true,
    },
    delimiters: ["[[", "]]"],
    created() {
        liff.init({liffId: '1655240902-7A1woKDm'}, () => {
                if (liff.isLoggedIn()) {
                    liff.getProfile()
                        .then((profile) => {
                            console.log(liff.getContext());
                            this.formElement.userId = profile.userId
                            this.formElement.profile = profile.displayName
                            this.formElement.picture = profile.pictureUrl
                            this.formElement.email_private = liff.getDecodedIDToken().email
                        })
                } else {
                    liff.login();
                }
            }
        )
    },
    methods: {
        onSubmit() {
            let validate = this.$refs.form.validate()
            if (validate === true) {
                this.spinBtn = false
                const path = '/api/all/questionnaire'
                if (this.checkbox === true) {
                    this.formElement.product = 'รับข้อมูลข่าวสาร'
                } else if (this.checkbox === false) {
                    this.formElement.product = 'ไม่รับข้อมูลข่าวสาร'
                }
                axios.post(path, this.formElement)
                    .then(() => {
                        this.spinBtn = true
                        this.popUp()
                        this.$refs.form.reset()
                    })
                    .catch((err) => {
                        this.spinBtn = true
                        Swal.fire("มีบางอย่างผิดพลาด", "กรุณาลองใหม่อีกครั้งค่ะ", "error").then(() => {
                            liff.closeWindow();
                        })
                    })
            }
        },
        popUp() {
            Swal.fire("ข้อมูลบันทึกเรียบร้อย!", "เจ้าหน้าที่ได้รับข้อมูลของท่านแล้ว\nและจะดำเนินการติดต่อกลับให้เร็วที่สุด", "success").then(() => {
                liff.closeWindow();
            })
        },
    }
})