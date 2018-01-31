import { hx } from "../../common/_tools";

var CLoading = Vue.extend({
    props: {
        size: {
            type: Number,
            default: 20
        }
    },
    computed: {

    },
    render (h) {
        var $loading,
            me = this 

            $loading = hx("div.c-loading-effext", {
                style: {
                    width: me.size + "px",
                    height: me.size + "px"
                }
            }, [
                hx("span"),hx("span"),hx("span"),hx("span"),hx("span"),hx("span"),hx("span"),hx("span")
            ])
        
        return $loading.resolve(h)
    }
})

Vue.component('c-loading', CLoading)