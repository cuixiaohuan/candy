import { hx, getRect } from "../../common/_tools";

const pullDownRefreshTxt = "刷新成功"
const pullUpLoadTxt = "加载更多"

var CPull = Vue.extend({
    props: {
        value: Array,
        height: String,

        pullDownRefresh: {
            type: null,
            default: false
        },
        pullUpLoad: {
            type: null,
            default: false
        }

    },
    data () {
        return {
            pullingEle: "",

            beforePullDown: true,
            isPullingDown: false,

            // beforeUpLoad: false,
            isPullUpLoad: false,

            hasMore: true

        }
    },
    computed: {
        pullDownRefreshTxt () {

            return this.pullDownRefresh && this.pullDownRefresh.msg || pullDownRefreshTxt
        },
        pullUpLoadTxt () {

            return this.pullUpLoad && this.pullUpLoad.msg || pullUpLoadTxt
        }
    },
    watch: {
        value: {
            handler(val){
                this.forceUpdate()
            },
            deep:true
        }
    },
    methods: {

        refresh() {

            this.pullingEle && this.pullingEle.refresh()
        },
        initPullDownRefresh () {
            this.pullingEle.on('pullingDown', () => {
                this.beforePullDown = false
                this.isPullingDown = true
                
                this.$emit('pulling-down')
            })
          
        },
        initPullUpLoad () {

            this.pullingEle.on("pullingUp", () => {

                this.isPullUpLoad = true;
                
                this.$emit('pulling-up')
                // this.refresh()
                // this.forceUpdate()

            })
        },

        forceUpdate(dirty) {
            if (this.pullDownRefresh && this.isPullingDown) {
                this.isPullingDown = false
                this._reboundPullDown().then(() => {
                    this._afterPullDown()
                })
            } else if (this.pullUpLoad && this.isPullUpLoad) {
                this.isPullUpLoad = false
                this.pullingEle.finishPullUp()
                // this.pullUpDirty = dirty
                this.refresh()

            } else {
                this.refresh()
            }
        },

        _reboundPullDown() {
            const {stopTime = 600} = this.pullingEle.options.pullDownRefresh
            return new Promise((resolve) => {
                setTimeout(() => {

                    // this.isRebounding = true
                    this.pullingEle.finishPullDown()
                    resolve()
                }, stopTime)
            })
        },

        _afterPullDown() {
            setTimeout(() => {
                this.beforePullDown = true
                // this.isRebounding = false
                this.refresh()
            },  this.pullingEle.options.bounceTime)
        },
        _getPullUpTag ($bd) {
            var me = this

            var $content = hx("div.c-pullUp", {
            })

            $content.push( hx("span", {
                style: {
                    display: this.pullUpLoad && !this.isPullUpLoad?"block":"none",
                }
            }, [this.pullUpLoadTxt]) )

            $content.push( hx("c-loading", {
                style: {
                    display: this.pullUpLoad && this.isPullUpLoad?"block":"none",
                }
            }))

            $bd.push($content)

        },
        _getPullDownTag ($bd) {
            var $cPulldown = hx("div.c-pulldown")

            $cPulldown.push(hx("c-loading", {
                style: {
                    // position: "absolute",
                    // top: "-24px",
                    // marginTop: "6px",
                    // left: "50%",
                    // transform: "translateX(-50%)",
                    display: this.isPullingDown && !this.beforePullDown ? "block" : "none"
                }
            }))
            $cPulldown.push(hx("p", {
                style: {
                    // position: "absolute",
                    // top: "-24px",
                    // left: "50%",
                    // marginTop: "6px",
                    // transform: "translateX(-50%)",
                    display: !this.isPullingDown && !this.beforePullDown ? "block" : "none"
                }
            },
            [this.pullDownRefreshTxt]))

            $bd.push($cPulldown)

        }

    },
    mounted(){

        if ( this.pullDownRefresh || this.pullUpLoad){

            var $pull = this.$refs["c-pull"]
            var $scroll = this.$refs["pulling-wrap"]
            var $scrollContent = this.$refs["pulling-content"]
            
            $scroll.style.height = `${getRect($pull).height}px` 
            $scrollContent.style.minHeight = `${getRect($scroll).height + 1}px` 

            this.$nextTick(_ => {
                this.pullingEle = new BScroll($scroll, {
                    bounceTime: 700,
                    probeType: 1,
                    // maxScrollY: "-2000px",
                    pullDownRefresh: {
                        threshold: 50,
                        stop: 20,
                        stopTime: 600
                    },
                    pullUpLoad: {
                        threshold: 50
                    }
                })

                if ( this.pullUpLoad){
                    this.initPullUpLoad()
                }

                if (this.pullDownRefresh){
                    this.initPullDownRefresh()
                }

            })
          

        }


    },
    render (h) {
        var $pull,
            me = this 

        $pull = hx('div.c-pull', {
            ref: "c-pull",
            
            style: {
                height: me.height || "auto"
                // height: (me.pullDownRefresh || me.pullUpLoad)? "100%": "auto"
            }
        })

        
        if (me.$slots['default']) {
            var $bd = hx("div", {
                ref: "pulling-wrap",
            })

            // var $bd = hx('div.c-panel__bd', {
            //     ref: "pulling-wrap",
            //     style: {
            //         overflow: (me.pullDownRefresh || me.pullUpLoad) ? "hidden" : "auto"
            //     },
            // })

            if (me.pullDownRefresh || me.pullUpLoad){

                var _tmp = hx("div.c-pulling", {
                    ref: "pulling-content",
                    style: {

                        // paddingBottom: this.pullUpLoad? "38px": "0"
                    }
                }, [me.$slots['default']])
                
                if (me.pullDownRefresh ){
                    // pulldown的样式
                    me._getPullDownTag(_tmp)
                }
                if (me.pullDownRefresh ){
                    
                    // pullup的样式
                    me._getPullUpTag(_tmp)
                }                
                $bd.push(_tmp)

            } else {
                $bd.push(me.$slots['default'])
            }
            
            $pull.push($bd)
        }

        return $pull.resolve(h)
    }
})

Vue.component('c-pull', CPull)