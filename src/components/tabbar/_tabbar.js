import { hx } from "../../common/_tools";

var CTab = Vue.extend({

    model: {
        prop: 'value',
        event: 'input',
    },
    props: {
        value: [Number, String]
    },
    data (){
        return {
            list: []
        }
    },
    methods: {
        _getActiveTab () {

            var children = this.$slots.default
            
            children.some((child) => {
                
                if ( child.componentOptions && child.componentOptions.tag === "c-tab-item" && child.componentInstance){
                    this.$nextTick(_ => {

                        child.componentInstance.active = this.value === child.componentInstance.value
                        if (this.list.indexOf( child.componentInstance.val ) == -1) {
                            this.list.push(child.componentInstance.val)                            
                        }
                    })
                }
                    
            });
        }
    },
    created () {
    },
    render (h) {

        var me = this

        var $tabbar = hx("div.c-tabbar", {})

        var children = this.$slots.default

        children.forEach((child) => {
            
            if ( child.componentOptions && child.componentOptions.tag === "c-tab-item"){
                
                $tabbar.push(child)
            }
        });

        $tab = hx('div.c-tab')
        
        $tab.push( hx("div.c-tab__panel", {

        }, [this.$slots["panel"]]) )
        
        $tab.push($tabbar)

        return $tab.resolve(h)
    }
})

var CTabItem = Vue.extend({
    props: {
        value: [Number, String],
        tab: String,
        badge: Number,
        dot: [Boolean, Number],
        backgroundImg: {
            type: String
        }      
    },
    data () {
        return {
            active: false,
            val: this.value
        }
    },
    mounted () {
        this.$parent._getActiveTab()
    },
    beforeDestroy () {
        this.$parent._getActiveTab()
    },
    updated () {
        this.$parent._getActiveTab()
    },
    methods: {
        getIcon () {
            var me = this;
            if (this.backgroundImg){
                if (this.backgroundImg.indexOf("/")>-1 ){

                    return hx("img.c-tabbar__icon", {
                        attrs: {
                            src: me.backgroundImg
                        }
                    })
                } else {
                    return hx("span.c-tabbar__icon", {
                        
                    }, [
                        hx("c-icon", {
                            props: {
                                type: me.active?'success':'default',
                                icon: me.backgroundImg
                            }
                        })
                    ])
                }
            } else {
                return hx("span.c-tabbar__icon", {
                    
                }, me.$slots["icon"])
            }
        },
        getDot () {
            if (this.dot && !this.badge) {
                return hx("span.c-badge + c-badge_dot", {
                    style: {
                        position: "absolute",
                        top: 0,
                        right: "-6px"
                    }
                })
            } else {
                return null
            }
        },
        getBadge () {
            var me = this
            if (this.badge && !this.dot){
                return hx("span.c-badge", {
                    style: {
                        position: "absolute",
                        top: "-2px",
                        right: "-13px"
                    }
                }, [me.badge])
            } else {
                return null
            }
        }
    },
    render (h) {
        var $item, 
            me = this;

        $item = hx(`div.c-tabbar__item`, {
            "class": {
                "c-bar__item_on": me.active
            },
            on: {
                click () {

                    var parent = me.$parent

                    if (parent.$options && parent.$options._componentTag === "c-tab"){

                        parent.$emit("input", me.value)

                        me.$nextTick(rse=>{
                            parent._getActiveTab()
                            
                        })
                    }
                }
            }
        })
        
        var $span = hx(`span.c-tabbar__item-content`, {

        }, [me.getIcon(), me.getBadge(), me.getDot()])

        $item.push([
            $span,
            hx("p.c-tabbar__label", {}, [me.tab])
        ])

        return $item.resolve(h)

    }
})

Vue.component('c-tab-item', CTabItem)

Vue.component('c-tab', CTab)
