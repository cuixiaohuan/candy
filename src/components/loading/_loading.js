// import { hx } from "../../common/_tools";

// var CLoadmore = Vue.extend({
//     props: {
//         show: {
//             type: Boolean,
//             default: true,
//         },
//         hasMore: {
//             type: Boolean,
//             default: false,
//         },
//         noData: {
//             type: Boolean,
//             default: false
//         },
//         loading: {
//             type: Boolean,
//             default: false
//         }
//     },
//     computed :{
//         cls () {
//             var clsList = []
//             if (!this.loading){
//                 clsList.push('c-loadmore_line')

//                 if (this.hasMore) {
//                     clsList.push('c-loadmore_dot')
//                 }
//             }
//             return clsList
//         }
//     },
//     render (h) {
//         var $loadmore ,
//             me = this

//             $loadmore = hx( `div.c-loadmore + ${me.cls.join('+')}`)
//             if (this.loading && !me.noData) {
//                 $loadmore.push( hx('i.c-loading') )
                
//                 var params = {}

//                 params ={ 
//                     domProps: {
//                         innerHTML: '正在加载'
//                     }
//                 }
//                 $loadmore.push( hx('span.c-loadmore__tips', params) )
            
//             } else if (me.noData) {
//                 $loadmore.push( hx('span.c-loadmore__tips', {}) )
//             } else {
//                 $loadmore.push( hx('span.c-loadmore__tips', {
//                     domProps: {
//                         innerHTML: '暂无数据'
//                     }
//                 }) )
                
//             }

//         return $loadmore.resolve(h)
        
//     }
// })

// Vue.component('c-loadmore', CLoadmore)
