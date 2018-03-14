import { hx, ajax } from "../../common/_tools";

var CUploader = Vue.extend({
    props: {
        config: {
            type: Object
        },
        onProgress: {
            type: Function,
            default: function () { }
        },        
        onSuccess: {
            type: Function,
            default: function () { }
        },
        onError: { 
            type: Function,
            default: function () { }    
        },
        onPreview: { // 预览
            type: Function,
            default: function () { }
        },
        headers: {
            type: Object,
            default: () => { }
        },
        action: String,
        withCredentials: Boolean,
        beforeUpload: Function,
        accept: String,
        multiple: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            default: "file"
        },
        limit: {
            type: Number,
            default: ''
        },
        files: Array,
        headers: Object,
    },
    data () {
        return {
            fileList: this.files,
            progressNum: 0
        }
    },
    computed: {
        showSelectBtn() { 
            if (this.limit <= this.fileList.length) {
                return false
            }
            return true
        }
    },
    watch: {
        files: {
            handler(val) { 
                this.fileList = val 
            },
            deep: true
        },
        fileList: {
            handler() { 
                console.log('fileList changed');
                
                this.imgList()
            },
            deep: true
        }
    },
    methods: {
        uploader(){
            return hx("input.c-uploader__input", {
                domProps: {
                    type: "file",
                    accept: this.accept,
                    multiple: this.multiple
                }
            })
        },
        imgList () {
            let ul = hx("ul.c-uploader__files", {
            
            }, [])
            let me = this
            
            this.fileList.forEach(o => {
                // .c-uploader__file_status
                ul.push(hx("li.c-uploader__file", {
                    class: {
                        "c-uploader__file_status": !!o.status && o.status < 100
                    },
                    style: {
                        backgroundImage: "url("+ o.url+ ")"
                    },
                    on: {
                        click() { 
                            me.onPreview(o.url)
                        }
                    }
                }, [
                        hx("div.c-uploader__file-content", {}, [o.status])    
                    ]))
                
                // <i class="c-icon-warn"></i>

            })
            return ul
        },
        getFileObj(file) {
            return {
                name: file.name || "",
                size: file.size || 0
            }
        },
        // commit (){
        //     if(this.config && this.config.autocommit){
        //         // 自动提交
        //     } else {
        //         this.config && this.config.onCommit()
        //     }
        // },
        clickEvent() { 

        },
        progressEvent(file, o) { 
            file.status = o
            this.onProgress(file, o)
        },
        changeEvent(e) { 
            this.dealFile(e.target.files)
        },
        successEvent(res, file) { 
            this.onSuccess(res, file)
                
        },
        errorEvent() { 
            this.onError()
        },
        dealFile(files) { 
            let fileList = Array.from(files)

            if (!fileList.length) {
                return
            }
            fileList.forEach(file => {
                this.upload(file)
            })
        },
        upload(file) {
            if (!this.beforeUpload) {
                return this.post(file)
            } else {

                this.beforeUpload(file, isOk => {
                    if (isOk) {
                        this.post(file)
                    }
                })
            }

        },
        post(file) {
            var formData = new FormData()
            formData.append(this.name, file)

            ajax({
                url: this.action,
                headers: this.headers,
                withCredentials: this.withCredentials,
                data: formData,
                success: (res) => {
                    this.successEvent(res, file)
                },
                failed: (res) => {
                    this.errorEvent(res, file)
                },
                progress: (o) => {
                    this.progressEvent(file, o)
                }
            })
            
        },
    },
    render (h) {
        var me = this 

        // +
        $addControl = hx("div.c-uploader__input-box", {
            on: {
                change(e) {
                    me.changeEvent(e)
                },
                click() {
                    me.clickEvent()
                }
            }
        }, [me.uploader()])

        $content = hx("div.c-uploader__bd")
        // 列表        
        $content.push(me.imgList())
        // 添加按钮
        if (this.showSelectBtn) {
            $content.push($addControl)
        }

        let $uploader = hx("div.c-uploader")
        $uploader.push($content)
        return $uploader.resolve(h)
    }
})

Vue.component('c-uploader', CUploader)