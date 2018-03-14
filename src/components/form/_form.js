import { hx } from '../../common/_tools.js'

var CForm = Vue.extend({
    props: {
        model: Object,
        rules: Object
    },
    data() { 
        return {
            needValideList: []
        }
    },
    created() { 
        this.getItems()

    },
    methods: {
        getItems() { 
            let children = this.$slots.default
            children.some((child) => {

                if (child.componentOptions && child.componentOptions.tag === "c-form-item" ) {
                    this.$nextTick(_ => {
                        if (!!child.componentOptions.propsData.prop) {                            
                            this.needValideList.push(child.componentOptions.propsData.prop)
                        }
                    })
                }

            });
        },
        valideDate(callback) { 

        }
    },
    render(h) {
        var $form = hx("form.c-form", {}, [this.$slots.default])

        return $form.resolve(h)
    }
})

var CFormItem = Vue.extend({
    props: {
        required: {
            type: Boolean,
            default: false
        },
        prop: String,
        rules: Object
    },
    data() { 
        return {
        }
    },
    computed: {
        forms() { 
            var parent = this.$parent

            if (parent.$options && parent.$options._componentTag === "c-form") {
                return parent.$options
            }
            return false
        },
        realRules() { 
            if (this.rules) {
                return this.rules
            }
            if (this.prop in  this.forms.propsData.rules) {
                return this.forms.propsData.rules[this.prop]
            }
        }
    },
    created() {
        
    },
    methods: {
        
    },
    render(h) {
        
        let me = this;

        let children = this.$slots.default
        children.some((child) => {
            // c-input执行rules校验
            if (child.componentOptions && child.componentOptions.tag === "c-input") {
                child.componentOptions.propsData.rules = me.realRules
            }
        });

        var $formItem = hx('div.c-form-item', {

        }, [children])

        return $formItem.resolve(h)
    }
})

Vue.component('c-form', CForm)
Vue.component('c-form-item', CFormItem)