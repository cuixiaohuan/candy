import { hx, ajax } from "../../common/_tools";

var CGallery = Vue.extend({
    props: {
        onClick: {
            type: Function,
            default: function () {
                
            }
        },
        value: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: "ion-trash-a"
        },
        img: String, // 图片路径
    },
    data() {
        return {
            show: this.value
        }
    },
    computed: {
    },
    watch: {
        value(val) { 
            this.show = val
        },
        show(val) { 
            if (!val) {
                this.$emit("input", val)
            }
        }
    },
    methods: {

    },
    render(h) {
        let me = this;

        let $gallery = hx('div.c-gallery', {
            style: {
                display: me.show?"block":"none"
            }
        });

        $gallery.push([
            hx("div.c-gallery_img", {
                style: {
                    backgroundImage: "url(" + me.img + ")"
                },
                on: {
                    click() { 
                        me.show = false
                    }
                }
            })
        ])

        let $btn = hx("div.c-gallery_opr", {
            on: {
                click() { 
                    me.onClick()
                }
            }
        }, [
            hx("c-icon", {
                props: {
                    icon: me.icon
                }
            })
        ])

        $gallery.push($btn)

        return $gallery.resolve(h)
    }
})

Vue.component('c-gallery', CGallery)