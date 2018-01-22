import { hx, isArray, isObject, depthOf } from "../../common/_tools";

// 事件： cancel  confirm
var CPicker = Vue.extend({
    model: {
        prop: 'show',
        event: 'input',
    },
    props: {
        // class: {
        //     type: String,
        //     default: '',
        // },
        show: { // 隐藏显示
            type: Boolean,
            default: false
        },
        defaultValue: [Array, String, Number],  // 默认选中值
        list: Array, // 数据列表
    },
    data () {
        return {
            isShow: this.show,
            // depth: 1, // 数据深度
            cascade: false // 是否是级联
        }
    },
    watch: {
        show (val) {
            this.isShow = val                
        },
        isShow (val) {
            if (!val) {
                this.$emit('input', val)
            } else {

                // this.list.push(...[{label: '', value: ''},{label: '', value: ''}, {label: '', value: ''}])
                // this.list.unshift(...[{label: '', value: ''},{label: '', value: ''}, {label: '', value: ''}])
                
                this.$nextTick(res => {
                    var els = document.querySelectorAll('.c-picker__group')
                    els.forEach(ele => {
                        new IScroll(ele)
                    
                    })
                }) 
                
            }
        }

    },
    activated: function () { //进入页面时执行

    },
    deactivated: function () { // 离开页面时执行

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
        info () { // picker数据

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
        getItem (data, index) {
            return hx('div.c-picker__item', {
                domProps: {
                    innerHTML: data.label,
                    value: data.value
                }
            })
        },
        getGroup (items) {

            let $group = hx('div.c-picker__group').push([
                hx('div.c-picker__content').push(
                    items
                ),
                hx(`div.c-picker__mask`),
                hx('div.c-picker__indicator')]
            )

            return $group

        }
    },
    render (h) {
        var $picker,
            me = this ,
            items = []
            
        
        
        var $body = hx( 'div.c-picker__bd' )

        if ( !this.isMulti ){ // 单列
            items = []
            this.info.forEach((ele, index) => {
                items.push( me.getItem(ele, index) )
            });
            $body.push (me.getGroup(items))

        } else if( !this.cascade ){ // 多列 不级联

            this.info.forEach( (ele)=>{
                if (isArray(ele)) {
                    items = []
                    
                    ele.forEach((ele) => {
                        items.push( me.getItem(ele) )
                    });
                    $body.push (me.getGroup(items))
                    
                }
            } )

        } else { // 级联

            console.log(123)
        }

        // let $group = hx('div.c-picker__group').push([
        //     hx(`div.c-picker__mask`),
        //     hx('div.c-picker__indicator'),
        //     hx('div.c-picker__content').push(
        //         items
        //     )]
        // )

        
        var $head =  hx('div.c-picker__hd', {}, [hx('a.c-picker__action', {
                            domProps: {
                                innerHTML: '取消'
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
                                innerHTML: '确定'
                            },
                            attrs: {
                                href: 'javascript:;'                        
                            },
                            on: {
                                click () {
                                    me.$emit('confirm', 'toast value')
                                }
                            }
                        })])
                        

        $picker = hx(`div.c-picker + ${me.pickerStyle.join('+')}`, {}, [
            $head,
            $body
        ])
            

        var $mask = hx(`div.c-mask + ${me.maskStyle.join('+')}`, {
            on: {
                click () {
                    me.isShow = false
                }
            }
        })

        var $container = hx('div').push([$mask, $picker])
    

        return $container.resolve(h)
    }
})

Vue.component('c-picker', CPicker)