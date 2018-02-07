import { hx, getRect } from "../../common/_tools";

const pullDownRefreshTxt = "刷新成功"
const pullUpLoadTxt = "加载更多"

var CPanel = Vue.extend({
    props: {
        title: String,
        link: String,
        icon: String,
        legend: String,
        height: String,

    },
    data () {
        return {

        }
    },
    computed: {
    },
    watch: {
    },
    methods: {
        _getHeader () {
            var me = this
            var $hd = hx('div.c-panel__hd', {})
            
            if (!!me.link){
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

                $header.push( hx('div.c-cell__bd', {},[ hx('p',{}, [me.title])]) )
                
                if ( !!me.legend ){
                    $header.push( hx('div.c-cell__ft', {}, [me.legend]) )
                } else {
                    $header.push( hx('div.c-cell__ft') )
                    
                }
                $hd.push($header)


            } else {
                $hd.push(hx('span', {}, [me.title]))
            }

            return $hd
        }

    },
    mounted(){
    },
    render (h) {
        var $panel,
            me = this 

        $panel = hx('div.c-panel', {
            style: {
                height: me.height || "auto"
            }
        })
            
        if (!!me.title || !!this.link) {
            $panel.push( me._getHeader())
        }

        
        if (me.$slots['default']) {

            var $bd = hx('div.c-panel__bd', {
                style: {
                    overflow: (me.pullDownRefresh || me.pullUpLoad) ? "hidden" : "auto"
                },
            })

            $bd.push(me.$slots['default'])
            
            $panel.push($bd)
        }

        if (me.$slots['footer']) {

            var $ft = hx('div.c-panel__ft')

            $ft.push(me.$slots['footer'])

            $panel.push($ft)
        }

        return $panel.resolve(h)
    }
})

Vue.component('c-panel', CPanel)