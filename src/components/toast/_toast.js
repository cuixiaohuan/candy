import {hx} from "../../common/_tools"

var CToast = Vue.extend({
    props: {
        message: {
            required: true,
            type: String
        },
        type: {
            type: String,
            default: "success" // success, loading, error
        },
        showTime: {
            type: Number,
            default: 0
        },
        value: {
            type: Boolean,
            default: false
        }

    },
    data: ()=>{
        return {
            realVal: false
        }
    },
    watch: {
        value(val) {
            this.realVal = val
        },
        realVal (val) {
            if (!val){
                this.$emit("input", false)
            } else {
                if(this.showTime){

                    setTimeout(() => {
                        this.realVal = false
                    }, this.showTime);
                }
            }
        }
    },
    computed: {
        cls () {
            var cls = ["c-icon_toast"]

            if (this.type === "success"){
                cls.push("c-native-icon-success")
            } else if (this.type === "error"){
                cls.push("c-native-icon-error")
            }

            return cls
        }
    },
    methods: {
        getContent () {
            var me = this
            let $content = hx("div.c-toast", {

            })

            var tmp =  hx(`div.${me.cls.join("+")}`)


            if(me.type === "loading"){
                tmp.push( hx("c-loading", {
                    props: {
                        size: 52
                    }
                }))
            }
            $content.push(tmp)


            if (me.message){

                $content.push(hx("div.c-toast__content", {

                }, [me.message]))
            }
            return $content

        }
    },
    render(h){
        var me = this

        var $toast = hx("div", {
                style: {
                    display: me.realVal ? "block" : "none"
                }
            },
            [hx("div.c-mask_transparent")]
        )

        $toast.push(me.getContent())
 
        return $toast.resolve(h)
    }
})

Vue.component("c-toast", CToast)
