import { hx } from "../../common/_tools";
var CSlider = Vue.extend({
    props: {
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
    render (h) {

        var $inner = hx('div.c-slider__inner')
        var $sliderTrack = hx('div.c-slider__track', {
            style: {
                width: this.value + "%"
            },
        })


        var $slider = hx('div.c-slider').push(
            $inner
        )

        var totalLen = $inner.offsetWidth,
            startLeft = 0,
            startX = 0;
        var $sliderHandler = hx('div.c-slider__handler', {
            attrs: {
                draggable: true,
            },
            style: {
                left: this.value + "%"
            },
            on: {
                click () {
                    console.log(111)
                },
                dragstart (e) {
                    startLeft = parseInt($sliderHandler.props.style.left)
                    // startLeft = parseInt($sliderHandler.props.style.left) * totalLen / 100;
                    startX = e.target.clientX;
                },
                drag (e){
                    console.log('drag')
                    var dist = startLeft + e.target.clientX - startX,
                        percent;
                    dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
                    percent =  parseInt(dist / totalLen * 100);
                    $sliderTrack.props.style.width= percent + '%';
                    $sliderHandler.props.style.left = percent + '%';
                    
                    this.value = percent
                    console.log(this.value)
                    
                    e.preventDefault();
                }
            }
        })


        $inner.push([$sliderTrack, $sliderHandler])

        return $slider.resolve(h)
        
    }
})

Vue.component('c-slider', CSlider)