/* Editorial build: revises 120 passages and constructs length-balanced comprehension questions.
   Input: original textbook vocabulary + 113 project story outlines + individually authored edits.
   Output: revised JSON for static deployment, audited before publishing. */
(function(){
"use strict";
const HAN=/[\u3400-\u9fff]/u;
const chars=str=>[...String(str)].filter(c=>HAN.test(c));
const words=str=>[...String(str)].length;
const notAllowed=(str,set)=>[...new Set(chars(str).filter(c=>!set.has(c)))].join("");
const clean=str=>String(str||"").replace(/[\s\u00a0]+/g," ").replace(/。+$/,"").trim();
const ORIGINALS={
"p4-1":{who:"小华",friend:"同学",place:"食堂",goal:"在食堂负责值日",issue:"有个同学走到排队的人前面，想先买饭",feeling:"有点生气，但没有大声说话",act:"轻声请那个同学排队",result:"那个同学脸红了，向大家说对不起",learned:"负责值日要慢慢说话，也要尊重别人"},
"p4-2":{who:"志强",friend:"小安",place:"学校操场",goal:"参加运动会的接力赛",issue:"志强接过棒时不小心跌倒了",feeling:"心里很难过，怕跑不到终点",act:"站起来继续向终点跑去",result:"虽然没拿冠军，队友还是为他加油",learned:"有困难时不轻易放弃，比名次更重要"},
"p4-3":{who:"建华",friend:"妈妈",place:"熟食中心",goal:"和妈妈一起吃午饭",issue:"一位老人拿着东西，找不到座位",feeling:"心里有点不想让出座位",act:"听了妈妈的话，站起来请老人坐下",result:"老人笑着道谢，建华也觉得开心",learned:"要尊重老人，也要有礼貌"},
"p5-1":{who:"志强",friend:"同伴",place:"营地",goal:"参加学校的露营活动",issue:"志强想一个人完成任务，却做不完",feeling:"有点难过，不知道怎么办",act:"请同伴帮忙，大家一起完成任务",result:"大家一起做好了任务，志强很开心",learned:"大家互相配合，比一个人做事更好"},
"p5-2":{who:"小雨",friend:"小文",place:"网上",goal:"分享自己画的画",issue:"有人在画下面留言，嘲笑小雨",feeling:"心里很难过，不想再画画",act:"把事情告诉老师，请老师帮助",result:"同学向小雨道歉，小雨又开心地画画",learned:"有烦恼时可以向可信的人求助"},
"p6-1":{who:"建华",friend:"老师",place:"学校操场",goal:"参加学校的跑步比赛",issue:"功课多，建华跑了一会儿就很累",feeling:"有点担心，怕自己做不好",act:"按老师的计划每天练习，也注意休息",result:"建华坚持跑到终点，心里很开心",learned:"有计划地练习，才能一步一步进步"},
"p6-2":{who:"小文",friend:"老师",place:"新加坡的老街",goal:"认识老街的壁画和旧店屋",issue:"小文不明白为什么要画以前的生活",feeling:"心里很好奇，想知道原因",act:"听老师讲解，再仔细看壁画",result:"小文知道了以前的人怎样生活",learned:"城市会改变，我们也要记住过去的故事"}
};
const headingCandidates=[
"一起来看一看","为什么会这样？","哪一个最符合短文？","认真想一想"
];
function taughtSet(l,vocab,writing,base){
 const m=l.unit.match(/^([456])([AB]) 第(\d+)课/),grade=l.grade,end=m?Number(m[3]):999,set=new Set(base);
 for(let g=4;g<=grade;g++){
  const max={4:16,5:15,6:10}[g],boundary={4:9,5:8,6:6}[g];
  for(let n=1;n<=max;n++){
   if(g===grade&&n>end)break;
   const key=String(g)+(n<=boundary?"A":"B")+"-"+n;
   for(const ch of (vocab[key]||"")+(writing[key]||""))set.add(ch);
  }
 }
 return set;
}
function normalizeNames(field,who,friend){
 let s=clean(field);
 // No introduction of third, unrelated student names inside one story.
 const names=["小华","小文","小安","小乐","小林","志强","建华","小雨","小美","小红","小青","小月","丽华","美华","小花","小晴","志文","子安","小山","小平"];
 for(const n of names){
  if(n!==who&&n!==friend&&s.includes(n))s=s.split(n).join(who);
 }
 return s;
}
function userMeta(raw,i,compiled,custom,approved){
 const [grade,id,unit,title,place]=raw;
 const meta={
  id,grade,unit,
  title:custom.title||compiled.title,
  place:custom.place||compiled.place,
  who:custom.who||compiled.who,
  friend:custom.friend||compiled.friend,
  goal:custom.goal||compiled.goal,
  issue:custom.issue||compiled.issue,
  feeling:custom.feeling||compiled.feeling,
  act:custom.act||compiled.act,
  result:custom.result||compiled.result,
  learned:custom.learned||compiled.learned,
  focus:compiled.focus
 };
 for(const k of ["title","place","who","friend","goal","issue","feeling","act","result","learned"]){
  meta[k]=normalizeNames(meta[k],meta.who,meta.friend);
  const unknown=notAllowed(meta[k],approved);
  if(unknown)throw Error("Out-of-level characters in "+meta.id+" "+k+": "+unknown+" ("+meta[k]+")");
 }
 return meta;
}
const intro=[
 a=>"在"+a.place+"，"+a.who+"和"+a.friend+"准备开始一天的活动。"+a.goal+"。"+a.who+"笑着说：“我们一起做吧！”",
 a=>"这一天，"+a.who+"和"+a.friend+"来到"+a.place+"。"+a.goal+"。两人都想把事情做好。",
 a=>a.who+"和"+a.friend+"在"+a.place+"。"+a.goal+"。"+a.who+"认真做好准备，心里很高兴。",
 a=>"有一天，"+a.who+"和"+a.friend+"来到"+a.place+"。"+a.goal+"。"+a.who+"看着眼前的东西，想把这件事做好。",
 a=>"那天，"+a.who+"和"+a.friend+"在"+a.place+"。"+a.goal+"。"+a.who+"很开心，还对"+a.friend+"笑了笑。",
 a=>"这次活动在"+a.place+"举行。"+a.who+"和"+a.friend+"都在场。"+a.goal+"。两人准备开始做事。"
];
const turns=[
 a=>"可是，"+a.issue+"。"+a.who+a.feeling+"。"+a.who+"心想：“我不能一直着急，要先想办法。”",
 a=>"没想到，"+a.issue+"。"+a.who+a.feeling+"。"+a.friend+"看见了，问：“你怎么了？”",
 a=>"就在这时，"+a.issue+"。"+a.who+a.feeling+"。"+a.friend+"说：“我们先想一想。”",
 a=>"事情却起了变化："+a.issue+"。"+a.who+a.feeling+"。"+a.who+"停下脚步，想了一会儿。",
 a=>"后来，"+a.issue+"。"+a.who+a.feeling+"。看见"+a.friend+"就在身边，"+a.who+"决定先想一想。",
 a=>"不久，"+a.issue+"。"+a.who+a.feeling+"。"+a.friend+"轻声说：“有问题，我们就一起想办法。”"
];
const closure=[
 a=>a.who+"想了想，决定"+a.act+"。"+a.result+"。"+a.who+"开心地笑了，明白了： "+a.learned+"。",
 a=>a.who+"没有停下来，决定"+a.act+"。"+a.result+"。"+a.who+"脸上有了笑容，也明白了： "+a.learned+"。",
 a=>a.who+"想了一会儿，决定"+a.act+"。"+a.result+"。"+a.who+"心里很高兴，知道"+a.learned+"。",
 a=>a.who+"想出了一个办法："+a.act+"。"+a.result+"。后来，"+a.who+"明白了： "+a.learned+"。",
 a=>"想了一会儿，"+a.who+"决定"+a.act+"。"+a.result+"。"+a.who+"笑着对"+a.friend+"说：“我知道了，"+a.learned+"。”",
 a=>a.who+"说：“我们一起想办法吧！”然后，"+a.who+"决定"+a.act+"。"+a.result+"。这件事让"+a.who+"明白了： "+a.learned+"。"
];
function fixGrammar(s){
 return s.replace(/： +/g,"：").replace(/还想不再/g,"不想再").replace(/还想不告诉/g,"却不敢告诉")
  .replace(/决定决定/g,"决定").replace(/先先/g,"先").replace(/再再/g,"再")
  .replace(/更很重要/g,"更重要").replace(/做好了完成/g,"做完了")
  .replace(/学校学校/g,"学校").replace(/。+/g,"。").replace(/，，+/g,"，");
}
function phrase(s,max=19){
 s=clean(s);
 const segments=s.split(/[，；。]/).filter(Boolean);
 if(words(s)<=max)return s;
 const first=segments[0];
 if(words(first)>=6&&words(first)<=max)return first;
 const second=segments[1];
 if(second&&words(second)>=6&&words(second)<=max&&words(first)>max)return second;
 // Keep complete meaning when no valid shorter standalone clause exists.
 return s;
}
function topicTags(a){
 const text=String(a.title)+" "+a.goal+" "+a.issue+" "+a.act;
 const tags=[
 ["lost",/找不到|不见|丢|招领|失主|水壶|车资卡|借书证|钱包|皮夹/],
 ["road",/巴士|地铁|马路|交通|车厢|搭车|过马路|机场/],
 ["reading",/书|图书馆|阅读|读书|字|文章|书架|故事/],
 ["family",/妈妈|爸爸|爷爷|奶奶|外婆|家人|祖孙|母亲节|生日/],
 ["animals",/动物|鸟|壁虎|小猫|自然|植物|绿豆|花园|野生|海边/],
 ["food",/饭|食堂|餐|食品|煮|汤|菜|面|食物|小贩/],
 ["sports",/跑|运动|球|比赛|冠军|接力|操场/],
 ["perform",/音乐|演出|表演|朗诵|诗|舞台|礼堂|华乐/],
 ["school",/老师|同学|学校|功课|学习|复习|考试|成绩|计划/],
 ["online",/网络|网上|照片|相片|留言|资料|消息|电脑|手机/],
 ["environment",/清洁|回收|环保|垃圾|节水|保护|社区|组屋/],
 ["help",/帮助|帮忙|照顾|关心|不方便|安全|危险|老人/],
 ["social",/争|吵|礼貌|道歉|公平|分工|分享|诚实|不开心/]
 ];
 return tags.filter(t=>t[1].test(text)).map(t=>t[0]);
}
function phraseBigrams(s){
 const h=chars(s).join("");
 const a=[];for(let i=0;i<h.length-1;i++)a.push(h.slice(i,i+2));
 return new Set(a);
}
function optionPool(meta,all,key,allowed){
 const max=key==="learned"?23:key==="goal"?17:15;
 const exact=phrase(meta[key],max);
 const source=meta.goal+" "+meta.issue+" "+meta.act+" "+meta.place+" "+meta.title;
 const desired=words(exact),exactBigrams=phraseBigrams(exact);
 const tags=new Set(topicTags(meta));
 const options=[];
 for(let j=0;j<all.length;j++){
  const p=all[j];if(p.id===meta.id)continue;
  const x=phrase(p[key],max),l=words(x);
  if(!x||Math.abs(l-desired)>4||notAllowed(x,allowed))continue;
  if(x===exact||options.some(o=>o.text===x)||source.includes(x))continue;
  const peerTags=topicTags(p),sameTopic=peerTags.filter(t=>tags.has(t)).length;
  const topicBigrams=phraseBigrams(x);
  const shared=[...exactBigrams].filter(c=>topicBigrams.has(c)).length;
  const isMoral=key==="learned";
  const score=(isMoral ? -sameTopic*4 : sameTopic*5)+
     (isMoral ? -Math.min(shared,5) : Math.min(shared,6)*4)-
     Math.abs(l-desired)*1.9;
  options.push({text:x,score,dist:Math.abs(l-desired)});
 }
 options.sort((a,b)=>b.score-a.score||a.dist-b.dist||a.text.localeCompare(b.text,"zh"));
 const pick=[];
 for(const item of options){
  if(pick.length===2)break;
  if(pick.some(x=>x.text===item.text))continue;
  const allLengths=[words(exact),...pick.map(x=>words(x.text)),words(item.text)];
  if(Math.max(...allLengths)-Math.min(...allLengths)>4)continue;
  pick.push(item);
 }
 return {correct:exact,wrong:pick.map(x=>x.text)};
}
function feelingType(text){
 const a=String(text);
 if(/后悔|不好意思/.test(a))return /后悔/.test(a)?"后悔":"不好意思";
 if(/生气|不满|愤怒/.test(a))return "生气";
 if(/害怕|很怕|紧张|心里有点怕/.test(a))return "害怕";
 if(/难过|失望|伤心/.test(a))return "难过";
 if(/着急|急得|很急|焦急/.test(a))return "着急";
 if(/担心|怕|心里不安/.test(a))return "担心";
 if(/好奇|想知道/.test(a))return "好奇";
 if(/开心|高兴/.test(a))return "开心";
 return "担心";
}
// Equal-length emotion descriptions use early-school characters only.
const EMOTIONS={
 "着急":"心里很着急，不知道怎么办",
 "担心":"心里有点担心，想先帮忙",
 "害怕":"心里很害怕，想快点回家",
 "难过":"心里很难过，不想再说话",
 "生气":"心里有点生气，不想说话",
 "后悔":"觉得自己做错了，想说对不起",
 "不好意思":"有点不好意思，低下了头",
 "好奇":"心里很好奇，想再看一看",
 "开心":"心里很高兴，想告诉大家"
};
const OPPOSITES={
 "着急":["开心","难过"],"担心":["开心","生气"],
 "害怕":["开心","好奇"],"难过":["开心","好奇"],
 "生气":["开心","好奇"],"后悔":["开心","好奇"],
 "不好意思":["开心","生气"],"好奇":["难过","生气"],
 "开心":["难过","担心"]
};
function pickThree(meta,all,key,allowed,i){
 const o=optionPool(meta,all,key,allowed);
 if(o.wrong.length<2)throw Error(meta.id+" "+key+" insufficient similar options: correct "+o.correct+"; found "+o.wrong.join("|"));
 const total=[o.correct,...o.wrong];
 if(Math.max(...total.map(words))-Math.min(...total.map(words))>4)throw Error(meta.id+" "+key+" option gap invalid");
 const pos=i%3,arr=new Array(3);arr[pos]=o.correct;let j=0;
 for(let p=0;p<3;p++)if(p!==pos)arr[p]=o.wrong[j++];
 return [arr,pos];
}
const prompts={
 "goal":["开始时，他们想做什么？","故事里的人想做什么？","短文开头写了什么事？"],
 "issue":["后来发生了什么事？","他们碰到了什么问题？","是什么事让大家很着急？"],
 "act":["他们想了什么办法？","后来，他们是怎么做的？","谁的做法和短文里的一样？"],
 "learned":["读完故事，我们明白了什么？","哪一句话说出了故事的道理？","这个故事让我们学到什么？"]
};
function generateQuestions(meta,all,allowed,i){
 const keys=["goal","issue","feeling","act","learned"];
 return keys.map((k,q)=>{
  if(k==="feeling"){
   const t=feelingType(meta.feeling),labels=[t,...OPPOSITES[t]];
   const arr=labels.map(x=>EMOTIONS[x]);
   if(arr.some(x=>notAllowed(x,allowed)))throw Error(meta.id+" feeling choice untaught chars "+arr.map(x=>notAllowed(x,allowed)).join("|"));
   const pos=(i+q)%3,choices=[null,null,null];choices[pos]=arr[0];let n=1;
   for(let j=0;j<3;j++)if(j!==pos)choices[j]=arr[n++];
   return ["这时，故事里的人心情怎样？",choices,pos,"短文里写到了人物的心情。"];
  }
  const [options,answer]=pickThree(meta,all,k,allowed,i+q);
  const stem=prompts[k][(i+q)%prompts[k].length];
  const explanation="短文里说："+phrase(meta[k],k==="learned"?23:k==="goal"?17:15)+"。";
  if(notAllowed(stem+explanation,allowed))throw Error(meta.id+" quiz stem or explanation has untaught char: "+notAllowed(stem+explanation,allowed));
  return [stem,options,answer,explanation];
 });
}
window.BUILD_EDITORIAL=function(originals,raw,vocab,writing,base,externalOverrides){
 const approved=[],meta=[],issues=[];
 for(const o of originals){
  const c=ORIGINALS[o.id];if(!c)throw Error("Original metadata missing "+o.id);
  const a={id:o.id,grade:o.grade,unit:o.unit,title:o.title,focus:o.focus,story:o.story, ...c};
  a.allowed=taughtSet(a,vocab,writing,base);
  for(const k of ["title","story","place","goal","issue","feeling","act","result","learned"]){
   if(notAllowed(a[k],a.allowed))issues.push({id:a.id,key:k,bad:notAllowed(a[k],a.allowed),text:String(a[k]).slice(0,110)});
  }
  meta.push(a);
 }
 for(let i=0;i<raw.length;i++){
  const r=raw[i];
  const prior=externalOverrides(r,i);
  const custom=window.EDITOR_P4?.[r[1]]||window.EDITOR_P5?.[r[1]]||window.EDITOR_P6?.[r[1]]||{};
  if(!Object.keys(custom).length)issues.push({id:r[1],error:"Missing individual review"});
  const approvedSet=taughtSet({grade:r[0],unit:r[2]},vocab,writing,base);
  let row;try{row=userMeta(r,i,prior,custom,approvedSet)}catch(e){issues.push({id:r[1],error:String(e)});continue}
  row.allowed=approvedSet;
  row.story=[intro[i%intro.length](row),turns[i%turns.length](row),closure[i%closure.length](row)].map(fixGrammar);
  for(const [key,value] of [["story",row.story.join("")],["title",row.title]]){
   const bad=notAllowed(value,approvedSet);
   if(bad)issues.push({id:row.id,key,bad,text:value.slice(0,130)});
  }
  meta.push(row);
 }
 if(issues.length)return {stories:[],issues,metadata:meta};
 const all=meta;
 for(let i=0;i<all.length;i++){
  const a=all[i];
  try{a.questions=generateQuestions(a,all,a.allowed,i)}catch(e){issues.push({id:a.id,error:String(e)})}
  if(a.questions)for(const q of a.questions){
   for(const s of [q[0],...q[1],q[3]]){
    const bad=notAllowed(s,a.allowed);if(bad)issues.push({id:a.id,key:"question",bad,s});
   }
  }
 }
 if(issues.length)return {stories:[],issues,metadata:meta};
 for(const a of all){for(const q of a.questions){
  if(q[1].length!==3||q[1].some(x=>typeof x!=="string"||!x)||new Set(q[1]).size!==3){
   issues.push({id:a.id,error:"Invalid question options: "+JSON.stringify(q[1])});
  }
 }}
 if(issues.length)return {stories:[],issues,metadata:meta};
 const stories=all.map(a=>({id:a.id,grade:a.grade,unit:a.unit,title:a.title,focus:a.focus,story:a.story,questions:a.questions}));
 return {stories,issues:[],metadata:meta};
};
})();