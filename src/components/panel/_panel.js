import { hx } from "../../common/_tools";

var CPanel = Vue.extend({
    props: {
        title: String
    },
    computed: {

    },
    render (h) {
        var $panel,
            $hd,
            me = this 

        $panel = hx('div.c-panel')
            
        if (!!me.title) {
            $hd = hx('div.c-panel__hd', {
                domProps: {
                    innerHTML: me.title
                }
            })
            $panel.push($hd)

        }

        if (me.$slots['default']) {
            var $bd = hx('div.c-panel__bd')

            $bd.push(me.$slots['default'])

            $panel.push($bd)
        }

        return $panel.resolve(h)
    }
})

Vue.component('c-panel', CPanel)