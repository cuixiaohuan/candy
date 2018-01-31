import { hx } from "../../common/_tools";

var CNav = Vue.extend({
    props: {
        value: [Number, String],
        height: String
    },
    data (){
        return {
            list: []
        }
    },
    computed :{
    },
    methods: {
        _getActiveNav () {
            // debugger
            var children = this.$slots.default
            
            children.some((child) => {
                
                if ( child.componentOptions && child.componentOptions.tag === "c-nav-item" && child.componentInstance){
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

        var me = this,
            $navbar


        var navbar = hx("div.c-navbar", {})

        // var children = this.$children
        var children = this.$slots.default

        children.forEach((child) => {
            
            if ( child.componentOptions && child.componentOptions.tag === "c-nav-item"){
                
                navbar.push(child)
            }
        });

        var startX, startY, initialPos, startT, isMove,
            bodyWidth = document.body.offsetWidth;
        $tab = hx('div.c-tab', {},
            [
                navbar
            ])
        
        $tab.push( hx("div.c-tab__panel", {
            style: {
                height: me.height
            },
            on: {
                touchstart(e){
                    e.preventDefault();
                    var touch = e.touches[0];
                    startX = touch.pageX;
                    startT = new Date().getTime(); //记录手指按下的开始时间
                    // isMove = false; //是否产生滑动
                },
                touchmove(e){
                    // console.log('touchmove', e);
                    e.preventDefault();
                    var touch = e.touches[0];
                    var deltaX = touch.pageX - startX;
                },
                touchend(e){
                    // console.log(e)
                    var touch = e.changedTouches[0]
                    var endX = touch.pageX
                    
                    var index = me.list.indexOf(me.value)


                    var deltaT = new Date().getTime() - startT;
                    
                    var deltaX = touch.pageX - startX;
                    if (deltaT < 300){
                        if (deltaX > 0){
                            console.log('index', index);
                            
                            if (index === 0) {
                                index = me.list.length
                            }
                            me.$emit("input", me.list[--index])
                        } else if (deltaX < 0) {

                            if (index === me.list.length - 1) {
                                index = -1
                            }
                            me.$emit("input", me.list[++index])
                            console.log('index', index);
                            
                        }
                    } else {

                        if (deltaX > bodyWidth * 0.5){
                            console.log('index', index);
                            
                            if (index === 0) {
                                index = me.list.length
                            }
                            me.$emit("input", me.list[--index])
                        } else if (deltaX < -bodyWidth * 0.5) {

                            if (index === me.list.length - 1) {
                                index = -1
                            }
                            me.$emit("input", me.list[++index])
                            console.log('index', index);
                            
                        }
                    }
                    
                    console.log(me.list.join("--"))
                    
                        
                    me._getActiveNav()
                }
            }
        }, [this.$slots["default"]]) )
        

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
            me = this
        
        $item = hx(`div.c-navbar__item`, {
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
                }
            }
        }, [me.tab])
        
        return $item.resolve(h)

    }
})

Vue.component('c-nav-item', CNavItem)

Vue.component('c-nav', CNav)
