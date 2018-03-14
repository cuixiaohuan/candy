import {hx} from '../../common/_tools.js'

var CInput = Vue.extend({
    props: {
        value: [String, Number, Boolean],
        type: {
            type: String,
            default: 'text', // password, textarea, 
        },

        rules: {
            type: Object,
            default: function () {
                return {}
            }
        },
        labelWidth: String,
        labelIcon: String,
        label: '',  

        placeholder: '',
        
        rows: Number,

        trim: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            showToptips: false,
            hasError: false,
            max: "",
            min: "",
            pattern: "",
            message: "",
            trigger: "",
            timer: '',
            isshowToptip: false,
            topTip: null
        }
    },
    mounted () {
        if (this.rules && this.rules.type === "phone"){
            this.message = "请输入正确的手机号码"
            this.pattern =  /^1\d{10}$/
        }
        if (this.rules && this.rules.type === "email"){
            
            this.message = "请输入正确的邮箱地址"
            
            this.pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }

        // 顶部提示框
        this.topTip = document.querySelector(".c-toptips_warn")
        if (!this.topTip) {

            this.topTip = document.createElement("div")

            this.topTip.classList.add('c-toptips_warn', "c-toptips")
            this.topTip.style.display = "none"

            document.body.appendChild(this.topTip)

        }
    },
    computed: {
        cls () {
            
            var cls = []
            if (this.hasError) {
                cls.push('c-cell_warn')
            }
            if (this.$slots['right']) {
                cls.push('c-cell_vcode')
            }
            // if (this.$slots['left']) {
            //     cls.push('c-check__label')
            // }
            return cls
        }
    },
    watch: {
        isshowToptip(val){

            if (!val){
                clearTimeout(this.timer)
            }
        },
        hasError(val) { 
            if (!val) {

                
                this.isshowToptip = false
                this.topTip.style.display = "none"
                
            }
        }
    },
    methods: {
        createTopTip(message) {
            // var topTip = document.querySelector(".c-toptips_warn")
            // if (!this.topTip ){
    
            //     this.topTip = document.createElement("div")

            //     this.topTip.classList.add('c-toptips_warn', "c-toptips")
    
            //     document.body.appendChild(this.topTip)

            // }
            message = message || this.rules.message || this.message

            this.topTip.innerHTML = message
            
            this.topTip.style.display = "block"
            this.isshowToptip = true

            clearTimeout(this.timer)            

            this.timer = setTimeout(() => {

                this.isshowToptip = false
                
                this.topTip.style.display = "none"
            }, 1800);

        },
        getParams () {
            var me = this

            var params = {
                domProps: {
                    placeholder: this.placeholder || '',
                    // message: this.message || '',
                    innerHTML: this.type=="date"? this.value:"",
                    value: this.value
                },
                attrs: {
                    readonly: this.readonly || false,
                    disabled: this.disabled || false
                },
                on: {
                    click (e) {
                        // e.preventDefault()
                        me.$emit("click")
                    },
                    input (e) {
                        if (me.rules && me.rules.trigger &&  me.rules.trigger.indexOf("input") >-1 ){
                            me.validDate(e.target.value)
                        }
                        me.$emit('input', e.target.value)
                    },
                    change (e) {
                        if (me.rules && me.rules.trigger && me.rules.trigger.indexOf("change")>-1){
                            me.validDate(e.target.value)
                            
                        }
                        me.$emit('change', e)
                    },
                    focus (e) {
                        if (me.rules && me.rules.trigger && me.rules.trigger.indexOf("focus")>-1){
                            me.validDate(e.target.value)
                            
                        }
                        me.$emit('focus', e)
                    },
                    blur (e) {
                        if (me.rules && me.rules.trigger && me.rules.trigger.indexOf("blur")>-1){
                            
                            me.validDate(e.target.value)
                        }
                        me.$emit('blur', e)
            
                        if (me.trim){
                            me.$emit('input', e.target.value.trim())
                        }
                    }
                }
            }

            if (this.type === 'textarea'){
                params.attrs.rows = this.rows
            } else {
                params.domProps.type = this.type
            }
            // if (!!this.pattern) {
            //     params.domProps.pattern = this.pattern
            // }

            
            return params
        },
        validDate (value) {
            if ("max" in this.rules){
                this.max = this.rules.max
                if (value.length > parseInt(this.max)){
                    this.hasError = true
                    this.createTopTip()
                    
                } else {
                    this.hasError = false                    
                }
            }
            if ("min" in this.rules){
                this.min = this.rules.min

                if (value.length < parseInt(this.min)){
                    this.hasError = true
                    this.createTopTip()
                    
                } else {
                    this.hasError = false
                    
                }
            }
            if ( this.pattern || "pattern" in this.rules){

                this.pattern ? "" : (this.pattern = this.rules.pattern)
                
                if (this.pattern.test(value)){
                    // 校验成功
                    this.hasError = false
                } else {
                    // 校验失败
                    this.hasError = true

                    this.createTopTip()
                }
            }
            if ("valide" in this.rules) {
                this.rules.valide(value, (isOk, thisssage) => {
                    if (!isOk) {
                        this.hasError = true
                        this.createTopTip(thisssage)
                    } else {
                        this.hasError = false
                    }
                })
            }
        }
    },
    render (h) {
        var me = this

        var params = this.getParams()
        

        var $inputs, $label
        if (me.type === 'textarea'){

            $inputs = hx(`textarea.c-textarea`, params)
        // } else if (me.type === 'date') {
        //     $inputs = hx(`input.c-input`, params)
            
        }else {
            
            $inputs = hx('input.c-input', params)
        }

        var $bd = hx('div.c-cell__bd', {}, [$inputs])

        var hdParams = {}
        var labelWidth = "auto"
        if(!!me.labelWidth) {

            labelWidth = me.labelWidth
            hdParams.style = {
                width: labelWidth
            }
        }

        var $hd = hx('div.c-cell__hd', hdParams)
        

        if (me.labelIcon) {

            $label = hx(`i.c-icon-success + c-label + ${me.labelIcon}`)  
            
            $hd.push($label)            
        } 
        if (me.label ){ 
            var labelParams = {
                domProps: {
                    innerHTML: me.label
                }
            }
            $label = hx('label.c-label', labelParams)   
            
            $hd.push($label)
        } 


        var $input = hx(`div.c-cell + ${me.cls.join("+")}`, {

        }).push([$hd, $bd])
        
        if (me.hasError && !me.$slots['right']) {

            $input.push( hx('div.c-cell__ft', {
                
            }, [
                hx('i.c-icon-error + ion-ios-information')
            ]))

        } else if (me.$slots['right']) {
            $input.push( hx('div.c-cell__ft + c-vcode-img', {}, [this.$slots['right']]) )

            // if (me.$slots['left']) {
            //     $input.push( hx('div.c-cell__ft + c-vcode-img', {}, [this.$slots['right']]) )

            // }

        }

        return $input.resolve(h)
    }
})

Vue.component('c-input', CInput)