var Grades=function(){var f={},w={},k={},z={},B={},C={},D={},p=[],g=function(){},e=function(a,e,l){e?($(a).prop("disabled",!0).css({position:"relative"}),l&&(a=l(a)),a.append($("<div />",{"class":"spinner"}).append($("<div />",{"class":"fa fa-spin fa-cog"})))):$(a).prop("disabled",!1).find(".spinner").remove()},A=function(){w={};k={};g()},m=function(a,e){try{if("type"in a){switch(a.type){case "grade":var l=w[a.id];if(void 0==l||l.timestamp<a.timestamp)w[a.id]=a,!e&&l&&"visible"in l&&0==l.visible&&
"visible"in a&&1==a.visible&&getHistory(Conversations.getCurrentSlideJid());break;case "numericGradeValue":case "booleanGradeValue":case "textGradeValue":var f=k[a.gradeId]||{};k[a.gradeId]=f;var p=f[a.gradedUser];if(!p||p.timestamp<a.timestamp)f[a.gradedUser]=a,Progress.call("gradeValueReceived",[a])}e||g()}}catch(h){console.log("Grades.stanzaReceived",h)}};Progress.onConversationJoin.Grades=A;Progress.historyReceived.Grades=function(a){try{"type"in a&&"history"==a.type&&(A(),_.forEach(a.grades,
function(a){m(a,!0)}),_.forEach(a.gradeValues,function(a){m(a,!0)}),g())}catch(e){console.log("Grades.historyReceivedFunction",e)}};Progress.stanzaReceived.Grades=m;$(function(){$.getJSON("/getExternalGradebooks",function(a){p=a});console.log("Conv state:",Conversations.getCurrentConversationJid(),Conversations.shouldModifyConversation(),Conversations.getCurrentConversation());var a=function(){f=$("#gradesDatagrid");B=f.find(".gradeActionsContainer").clone();C=f.find(".gradeEditContainer").clone();
D=f.find(".gradeAssessContainer").clone();f.empty();z=$("#createGradeButton");var a=function(a){jsGrid.Field.call(this,a)};a.prototype=new jsGrid.Field({sorter:function(a,b){return new Date(a)-new Date(b)},itemTemplate:function(a){return(new Date(a)).toLocaleString()},insertTemplate:function(a){return""},editTemplate:function(a){return""},insertValue:function(){return""},editValue:function(){return""}});jsGrid.fields.dateField=a;var a=[{name:"name",type:"text",title:"Name",readOnly:!0,sorting:!0},
{name:"description",type:"text",title:"Description",readOnly:!0,sorting:!0},{name:"location",type:"text",title:"Location",readOnly:!0,sorting:!0},{name:"timestamp",type:"dateField",title:"When",readOnly:!0}],m=[{name:"gradeType",type:"text",title:"Type",readOnly:!0,sorting:!0},{name:"identity",type:"text",title:"actions",readOnly:!0,sorting:!1,itemTemplate:function(a,b){if(b.author==UserSettings.getUsername()){var f=B.clone(),c=_.cloneDeep(b),r=function(){var a=_.uniqueId(),b=$("<div/>",{id:a}),f=
$.jAlert({title:"edit grade",width:"50%",content:b[0].outerHTML}),d=C.clone(),b=sprintf("gradeName_%s",a),h=d.find(".gradeNameInputBox");h.attr("id",b).on("blur",function(a){c.name=h.val()}).val(c.name);d.find(".gradeNameLabel").attr("for",b);var b=sprintf("gradeDesc_%s",a),k=d.find(".gradeDescriptionInputBox");k.attr("id",b).on("blur",function(a){c.description=k.val()}).val(c.description);d.find(".gradeDescriptionLabel").attr("for",b);var b=sprintf("gradeType_%s",a),l=d.find(".gradeTypeSelect"),
m=d.find(".numericMinTextbox"),u=d.find(".numericMaxTextbox"),x=sprintf("numericMin_%s",a),E=sprintf("numericMax_%s",a);d.find(".numericMinLabel").attr("for",x);d.find(".numericMaxLabel").attr("for",E);m.on("blur",function(a){"numeric"==c.gradeType?c.numericMinimum=parseFloat(u.val()):delete c.numericMinimum}).attr("id",x);u.on("blur",function(a){"numeric"==c.gradeType?c.numericMaximum=parseFloat(u.val()):delete c.numericMaximum}).attr("id",E);var q=function(){switch(c.gradeType){case "numeric":d.find(".numericOptions").show();
void 0===c.numericMinimum&&(c.numericMinimum=0);void 0===c.numericMaximum&&(c.numericMaximum=100);m.val(c.numericMinimum);u.val(c.numericMaximum);break;default:d.find(".numericOptions").hide()}};l.attr("id",b).on("change",function(){c.gradeType=l.val();q()}).val(c.gradeType);q();d.find(".gradeTypeLabel").attr("for",b);b=sprintf("gradeVisible_%s",a);d.find(".gradeVisibleLabel").attr("for",b);var g=d.find(".gradeVisibleCheckbox");g.attr("id",b).prop("checked",c.visible).on("change",function(a){c.visible=
g.prop("checked")});var t=void 0,v=void 0,n=void 0,y=function(){var a=d.find(".associateController");e(a,!1);if("foreignRelationship"in c){a.find(".createAssociation").hide();var b=c.foreignRelationship.sys,u=c.foreignRelationship.key.split("_"),x=u[0],h=u[1];a.find(".associationSystem").text(b);a.find(".associationOrgUnit").text(x);a.find(".associationGradeId").text(h);a.find(".requestRefreshAssociation").unbind("click").on("click",function(){e(a,!0);$.getJSON(sprintf("/getExternalGrade/%s/%s/%s",
b,x,h),function(a){c.description=a.description;c.name=a.name;c.gradeType=a.gradeType;c.numericMinimum=a.numericMinimum;c.numericMaximum=a.numericMaximum;f.closeAlert();r();e(this,!1)}).fail(function(b,c,t){e(a,!1);alert(sprintf("error: %s \r\n %s",c,t))})});a.find(".refreshAssociation").show()}else a.find(".refreshAssociation").hide(),a.find(".createAssociation").show(),a.find(".associationPhase").hide(),void 0===t?(a.find(".requestAssocPhase1").show(),a.find(".requestAssociation").unbind("click").on("click",
function(){t=!0;1==p.length&&(v=p[0]);y()})):void 0==v?(v=p[0],a.find(".chooseGradebook").html(_.map(p,function(a){return $("<option/>",{value:a,text:a})})).unbind("change").on("change",function(a){v=$(this).val()}),a.find(".commitGradebook").unbind("click").on("click",function(){e(this,!0);y()}),a.find(".requestAssocPhase2").show()):void 0===n?(e(a,!0),$.getJSON(sprintf("/getExternalGradebookOrgUnits/%s",v),function(b){console.log("requestedOrgUnits:",b);b&&b.length?(n=b[0].foreignRelationship.key,
a.find(".chooseOrgUnit").html(_.map(b,function(a){return $("<option/>",{value:a.foreignRelationship.key,text:a.name})})).unbind("change").on("change",function(a){n=$(this).val()}),a.find(".commitOrgUnit").unbind("click").on("click",function(){y()}),a.find(".requestAssocPhase3").show()):console.log("found no data:",b);e(a,!1)}).fail(function(b,c,t){e(a,!1);alert(sprintf("error: %s \r\n %s",c,t))})):(a.find(".requestAssocPhase4").show(),a.find(".createGrade").unbind("click").on("click",function(){e(a,
!0);$.ajax({type:"POST",url:sprintf("/createExternalGrade/%s/%s",v,n),data:JSON.stringify(c),success:function(a){console.log("createdGrades:",c,a);c.foreignRelationship={sys:a.foreignRelationship.sys,key:a.foreignRelationship.key};sendStanza(c);y();e(this,!1)},contentType:"application/json",dataType:"json"}).fail(function(b,c,t){e(a,!1);alert(sprintf("error: %s \r\n %s",c,t))})}))};y();d.find(".cancelGradeEdit").on("click",function(){f.closeAlert()});d.find(".submitGradeEdit").on("click",function(){sendStanza(c);
f.closeAlert()});$("#"+a).append(d)};f.find(".editGradeButton").on("click",r);f.find(".assessGradeButton").on("click",function(){var a=_.uniqueId(),c=$("<div/>",{id:a});$.jAlert({title:"assess grade",width:"auto",content:c[0].outerHTML,onClose:function(){g()}});var f={},d=D.clone();$("#"+a).append(d);e(d,!0);var h=d.find(".gradebookDatagrid"),f=d.find(".gradeValueEditPopup").clone();h.find(".gradeUserContainer").clone();h.empty();var l=function(a){var c=k[b.id];void 0==c&&(k[b.id]={},c={});var f=
sprintf("%sGradeValue",b.gradeType),h=Participants.getPossibleParticipants();if("foreignRelationship"in b){var l=b.foreignRelationship.sys,m=b.foreignRelationship.key.split("_")[0];$.getJSON(sprintf("/getExternalGradebookOrgUnitClasslist/%s/%s",l,m),function(t){_.forEach(t,function(a){a=a.UserName;void 0!==a&&h.push(a)});h=_.uniq(h);_.forEach(h,function(a){void 0==c[a]&&(c[a]={type:f,gradeId:b.id,gradedUser:a,gradePrivateComment:"",gradeComment:"",author:b.author,timestamp:0,audiences:[]})});console.log("possibleParticipants:",
h,c);c=_.values(c);c=_.filter(c,function(a){return a.type==f});a(c)}).fail(function(a,c,b){e(d,!1);console.log("error",c,b)})}else _.forEach(h,function(a){void 0==c[a]&&(c[a]={type:f,gradeId:b.id,gradedUser:a,author:b.author,gradePrivateComment:"",gradeComment:"",timestamp:0,audiences:[]})}),c=_.values(c),c=_.filter(c,function(a){return a.type==f}),a(c)},m=function(a){var c=function(a){var c=sprintf("changeGvPopup_%s",_.uniqueId()),n=$("<div/>",{id:c});console.log("gvPopup",a);var h=$.jAlert({type:"modal",
content:n[0].outerHTML,title:sprintf("change grade for %s",a.gradedUser)}),c=$("#"+c),n=f.clone(),d=n.find(".changeGradeContainer"),e=d.find(".numericScore"),q=d.find(".booleanScore"),g=d.find(".booleanScoreLabel"),r=d.find(".textScore"),k=_.cloneDeep(a);switch(b.gradeType){case "numeric":d=function(a){k.gradeValue=parseFloat(e.val())};e.val(a.gradeValue).attr("min",b.numericMinimum).attr("max",b.numericMaximum).on("blur",d);q.remove();g.remove();r.remove();break;case "text":e.remove();d=function(a){k.gradeValue=
r.val()};r.val(a.gradeValue).on("blur",d);g.remove();q.remove();break;case "boolean":e.remove();var p=sprintf("booleanScoreId_%s",_.uniqueId()),d=function(a){k.gradeValue=q.prop("checked")};q.on("change",d).prop("checked",a.gradeValue).attr("id",p);g.attr("for",p);r.remove();break;default:e.remove(),q.remove(),g.remove(),r.remove()}g=sprintf("privateComment_%s",_.uniqueId);n.find(".gradeValueCommentTextbox").val(a.gradeComment).attr("id",g).on("blur",function(){k.gradeComment=$(this).val()});n.find(".gradeValueCommentTextboxLabel").attr("for",
g);g=sprintf("privateComment_%s",_.uniqueId);n.find(".gradeValuePrivateCommentTextbox").val(a.gradePrivateComment).attr("id",g).on("blur",function(){k.gradePrivateComment=$(this).val()});n.find(".gradeValuePrivateCommentTextboxLabel").attr("for",g);n.find(".submitGradeValueChange").on("click",function(){sendStanza(k);a.gradeValue=k.gradeValue;a.gradeComment=k.gradeComment;a.gradePrivateComment=k.gradePrivateComment;console.log("sending:",k);h.closeAlert();l(m)});n.find(".cancelGradeValueChange").on("click",
function(){h.closeAlert()});c.append(n)},q=[{name:"gradedUser",type:"text",title:"Who",readOnly:!0,sorting:!0},{name:"timestamp",type:"dateField",title:"When",readOnly:!0},{name:"gradeValue",type:"text",title:"Score",readOnly:!0,sorting:!0},{name:"gradeComment",type:"text",title:"Comment",readOnly:!0,sorting:!0},{name:"gradePrivateComment",type:"text",title:"PrivateComment",readOnly:!0,sorting:!0}];"foreignRelationship"in b&&q.push({name:"remoteGrade",type:"text",title:"Remote score",readOnly:!0,
sorting:!0},{name:"remoteComment",type:"text",title:"Remote comment",readOnly:!0,sorting:!0},{name:"remotePrivateComment",type:"text",title:"Remote private comment",readOnly:!0,sorting:!0});h.jsGrid({width:"100%",height:"auto",inserting:!1,editing:!1,sorting:!0,paging:!0,rowClick:function(a){c(a.item)},noDataContent:"No gradeable users",controller:{loadData:function(c){if("sortField"in c){var b=_.sortBy(a,function(a){return a[c.sortField]});"sortOrder"in c&&"desc"==c.sortOrder&&(b=_.reverse(b));return b}return a}},
pageLoading:!1,fields:q});h.jsGrid("loadData");h.jsGrid("sort",{field:"gradedUser",order:"desc"});if("foreignRelationship"in b){var g=b.foreignRelationship.sys,q=b.foreignRelationship.key.split("_"),r=q[0],p=q[1];d.find(".getRemoteData").on("click",function(){var a=this;e(a,!0,function(a){return $(a).find("span")});$.getJSON(sprintf("/getExternalGradeValues/%s/%s/%s",g,r,p),function(c){l(function(b){_.forEach(b,function(b){var d=_.find(c,function(a){return a.gradedUser==b.gradedUser});void 0!==d&&
(b.remoteGrade=d.gradeValue,b.remoteComment=d.gradeComment,b.remotePrivateComment=d.gradePrivateComment);e(a,!1)});return m(b)})}).fail(function(c,b,d){e(a,!1);console.log("error",b,d)})});d.find(".sendGradesToRemote").on("click",function(){var a=this;e(a,!0,function(a){return $(a).find("span")});var c=_.filter(k[b.id],function(a){return void 0!=a.gradeValue});$.ajax({type:"POST",data:JSON.stringify(c),dataType:"json",success:function(c){l(function(b){_.forEach(b,function(a){var b=_.find(c,function(c){return c.gradedUser==
a.gradedUser});void 0!==b&&(a.remoteGrade=b.gradeValue,a.remoteComment=b.gradeComment,a.remotePrivateComment=b.gradePrivateComment)});e(a,!1);return m(b)})},url:sprintf("/updateExternalGradeValues/%s/%s/%s",g,r,p),contentType:"application/json"}).fail(function(c,b,d){e(a,!1);console.log("error",b,d)})})}else d.find(".gradeSyncActions").remove();e(d,!1)};l(m)});return f}return $("<span/>")}}],A=[{name:"myGradeValue",type:"text",title:"Score",readOnly:!0,sorting:!0},{name:"myGradeComment",type:"text",
title:"Comment",readOnly:!0,sorting:!0}],a=Conversations.shouldModifyConversation()?_.concat(a,m):_.concat(a,A);f.jsGrid({width:"100%",height:"auto",inserting:!1,editing:!1,sorting:!0,paging:!0,noDataContent:"No grades",controller:{loadData:function(a){var b=Conversations.shouldModifyConversation(),e=_.map(_.filter(w,function(a){return b||a.visible}),function(a){var b=k[a.id];console.log("found my grade:",a,b);void 0!==b&&(b=b[UserSettings.getUsername()],void 0!==b&&(a.myGradeValue=b.gradeValue,a.myGradeComment=
b.gradeComment));return a});"sortField"in a&&(e=_.sortBy(e,function(b){return b[a.sortField]}),"sortOrder"in a&&"desc"==a.sortOrder&&(e=_.reverse(e)));return e}},pageLoading:!1,fields:a});f.jsGrid("sort",{field:"timestamp",order:"desc"});g=function(){WorkQueue.enqueue(function(){f.jsGrid("loadData");var a=f.jsGrid("getSorting");"field"in a&&f.jsGrid("sort",a);z.unbind("click");Conversations.shouldModifyConversation()?z.on("click",function(){console.log("clicked createButton");if(Conversations.shouldModifyConversation()){var a=
Conversations.getCurrentSlideJid(),e=UserSettings.getUsername(),a={type:"grade",name:"",description:"",audiences:[],author:e,location:a,id:sprintf("%s_%s_%s",a,e,(new Date).getTime().toString()),gradeType:"numeric",numericMinimum:0,numericMaximum:100,visible:!1,timestamp:0};sendStanza(a)}}).show():z.hide()})};g()},m=function(){"jid"in Conversations.getCurrentConversation()?a():_.delay(m,500)};m()});return{getGrades:function(){return w},getGradeValues:function(){return k},reRender:g}}();
