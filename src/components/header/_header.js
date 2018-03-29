import { hx } from '../../common/_tools.js'

var CHeader = Vue.extend({
    props: {
        title: String,
        left: {
            type: Object,
            default() {
                return {}
            }
        },
        right: {
            type: Object,
            default() {
                return {}
            }
        },
        type: {
            type: String,
            default: "light"
        }
    },
    data() { 
        return {

        }
    },
    computed: {
        cls() { 
            return "c-header_" + this.type
        }
    },
    methods: {
        getLeftBtn() { 
            if (Object.keys(this.left).length === 0) {
                return null
            }

            let { icon, text, click } = this.left
            
            let $left = hx("div.c-header_left", {
                on: {
                    click() {
                        console.log('11');
                        
                        click()
                    }
                }
            })

            if (icon) {
                $left.push(hx("c-icon", {
                    props: {icon}
                }))
            }

            if (text) {
                $left.push(text)
            }

            return $left

        },
        getRightBtn() { 
            if (Object.keys(this.right).length === 0) {
                return 
            }

            let { icon, text, click } = this.right
            
            let $right = hx("div.c-header_right", {
                on: {
                    click() {
                        console.log('22');
                        click()
                    }
                }
            })

            if (text) {
                $right.push(text)
            }
            
            if (icon) {
                $right.push(hx("c-icon", {
                    props: { icon }
                }))
            }

            return $right
        },
        getTitle() { 
            return hx("div.c-header_title", { }, [this.title])
        }
    },
    render(h) {
        var $header = hx(`div.c-header+${this.cls}`),
            $content = hx('div.c-header_content')
        let me = this

        $content.push([
            me.getLeftBtn(),
            me.getTitle(),
            me.getRightBtn()            
        ])
        
        $header.push($content)

        return $header.resolve(h)
    }
})

Vue.component('c-header', CHeader)