import { hx, isArray, isObject, depthOf, getObjResult } from "../../common/_tools";

// 事件： cancel  confirm
var CPicker = Vue.extend({
    props: {
        type: String, // date, 表示时间选择器
        value: { // 隐藏显示
            type: Boolean,
            default: false
        },
        comfirmText: {
            type: String,
            default: "确定"
        },
        cancelText: {
            type: String,
            default: "取消"
        },
        defaultValueIndex: [Array],  // 默认选中值索引
        // defaultValue: [Array],  // 默认选中值
        list: Array, // 数据列表
        maskCloseable: {
            type: Boolean,
            default: true
        },
        disable: {
            type: Function,
            default: function () { }
        }
    },
    data () {
        return {
            isShow: this.value,
            cascade: false, // 是否是级联
            indexObj: {},
            listObj: {},
            scroll: [], // bscroll实例
            pickerSelectedIndex: [], // 选中值的索引
        }
    },
    watch: {
        value (val) {
            this.isShow = val                
        },
        isShow (val) {
            if (!val) {
                // click confirm
                this.$emit('input', false)
            }
        },
        indexObj: {
            handler (val) {
            },
            deep: true
        },
        listObj: {
            handler (val) {
            },
            deep: true
        }

    },
    created () {
        if (!this.defaultValueIndex && !this.defaultValue) {
            for (let i = 0; i< this.depth; i++){
                this.pickerSelectedIndex[i] = 0
                this.indexObj[i] = 0
                
            }
        } else if (this.defaultValueIndex) {
            this.pickerSelectedIndex = this.defaultValueIndex.splice(0)
            this.defaultValueIndex.forEach( (v,i) => {
                this.indexObj[i] = v
            })
        // } else if (this.defaultValue) {
        //     this.getListObj()
        //     debugger
        //     for (var i = 0; i< this.defaultValue.length; i ++) {

        //         this.pickerSelectedIndex[i] = this.listObj[i].indexOf(this.defaultValue[i])
        //         this.indexObj[i] = this.listObj[i].indexOf(this.defaultValue[i])
        //     }
        }
    },
    mounted () {
        var me = this

        if (this.scroll.length === 0){

            this.$nextTick(_ => {

                // this.unitHeight = this.$el.querySelectorAll('.c-picker__indicator')[0].offsetHeight
                
                let scrollList = this.$el.querySelectorAll(".c-picker__group")

                scrollList.forEach((o, i) => {
                    this.scroll[i] = new BScroll(o, {
                        observeDOM: true,
                        swipeTime: 1000, // 动画时长
                        wheel:{
                            // selectedIndex: 0,
                            selectedIndex: this.pickerSelectedIndex[i] || 0,
                            rotate: 10, 
                            adjustTime: 400, 
                            wheelWrapperClass: 'c-picker__group', 
                            wheelItemClass: 'c-picker__item' // 滚动起来的时候点击一下终止滚动, 触发 scrollEnd 事件
                        }
                    })

                    this.scroll[i].on('scrollEnd', () => {
                        // this.$emit("change", this.info[this.scroll[i].getSelectedIndex()])
                        var _tmp = Object.assign({}, this.indexObj)

                        _tmp[i] = this.scroll[i].getSelectedIndex()
                        
                        this.indexObj = _tmp

                        this.getListObj(i)
                        this.getValue()
                    })
                })

            })            
        } else {
            // 刷新
            this.$nextTick(() => {
                this.scroll.forEach((o, index) => {
                    o.refresh()
                })
            })
        }
    },
    computed: {
        maskStyle () {
            
            var maskStyle = []
            if (this.isShow) {
                maskStyle.push('c-animate-fade-in')
            } else {
                maskStyle.push('c-animate-fade-out')
                
                // this.$nextTick(function(){
                    maskStyle.push('c-picker__mask-hide')
                // })
                
            }

            return maskStyle
        },
        pickerStyle () {
            var pickerStyle = []
            if (this.isShow) {
                pickerStyle.push('c-animate-slide-up')
            } else {
                pickerStyle.push('c-animate-slide-down')
            }
            return pickerStyle
        },
        info() { // picker数据

            let list = this.list.slice(0) // 拷贝 传入的list
            return list
        },
        depth (){

            let dateLength = this.list.length
            
            if ( dateLength != 0 ) {
                let firstDate = this.list[0]

                if ( isArray(firstDate) ) { // 不级联
                    
                    this.cascade = false

                    return dateLength

                } else if ( isObject(firstDate) ){

                    let objDepth = depthOf(firstDate)

                    this.cascade = objDepth > 1 ? true : false
                    
                    return objDepth
                }

            }
            return false
            
        },
        isMulti (){
            return this.depth > 1
        }

    },
    methods: {
        disableScroll () {

            for (let i = 0; i < this.scroll.length; i++) {
                this.scroll[i].disable()
            }
        },
        gettPickerSelectedIndex(){
            this.scroll.forEach((o, i) => {
                this.pickerSelectedIndex[i] = o.getSelectedIndex()
            })
        },
        clickComfirm(){

            let status = this.scroll.every((o) => {

                return !o.isInTransition
            }) // 判断滚动是否停止

            if (status) {
                this.isShow = false
                this.$emit('confirm', this.getValue())
            }

            let _pickerSelectedIndex = this.pickerSelectedIndex.slice(0)

            this.gettPickerSelectedIndex()

            let hasChange = _pickerSelectedIndex.some((o, i) => {
                return o != this.pickerSelectedIndex[i]
            })

            if (hasChange){
                this.$emit('change', this.getValue())
                
            }

        },
        getListObj (column) { // 更新了column列的数据

            if (this.cascade){

                let i = 0
                obj = JSON.parse(JSON.stringify(this.info))
                
                while (i < this.depth) {
                    if (!column && column!=0){
                        this.listObj[i] = obj

                        // if (this.scroll[i]){
                        //     this.scroll[i].refresh()
                        // }

                        let _index = this.scroll[i] && this.scroll[i].getSelectedIndex() || 0
                        obj = obj[_index].children

                        i++;
                    } else {

                        this.listObj[i] = obj
                        
                        if (i<=column){
                            let _index = this.scroll[i] && this.scroll[i].getSelectedIndex() || 0
                        
                            obj = obj[_index].children                            
                            i++
                        } else {

                            let _index = 0
                            obj = obj[_index].children
                            this.scroll[i].wheelTo(0)
                            i++
                        }
                    }
                }
                
            } else {
                
            }
        },
        getValue (me) {
            let rest = [], tag;
            me = me || this

            if (me.depth === 1) {
                
                let index = me.scroll[0].getSelectedIndex()

                rest = [ getObjResult(this.info[index]) ]

            } else {

                if (!this.cascade){
                    
                    for (let o = 0; o < this.depth; o++){
                        let index = me.scroll[o].getSelectedIndex()
                        rest.push(getObjResult(this.info[o][index]))
                    }
                } else { // 级联

                    let i = 0, 
                    
                    // index = me.scroll[0].getSelectedIndex(),
                    obj = JSON.parse(JSON.stringify(this.info))

                    // rest.push(getObjResult(obj[index]))
                    
                    // obj = obj[index].children

                    while (i < this.depth) {

                        let _index = me.scroll[i].getSelectedIndex()

                        rest.push(getObjResult(obj[_index]))
                        
                        obj = obj[_index].children

                        i++;
                    }
                }
            }
            
            if(this.type === "date"){

                this.$emit('confirm', rest)
            }
            return rest
        },
        getItem (data, index, groupId) { // 当前item的数据， 当前item的索引值， 当前item所在的group索引
            if (!data){
                return hx('div.c-picker__item', {}, ["暂无数据"])
            }
            return hx('div.c-picker__item', {
                domProps: {
                    innerHTML: data.label,
                    value: data.value
                },
                ref: `pickerItem_${index}_${groupId}`,

            })
        },
        getItemList (data, groupId) {
            let items = []
            if (!data || data.length===0){
                items.push( this.getItem() )
                return items
            } else {

                data.forEach((ele, index) => {
                    items.push( this.getItem(ele, index, groupId) )
                });
                return items
            
            }

        },
        getGroup (items, index) {
            var me = this
            let $group = hx('div.c-picker__group + c-picker__bd', {
            }).push([
                hx('div.c-picker__content', {
                    // ref: "c-picker__content",
                }).push(
                    items
                ),
                hx(`div.c-picker__mask`, {

                }),
                hx('div.c-picker__indicator')
            ])

            return $group

        },

    },
    render (h) {
        
        var $picker,
            me = this,
            items = []
        
        var $body = hx('div', {
            style: {
                display: "flex"
            }
        })

        if ( !this.isMulti ){ // 单列

            let items = this.getItemList(this.info, 0)
            $body.push (me.getGroup(items, 0))

        } else if( !this.cascade ){ // 多列 不级联

            this.info.forEach((ele, groupId)=>{
                if (isArray(ele)){

                    let items = me.getItemList(ele, groupId)
                    $body.push(me.getGroup(items, groupId))
                    
                }
            })
        } else { // 级联
            this.getListObj()

            for (var d = 0; d < this.depth; d++) {

                let items = me.getItemList(this.listObj[d], 0)
                $body.push(me.getGroup(items, 0))
            }
        }

        var $head =  hx('div.c-picker__hd', {}, [hx('a.c-picker__action', {
                            domProps: {
                                innerHTML: me.cancelText
                            },
                            attrs: {
                                href: 'javascript:;'                        
                            },
                            on: {
                                click () {
                                    me.isShow = false
                                    me.$emit('cancel')
                                }
                            }
                        }),
                        hx( 'a.c-picker__action',{
                            domProps: {
                                innerHTML: me.comfirmText
                            },
                            attrs: {
                                href: 'javascript:;'                        
                            },
                            on: {
                                click () {

                                    me.clickComfirm()

                                }
                            }
                        })
                    ]
                )
                        

        $picker = hx(`div.c-picker + ${me.pickerStyle.join('+')}`, {}, [
            $head,
            $body
        ])
            

        var $mask = hx(`div.c-mask + ${me.maskStyle.join('+')}`, {
            on: {
                click () {
                    if (me.maskCloseable){
                        me.isShow = false
                        
                    }
                }
            }
        })

        var $container = hx('div', {
            ref: "cpicker"
        }).push([$mask, $picker])
    

        return $container.resolve(h)
    }
})


Vue.component('c-picker', CPicker)