(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7a8b2b6c"],{"4e51":function(t,e,o){"use strict";o.r(e);var a=function(){var t=this,e=t._self._c;return e("v-card",[e("v-card-title",[t._v(" "+t._s(t.subject)+" "),e("v-spacer"),e("v-btn",{attrs:{to:"/board/"+t.table,fab:"","x-small":""}},[e("v-icon",[t._v("mdi-dots-horizontal")])],1)],1),e("v-divider"),t.items.length?e("v-container",{attrs:{fluid:""}},[e("v-row",t._l(t.items,(function(o){return e("v-col",{key:o.wr_id,staticClass:"mt-4 gal-item",attrs:{cols:"6",sm:"6",md:"4",lg:"2"}},[e("v-card",[e("v-card-title",{staticClass:"px-0 mx-4 text-body-1"},[e("span",{staticStyle:{width:"100%","text-overflow":"ellipsis",overflow:"hidden","white-space":"nowrap"}},[t._v(" "+t._s(o.wr_title)+" ")])]),e("v-card-subtitle",{staticClass:"d-flex pb-2"},[e("div",[e("v-icon",{attrs:{small:""}},[t._v("mdi-eye")]),t._v(" "+t._s(o.wr_view)+" "),e("v-icon",{staticClass:"ml-2",attrs:{small:""}},[t._v("mdi-comment-outline")]),t._v(" "+t._s(o.wr_reply)+" ")],1),e("v-spacer"),e("display-time",{attrs:{time:o.wr_create_at}})],1),e("a",{staticClass:"text-decoration-none",on:{click:function(e){return t.$router.push(`/board/${t.table}/${o.wr_id}`)}}},[e("v-img",{staticStyle:{border:"0.1px solid #b8b8b8"},attrs:{src:t.getImage(o,t.table,t.imgSize),"aspect-ratio":1}})],1)],1)],1)})),1)],1):e("div",[e("div",[e("v-divider")],1),e("div",{staticClass:"d-flex justify-center align-center",staticStyle:{height:"100px"}},[t._v(" 데이터가 없습니다. ")])])],1)},i=[],r=o("fe6b"),s=o("64f2"),n=o("c117"),l={components:{DisplayTime:r["a"],DisplayGood:n["a"]},name:"GalleryLatest",props:{table:{type:String,required:!0},subject:{type:String,required:!0},items:{type:Array,required:!0},loading:{type:Boolean,default:!1}},data(){return{imgSize:{w:300,h:300}}},computed:{getImage:()=>s["getImage"]}},d=l,c=o("2877"),u=Object(c["a"])(d,a,i,!1,null,null,null);e["default"]=u.exports},c117:function(t,e,o){"use strict";var a=function(){var t=this,e=t._self._c;return e("div",t._b({},"div",t.$attrs,!1),[e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function({on:o,attrs:a}){return[e("v-btn",t._g(t._b({attrs:{color:t.goodColor},on:{click:function(e){return e.stopPropagation(),t.goodUpdate(1)}}},"v-btn",{...a,...t.btnProps},!1),o),[e("v-icon",{attrs:{left:""}},[t._v(t._s(t.icon.good))]),t._v(" "+t._s(t.good)+" ")],1)]}}])},[e("span",[t._v(t._s(t.label.good))])]),t.goodOnly?t._e():e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function({on:o,attrs:a}){return[e("v-btn",t._g(t._b({attrs:{color:t.badColor},on:{click:function(e){return e.stopPropagation(),t.goodUpdate(2)}}},"v-btn",{...a,...t.btnProps},!1),o),[e("v-icon",{attrs:{left:""}},[t._v(t._s(t.icon.bad))]),t._v(" "+t._s(t.bad)+" ")],1)]}}],null,!1,189465039)},[e("span",[t._v(t._s(t.label.bad))])])],1)},i=[],r=o("2f62"),s={name:"DisplayGood",props:{item:{type:Object,required:!0},table:{type:String,required:!0},btnProps:{type:Object,default:null},icon:{type:Object,default:()=>({good:"mdi-heart-outline",bad:"mdi-heart-broken-outline"})},label:{type:Object,default:{good:"좋아요",bad:"싫어요"}},goodOnly:{type:Boolean,default:!1}},data(){return{goodFlag:this.item.goodFlag,good:this.item.good,bad:this.item.bad}},computed:{...Object(r["e"])("user",["user"]),goodColor(){return 1==this.goodFlag?"primary":""},badColor(){return 2==this.goodFlag?"error":""}},methods:{async goodUpdate(t){if(!this.user)return void this.$toast.error("회원만 사용 할 수 있습니다.");let e;e=t==this.goodFlag?await this.$axios.delete(`/api/good/${this.table}/${this.item.wr_id}`):await this.$axios.post(`/api/good/${this.table}/${this.item.wr_id}`,{brd_good_flag:t}),e&&(this.goodFlag=e.goodFlag,this.good=e.good,this.bad=e.bad)}}},n=s,l=o("2877"),d=Object(l["a"])(n,a,i,!1,null,null,null);e["a"]=d.exports},fe6b:function(t,e,o){"use strict";var a=function(){var t=this,e=t._self._c;return e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function({on:o,attrs:a}){return[e("span",t._g(t._b({},"span",a,!1),o),[t._v(" "+t._s(t.display)+" ")])]}}])},[t._v(" "+t._s(t.formatTime)+" ")])},i=[],r={name:"DisplayTime",props:{time:{type:String,required:!0}},computed:{formatTime(){return this.$moment(this.time).format("LLL")},display(){const t=this.$moment(this.time),e=this.$moment(),o=e.diff(t,"days");return o>0?t.format("LL"):t.fromNow()}}},s=r,n=o("2877"),l=Object(n["a"])(s,a,i,!1,null,null,null);e["a"]=l.exports}}]);
//# sourceMappingURL=chunk-7a8b2b6c.06650a2e.js.map