var Submissions=function(){var e=[],c={},h={},f=function(){WorkQueue.enqueue(function(){c.jsGrid("loadData");var a=c.jsGrid("getSorting");"field"in a&&c.jsGrid("sort",a)})};$(function(){c=$("#submissionsDatagrid");h=c.find(".insertOnNextSlideButtonContainer");c.empty();var a=function(b){jsGrid.Field.call(this,b)};a.prototype=new jsGrid.Field({sorter:function(b,a){return new Date(b)-new Date(a)},itemTemplate:function(b){return(new Date(b)).toLocaleString()},insertTemplate:function(b){return""},editTemplate:function(b){return""},
insertValue:function(){return""},editValue:function(){return""}});jsGrid.fields.dateField=a;c.jsGrid({width:"100%",height:"auto",inserting:!1,editing:!1,sorting:!0,paging:!0,noDataContent:"No submissions",controller:{loadData:function(b){if("sortField"in b){var a=_.sortBy(_.filter(e,g),function(a){return a[b.sortField]});"sortOrder"in b&&"desc"==b.sortOrder&&(a=_.reverse(a));return a}return _.filter(e,g)}},pageLoading:!1,fields:[{name:"url",type:"text",title:"Preview",readOnly:!0,sorting:!1,itemTemplate:function(a,
d){var c=sprintf("/submissionProxy/%s/%s/%s",Conversations.getCurrentConversationJid(),d.author,d.identity);return $("<img/>",{src:c,"class":"submissionThumbnail",style:"max-height:100px;max-width:100%;cursor:zoom-in"}).on("click",function(){var a=sprintf("/submissionProxy/%s/%s/%s",Conversations.getCurrentConversationJid(),d.author,d.identity),b=sprintf("Submission from %s at %s on page %s",d.author,new Date(d.timestamp),d.slide);$.jAlert({title:b,closeOnClick:!0,width:"90%",content:$("<img/>",{src:a})[0].outerHTML})})}},
{name:"slide",type:"number",title:"Page",readOnly:!0},{name:"timestamp",type:"dateField",title:"When",readOnly:!0},{name:"author",type:"text",title:"Who",readOnly:!0},{name:"identity",type:"text",title:"actions",readOnly:!0,sorting:!1,itemTemplate:function(a,d){if(Conversations.shouldModifyConversation()){var c=h.clone();c.find(".insertOnNextSlideButton").on("click",function(){addSubmissionSlideToConversationAtIndex(Conversations.getCurrentConversationJid(),Conversations.getCurrentSlide().index+1,
d.identity)});return c}return $("<span/>")}}]});c.jsGrid("sort",{field:"timestamp",order:"desc"});f()});var g=function(a){return Conversations.shouldModifyConversation()||a.author.toLowerCase()==UserSettings.getUsername().toLowerCase()},k=function(){e=[]},l=function(a,b){try{"target"in a&&"submission"==a.target&&g(a)&&(e.push(a),b||f())}catch(d){console.log("Submissions.stanzaReceivedFunction",d)}};Progress.onConversationJoin.Submissions=k;Progress.historyReceived.Submissions=function(a){try{"type"in
a&&"history"==a.type&&(k(),_.forEach(a.submissions,function(a){l(a,!0)}),f())}catch(b){console.log("Submissions.historyReceivedFunction",b)}};return{getAllSubmissions:function(){return _.filter(e,g)},getCurrentSubmission:function(){return currentSubmission},processSubmission:l,sendSubmission:function(){WorkQueue.pause();var a=$("<canvas />"),b=board[0].width,d=board[0].height;a.width=b;a.height=d;a.attr("width",b);a.attr("height",d);a.css({width:b,height:d});var c=a[0].getContext("2d");c.fillStyle=
"white";c.fillRect(0,0,b,d);c.drawImage(board[0],0,0,b,d);var a=a[0].toDataURL("image/jpeg",.4),e=(new Date).getTime(),f=UserSettings.getUsername(),g=Conversations.getCurrentSlide().id,b=Conversations.getCurrentConversation().jid,h=sprintf("submission%s%s.jpg",f,e.toString()),k=sprintf("%s:%s:%s",b,h,e),b=sprintf("/uploadDataUri?jid=%s&filename=%s",b.toString(),encodeURI(k));$.ajax({url:b,type:"POST",success:function(a){a=$(a).find("resourceUrl").text();a={audiences:[],author:f,blacklist:[],identity:k,
privacy:Privacy.getCurrentPrivacy(),slide:g,target:"submission",timestamp:e,title:h,type:"submission",url:a};console.log(a);sendStanza(a);WorkQueue.gracefullyResume();successAlert("submission sent","your submission has been sent to the instructor")},error:function(a){console.log(a);errorAlert("Submission failed","This image cannot be processed, either because of image protocol issues or because it exceeds the maximum image size.");WorkQueue.gracefullyResume()},data:a,cache:!1,contentType:!1,processData:!1})},
requestServerSideSubmission:function(){if("Conversations"in window){var a=Conversations.getCurrentConversation(),b=Conversations.getCurrentSlideJid();"jid"in a&&submitScreenshotSubmission(a.jid.toString(),b)}},reRender:f}}();
