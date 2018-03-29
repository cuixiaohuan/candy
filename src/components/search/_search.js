import { hx } from "../../common/_tools";

var CSearchbar = Vue.extend({
    model: {
        prop: 'value',
        event: 'input',
    },
    data () {
        return {
            isfocus: false,

        }
    },
    props: {
        value: [String, Number],
        placeholder: [String, Number],
    },
    computed :{
        cls () {
            var cls = ''
            if (this.isfocus) {
                cls = 'c-search-bar_focusing'
            }
            return cls
        },
    },
    render (h) {
        var me = this,
            $searchbar,
            $box,
            $label,
            $btn,
            $input;

        
        $input = hx( 'input.c-search-bar__input', {
            attrs: {
                type: 'search',
                placeholder: me.placeholder
            },
            domProps: {
                value: me.value
            },
            on: {
                focus () {
                    me.isfocus = true
                },
                input (e) {
                    me.$emit('input', e.target.value)
                }
            }
        } )

        $box = hx('div.c-search-bar__box', {}, [
            // c-native-icon-search
            hx('i.c-native-icon-search', {
                style: {
                    fontSize: '14px'
                }
            }),
            $input,
            hx( 'a.c-icon-clear', {
                attrs: {
                    href: 'javascript:;'
                }
            } )
        ] )


        $label = hx( 'label.c-search-bar__label', {
            on: {
                click () {
                    $input.props.on.focus()
                }
            }
        }, [
            hx('i.c-native-icon-search', {
                style: {
                    fontSize: '14px'
                }
            }),
            hx('span', {
                domProps: {
                    innerHTML: '搜索'
                }
            })
        ] )

        $btn = hx('a.c-search-bar__cancel-btn', {
            domProps: {
                innerHTML: '取消'
            },
            attrs: {
                href: 'javascript:;'
            },
            on: {
                click () {
                    me.isfocus = false
                    me.$emit('input', '')
                }
            }
        })

        $searchbar = hx(`div.c-search-bar + ${me.cls}`)

        $searchbar.push([hx('div.c-search-bar__form').push( [$box, $label] ), $btn])
        if (me.$slots['result']){
            $searchbar = hx('div.searchbar-result', {}, [$searchbar, ...me.$slots['result']])
        }
        return $searchbar.resolve(h)
    }
})


Vue.component('c-searchbar', CSearchbar)