import { hx } from '../../common/_tools.js'

var CActionsheet = Vue.extend({
    data() {
        return {
            isShow: this.value
        }
    },
    props: {
        noClose: { // 是否有取消按钮
            type: Boolean,
            default: false
        },
        maskCloseable: { // 点击背景隐藏
            type: Boolean,
            default: true
        },
        title: String,
        menuList: Array,
        value: {
            type: Boolean,
            default: false
        },
        styleSheet: {
            type: String,
            default: 'IOS' 
        }

    },
    watch: {
        value(val) {
            this.isShow = val
        },
        isShow(val) {
            if (!val) {
                this.$emit('input', val)
            }
        }
    },
    computed: {
        cls() {
            var cls = []

            if (this.isShow) {
                cls.push('c-actionsheet_toggle')
            }

            return cls
        },
        maskStyle() {
            var maskStyle = {}
            if (this.styleSheet == 'Android' || this.styleSheet == 'android' || this.styleSheet == 2) return maskStyle
            if (this.isShow) {
                maskStyle = {
                    opacity: 1
                }
            } else {
                maskStyle = {
                    opacity: 0,
                    display: 'none'
                }
            }

            return maskStyle
        },
        sheetStyle() {
            var sheetStyle = {}

            if (this.styleSheet == 'IOS' || this.styleSheet == 'ios' || this.styleSheet == 1) return sheetStyle
            if (this.isShow) {
                sheetStyle = {
                    opacity: 1
                }
            } else {
                sheetStyle = {
                    opacity: 0,
                    display: 'none'
                }
            }

            return sheetStyle
        }
    },
    render(h) {
        var me = this,
            $actionsheet,
            titleParams = {},
            $menuList,
            $content = hx(`div.c-actionsheet + ${me.cls.join('+')}`)

        var $menu = hx('div.c-actionsheet__menu', {})

        // title
        if (!!this.title) {
            titleParams = {
                domProps: {
                    innerHTML: me.title
                }
            }

            var $title = hx('div.c-actionsheet__title', {}, [
                hx('p.c-actionsheet__title-text', titleParams)
            ])

            $menu.push($title)
        }

        // content
        if (me.$slots["content"]){
            $menu.push(me.$slots["content"])

        } else if (!!me.menuList) {
            me.menuList.forEach((item) => {
                $menu.push(hx('a.c-actionsheet__cell ', {
                    domProps: {
                        innerHTML: item.name,
                        value: item.id
                    },
                    attrs: {
                        href: item.href
                    },
                    on: {
                        click() {
                            me.$emit("click", item)
                        }
                    }
                }))
            });
        }

        $content.push($menu)

        if (!me.noClose) {
            var $footer = hx('div.c-actionsheet__action', {}, [
                hx('div.c-actionsheet__cell', {
                    domProps: {
                        innerHTML: '取消'
                    },
                    on: {
                        click() {
                            me.isShow = false
                        }
                    }
                })
            ])
            $content.push($footer)
        }

        var domName = 'div'
        if (me.styleSheet == 'Android' || me.styleSheet == 'android' || me.styleSheet == 2) {
            domName = 'div.c-skin_android'
        }

        $actionsheet = hx(domName, {
            style: me.sheetStyle,

        }).push([
            hx('div.c-mask', {
                style: me.maskStyle,
                on: {
                    click() {
                        if (me.maskCloseable) {
                            me.isShow = false

                        }
                    }
                }
            }), $content
        ])

        return $actionsheet.resolve(h)
    }
})

Vue.component('c-actionsheet', CActionsheet)