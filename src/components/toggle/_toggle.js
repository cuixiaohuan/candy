import { hx } from "../../common/_tools";

var CToggle = Vue.extend({
    props: {
        value: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        onToggle () {
            this.$emit("input", !this.value)
        }
    },
    render (h) {
        var me = this
        var $toggle = hx("label.c-switch-cp")

        var _ischecked = hx("input.c-switch-cp__input", {
            domProps: {
                type: "checkbox",
                checked: me.value
            },
            ref: "checkbox",
            on: {
                click () {
                    me.onToggle()
                }
            }
        })

        $toggle.push(_ischecked)

        $toggle.push(hx("div.c-switch-cp__box"))
        
        return $toggle.resolve(h)
    }
})

Vue.component("c-toggle", CToggle)