import { hx } from "../../common/_tools";

var CUploader = Vue.extend({
    props: { 
        // config: {
        //     url: "",
        //     accept: "",
        //     url :'',
        //     beforeUpload: "",
        //     data: "",
        //     header: "",
        //     onChange:ƒ default()
        //     onError:ƒ boundFn(a)
        //     onPreview:ƒ boundFn(a)
        //     onProgress:ƒ default()
        //     onRemove:ƒ boundFn(a)
        //     onSuccess:ƒ boundFn(a)
        //     readonly:false
        //     withCredentials:false
        // }
        config: {
            type: Object
        },
        autocommit: {
            type: Boolean,
            default: false
        }
        
    },
    data () {
        return {
            fileList: []
        }
    },
    computed: {

    },
    methods: {
        setHeader () {

        },
        uploader(){
            return hx("input.c-uploader__input", {
                domProps: {
                    type: "file",
                    accept: this.config &&this.config.accept || "image/*",
                    multiple: this.config && this.config.multiple || true
                }
            })
        },
        imgList () {
            let ul = hx("ul.c-uploader__files", {
            
            }, [])
            
            this.fileList.forEach(o => {
                ul.push(hx("li.c-uploader__file", {
                    style: {
                        backgroundImage: "url("+ "/candy/tests/img/icon.png"+ ")"
                    }
                }))

            })
            return ul
        },
        getFileObj (file) {
            return {
                name: file.name || "",
                size: file.size || 0

            }
        },
        commit (){
            if(this.config && this.config.autocommit){
                // 自动提交
            } else {
                this.config && this.config.onCommit()
            }
        }

    },
    render (h) {
        var me = this 

        $content = hx("div.c-uploader__bd")
        $addControl = hx("div.c-uploader__input-box", {
            on: {
                change (e) {
                    if(e.target.files.length === 0){
                        return 
                    }

                    let files = e.target.files

                    let filesArray = Array.from(files)
                    filesArray.forEach((_) => {
                        me.fileList.push(me.getFileObj(_))
                    });
                }
            }
        }, [me.uploader()])
        $content.push(me.imgList())
        $content.push($addControl)


        let $uploader = hx("div.c-uploader")
        $uploader.push($content)
        return $uploader.resolve(h)
    }
})

Vue.component('c-uploader', CUploader)