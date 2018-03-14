import { hx } from "../../common/_tools";

var CNav = Vue.extend({
    props: {
        value: [Number, String],
        height: String
    },
    data (){
        return {
            list: [],
            scrollEle: "",
            needScroll: false
        }
    },
    computed :{
    },
    watch: {
        value (val){
            this.$emit("change", val)
        }
    },
    methods: {
        _getActiveNav (el) {

            var children = this.$slots.default
            
            children.some((child) => {
                
                if ( child.componentOptions && child.componentOptions.tag === "c-nav-item" && child.componentInstance){
                    this.$nextTick(_ => {
                        debugger
                        child.componentInstance.active = this.value === child.componentInstance.value
                        if (this.list.indexOf( child.componentInstance.val ) == -1) {
                            this.list.push(child.componentInstance.val)                            
                        }
                    })
                }
                    
            });

            if (this.needScroll && el && el.previousElementSibling){
                let ele = el.previousElementSibling
                this.scrollEle.scrollToElement(ele.previousElementSibling, 1000)
            }

        }
    },
    created () {
    },
    mounted () {

        var nav = this.$refs["scrollEle"]
        var content = this.$refs["content"]

        nav.style.height = content.clientHeight + "px"
        if (this.needScroll){

            this.scrollEle = new BScroll(nav, {
                scrollX: true,
                scrollY: false,
                bounce: false,
                click: true,
                tap: true
            })
        }

    },
    render (h) {

        var me = this,
            $navbar

        var navbar = hx("div.c-navbar", {
            ref: "scrollEle"
        })

        var children = this.$slots.default
        var tmp = []
        children.forEach((child) => {
            
            if ( child.componentOptions && child.componentOptions.tag === "c-nav-item"){
                
                tmp.push(child)
            }
        });

        me.needScroll = tmp.length > 5

        var $_content = hx("div.c-navbar__content", {
            ref: "content",
            style: {
                width: tmp.length > 5? 20*tmp.length+"%" : "100%"
            }
        })

        $_content.push(tmp)

        navbar.push($_content)


        var startX, startY, initialPos, startT, isMove,
            bodyWidth = document.body.offsetWidth;
        $tab = hx('div.c-tab', {

            style: {
                height: me.height || "100%"
            }
        },[ navbar ])
        
        $tab.push( hx("div.c-tab__panel", {
            // style: {
            //     height: me.height || "100%"
            // }
        }, [this.$slots["panel"]]) )
        
        return $tab.resolve(h)
    }
})

var CNavItem = Vue.extend({
    props: {
        value: [Number, String],
        tab: String
    },
    computed: {
        cls (){
            var cls = ''

            if (this.active){
                cls = "c-bar__item_on"
            } else {
                cls = ""
            }
            return cls
        }
    },
    data () {
        return {
            active: false,
            val: this.value
        }
    },
    mounted () {
        this.$parent._getActiveNav()
    },
    beforeDestroy () {
        this.$parent._getActiveNav()
    },
    updated () {
        this.$parent._getActiveNav()
    },
    render (h) {
        var $item, 
            me = this,
            round = parseInt(Math.random()*1000)
        
        $item = hx(`div.c-navbar__item`, {
            ref: "item"+round,
            "class": {
                "c-bar__item_on": me.active
            },
            on: {
                click () {

                    var parent = me.$parent

                    if (parent.$options && parent.$options._componentTag === "c-nav"){

                        parent.$emit("input", me.value)

                        me.$nextTick(rse=>{
                            parent._getActiveNav()
                            
                        })
                    }
                },
                tap () {

                    var parent = me.$parent
                    
                    if (parent.$options && parent.$options._componentTag === "c-nav"){

                        parent.$emit("input", me.value)

                        me.$nextTick(rse=>{
                            parent._getActiveNav(me.$refs["item"+round])
                            
                        })
                    }
                }
            }
        }, [me.tab])
        
        return $item.resolve(h)

    }
})

Vue.component('c-nav-item', CNavItem)

Vue.component('c-nav', CNav)
