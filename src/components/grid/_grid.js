import { hx } from '../../common/_tools.js'

var CGrid = Vue.extend({
    props: {
        cols: {
            type: Number,
            default: 3
        },
        noBorder: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cls () {
            var cls = ["c-grids"]
            if (this.noBorder){
                cls.push("c-noborder")
            }
            return cls
        }
    },
    render(h) {
        var $grid = hx(`div.${this.cls.join("+")}`)

        var children = this.$slots.default
        
        children.forEach((child) => {
            
            if ( child.componentOptions && child.componentOptions.tag === "c-grid-item"){
                
                $grid.push(child)
            }
        });
        
        return $grid.resolve(h)
    }
})

var CGridItem = Vue.extend({
    computed: {
        width () {
            var parent = this.$parent
            if (parent.$options && parent.$options._componentTag === "c-grid"){
                return parent.cols
            }
        }
    },
    render(h) {
        var me = this

        var $gridItem = hx("div.c-grid", {
            style: {
                width: 100 / me.width + "%"
            }
        }, me.$slots["default"])

        return $gridItem.resolve(h)
    }
})

Vue.component('c-grid', CGrid)
Vue.component('c-grid-item', CGridItem)