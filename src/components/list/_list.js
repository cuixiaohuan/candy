import { hx } from "../../common/_tools";

var CList = Vue.extend({
    props: {
        legend: String,
        title: String,
        icon: String,
        href: String
    },
    computed: {
        cls () {
        }
    },
    watch: {
    },
    render (h) {
        var me = this,
            $list
        
        if ( this.href ){
            $list = hx('a.c-cell + c-cell_access + c-cell_link', {
                attrs: {
                    href: me.href
                }
            })            
        } else {
           $list = hx('div.c-cell')
        }

        if (!!me.icon ){
            $list.push(
                hx('div.c-cell__hd',
                {},
                [ hx(`i.c-btn_icon+${me.icon}`) ])
            )
        }
        if ( !!this.title ){
            var params_p = {
                domProps: {
                    innerHTML: me.title
                }
            }
            $list.push( hx('div.c-cell__bd', {},[ hx('p', params_p)]) )
        }

        if ( !!me.legend || !!me.href){
            var params_ft = {
                domProps: {
                    innerHTML: me.legend
                }
            }
            $list.push( hx('div.c-cell__ft', params_ft) )
        }
        return $list.resolve(h)
    }
})

Vue.component('c-list', CList)