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
            })
        
            var span = hx("span", {
                style: {
                    width: me.size / 5 + "px",
                    height: me.size / 5 + "px"
                }
            })
            for (var i=0;i<8;i++){
                $loading.push(span)
                
            }

        return $loading.resolve(h)
    }
})

Vue.component('c-loading', CLoading)