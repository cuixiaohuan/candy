import { hx } from "../../common/_tools";
var CSlider = Vue.extend({
    model: {
        prop: 'value',
        event: 'input',
    },
    data() {
        return {
            // realValue: this.value
        }
    },
    props: {
        total: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number,
            default: 0
        }
    },
    computed: {
        cls () {
            var cls = ['c-slider']
        }
    },
    watch: {
    },
    render (h) {
        var me = this
        // <div class="c-slider">
        //     <div class="c-slider__inner">
        //         <div style="width: 0;" class="c-slider__track"></div>
        //         <div style="left: 0;" class="c-slider__handler"></div>
        //     </div>
        // </div>

        var $inner = hx('div.c-slider__inner')
        var $sliderTrack = hx('div.c-slider__track', {
            style: {
                width: this.value / this.total * 100 + "%"
            },
        })
        var totalLen = this.total,
            startLeft = 0,
            startX = 0;

        var $sliderHandler = hx('div.c-slider__handler', {
            attrs: {
                draggable: true,
            },
            style: {
                left: me.value / me.total * 100 + "%"
            },
            on: {
                click () {
                    console.log(111)
                },
                dragstart (e) {
                    startLeft = parseInt($sliderHandler.props.style.left)
                    startX = e.target.offsetLeft;

                    console.log('startX', startX, ',startLeft:', startLeft)
                },
                drag (e){
                    var dist = startLeft + e.target.offsetLeft - startX,
                        percent;
                    dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
                    percent =  parseInt(me.value / totalLen * 100);
                    $sliderTrack.props.style.width= percent + '%';
                    $sliderHandler.props.style.left = percent + '%';
                    
                    me.$emit('input', me.total * percent)
                    
                    console.log('me.value', me.value, ',percent:', percent)
                    
                    e.preventDefault();
                }
            }
        })


        $inner.push([$sliderTrack, $sliderHandler])

        var $slider = hx('div.c-slider').push(
            $inner
        )

        return $slider.resolve(h)
        
    }
})

Vue.component('c-slider', CSlider)