(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8c4d1b42"],{"0f91":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{attrs:{fluid:""}},[s("v-toolbar",[s("v-toolbar-title",[t._v(t._s(t.pageTitle))]),1==t.config.brd_use_category?s("v-sheet",{staticClass:"ml-4",attrs:{width:"150",color:"transparent"}},[s("category-select",{attrs:{options:t.options},on:{"update:options":function(e){t.options=e}}})],1):t._e(),s("search-field",{staticClass:"ml-4",attrs:{items:t.searchItems,options:t.options},on:{"update:options":function(e){t.options=e}}}),s("v-spacer"),s("v-sheet",{staticClass:"mt-2 mr-2",attrs:{width:"60",color:"transparent"}},[s("v-select",{attrs:{items:t.pageItems,label:"목록 수","hide-details":"",dense:""},model:{value:t.options.itemsPerPage,callback:function(e){t.$set(t.options,"itemsPerPage",e)},expression:"options.itemsPerPage"}})],1),s("v-btn",{attrs:{to:"/board/"+t.table+"?act=write",color:"primary"}},[s("v-icon",{attrs:{left:""}},[t._v("mdi-pencil")]),t._v(" 새글 작성 ")],1)],1),s("v-data-table",{attrs:{headers:t.headers,items:t.items,options:t.options,"server-items-length":t.totalItems,loading:t.loading,"hide-default-footer":""},on:{"update:options":function(e){t.options=e}},scopedSlots:t._u([{key:"item.wr_title",fn:function(e){var a=e.item;return[s("v-btn",{staticClass:"justify-start pl-0",attrs:{to:"/board/"+t.table+"/"+a.wr_id,block:"",plain:""}},[a.wr_dep>0?s("v-icon",{style:{"padding-left":16*(a.wr_dep-1)+"px"}},[t._v(" mdi-subdirectory-arrow-right ")]):t._e(),s("div",[t._v(t._s(a.wr_title))])],1)]}}])}),s("v-pagination",{staticClass:"mt-4",attrs:{length:t.pageCount},model:{value:t.options.page,callback:function(e){t.$set(t.options,"page",e)},expression:"options.page"}})],1)},o=[],i=s("1da1"),n=s("5530"),r=(s("96cf"),s("4de4"),s("a434"),s("a9e3"),s("99af"),s("4328")),l=s.n(r),c=s("2f62"),u=s("64f2"),p=s("fe6b"),f=s("fc1f"),m=function(){var t=this,e=t.$createElement,s=t._self._c||e;return 1==t.config.brd_use_category?s("v-select",{attrs:{label:"카테고리",items:t.items,"hide-details":"",dense:""},on:{change:t.categoryChange},model:{value:t.categoryItem,callback:function(e){t.categoryItem=e},expression:"categoryItem"}}):t._e()},d=[],h=s("2909"),v={name:"CategorySelect",props:{options:{type:Object,required:!0}},data:function(){return{categoryItem:"전체"}},computed:Object(n["a"])(Object(n["a"])({},Object(c["e"])({config:function(t){return t.board.config}})),{},{items:function(){return this.config.brd_use_category?["전체"].concat(Object(h["a"])(this.config.brd_category)):[]}}),methods:{categoryChange:function(){var t="전체"==this.categoryItem?"":this.categoryItem,e=Object(n["a"])(Object(n["a"])({},this.options),{},{page:1});e.stx.splice(1,1,t),this.$emit("update:options",e)}}},b=v,g=s("2877"),x=Object(g["a"])(b,m,d,!1,null,null,null),_=x.exports,y={components:{DisplayTime:p["a"],SearchField:f["a"],CategorySelect:_},name:"BasicList",props:{config:Object,access:Object},title:function(){return this.pageTitle},data:function(){return{loading:!1,options:{},pageReady:!1,pageRouting:!1,pageItems:[2,5,10,20,50,100]}},computed:Object(n["a"])(Object(n["a"])({},Object(c["e"])({items:function(t){return t.board.list},totalItems:function(t){return t.board.totalItems}})),{},{searchItems:function(){var t=this.headers.filter((function(t){return t.searchable}));return t.push({text:"내용",value:"wr_content"}),t},table:function(){return this.config.brd_table},pageTitle:function(){return this.config.brd_subject+" 게시판"},headers:function(){var t=[{text:"No",value:"no",align:"start",sortable:!1,searchable:!1},{text:"제목",value:"wr_title",align:"start",sortable:!1,searchable:!0},{text:"작성자",value:"wr_name",align:"center",sortable:!1,searchable:!0},{text:"작성일",value:"wr_create_at",align:"center",sortable:!1,searchable:!1},{text:"조회수",value:"wr_view",align:"center",sortable:!1,searchable:!1}];return this.config.brd_use_category&&t.splice(1,0,{text:"카테고리",value:"wr_category",align:"start",sortable:!1,searchable:!1}),t},pageCount:function(){return Math.ceil(this.totalItems/this.options.itemsPerPage)}}),watch:{options:{handler:function(){this.fetchData()},deep:!0},table:function(){this.fetchData()}},serverPrefetch:function(){return this.fetchData()},created:function(){this.options=this.initOptions()},mounted:function(){window.addEventListener("popstate",this.routeChange)},destroyed:function(){window.removeEventListener("popstate",this.routeChange)},methods:Object(n["a"])(Object(n["a"])({},Object(c["b"])("board",["getBoardList"])),{},{initOptions:function(){var t=this.$route.query,e={page:Number(t.page)||1,itemsPerPage:Number(t.itemsPerPage)||10,stf:[t.stf||"","wr_category"],stx:[t.stx||"",""],stc:[t.stc||"","eq"]};return e},pushState:function(){if(!this.pageRouting){var t={page:this.options.page,itemsPerPage:this.options.itemPerPage,stf:this.options.stf[0]||void 0,stx:this.options.stx[0]||void 0,stc:this.options.stc[0]||void 0,ca:this.options.stf[1]||void 0},e=l.a.stringify(t);this.pageReady?history.pushState(null,null,"".concat(this.$route.path,"?").concat(e)):history.replaceState(null,null,"".concat(this.$route.path,"?").concat(e))}},getPayload:function(){var t=Object(u["deepCopy"])(this.options);return t.stf.push("wr_reply"),t.stc.push("eq"),t.stx.push("0"),t},routeChange:function(){this.pageRouting=!0,this.options=this.initOptions()},fetchData:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var s,a,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=t.getPayload(),a=l.a.stringify(s),o={},t.$ssrContext&&(o.token=t.$ssrContext.token),e.next=6,t.getBoardList({vm:t,query:a,headers:o});case 6:case"end":return e.stop()}}),e)})))()}})},w=y,O=Object(g["a"])(w,a,o,!1,null,null,null);e["default"]=O.exports},"2f90":function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-dialog",t._b({model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},"v-dialog",t.$attrs,!1),[s("v-card",[s("v-toolbar",t._b({},"v-toolbar",t.$attrs,!1),[s("v-toolbar-title",[t._v(t._s(t.label))]),s("v-spacer"),s("v-btn",{attrs:{icon:""},on:{click:t.close}},[s("v-icon",[t._v("mdi-close")])],1)],1),s("v-card-text",[t._t("default")],2)],1)],1)},o=[],i={name:"MyDialog",props:{label:{type:String,required:!0}},data:function(){return{dialog:!1}},methods:{open:function(){this.$emit("onOpen"),this.dialog=!0},close:function(){this.$emit("onClose"),this.dialog=!1}}},n=i,r=s("2877"),l=Object(r["a"])(n,a,o,!1,null,null,null);e["a"]=l.exports},fc1f:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("tooltip-btn",{attrs:{label:t.searchLabel,icon:"",small:""},on:{click:t.open}},[s("v-icon",[t._v("mdi-magnify")])],1),t.options.stf[0]?s("tooltip-btn",{attrs:{type:"button",label:"검색 초기화",icon:"",color:"error",small:""},on:{click:t.reset}},[s("v-icon",[t._v("mdi-magnify-close")])],1):t._e(),s("my-dialog",{ref:"dialog",attrs:{label:t.label,width:"300"}},[s("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.searchGo.apply(null,arguments)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[s("v-select",{attrs:{label:"검색 필드",items:t.items,rules:[t.rules.required({label:"검색 필드"})]},model:{value:t.form.stf,callback:function(e){t.$set(t.form,"stf",e)},expression:"form.stf"}}),s("v-select",{attrs:{label:"비교방식",items:t.compItems},model:{value:t.form.stc,callback:function(e){t.$set(t.form,"stc",e)},expression:"form.stc"}}),s("v-text-field",{attrs:{label:"검색어",rules:[t.rules.required({label:"검색어"})],disabled:t.isNullComp},model:{value:t.form.stx,callback:function(e){t.$set(t.form,"stx",e)},expression:"form.stx"}}),s("div",{staticClass:"d-flex"},[s("tooltip-btn",{attrs:{type:"button",label:"Reset",icon:"",color:"error"},on:{click:t.reset}},[s("v-icon",[t._v("mdi-magnify-close")])],1),s("v-spacer"),s("tooltip-btn",{attrs:{type:"submit",label:"Search",icon:"",color:"primary"}},[s("v-icon",[t._v("mdi-magnify")])],1)],1)],1)],1)],1)},o=[],i=s("5530"),n=s("1da1"),r=(s("96cf"),s("7db0"),s("99af"),s("a434"),s("ed2f")),l=s("2f90"),c=s("248f"),u=s.n(c),p={components:{TooltipBtn:r["a"],MyDialog:l["a"]},name:"SearchField",props:{label:{type:String,default:"Search"},items:{type:Array,requird:!0},options:{type:Object,required:!0}},data:function(){return{valid:!0,form:{stf:"",stx:"",stc:""},compItems:[{text:"포함",value:"like"},{text:"작은",value:"lt"},{text:"작거나 같은",value:"lte"},{text:"같은",value:"eq"},{text:"크거나 같은",value:"gte"},{text:"큰",value:"gt"},{text:"같지 않은",value:"ne"},{text:"NULL",value:"null"},{text:"NOT NULL",value:"not"}],tempText:""}},computed:{rules:function(){return u.a},searchLabel:function(){var t=this,e=this.items.find((function(e){return e.value==t.options.stf}));return e?"".concat(e.text," : ").concat(this.options.stx):this.label},isNullComp:function(){return"null"==this.form.stc||"not"==this.form.stc?(this.tempText||(this.tempText=this.form.stx,this.form.stx="Null"),!0):(this.tempText&&(this.form.stx=this.tempText,this.tempText=""),!1)}},methods:{open:function(){this.form.stf=this.options.stf[0]||this.items[0].value,this.form.stc=this.options.stc[0]||"like",this.form.stx=this.options.stx[0],this.$refs.form&&this.$refs.form.resetValidation(),this.$refs.dialog.open()},searchGo:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.$refs.form.validate(),e.next=3,t.$nextTick();case 3:if(t.valid){e.next=5;break}return e.abrupt("return");case 5:s=Object(i["a"])(Object(i["a"])({},t.options),{},{page:1}),s.stf.splice(0,1,t.form.stf),s.stc.splice(0,1,t.form.stc),s.stx.splice(0,1,t.form.stx),t.$emit("update:options",s),t.$refs.dialog.close();case 11:case"end":return e.stop()}}),e)})))()},reset:function(){var t=Object(i["a"])(Object(i["a"])({},this.options),{},{page:1});t.stf.splice(0,1,""),t.stc.splice(0,1,""),t.stx.splice(0,1,""),this.$emit("update:options",t),this.$refs.dialog.close()}}},f=p,m=s("2877"),d=Object(m["a"])(f,a,o,!1,null,null,null);e["a"]=d.exports},fe6b:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on,o=e.attrs;return[s("span",t._g(t._b({},"span",o,!1),a),[t._v(" "+t._s(t.display)+" ")])]}}])},[t._v(" "+t._s(t.formatTime)+" ")])},o=[],i={name:"DisplayTime",props:{time:{type:String,required:!0}},computed:{formatTime:function(){return this.$moment(this.time).format("LLL")},display:function(){var t=this.$moment(this.time),e=this.$moment(),s=e.diff(t,"days");return s>0?t.format("LL"):t.fromNow()}}},n=i,r=s("2877"),l=Object(r["a"])(n,a,o,!1,null,null,null);e["a"]=l.exports}}]);
//# sourceMappingURL=chunk-8c4d1b42.73ad9f5c.js.map