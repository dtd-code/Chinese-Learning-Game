/* Drafting and validation utility: source vocabulary follows the supplied old-edition 欢乐伙伴 识读/识写 tables. */
(function(){
"use strict";
const HAN=/[\u3400-\u9fff]/u;
const NAMES=["小华","小文","小安","小乐","小林","志强","建华","小雨","小美","小红","小青","小月","丽华","美华","小花","小晴","志文","子安","小山","小平"];
const REPL=[
["换频道","换电视节目"],["不肯交出遥控器","不想让大家看新闻"],["不肯交出电视","不想让大家看新闻"],
["争输赢","争第一"],["输赢","第一名"],["攥紧书包带","拿好书包"],["走廊","学校里"],["移向","拿给"],
["家人之间","一家人"],["相框","相片"],["珍爱的","很喜欢的"],["隐瞒","不告诉别人"],
["零用钱","自己的钱"],["修理","做好"],["并拿出","还拿出"],["勇于","敢"],["可贵","很重要"],
["温柔","轻轻"],["针筒","针"],["节奏","声音"],["眼眶","眼睛"],["旋律","音乐"],["乐曲","音乐"],
["邀请","请"],["谨慎","小心"],["挡住","放在"],["营造","让"],["友善","友好"],
["胡姬园","花园"],["国花胡姬","花"],["孙悟空","美猴王"],["改编","改了"],["扮演","演"],
["下唇","嘴"],["逞强","一个人做"],["凌乱","很乱"],["位置","地方"],["窘得连忙挠头","心里有点怕"],
["确认","看一看"],["解释","说一说"],["体验","去做"],["如何","怎么"],["距离","远近"],
["碰歪","碰倒"],["沮丧","难过"],["立刻","马上"],["失而复得","找回来了"],["瓶掉在地上","瓶在地上"],
["唯一的空座位","一个空座位"],["犹豫","想了想"],["是否","能不能"],
["示范","教"],["错误","错"],["海报","画"],["寻找","找"],["恢复","回到"],
["珍贵","很重要"],["回忆","想起"],["话筒","要说话的东西"],
["条例","办法"],["安排","准备"],["材料","东西"],["节目","活动"],["颁奖","给奖"],
["珍惜","爱惜"],["一枚","一个"],["计划","要做的事"],["屏幕","电脑"],
["核对","查一查"],["研究","学习"],["步骤","方法"],["收到","拿到"],
["网络平台","网上"],["智能手机","手机"],["社区","组屋"],["聊天群","同学们"],["电邮","信"],["华乐团","华乐团"],
["遥控器","电视"],["约定","想法"],["调味料","盐"],["华乐音乐会","音乐会"],["心理","心里"],
["心有余悸","有点怕"],["好奇","想知道"],["认真","用心"],["建议","想法"],["及时","马上"],
["重新","再"],["再次","再"],["终于","最后"],["顺利","做好了"],["详细","仔细"],
["懂得","知道"],["成功","做好了"],["感受到","觉得"],["提醒","告诉"],["发现","看见"],
["耐心","慢慢"],["坚持","一直做"],["困难","难题"],["指导","教"],["礼貌","有礼貌"],
["解决","想办法"],["舒服","很开心"],["自信","相信自己"],["认真观察","用心看"],
["面对","看到"],["耐烦","慢慢"],["打算","想"],["考虑","想"],["放弃","不再做"],
["鼓励","给他加油"],["处理","做好"],["调整","改一改"],["拍照","拍一张照片"],
["低下头","低下头"],["安全线","白线"],["队伍","同学们"],["观众","大家"],
["节目","节目"],["清洁","打扫"],["重要","很重要"],["比赛","比赛"],["讨论","一起说说"],
["体贴","关心"],["担忧","担心"],["紧张","有点怕"],["焦急","很着急"],
["感激","很感谢"],["珍惜","爱惜"],["感恩","谢谢"],["认识","知道"],["欣慰","开心"],
["误会","想错了"],["诚实","不说假话"],["直接","马上"],["查询","查一查"],
["询问","问"],["回忆","想起"],["配合","一起做"],["检查","看一看"],["担心","怕"],
["读书分享会","读书会"],["证明","说清楚"],["插话","说话"],["反思","再想一想"],
["灯光","灯"],["物品","东西"],["内容","故事"],["台词","要说的话"],["表情","脸上的样子"],
["起点","开始的地方"],["奇怪","不明白"],["失望","有点难过"],["震惊","大吃一惊"],
["改进","改好"],["逐渐","慢慢"],["稳定","安定"],["忽然","这时"],
["清晨","早上"],["阳光","太阳"],["紧接着","后来"],["灵机一动","想到了办法"],
["海报","一张画"],["多用途","大家用的"],["公共","大家的"],["年级","年级"],
["几名","几个"],["优秀","很好"],["道歉","说对不起"],["措施","办法"],
["讨论","一起说"],["总结","说一说"],["记录","写下"],["核对","查一查"],
["主动","自己先"],["并且","也"],["虽然","虽然"],["希望","想"],
["照片","相片"],["活动","活动"],["观察","看"],["逐步","慢慢"],["自豪","很开心"],
["从此","后来"],["真正","真的"],["祖母","外婆"],["阿嬷","外婆"],
["阿公","爷爷"],["祖父","爷爷"],["学弟","小同学"],["学妹","小同学"],
["主人公","故事里的人"],["心情","心情"],["难忘","难忘"]
].sort((a,b)=>b[0].length-a[0].length);
const COMMON_GOAL=[
"大家要一起把这件事做好","他们想一起学习","他们想帮老师做事","他们想一起读书",
"他们想为朋友做一件事","大家要一起完成学习活动"
];
const COMMON_PROBLEM=[
"有个同学忘了带要用的东西","大家不知道该先做什么","一个同学不想一起做",
"有的东西找不到了","有人不小心做错了","事情没有想的那样容易"
];
const COMMON_ACTION=[
"请同学一起想办法","请老师帮忙","先想一想，再慢慢做",
"问问大家的想法","告诉别人自己的想法","和朋友一起把事情做好"
];
const COMMON_OUTCOME=[
"大家把这件事做好了","同学们都很开心","老师看了也很开心",
"朋友笑着说谢谢","大家都明白了","这件事有了好结果"
];
const COMMON_LESSON=[
"有问题时要先想办法","做事要慢慢来","朋友要互相帮助",
"做错事要说对不起","不懂的时候要问老师","要关心别人的感受"
];
function gradesFor(l){
 const code=l.unit.match(/^([456])([AB]) 第(\d+)课/);
 return code?[Number(code[1]),Number(code[3])]:[l.grade,999];
}
function taughtSet(l,fullRead,allWritten,base3){
 const [level,last]=gradesFor(l);
 const set=new Set(base3);
 for(let g=4;g<=level;g++)for(let n=1;n<=({4:16,5:15,6:10})[g];n++){
  if(g===level&&n>last)break;
  const key=String(g)+(n<=(g===4?9:g===5?8:6)?"A":"B")+"-"+n;
  const read=fullRead[key]||"";
  for(const ch of read+(allWritten[key]||""))set.add(ch);
 }
 return set;
}
function isTaught(s,allowed){return [...String(s)].every(c=>!HAN.test(c)||allowed.has(c))}
function unknown(s,allowed){return [...new Set([...String(s)].filter(c=>HAN.test(c)&&!allowed.has(c)))].join("")}
function replacePhrases(s,allowed){
 let out=String(s);
 for(const [a,b] of REPL)if(out.includes(a)&&!isTaught(a,allowed)&&isTaught(b,allowed))out=out.split(a).join(b);
 return out;
}
function safePart(s, fallback,allowed){
 const clean=replacePhrases(s,allowed);
 return isTaught(clean,allowed)?clean:fallback;
}
function nameFor(raw,i,allowed){if(/^(妈妈|爸爸|爷爷|奶奶|外婆|外公|哥哥|姐姐|弟弟|妹妹|阿姨|老师|表弟|同桌|祖父|祖母)$/.test(raw)&&isTaught(raw,allowed))return raw;const chosen=NAMES[i%NAMES.length];return isTaught(chosen,allowed)?chosen:"小华"}
function rename(text,sourceName,targetName){
 if(!sourceName||sourceName===targetName)return String(text);
 return String(text).split(sourceName).join(targetName);
}
function safePlace(s,allowed,i){
 const fallbacks=["学校","家里","公园","学校课室","学校图书馆","组屋楼下"];
 const original=replacePhrases(s,allowed);
 if(isTaught(original,allowed))return original;
 const candidates=[
  ["学校","学校"],["图书","图书馆"],["食堂","食堂"],["家","家里"],
  ["公园","公园"],["花园","花园"],["组屋","组屋楼下"],["巴士","巴士站"],
  ["礼堂","学校礼堂"],["海","公园"],["动物","公园"],["课室","课室"],
  ["体育","学校操场"],["操场","操场"],["机场","机场"],["滨海湾","新加坡"],
  ["电脑","电脑室"],["店","商店"],["地铁","地铁站"]
 ];
 for(const [word,replace] of candidates){
  if(s.includes(word)&&isTaught(replace,allowed))return replace;
 }
 return fallbacks[i%fallbacks.length];
}
function safeTitle(s,allowed,i,wordList){
 const cand=replacePhrases(s,allowed);
 if(isTaught(cand,allowed))return cand;
 const w=String(wordList||"").split("、").find(w=>w.length>1&&isTaught(w,allowed));
 if(w&&isTaught(w+"的故事",allowed))return w+"的故事";
 const t=["我们一起想办法","一件难忘的事","特别的一天","一个好办法","我学会了","和朋友一起","生活里的故事"];
 return t[i%t.length];
}
function safeFocus(str,allowed){
 const out=String(str).split("、").map(x=>replacePhrases(x,allowed)).filter(x=>x&&isTaught(x,allowed));
 return [...new Set(out)].slice(0,12);
}
function fieldAspects(raw,allowed,i){
 const [grade,id,unit,rawTitle,place,who,friend,aim,problem,feeling,action,outcome,lesson,words]=raw;
 const w=nameFor(who,i,allowed),f=nameFor(friend,i+7,allowed);
 const rev=x=>rename(rename(x,who,w),friend,f);
 const p=safePlace(rev(place),allowed,i);
 const goal=safePart(rev(aim),COMMON_GOAL[i%COMMON_GOAL.length],allowed);
 const issue=safePart(rev(problem),COMMON_PROBLEM[i%COMMON_PROBLEM.length],allowed);
 const feelingOK=safePart(rev(feeling),["有点着急","心里有点难过","有点生气","心里有点怕","有些不开心","有点担心"][i%6],allowed);
 const act=safePart(rev(action),COMMON_ACTION[i%COMMON_ACTION.length],allowed);
 const result=safePart(rev(outcome),COMMON_OUTCOME[i%COMMON_OUTCOME.length],allowed);
 const learned=safePart(rev(lesson),COMMON_LESSON[i%COMMON_LESSON.length],allowed);
 return {grade,id,unit,title:safeTitle(rawTitle,allowed,i,words),focus:safeFocus(words,allowed),who:w,friend:f,place:p,goal,issue,feeling:feelingOK,act,result,learned};
}
function paragraphSet(a,i){
 const w=a.who,f=a.friend,p=a.place;
 const opens=[
 "今天，"+w+"和"+f+"来到"+p+"。"+a.goal+"。"+w+"笑着说：“我们一起做吧！”",
 "那天，"+w+"和"+f+"在"+p+"。"+a.goal+"。"+w+"心里很高兴，想把这件事做好。",
 "放学后，"+w+"和"+f+"去"+p+"。"+a.goal+"。两人一边走，一边说笑。",
 "星期五，"+w+"和"+f+"来到"+p+"。"+a.goal+"。"+w+"早早做好准备。",
 "这一天，"+w+"和"+f+"在"+p+"。"+a.goal+"。看着眼前的东西，"+w+"很开心。",
 "有一天，"+w+"和"+f+"来到"+p+"。"+a.goal+"。两人都想把事情做好。"
 ];
 const middle=[
 "可是，"+a.issue+"。"+w+a.feeling+"，低下头，心想：“我该怎么办？”"+f+"说：“不要怕，我们可以一起想办法。”",
 "做的时候，"+a.issue+"。"+w+a.feeling+"，轻轻地说：“我们先想一想吧。”"+f+"点了点头。",
 "不久，"+a.issue+"。"+w+a.feeling+"，脸上的笑容没有了。"+w+"心想：“我还可以再试一次。”",
 "后来，"+a.issue+"。"+w+a.feeling+"，停下手上的事，想了好一会儿。"+f+"走过来说：“我们一起做。”",
 "这时，"+a.issue+"。"+w+a.feeling+"，不知该怎么办。"+f+"轻轻地说：“我们先说说自己的想法。”",
 "做了一会儿，"+a.issue+"。"+w+a.feeling+"，站在一边不说话。"+f+"问：“你怎么了？”"
 ];
 const close=[
 w+"想了想，决定"+a.act+"。"+f+"说：“我来帮你！”最后，"+a.result+"。"+w+"开心地笑了，也明白了： "+a.learned+"。",
 w+"抬起头，对"+f+"说：“我们一起"+a.act+"吧。”他们慢慢做好了事情。后来，"+a.result+"。"+w+"想： "+a.learned+"。",
 w+"没有一直难过，决定"+a.act+"。"+f+"也来帮忙。最后，"+a.result+"。"+w+"笑着说：“我学会了，"+a.learned+"。”",
 "想了一会儿，"+w+"决定"+a.act+"。"+f+"跟着一起做。后来，"+a.result+"。"+w+"明白了： "+a.learned+"。",
 w+"对"+f+"说：“我们先"+a.act+"。”两人慢慢做好了事情。最后，"+a.result+"。"+w+"心里很高兴，知道"+a.learned+"。",
 w+"决定"+a.act+"。"+f+"也来帮忙，两人没有再吵。后来，"+a.result+"。"+w+"开心地说：“"+a.learned+"。”"
 ];
 return [opens[i%6],middle[i%6],close[i%6]];
}
function qa(a,i){
 const specs=[
 ["故事在哪里发生？",a.place,["在家里","在公园","在学校","在图书馆"]],
 ["他们想做什么？",a.goal,["去公园玩","回家看书","一个人去玩","回家吃饭"]],
 ["后来出了什么问题？",a.issue,["大家都很开心","今天的天气很好","没有人做错事","大家一起看书"]],
 ["他们怎么做？",a.act,["马上回家休息","坐着不说话","只想自己玩","不再做这件事"]],
 ["这个故事让我们懂得什么？",a.learned,["有问题时不用想办法","做错事也不用说对不起","做事只想自己就好","不用听别人的话"]]
 ];
 return specs.map(([q,correct,wrong],k)=>{
  const choices=[correct,...wrong.filter(z=>z!==correct)].slice(0,3);
  const index=(i+k)%3;
  const opts=Array(3);opts[index]=correct;let j=1;for(let z=0;z<3;z++)if(z!==index)opts[z]=choices[j++];
  return [q,opts,index,"短文提到："+correct+"。"];
 });
}
// Seven previously released levels retain their IDs and counting history.
const originalOverride={
"p4-1":{
 title:"食堂里的小事",
 story:[
 "星期三，小华负责在食堂值日。下课后，同学们排队买饭。小华看见大家有说有笑，心里十分开心。",
 "这时，一个同学走到队伍前面，想先买饭。小华有点生气，却没有大声喊。他走过去，轻轻地说：“请你排队，大家都在等。”",
 "那个同学听了，脸红了。他低下头说：“对不起，我以后会注意。”小华笑着说：“没关系。”他明白了，负责值日要慢慢说话，也要尊重别人。"
 ],
 a:["食堂","在食堂值日","一个同学走到队伍前面，想先买饭","请同学排队","负责值日要慢慢说话，也要尊重别人"]
},
"p4-2":{
 title:"最后一棒",
 story:[
 "学校运动会到了。操场上有很多观众，大家大声为队友加油。志强和小安要参加接力赛，心里又开心又紧张。",
 "开始跑了，志强接过接力棒，快步向前跑。可是，他不小心跌倒了。志强站起来，心里很难过，想：“我还能跑到终点吗？”",
 "队友大声说：“加油！你可以的！”志强没有放弃，继续向终点跑去。虽然没有拿到冠军，大家还是为他加油。志强明白了，坚持比拿第一名更重要。"
 ],
 a:["操场","参加接力赛","志强不小心跌倒了","站起来继续向终点跑去","坚持比拿第一名更重要"]
},
"p4-3":{
 title:"一声谢谢",
 story:[
 "星期六中午，建华和妈妈到熟食中心吃午饭。天气很热，建华排队排了好一会儿，心里有点不耐烦。",
 "买到饭后，建华看见一个老人拿着很多东西，想找个地方坐下。他没有马上让位子，还想：“我也很累呢。”妈妈轻轻地说：“我们应该尊重老人。”",
 "建华听了，脸红了。他站起来，请老人坐下。老人笑着说：“谢谢你。”建华也笑了。他知道，对别人有礼貌，大家都会很开心。"
 ],
 a:["熟食中心","和妈妈吃午饭","老人拿着很多东西，找不到地方坐下","站起来，请老人坐下","对别人有礼貌很重要"]
},
"p5-1":{
 title:"露营夜的小任务",
 story:[
 "学校举行两天一夜的露营活动。出发前，老师请同学们看物品清单，把睡袋、手电筒和防蚊用品放进袋子里。志强心里很高兴。",
 "到了营地，志强想自己做好所有的事，不愿听同伴的想法。后来，他发现要做的事很多，一个人做不完。志强低下头，心里有点难过。",
 "老师轻轻地说：“大家一起做，才会更快。”志强听了，主动请同伴帮忙。他们一边说，一边做，最后完成了任务。志强明白了，大家互相配合，比自己一个人做更好。"
 ],
 a:["营地","做好露营任务","志强一个人做不完所有的事","请同伴一起完成任务","大家互相配合比一个人做更好"]
},
"p5-2":{
 title:"留言背后的心情",
 story:[
 "小雨喜欢画画，也喜欢在网上分享自己的画。有一天，有同学在她的画下面留言，嘲笑她画得不好。小雨看了，心里很难过。",
 "朋友小文发现小雨不开心，走过去轻轻地问：“你怎么了？”小雨把事情说给她听。小文说：“你可以告诉老师，不要自己一个人难过。”",
 "小雨鼓起勇气，把网上的留言告诉老师。老师帮助她和那位同学说清楚。后来，那位同学知道自己做错了，向小雨说对不起。小雨重新开心地画画，也懂得了有烦恼时可以找人帮忙。"
 ],
 a:["网上","分享自己的画","有人留言嘲笑小雨","告诉老师，请老师帮忙","有烦恼时可以找人帮忙"]
},
"p6-1":{
 title:"一步一步向目标前进",
 story:[
 "六年级的建华想参加学校的跑步比赛，可是功课和测验让他感到压力。第一次练习时，他跑了一会儿就很累，心里有点怕。",
 "体育老师帮建华做了一份计划，让他每天慢慢练习，也要注意休息。建华把目标写在纸上，每天完成一点。他看见自己做得越来越好，脸上有了笑容。",
 "比赛那天，建华跑得不快，却没有放弃。同学们在一边大声说：“加油！”他终于跑到终点。虽然没有拿第一名，建华还是很开心。他知道，有了计划并努力去做，就能一步一步战胜困难。"
 ],
 a:["学校","参加跑步比赛","建华第一次练习时很累","每天按计划慢慢练习","有计划并努力做才能战胜困难"]
},
"p6-2":{
 title:"老街上的新壁画",
 story:[
 "学校安排六年级的同学到新加坡的一条老街学习。街边有旧店屋，也有新的大厦。老师带大家看一幅壁画，画里有人在卖糕饼，也有人在做工。",
 "小文以为壁画只是用来给墙添一点色彩。老师说：“这些画让我们看见以前的人怎样生活。”小文又看了看，发现壁画和街边的店屋巧妙地连在一起。",
 "回到学校，同学们一起说说老街的过去和现在。有人喜欢新的大厦，有人爱旧店屋。小文在本子上写道：“新加坡会改变，但我们不能忘记以前的人为今天做过的事。”"
 ],
 a:["老街","了解新加坡的过去","小文不明白壁画的作用","听老师说，再仔细观察","不能忘记以前的人为今天做过的事"]
}
};
function originalQuestions(entry,i){
 const [place,goal,problem,action,lesson]=entry.a;
 return qa({place,goal,issue:problem,act:action,learned:lesson},i);
}
window.compileReadingLessons=function(original,raw,fullRead){
 const controls=window.READING_CONTROL_BASE3,written=window.READING_CONTROL_WRITING;
 if(!controls||!written)throw Error("Missing sourced original textbook character sets");
 const all=[...original],problems=[];
 for(let i=0;i<original.length;i++){
  const l=all[i],allowed=taughtSet(l,fullRead,written,controls);
  const override=originalOverride[l.id];
  if(!override)throw Error("Unrecognized original passage "+l.id);
  l.title=override.title;l.story=override.story;l.questions=originalQuestions(override,i);
  l.focus=l.focus.filter(w=>isTaught(w,allowed));
  for(const [label,str] of [["title",l.title],["story",l.story.join("")],["questions",l.questions.flat(Infinity).join("")]]){
   const bad=unknown(str,allowed);if(bad)problems.push({id:l.id,label,bad});
  }
 }
 for(let i=0;i<raw.length;i++){
  const r=raw[i];
  const allowed=taughtSet({grade:r[0],unit:r[2]},fullRead,written,controls);
  const a=fieldAspects(r,allowed,i);
  const l={id:a.id,grade:a.grade,unit:a.unit,title:a.title,focus:a.focus,story:paragraphSet(a,i),questions:qa(a,i)};
  for(const [label,str] of [["title",l.title],["story",l.story.join("")],["questions",l.questions.flat(Infinity).join("")],["focus",l.focus.join("")]]){
   const bad=unknown(str,allowed);
   if(bad)problems.push({id:l.id,label,bad});
  }
  all.push(l);
 }
 return {lessons:all,issues:problems};
};
})();