import {hx} from "../../common/_tools";

var CPagination = Vue.extend({

    data(){
        return {
            realPageNum: this.pageNum,
            maxPageNum: 0
        }
    },
    props: {
        showNumber: {
            type: Boolean,
            default: true
        },
        showButton: {
            type: Boolean,
            default: true
        },
        prev: String,
        prevIcon: {
            type: String,
            default: ""
        },
        next: String,
        nextIcon: {
            type: String,
            default: ""
        },
        total: {
            type: Number,
            default: 0
        },
        pageNum: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 1
        }

    },
    created(){
        this.maxPageNum = Math.max(1, Math.ceil(this.total/this.pageSize))
    },
    watch: {
        realPageNum(val){
            this.$emit("change", val)
        }
    },
    methods: {
        getItem(config){
            if(config){
                return hx(`div.c-flex__item+${config}`)
            
            }
            return hx("div.c-flex__item")
        }


    },
    render(h){
        let me = this
        let $pagination = hx("div.c-pagination + c-flex", {
            style: {
                justifyContent: "space-between",
                alignItem: "center",
            }
        })
        
        let prev = me.getItem("c-pagination-prev")
        let prevBtn = hx("c-button", {
            style: {
                display: me.showButton?"block":"none"
            },
            props: {
                disabled: 1 == me.realPageNum,
                icon: me.prevIcon
            },
            
            on: {
                click(){
                    if (me.realPageNum > 0){
                        me.realPageNum--
                    }
                }
            }
        })

        if(me.prev) {
            prevBtn.push(me.prev)
        }
        prev.push(prevBtn)
        $pagination.push(prev)
        
        if(me.showNumber) {

            let content = me.getItem("c-pagination-number").push(hx("span",{},[
                hx("span.realPageNum", {}, [me.realPageNum]),
                "/",
                hx("span", {}, [me.maxPageNum]),                
            ]))

            $pagination.push(content)
        }


        let next = me.getItem("c-pagination-next")
        let nextBtn = hx("c-button", {
            style: {
                display: me.showButton?"block":"none"
            },
            props: {
                disabled: me.maxPageNum == me.realPageNum,
                icon: me.nextIcon,
                iconPosition: "right"
                
            },
            
            on: {
                click(){
                    if (me.maxPageNum > me.realPageNum){
                        me.realPageNum=me.realPageNum+1
                    }
                }
            }
        })
        
        if( me.next) {
            nextBtn.push(me.next)
        }
        next.push(nextBtn)
        $pagination.push(next)

        return $pagination.resolve(h)
    }
})

Vue.component("c-pagination", CPagination)