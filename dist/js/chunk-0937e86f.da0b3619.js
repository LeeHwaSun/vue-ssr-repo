(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0937e86f"],{"063f":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,o=e.attrs;return[a("span",t._g(t._b({},"span",o,!1),n),[t._v(" "+t._s(t.display)+" ")])]}}])},[t._v(" "+t._s(t.formatTime)+" ")])},o=[],i={name:"DisplayTime",props:{time:{type:String,required:!0}},computed:{formatTime:function(){return this.$moment(this.time).format("LLL")},display:function(){var t=this.$moment(this.time),e=this.$moment(),a=e.diff(t,"days");return a>0?t.format("LL"):t.fromNow()}}},s=i,r=a("2877"),c=Object(r["a"])(s,n,o,!1,null,null,null);e["a"]=c.exports},"2f90":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-dialog",t._b({model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},"v-dialog",t.$attrs,!1),[a("v-card",[a("v-toolbar",t._b({},"v-toolbar",t.$attrs,!1),[a("v-toolbar-title",[t._v(t._s(t.label))]),a("v-spacer"),a("v-btn",{attrs:{icon:""},on:{click:t.close}},[a("v-icon",[t._v("mdi-close")])],1)],1),a("v-card-text",[t._t("default")],2)],1)],1)},o=[],i={name:"MyDialog",props:{label:{type:String,required:!0}},data:function(){return{dialog:!1}},methods:{open:function(){this.$emit("onOpen"),this.dialog=!0},close:function(){this.$emit("onClose"),this.dialog=!1}}},s=i,r=a("2877"),c=Object(r["a"])(s,n,o,!1,null,null,null);e["a"]=c.exports},ecd2:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-toolbar",[a("v-toolbar-title",[t._v(t._s(t.pageTitle))]),1==t.config.brd_use_category?a("v-sheet",{staticClass:"ml-4",attrs:{width:"150",color:"transparent"}},[a("category-select",{attrs:{options:t.options},on:{"update:options":function(e){t.options=e}}})],1):t._e(),a("search-field",{staticClass:"ml-4",attrs:{items:t.searchItems,options:t.options},on:{"update:options":function(e){t.options=e}}}),a("v-spacer"),a("v-sheet",{staticClass:"mt-2 mr-2",attrs:{width:"60",color:"transparent"}},[a("v-select",{attrs:{items:t.pageItems,label:"목록 수","hide-details":"",dense:""},model:{value:t.options.itemsPerPage,callback:function(e){t.$set(t.options,"itemsPerPage",e)},expression:"options.itemsPerPage"}})],1),a("v-btn",{attrs:{to:"/board/"+t.table+"?act=write",color:"primary"}},[a("v-icon",{attrs:{left:""}},[t._v("mdi-pencil")]),t._v(" 새글 작성 ")],1)],1),a("v-data-table",{staticClass:"fixedTable",attrs:{headers:t.headers,items:t.items,options:t.options,"server-items-length":t.totalItems,loading:t.loading,"hide-default-footer":""},on:{"update:options":function(e){t.options=e}},scopedSlots:t._u([{key:"item.no",fn:function(e){var a=e.index;return[t._v(" "+t._s(t.getNo(a))+" ")]}},{key:"item.wr_title",fn:function(e){var n=e.item;return[a("v-btn",{staticClass:"justify-start pa-0",attrs:{to:"/contents/"+n.wr_1,block:"",plain:""}},[t._v(" "+t._s(n.wr_title)+" ")])]}},{key:"item.cmd",fn:function(e){var n=e.item;return[a("tooltip-btn",{attrs:{label:"Modify",icon:"",color:"primary",to:"/board/"+t.table+"/"+n.wr_id+"?act=write"}},[a("v-icon",[t._v("mdi-pencil")])],1),t.isSuper?a("tooltip-btn",{attrs:{label:"Delete",icon:"",color:"red",loading:t.deleteLoading},on:{click:function(e){return t.deleteItem(n)}}},[a("v-icon",[t._v("mdi-delete")])],1):t._e()]}}])}),a("v-pagination",{staticClass:"mt-4",attrs:{length:t.pageCount},model:{value:t.options.page,callback:function(e){t.$set(t.options,"page",e)},expression:"options.page"}})],1)},o=[],i=a("1da1"),s=a("5530"),r=(a("96cf"),a("4de4"),a("a9e3"),a("99af"),a("4328")),c=a.n(r),l=a("2f62"),u=a("64f2"),p=a("fc1f"),f=function(){var t=this,e=t.$createElement,a=t._self._c||e;return 1==t.config.brd_use_category?a("v-select",{attrs:{label:"카테고리",items:t.items,"hide-details":"",dense:""},on:{change:t.categoryChange},model:{value:t.categoryItem,callback:function(e){t.categoryItem=e},expression:"categoryItem"}}):t._e()},d=[],m=a("2909"),h=(a("a434"),{name:"CategorySelect",props:{options:{type:Object,required:!0}},data:function(){return{categoryItem:"전체"}},computed:Object(s["a"])(Object(s["a"])({},Object(l["e"])({config:function(t){return t.board.config}})),{},{items:function(){return this.config.brd_use_category?["전체"].concat(Object(m["a"])(this.config.brd_category)):[]}}),methods:{categoryChange:function(){var t="전체"==this.categoryItem?"":this.categoryItem,e=Object(s["a"])(Object(s["a"])({},this.options),{},{page:1});e.stx.splice(1,1,t),this.$emit("update:options",e)}}}),b=h,v=a("2877"),g=Object(v["a"])(b,f,d,!1,null,null,null),x=g.exports,_=a("063f"),y=a("ed2f"),w={components:{SearchField:p["a"],CategorySelect:x,DisplayTime:_["a"],TooltipBtn:y["a"]},name:"BasicList",props:{config:Object,access:Object},title:function(){return this.pageTitle},data:function(){return{loading:!1,options:{},pageReady:!1,pageRouting:!1,pageItems:[2,5,10,20,50,100],deleteLoading:!1}},computed:Object(s["a"])(Object(s["a"])(Object(s["a"])({},Object(l["e"])({items:function(t){return t.board.list},totalItems:function(t){return t.board.totalItems}})),Object(l["c"])("user",["isSuper"])),{},{searchItems:function(){var t=this.headers.filter((function(t){return t.searchable}));return t.push({text:"내용",value:"wr_content"}),t},table:function(){return this.config.brd_table},pageTitle:function(){return this.config.brd_subject+" 게시판"},headers:function(){var t=[{text:"No",value:"no",align:"center",sortable:!1,searchable:!1,width:"90"},{text:"ID",value:"wr_1",align:"start",sortable:!0,searchable:!0,width:"160"},{text:"제목",value:"wr_title",align:"start",sortable:!1,searchable:!0,cellClass:"text-truncate"},{text:"스킨",value:"wr_2",align:"center",sortable:!0,searchable:!0,width:"160"},{text:"CMD",value:"cmd",align:"center",sortable:!1,searchable:!1,width:"160"}];return t},pageCount:function(){return Math.ceil(this.totalItems/this.options.itemsPerPage)}}),watch:{options:{handler:function(){this.fetchData()},deep:!0},table:function(){this.fetchData()}},serverPrefetch:function(){return this.fetchData()},created:function(){this.options=this.initOptions()},mounted:function(){window.addEventListener("popstate",this.routeChange)},destroyed:function(){window.removeEventListener("popstate",this.routeChange),this.SET_LIST({items:[],totalItems:0})},methods:Object(s["a"])(Object(s["a"])(Object(s["a"])({},Object(l["d"])("board",["SET_LIST"])),Object(l["b"])("board",["getBoardList"])),{},{initOptions:function(){var t=this.$route.query,e={page:Number(t.page)||1,itemsPerPage:Number(t.itemsPerPage)||10,stf:[t.stf||"","wr_category"],stx:[t.stx||"",""],stc:[t.stc||"","eq"]};return e},pushState:function(){if(!this.pageRouting){var t={page:this.options.page,itemsPerPage:this.options.itemPerPage,stf:this.options.stf[0]||void 0,stx:this.options.stx[0]||void 0,stc:this.options.stc[0]||void 0,ca:this.options.stf[1]||void 0},e=c.a.stringify(t);this.pageReady?history.pushState(null,null,"".concat(this.$route.path,"?").concat(e)):history.replaceState(null,null,"".concat(this.$route.path,"?").concat(e))}},getPayload:function(){var t=Object(u["deepCopy"])(this.options);return t.stf.push("wr_reply"),t.stc.push("eq"),t.stx.push("0"),t},routeChange:function(){this.pageRouting=!0,this.options=this.initOptions()},fetchData:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a,n,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.getPayload(),n=c.a.stringify(a),o={},t.$ssrContext&&(o.token=t.$ssrContext.token),e.next=6,t.getBoardList({vm:t,query:n,headers:o});case 6:case"end":return e.stop()}}),e)})))()},getNo:function(t){var e=this.options,a=e.page,n=e.itemsPerPage,o=this.totalItems;return o-(a-1)*n-t},deleteItem:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var n,o;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return e.deleteLoading=!0,a.next=3,e.$myNotify.confirm("".concat(t.wr_title,"을(를) 삭제하시겠습니까?"),"컨텐츠 삭제",{icon:"mdi-alert"});case 3:if(n=a.sent,!n){a.next=9;break}return a.next=7,e.$axios.delete("/api/board/".concat(e.table,"/").concat(t.wr_id));case 7:o=a.sent,o&&(e.$toast.info("".concat(t.wr_title," 컨텐츠가 삭제되었습니다.")),e.fetchData());case 9:e.deleteLoading=!1;case 10:case"end":return a.stop()}}),a)})))()}})},O=w,j=Object(v["a"])(O,n,o,!1,null,null,null);e["default"]=j.exports},ed2f:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,o=e.attrs;return[a("v-btn",t._g(t._b({class:t.childClass,attrs:{icon:""},on:{click:function(e){return t.$emit("click")}}},"v-btn",Object.assign({},t.$attrs,o),!1),n),[t._t("default")],2)]}}],null,!0)},[a("span",[t._v(t._s(t.label))])])},o=[],i={name:"TooltipBtn",props:{label:{type:String,required:!0},childClass:[String,Object]}},s=i,r=a("2877"),c=Object(r["a"])(s,n,o,!1,null,null,null);e["a"]=c.exports},fc1f:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("tooltip-btn",{attrs:{label:t.searchLabel,icon:"",small:""},on:{click:t.open}},[a("v-icon",[t._v("mdi-magnify")])],1),t.options.stf[0]?a("tooltip-btn",{attrs:{type:"button",label:"검색 초기화",icon:"",color:"error",small:""},on:{click:t.reset}},[a("v-icon",[t._v("mdi-magnify-close")])],1):t._e(),a("my-dialog",{ref:"dialog",attrs:{label:t.label,width:"300"}},[a("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.searchGo.apply(null,arguments)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-select",{attrs:{label:"검색 필드",items:t.items,rules:[t.rules.required({label:"검색 필드"})]},model:{value:t.form.stf,callback:function(e){t.$set(t.form,"stf",e)},expression:"form.stf"}}),a("v-select",{attrs:{label:"비교방식",items:t.compItems},model:{value:t.form.stc,callback:function(e){t.$set(t.form,"stc",e)},expression:"form.stc"}}),a("v-text-field",{attrs:{label:"검색어",rules:[t.rules.required({label:"검색어"})],disabled:t.isNullComp},model:{value:t.form.stx,callback:function(e){t.$set(t.form,"stx",e)},expression:"form.stx"}}),a("div",{staticClass:"d-flex"},[a("tooltip-btn",{attrs:{type:"button",label:"Reset",icon:"",color:"error"},on:{click:t.reset}},[a("v-icon",[t._v("mdi-magnify-close")])],1),a("v-spacer"),a("tooltip-btn",{attrs:{type:"submit",label:"Search",icon:"",color:"primary"}},[a("v-icon",[t._v("mdi-magnify")])],1)],1)],1)],1)],1)},o=[],i=a("5530"),s=a("1da1"),r=(a("96cf"),a("7db0"),a("99af"),a("a434"),a("ed2f")),c=a("2f90"),l=a("248f"),u=a.n(l),p={components:{TooltipBtn:r["a"],MyDialog:c["a"]},name:"SearchField",props:{label:{type:String,default:"Search"},items:{type:Array,requird:!0},options:{type:Object,required:!0}},data:function(){return{valid:!0,form:{stf:"",stx:"",stc:""},compItems:[{text:"포함",value:"like"},{text:"작은",value:"lt"},{text:"작거나 같은",value:"lte"},{text:"같은",value:"eq"},{text:"크거나 같은",value:"gte"},{text:"큰",value:"gt"},{text:"같지 않은",value:"ne"},{text:"NULL",value:"null"},{text:"NOT NULL",value:"not"}],tempText:""}},computed:{rules:function(){return u.a},searchLabel:function(){var t=this,e=this.items.find((function(e){return e.value==t.options.stf}));return e?"".concat(e.text," : ").concat(this.options.stx):this.label},isNullComp:function(){return"null"==this.form.stc||"not"==this.form.stc?(this.tempText||(this.tempText=this.form.stx,this.form.stx="Null"),!0):(this.tempText&&(this.form.stx=this.tempText,this.tempText=""),!1)}},methods:{open:function(){this.form.stf=this.options.stf[0]||this.items[0].value,this.form.stc=this.options.stc[0]||"like",this.form.stx=this.options.stx[0],this.$refs.form&&this.$refs.form.resetValidation(),this.$refs.dialog.open()},searchGo:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.$refs.form.validate(),e.next=3,t.$nextTick();case 3:if(t.valid){e.next=5;break}return e.abrupt("return");case 5:a=Object(i["a"])(Object(i["a"])({},t.options),{},{page:1}),a.stf.splice(0,1,t.form.stf),a.stc.splice(0,1,t.form.stc),a.stx.splice(0,1,t.form.stx),t.$emit("update:options",a),t.$refs.dialog.close();case 11:case"end":return e.stop()}}),e)})))()},reset:function(){var t=Object(i["a"])(Object(i["a"])({},this.options),{},{page:1});t.stf.splice(0,1,""),t.stc.splice(0,1,""),t.stx.splice(0,1,""),this.$emit("update:options",t),this.$refs.dialog.close()}}},f=p,d=a("2877"),m=Object(d["a"])(f,n,o,!1,null,null,null);e["a"]=m.exports}}]);
//# sourceMappingURL=chunk-0937e86f.da0b3619.js.map