(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3422e9a5"],{"2f90":function(t,e,s){"use strict";var o=function(){var t=this,e=t._self._c;return e("v-dialog",t._b({model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},"v-dialog",t.$attrs,!1),[e("v-card",[e("v-toolbar",t._b({},"v-toolbar",t.$attrs,!1),[e("v-toolbar-title",[t._v(t._s(t.label))]),e("v-spacer"),e("v-btn",{attrs:{icon:""},on:{click:t.close}},[e("v-icon",[t._v("mdi-close")])],1)],1),e("v-card-text",[t._t("default")],2)],1)],1)},a=[],i={name:"MyDialog",props:{label:{type:String,required:!0}},data(){return{dialog:!1}},methods:{open(){this.$emit("onOpen"),this.dialog=!0},close(){this.$emit("onClose"),this.dialog=!1}}},r=i,l=s("2877"),n=Object(l["a"])(r,o,a,!1,null,null,null);e["a"]=n.exports},c117:function(t,e,s){"use strict";var o=function(){var t=this,e=t._self._c;return e("div",t._b({},"div",t.$attrs,!1),[e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function({on:s,attrs:o}){return[e("v-btn",t._g(t._b({attrs:{color:t.goodColor},on:{click:function(e){return e.stopPropagation(),t.goodUpdate(1)}}},"v-btn",{...o,...t.btnProps},!1),s),[e("v-icon",{attrs:{left:""}},[t._v(t._s(t.icon.good))]),t._v(" "+t._s(t.good)+" ")],1)]}}])},[e("span",[t._v(t._s(t.label.good))])]),t.goodOnly?t._e():e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function({on:s,attrs:o}){return[e("v-btn",t._g(t._b({attrs:{color:t.badColor},on:{click:function(e){return e.stopPropagation(),t.goodUpdate(2)}}},"v-btn",{...o,...t.btnProps},!1),s),[e("v-icon",{attrs:{left:""}},[t._v(t._s(t.icon.bad))]),t._v(" "+t._s(t.bad)+" ")],1)]}}],null,!1,189465039)},[e("span",[t._v(t._s(t.label.bad))])])],1)},a=[],i=s("2f62"),r={name:"DisplayGood",props:{item:{type:Object,required:!0},table:{type:String,required:!0},btnProps:{type:Object,default:null},icon:{type:Object,default:()=>({good:"mdi-heart-outline",bad:"mdi-heart-broken-outline"})},label:{type:Object,default:{good:"좋아요",bad:"싫어요"}},goodOnly:{type:Boolean,default:!1}},data(){return{goodFlag:this.item.goodFlag,good:this.item.good,bad:this.item.bad}},computed:{...Object(i["e"])("user",["user"]),goodColor(){return 1==this.goodFlag?"primary":""},badColor(){return 2==this.goodFlag?"error":""}},methods:{async goodUpdate(t){if(!this.user)return void this.$toast.error("회원만 사용 할 수 있습니다.");let e;e=t==this.goodFlag?await this.$axios.delete(`/api/good/${this.table}/${this.item.wr_id}`):await this.$axios.post(`/api/good/${this.table}/${this.item.wr_id}`,{brd_good_flag:t}),e&&(this.goodFlag=e.goodFlag,this.good=e.good,this.bad=e.bad)}}},l=r,n=s("2877"),c=Object(n["a"])(l,o,a,!1,null,null,null);e["a"]=c.exports},ca4c:function(t,e,s){"use strict";s.r(e);var o=function(){var t=this,e=t._self._c;return e("v-container",{attrs:{fluid:""}},[e("v-toolbar",[e("v-toolbar-title",[t._v(t._s(t.pageTitle))]),1==t.config.brd_use_category?e("v-sheet",{staticClass:"ml-4",attrs:{width:"150",color:"transparent"}},[e("category-select",{attrs:{options:t.options},on:{"update:options":function(e){t.options=e}}})],1):t._e(),e("search-field",{staticClass:"ml-4",attrs:{items:t.searchItems,options:t.options},on:{"update:options":function(e){t.options=e}}}),e("v-spacer"),e("v-sheet",{staticClass:"mt-2 mr-2",attrs:{width:"60",color:"transparent"}},[e("v-select",{attrs:{items:t.pageItems,label:"목록 수","hide-details":"",dense:""},model:{value:t.options.itemsPerPage,callback:function(e){t.$set(t.options,"itemsPerPage",e)},expression:"options.itemsPerPage"}})],1),e("v-btn",{attrs:{to:`/board/${t.table}?act=write`,color:"primary"}},[e("v-icon",{attrs:{left:""}},[t._v("mdi-pencil")]),t._v(" 새글 작성 ")],1)],1),e("v-row",t._l(t.items,(function(s){return e("v-col",{key:s.wr_id,staticClass:"mt-4 gal-item",attrs:{cols:"6",sm:"4",md:"3",lg:"2"}},[e("v-card",[e("v-card-title",{staticClass:"px-0 mx-4 text-body-1"},[e("span",{staticStyle:{width:"100%","text-overflow":"ellipsis",overflow:"hidden","white-space":"nowrap"}},[t._v(" "+t._s(s.wr_title)+" ")])]),e("v-card-subtitle",{staticClass:"d-flex pb-2"},[t._v(" "+t._s(s.wr_name)+" "),e("v-spacer"),e("display-time",{attrs:{time:s.wr_create_at}})],1),e("a",{staticClass:"text-decoration-none",on:{click:function(e){return t.$router.push(`/board/${t.table}/${s.wr_id}`)}}},[e("v-img",{directives:[{name:"img-fallback",rawName:"v-img-fallback",value:t.imgFallback,expression:"imgFallback"}],staticStyle:{border:"0.1px solid #b8b8b8"},attrs:{src:t.getImage(s,t.table,t.imgSize),"aspect-ratio":1}})],1),e("div",{staticClass:"d-flex justify-space-between align-center ml-4 pt-2 pb-2"},[e("div",[e("v-icon",{attrs:{small:""}},[t._v("mdi-eye")]),t._v(" "+t._s(s.wr_view)+" "),e("v-icon",{staticClass:"ml-2",attrs:{small:""}},[t._v("mdi-comment-outline")]),t._v(" "+t._s(s.wr_reply)+" ")],1),e("v-spacer"),e("display-good",{attrs:{item:s,table:t.table,label:{good:"좋아요",bad:"싫어요"},icon:{good:"mdi-thumb-up",bad:"mdi-thumb-down"},btnProps:{text:!0,small:!0},"good-only":""}})],1)],1)],1)})),1),e("v-row",[e("v-col",[e("v-pagination",{staticClass:"mt-4",attrs:{length:t.pageCount},model:{value:t.options.page,callback:function(e){t.$set(t.options,"page",e)},expression:"options.page"}})],1)],1)],1)},a=[],i=s("4328"),r=s.n(i),l=s("2f62"),n=s("64f2"),c=s("fc1f"),p=function(){var t=this,e=t._self._c;return 1==t.config.brd_use_category?e("v-select",{attrs:{label:"카테고리",items:t.items,"hide-details":"",dense:""},on:{change:t.categoryChange},model:{value:t.categoryItem,callback:function(e){t.categoryItem=e},expression:"categoryItem"}}):t._e()},d=[],u={name:"CategorySelect",props:{options:{type:Object,required:!0}},data(){return{categoryItem:"전체"}},computed:{...Object(l["e"])({config:t=>t.board.config}),items(){return this.config.brd_use_category?["전체",...this.config.brd_category]:[]}},methods:{categoryChange(){const t="전체"==this.categoryItem?"":this.categoryItem,e={...this.options,page:1};e.stx.splice(1,1,t),this.$emit("update:options",e)}}},m=u,h=s("2877"),g=Object(h["a"])(m,p,d,!1,null,null,null),f=g.exports,b=s("d3f8"),v=s("c117"),_=s("6915"),y={directives:{ImgFallback:_["a"]},components:{SearchField:c["a"],CategorySelect:f,DisplayTime:b["a"],DisplayGood:v["a"]},name:"GalleryList",props:{config:Object,access:Object},title(){return this.pageTitle},data(){return{loading:!1,options:{},pageReady:!1,pageRouting:!1,pageItems:[2,3,4,6,9,12],imgSize:{w:300,h:300},imgFallback:{error:"/image/noimage.jpg"}}},computed:{...Object(l["e"])({items:t=>t.board.list,totalItems:t=>t.board.totalItems}),searchItems(){const t=this.headers.filter(t=>t.searchable);return t.push({text:"내용",value:"wr_content"}),t},table(){return this.config.brd_table},pageTitle(){return this.config.brd_subject+" 게시판"},headers(){const t=[{text:"No",value:"no",align:"center",sortable:!1,searchable:!1,width:"90"},{text:"제목",value:"wr_title",align:"start",sortable:!1,searchable:!0},{text:"작성자",value:"wr_name",align:"center",sortable:!1,searchable:!0,width:"100"},{text:"작성일",value:"wr_create_at",align:"center",sortable:!1,searchable:!1,width:"150"},{text:"조회수",value:"wr_view",align:"center",sortable:!1,searchable:!1,width:"80"}];return this.config.brd_use_category&&t.splice(1,0,{text:"카테고리",value:"wr_category",align:"center",sortable:!1,searchable:!1,width:"120"}),t},pageCount(){return Math.ceil(this.totalItems/this.options.itemsPerPage)},getImage:()=>n["getImage"]},watch:{options:{handler(){this.fetchData()},deep:!0},table(){this.fetchData()}},serverPrefetch(){return this.fetchData()},created(){this.options=this.initOptions()},mounted(){window.addEventListener("popstate",this.routeChange)},destroyed(){window.removeEventListener("popstate",this.routeChange),this.SET_LIST({items:[],totalItems:0})},methods:{...Object(l["d"])("board",["SET_LIST"]),...Object(l["b"])("board",["getBoardList"]),initOptions(){const{query:t}=this.$route,e={page:Number(t.page)||1,itemsPerPage:Number(t.itemsPerPage)||6,stf:[t.stf||"","wr_category"],stx:[t.stx||"",""],stc:[t.stc||"","eq"]};return e},pushState(){if(!this.pageRouting){const t={page:this.options.page,itemsPerPage:this.options.itemPerPage,stf:this.options.stf[0]||void 0,stx:this.options.stx[0]||void 0,stc:this.options.stc[0]||void 0,ca:this.options.stf[1]||void 0},e=r.a.stringify(t);this.pageReady?history.pushState(null,null,`${this.$route.path}?${e}`):history.replaceState(null,null,`${this.$route.path}?${e}`)}},getPayload(){const t=Object(n["deepCopy"])(this.options);return t.stf.push("wr_reply"),t.stc.push("eq"),t.stx.push("0"),t},routeChange(){this.pageRouting=!0,this.options=this.initOptions()},async fetchData(){const t=this.getPayload(),e=r.a.stringify(t),s={};this.$ssrContext&&(s.token=this.$ssrContext.token),await this.getBoardList({vm:this,query:e,headers:s})},getNo(t){const{page:e,itemsPerPage:s}=this.options,{totalItems:o}=this;return o-(e-1)*s-t}}},x=y,w=Object(h["a"])(x,o,a,!1,null,null,null);e["default"]=w.exports},d3f8:function(t,e,s){"use strict";var o=function(){var t=this,e=t._self._c;return e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function({on:s,attrs:o}){return[e("span",t._g(t._b({},"span",o,!1),s),[t._v(" "+t._s(t.display)+" ")])]}}])},[t._v(" "+t._s(t.formatTime)+" ")])},a=[],i={name:"DisplayTime",props:{time:{type:String,required:!0}},computed:{formatTime(){return this.$moment(this.time).format("LLL")},display(){const t=this.$moment(this.time),e=this.$moment(),s=e.diff(t,"days");return s>0?t.format("LL"):t.fromNow()}}},r=i,l=s("2877"),n=Object(l["a"])(r,o,a,!1,null,null,null);e["a"]=n.exports},ed2f:function(t,e,s){"use strict";var o=function(){var t=this,e=t._self._c;return e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function({on:s,attrs:o}){return[e("v-btn",t._g(t._b({class:t.childClass,attrs:{icon:""},on:{click:function(e){return t.$emit("click")}}},"v-btn",{...t.$attrs,...o},!1),s),[t._t("default")],2)]}}],null,!0)},[e("span",[t._v(t._s(t.label))])])},a=[],i={name:"TooltipBtn",props:{label:{type:String,required:!0},childClass:[String,Object]}},r=i,l=s("2877"),n=Object(l["a"])(r,o,a,!1,null,null,null);e["a"]=n.exports},fc1f:function(t,e,s){"use strict";var o=function(){var t=this,e=t._self._c;return e("div",[e("tooltip-btn",{attrs:{label:t.searchLabel,icon:"",small:""},on:{click:t.open}},[e("v-icon",[t._v("mdi-magnify")])],1),t.options.stf[0]?e("tooltip-btn",{attrs:{type:"button",label:"검색 초기화",icon:"",color:"error",small:""},on:{click:t.reset}},[e("v-icon",[t._v("mdi-magnify-close")])],1):t._e(),e("my-dialog",{ref:"dialog",attrs:{label:t.label,width:"300"}},[e("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.searchGo.apply(null,arguments)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[e("v-select",{attrs:{label:"검색 필드",items:t.items,rules:[t.rules.required({label:"검색 필드"})]},model:{value:t.form.stf,callback:function(e){t.$set(t.form,"stf",e)},expression:"form.stf"}}),e("v-select",{attrs:{label:"비교방식",items:t.compItems},model:{value:t.form.stc,callback:function(e){t.$set(t.form,"stc",e)},expression:"form.stc"}}),e("v-text-field",{attrs:{label:"검색어",rules:[t.rules.required({label:"검색어"})],disabled:t.isNullComp},model:{value:t.form.stx,callback:function(e){t.$set(t.form,"stx",e)},expression:"form.stx"}}),e("div",{staticClass:"d-flex"},[e("tooltip-btn",{attrs:{type:"button",label:"Reset",icon:"",color:"error"},on:{click:t.reset}},[e("v-icon",[t._v("mdi-magnify-close")])],1),e("v-spacer"),e("tooltip-btn",{attrs:{type:"submit",label:"Search",icon:"",color:"primary"}},[e("v-icon",[t._v("mdi-magnify")])],1)],1)],1)],1)],1)},a=[],i=s("ed2f"),r=s("2f90"),l=s("248f"),n=s.n(l),c={components:{TooltipBtn:i["a"],MyDialog:r["a"]},name:"SearchField",props:{label:{type:String,default:"Search"},items:{type:Array,requird:!0},options:{type:Object,required:!0}},data(){return{valid:!0,form:{stf:"",stx:"",stc:""},compItems:[{text:"포함",value:"like"},{text:"작은",value:"lt"},{text:"작거나 같은",value:"lte"},{text:"같은",value:"eq"},{text:"크거나 같은",value:"gte"},{text:"큰",value:"gt"},{text:"같지 않은",value:"ne"},{text:"NULL",value:"null"},{text:"NOT NULL",value:"not"}],tempText:""}},computed:{rules:()=>n.a,searchLabel(){const t=this.items.find(t=>t.value==this.options.stf);return t?`${t.text} : ${this.options.stx}`:this.label},isNullComp(){return"null"==this.form.stc||"not"==this.form.stc?(this.tempText||(this.tempText=this.form.stx,this.form.stx="Null"),!0):(this.tempText&&(this.form.stx=this.tempText,this.tempText=""),!1)}},methods:{open(){this.form.stf=this.options.stf[0]||this.items[0].value,this.form.stc=this.options.stc[0]||"like",this.form.stx=this.options.stx[0],this.$refs.form&&this.$refs.form.resetValidation(),this.$refs.dialog.open()},async searchGo(){if(this.$refs.form.validate(),await this.$nextTick(),!this.valid)return;const t={...this.options,page:1};t.stf.splice(0,1,this.form.stf),t.stc.splice(0,1,this.form.stc),t.stx.splice(0,1,this.form.stx),this.$emit("update:options",t),this.$refs.dialog.close()},reset(){const t={...this.options,page:1};t.stf.splice(0,1,""),t.stc.splice(0,1,""),t.stx.splice(0,1,""),this.$emit("update:options",t),this.$refs.dialog.close()}}},p=c,d=s("2877"),u=Object(d["a"])(p,o,a,!1,null,null,null);e["a"]=u.exports}}]);
//# sourceMappingURL=chunk-3422e9a5.2091d04d.js.map