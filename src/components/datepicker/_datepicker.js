import { hx } from "../../common/_tools";

var CDatepicker = Vue.extend({
    props: {
        type: {
            type: String,
            default: "datetime"
        },
        value: Boolean,
        maskCloseable: {
            type: Boolean,
            default: true
        },
        formDate: {
            type: String,
            default: '-'
        },
        defaultValue: String,
        start: String,
        end: String
    },
    data() {
        return {
            _start: '',
            _end: "",
            isShow: false,
            rest: [],
        }
    },
    watch: {
        value(val) {
                this.isShow = val                
        },
        isShow(val){
            this.$emit("input", val)
        }
    },
    computed: {
        cols() {
            
            if(this.type.toLowerCase() === "datetime"){
                return 5;
            } else if(this.type.toLowerCase() === "time"){
                return 2;
            } else if(this.type.toLowerCase() === "date"){
                return 3;
            }
        }
    },
    created() {
        try {
            let _dateStart, _dateEnd
            if (this.type.toLowerCase() === "time") {
                _dateStart = this.getToday() + ' ' + this.start || "00:00"
                _dateEnd = this.getToday() + ' ' + this.end || "12:59"
            } else {
                _dateStart = this.start || "2000/01/01 00:00"
                _dateEnd = this.end || "2050/12/31 12:59"
            }

            this._start = new Date(_dateStart || "2000/01/01")
            this._end = new Date(_dateEnd || "2050/12/31")
            if (this._start == "Invalid Date" || this._end == "Invalid Date") throw new Error("something error");
            

        } catch (error) {
            console.error("The start or end time format is incorrect")
        } 
    },
    beforeCreate() {
    },
    methods: {
        getToday() {
            var d = new Date()

            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + (d.getDate())).slice(-2);
            var hour = ('0' + (d.getHours())).slice(-2);
            return year+'-'+month+'-'+day
        },
        _getDataTimeObj() {
            let defaultValue
            defaultValue = this.defaultValue

            if (this.type === "time") {
                defaultValue = this.getToday() + ' ' + this.defaultValue
            }
            let date = defaultValue || new Date() // 默认为今天的日期 

            var d = new Date(date);
            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + (d.getDate())).slice(-2);
            var hour = ('0' + (d.getHours())).slice(-2);
            var minutes = ('0' + (d.getMinutes())).slice(-2);
            var seconds = ('0' + (d.getSeconds())).slice(-2);
            return {
                year,
                month,
                day,
                hour,
                minutes,
                seconds
            }
        },
        _getDataTimeObj2(defaultValue) {
            
            var d = new Date(defaultValue);
            var year = d.getFullYear();
            var month = ('0' + (d.getMonth() + 1)).slice(-2);
            var day = ('0' + (d.getDate())).slice(-2);
            var hour = ('0' + (d.getHours())).slice(-2);
            var minutes = ('0' + (d.getMinutes())).slice(-2);
            var seconds = ('0' + (d.getSeconds())).slice(-2);
            return {
                year,
                month,
                day,
                hour,
                minutes,
                seconds
            }
        },
        _getMonthDaysCount (year, month) {
            var dayCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
      
            // 检查闰月
            if (month == 2){
            
                var isLeapYear = ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0)
        
                if (isLeapYear){
                    dayCount = 29
                }
            }
      
            return dayCount
        },
        confirm (val) {
            this.rest = val
            let dates = [],time = [],res=[]

            this.rest.forEach((o) => {
                res.push(o.value < 10? "0"+o.value: o.value)
            });

            if (this.cols === 3) {
                var _tmp = ''
                if(this.formDate.indexOf("-")>-1){
                    _tmp = res.join("-")
                } else if(this.formDate.indexOf("/")>-1){
                    _tmp = res.join("/")
                }
                this.$emit("confirm", _tmp)
                
            } else if (this.cols === 2){
                this.$emit("confirm", res.join(":"))
                
            } else if (this.cols === 5){
                time = res.splice(3)
                dates = res

                if(this.formDate.indexOf("-")>-1){
                    res = dates.join("-")
                } else if(this.formDate.indexOf("/")>-1){
                    res = dates.join("/")
                }

                this.$emit("confirm", res+ " " + time.join(":"))
            }
        },
        getList() {
            let yindex, monindex, dindex, hindex, mindex

            let years = []
            let yearList = []
            for (var i = this._getDataTimeObj2(this._start).year; i <= this._getDataTimeObj2(this._end).year ;i++) {
                yearList.push(i)
                years.push({
                    label: i+'年',
                    value: i})
            }
            yindex = yearList.indexOf(this._getDataTimeObj().year)

            let month = []
            let monthList = []
            for(var i=1 ; i < 13 ; i++) {
                monthList.push(i)
                month.push({
                    label: i+'月',
                    value: i})
            }
            monindex = monthList.indexOf(parseInt(this._getDataTimeObj().month))

            let days = []
            let daysList = []
            for(var i=1 ; i < this._getMonthDaysCount(this.rest[0]&&this.rest[0]["value"] || this._getDataTimeObj().year ,this.rest[1]&&this.rest[1]["value"] || this._getDataTimeObj().month)+1 ; i++){
                daysList.push(i)
                days.push({
                    label: i+'日',
                    value: i})
            }
            dindex = daysList.indexOf(parseInt(this._getDataTimeObj().day))
            
            let hours = []
            let hoursList = []
            for(var i=0 ; i < 24; i++){
                hoursList.push(i)
                hours.push({
                    label: i+'时',
                    value: i})
            }
            hindex = hoursList.indexOf(parseInt(this._getDataTimeObj().hour))
            
            let minutes = []
            let minutesList = []
            for(var i=0 ; i < 60; i++){
                minutesList.push(i)
                minutes.push({
                    label: i+'分',
                    value: i})
            }
            mindex = minutesList.indexOf(parseInt(this._getDataTimeObj().minutes))
            
            if (this.type === 'time') {
                return {
                        list: [hours, minutes],
                        index: [hindex, mindex]
                    }

            } else if (this.type === 'date'){
                return {
                        list: [years, month, days],
                        index: [yindex, monindex, dindex]
                    }

            } else if (this.type === 'datetime'){
                return {
                        list: [years, month, days, hours, minutes],
                        index: [yindex, monindex, dindex, hindex, mindex]
                    }

            }
        }
    },
    render(h) {
        let me = this
        console.log('this._start', this._start);
        

        var $datePicker = hx("c-picker", {
            props: {
                type:"date",
                list: me.getList().list,
                value: me.isShow,
                defaultValueIndex: me.getList().index,
                maskCloseable: me.maskCloseable
            },
            on: {
                confirm(o){
                    me.confirm(o)
                },
                input(val) {
                    me.isShow = val
                }
            }
        })

        return $datePicker.resolve(h)
    }
})

Vue.component("c-datepicker", CDatepicker)