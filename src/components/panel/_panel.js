import { hx } from "../../common/_tools";

var CPanel = Vue.extend({
    props: {
        title: String,
        link: String,
        icon: String,
        legend: String,

    },
    computed: {

    },
    render (h) {
        var $panel,
            $hd,
            me = this 

        $panel = hx('div.c-panel')
            
        if (!!me.title) {
            $hd = hx('div.c-panel__hd', {})

            if (!!me.link){
                // $hd.push(hx('a', {
                //     attrs: {
                //         href: me.link
                //     },
                //     domProps: {
                //         innerHTML: me.title
                //     }
                // }))
                var $header

                $header = hx('a.c-cell + c-cell_access', {
                    attrs: {
                        href: me.link
                    }
                })
        
                if (!!me.icon ){
                    $header.push(
                        hx('div.c-cell__hd',
                        {},
                        [ hx(`i.c-btn_icon+${me.icon}`) ])
                    )
                }
                var params_p = {
                    domProps: {
                        innerHTML: me.title
                    }
                }
                $header.push( hx('div.c-cell__bd', {},[ hx('p', params_p)]) )
        
                if ( !!me.legend ){
                    var params_ft = {
                        domProps: {
                            innerHTML: me.legend
                        }
                    }
                    $header.push( hx('div.c-cell__ft', params_ft) )
                } else {
                    $header.push( hx('div.c-cell__ft') )
                    
                }
                $hd.push($header)


            } else {
                $hd.push(hx('span', {
                    domProps: {
                        innerHTML: me.title
                    }
                }))
            }

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