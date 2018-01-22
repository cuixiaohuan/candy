import { hx } from "../../common/_tools";
var CSlider = Vue.extend({
    model: {
        prop: 'value',
        event: 'input',
    },
    data() {
        return {
            sliderLength: '',
            stepWidth: ''
        }
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number,
            default: 0
        },
        step: {  // 每次移动的百分比
            type: Number,
            default: 1
        }
    },
    computed: {
        cls () {
            var cls = ['c-slider']

            return cls
        }
        
    },
    beforeCreate (){
    },
    created (){

    },
    beforeMount () {
    },
    mounted () {
        let $handler = this.$el.querySelector('.c-slider__handler')
        let $inner = this.$el.querySelector('.c-slider__inner')
        let $track = this.$el.querySelector('.c-slider__track')

        this.sliderLength = $inner.offsetWidth // slider的长度

        this.getStepLength()
        

        var flag = false,
            x,  // 鼠标的起始坐标
            dx, // handler的起始偏移量
            mx, // 鼠标的移动量
            tw; // $track 的长度


        $handler.addEventListener('mousedown', (e) => {

            flag = true; //确认鼠标按下
            x = e.clientX; //记录当前鼠标 在页面上 的x坐标
            dx = $handler.offsetLeft; //记录div当时的左偏移量  -14px

        })
        $handler.addEventListener('touchstart', (e) => {

            flag = true; //确认鼠标按下
            x = e.changedTouches[0].clientX; //记录当前鼠标 在页面上 的x坐标
            dx = $handler.offsetLeft; //记录div当时的左偏移量  -14px

        })
        window.addEventListener('mousemove', (e) => {
            if (flag) {
                mx = e.clientX - x; //记录鼠标在x轴移动的数据
                
                tw = dx + 14 + mx; //div在x轴的偏移量加上鼠标在x轴移动的距离

                if (!!this.stepWidth){
                    tw = Math.round(tw / this.stepWidth) * this.stepWidth
                }

                var value = Math.round(tw / this.sliderLength * 100)
                value = value > 100 ? 100 : value < 0 ? 0 : value

                this.$emit('input', value)
                
                $handler.style.left = value + "%";
                $track.style.width = value + "%";
            }

        })
        $handler.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (flag) {
                mx = e.changedTouches[0].clientX - x; //记录鼠标在x轴移动的数据
                
                tw = dx + 14 + mx; //div在x轴的偏移量加上鼠标在x轴移动的距离

                if (!!this.stepWidth){
                    tw = Math.round(tw / this.stepWidth) * this.stepWidth
                    
                }

                var value = Math.round(tw / this.sliderLength * 100)

                value = value > 100 ? 100 : value < 0 ? 0 : value

                this.$emit('input', value)
                
                $handler.style.left = value + "%";
                $track.style.width = value + "%";
                
            }

        })
        window.addEventListener('mouseup', (e) => {
            flag = false
        })
        
    },
    watch: {
    },
    methods: {
        getStepLength () {

            if (this.step > 0 && this.step < 100) {
                
                stepWidth = this.sliderLength * this.step / 100; // + 'px'

                this.stepWidth = stepWidth
            } else {
                this.stepWidth = undefined
                throw new Error('CSlider step must be a positive number between 0 and 100.');
            }
        }
    },
    render (h) {
        var me = this

        var $inner = hx('div.c-slider__inner', {
            style: {
                width: 100 + "%"
            },
        })
        var $sliderTrack = hx('div.c-slider__track', {
            style: {
                width: me.value + "%"
            },
        })

        var $sliderHandler = hx('div.c-slider__handler', {
            style: {
                left: me.value + "%"
            },
        })

        $inner.push([$sliderTrack, $sliderHandler])

        var $slider = hx('div.c-slider').push(
            $inner
        )

        return $slider.resolve(h)
    }
})

Vue.component('c-slider', CSlider)