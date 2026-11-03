/* Balanced, story-grounded five-question comprehension bank. */
(function(){
"use strict";
const HAN=/[\u3400-\u9fff]/u;
const CUSTOM={
"p5-ta5":["乘巴士到图书馆参加阅读活动","小华发现车资卡不见了","回去找，还向工作人员问招领处"],
"p4-ta2":["走到校门口等妈妈","弟弟没有带雨伞","把雨伞给弟弟一起走"],
"p4-ta3":["在家里帮妈妈整理东西","小红弄坏了妈妈的相片","主动向妈妈认错"],
"p4-ta7":["乘地铁去参加活动","一名孕妇上车却没有座位","请表弟拿开书包让孕妇坐下"],
"p4-x04":["和奶奶在熟食中心吃米粉","年轻人的袋子放在空座位上","礼貌请年轻人拿开袋子"],
"p4-x11":["和爸爸整理家里的相片","全家喜欢的相片被水弄湿","和爸爸一起把相片收好"],
"p5-x08":["和同学一起参加音乐会","一名队员不能来表演","请老师帮忙安排节目"],
"p5-x11":["和班长一起安排小组座位","几名同学都想坐在窗边","请大家轮流说出想法"],
"p5-x15":["教外婆用手机和家人说话","外婆不知道怎么用手机","写下方法再陪外婆练习"],
"p5-x17":["去参加学校比赛","一位老人拿着东西不方便上车","先问老人再帮他拿东西"],
"p6-ta4":["为妈妈准备一份礼物","商场里的礼物太贵了","和哥哥动手做一只袋子"],
"p6-ta3":["介绍学校食堂的清蒸菜","同学没有吃过就说它不好吃","问摊主并自己尝一尝"],
"p6-tb9":["设计一种能帮助长者的设备","设备里的零件出了问题","查出问题后重新安装零件"],
"p6-x30":["参加海边清洁活动","丽华捡到一个有证件的皮夹","把皮夹交给活动负责人"]
};
const EMOTIONS=[
"心里很着急","有点难过","心里很担心","有点生气","觉得很害怕",
"十分开心","心里有点怕","有点不开心","心里很不安","有些担心",
"感到很失望","有点不好意思","十分紧张","觉得很难过","有点不服气",
"心里很高兴","有点害羞","有些不舒服","心里很烦恼","很想马上帮忙"
];
function taughtAllowed(lesson,ctx){
 const a=new Set(ctx.base3),m=lesson.unit.match(/^([456])[AB] 第(\d+)课/);
 const last=m?Number(m[2]):999;
 for(let g=4;g<=lesson.grade;g++)for(let n=1;n<={4:16,5:15,6:10}[g];n++){
  if(g===lesson.grade&&n>last)break;
  const k=g+(n<=({4:9,5:8,6:6}[g])?"A":"B")+"-"+n;
  for(const c of (ctx.read[k]||"")+(ctx.written[k]||""))a.add(c);
 }
 return a;
}
function inVocab(s,allow){return [...s].every(c=>!HAN.test(c)||allow.has(c))}
function findHero(l){
 const str=l.story.slice(0,2).join("");
 const x=str.match(/(小[\u4e00-\u9fff]{1,2}|志强|建华|志文|子安|丽华|美华|小平|小青|小花)(?:和|在|来到|准备|想|看见|发现|心里|负责|听见|把|对|说)/);
 return x?.[1]||"他";
}
function moralFromStory(l){
 const last=l.story[2];
 let m=last.match(/(?:明白了[:：]|知道[，：]?|学会了[，：]?|想[:：])([^。！？]+)[。！？]\s*$/);
 if(m)return m[1].trim();
 m=last.match(/([^。！？]{5,25})[。！？]\s*$/);
 return m?.[1]||l.questions[4][1][l.questions[4][2]];
}
function getFeeling(l,allow){
 const paragraph=l.story[1],hero=findHero(l);
 const position=paragraph.indexOf(hero);
 // Do not attribute another character's emotions to the protagonist.
 if(position<0)return null;
 const s=paragraph.slice(position);
 const mood=[
  ["担忧","心里很担心"],["担心得","心里很担心"],["焦虑","心里很着急"],["急得","心里很着急"],["很着急","心里很着急"],["着急","心里很着急"],["脸都红了","心里很着急"],["难过","有点难过"],
  ["生气","有点生气"],["担心","心里很担心"],["害怕","觉得很害怕"],
  ["很怕","心里有点怕"],["紧张","十分紧张"],["失望","感到很失望"],
  ["不好意思","有点不好意思"],["有点怕","心里有点怕"],["不安","心里很不安"],["不服气","有点不服气"],
  ["心疼","心里很难过"],["焦急","心里很着急"],["害羞","有点害羞"],
  ["不开心","有点不开心"],["很累","有些不舒服"],["不知该怎么办","心里很着急"],
  ["怕","心里有点怕"],["笑","十分开心"]
 ];
 for(const [source,target] of mood){if(s.includes(source)&&inVocab(target,allow))return target;}
 return EMOTIONS.find(x=>s.includes(x)&&inVocab(x,allow))||null;
}
function rotate(options,answer,seed){
 const correctIndex=seed%3,ret=Array(3);ret[correctIndex]=answer;
 let j=0;for(let i=0;i<3;i++)if(i!==correctIndex)ret[i]=options[j++];
 return [ret,correctIndex];
}
function scoreRelation(a,b){
 const a2=new Set([...a].filter(ch=>HAN.test(ch)));
 const shared=[...b].filter(ch=>a2.has(ch)).length;
 const ratio=shared/Math.max(1,b.length);
 return Math.abs(a.length-b.length)*4 + (ratio>0.72?20:ratio<0.12?6:0) - Math.min(shared,5);
}
function fallbackPool(correct,type,l,allow){
 const base={
  location:["学校礼堂","学校食堂","学校课室","学校图书馆","家里的客厅","家里的饭厅","组屋楼下","公园","巴士站","熟食中心"],
  goal:["和同学一起完成学习活动","在学校参加一场活动","和朋友一起准备一份礼物","和同学一起看一本书","帮忙整理班里的东西"],
  issue:["一个同学把东西忘在家里","有个同学不愿意参加活动","大家找不到要用的东西","有人不小心打翻了东西","一个人不知道该怎么做"],
  action:["请同学一起帮忙想办法","先找老师帮忙再慢慢做","先把事情和朋友说清楚","回到原来的地方仔细找","先听大家的想法再决定"],
  moral:["要多留意身边朋友的感受","有问题时要先想办法","大家一起做事更容易完成","做事不能只想到自己","遇到难题时要冷静想办法"]
 }[type]||[];
 return base.filter(x=>x!==correct&&inVocab(x,allow));
}

const DETAIL_ALTS=[["图书馆",["美术室","学校礼堂","学校食堂","音乐室"]],["阅读活动",["画画活动","音乐活动","体育活动"]],["车资卡",["书包","水壶","车票"]],["工作人员",["巴士司机","学校老师","其他乘客"]],["服务柜台",["巴士司机","学校老师","服务人员"]],["老人",["小孩","同学","司机"]],["妈妈",["爸爸","姐姐","老师"]],["弟弟",["妹妹","朋友","同学"]],["哥哥",["姐姐","弟弟","朋友"]],["学校",["家里","公园","商店"]],["公园",["学校","花园","食堂"]],["地铁",["巴士","校车","汽车"]],["巴士",["校车","地铁","汽车"]],["食堂",["课室","图书馆","礼堂"]],["课室",["食堂","礼堂","图书馆"]],["音乐",["画画","体育","阅读"]],["画画",["唱歌","跳舞","运动"]],["相片",["书本","卡片","照片"]],["小猫",["小狗","小鸟","小鱼"]],["动物",["植物","小鸟","小猫"]],["同学",["老师","朋友","妈妈"]],["朋友",["家人","同学","老师"]],["老师",["同学","朋友","妈妈"]],["拿开",["放好","拿起","打开"]],["放好",["拿走","拿开","放下"]],["走到",["跑到","来到","回到"]],["回去",["走开","回家","过去"]],["不见了",["弄坏了","没钱了","拿错了"]],["弄坏了",["弄丢了","找不到","忘记了"]],["打翻",["拿走","放错","碰倒"]],["找不到",["不想带","忘记拿","拿错了"]],["整理",["检查","收好","拿走"]],["检查",["整理","收好","拿走"]],["练习",["玩耍","休息","比赛"]],["比赛",["表演","练习","游戏"]],["互相",["自己","大家","一起"]],["慢慢",["马上","一起","轻轻"]],["轻轻",["大声","马上","慢慢"]]];
function contextualVariants(text,l,allow){
 const result=[];
 for(const [token,replacements] of DETAIL_ALTS){
  const i=text.indexOf(token);if(i<0)continue;
  for(const alt of replacements){
   if(!inVocab(alt,allow))continue;
   const changed=text.slice(0,i)+alt+text.slice(i+token.length);
   if(changed!==text&&Math.abs(changed.length-text.length)<=3&&!l.story.join("").includes(changed))result.push(changed);
  }
 }
 return [...new Set(result)];
}

function generateOptions(correct,type,l,pool,allow,seed){
 const variants=(type==="moral"||type==="location")?[]:contextualVariants(correct,l,allow);
 let candidates=pool.filter(p=>p.grade===l.grade&&p.id!==l.id)
  .map(p=>p[type]).filter(s=>s&&s!==correct&&inVocab(s,allow)&&!l.story.join("").includes(s));
 const fallback=fallbackPool(correct,type,l,allow);
 candidates=variants.concat(candidates,fallback);
 // Prefer similar-length choices, with the same grammatical role.
 candidates=[...new Set(candidates)].filter(s=>Math.abs(s.length-correct.length)<=3)
  .sort((a,b)=>(variants.includes(a)?-100:0)-(variants.includes(b)?-100:0)+scoreRelation(correct,a)-scoreRelation(correct,b));
 const selected=[];
 for(const s of candidates)if(!selected.includes(s)&&selected.length<2)selected.push(s);
 if(selected.length<2){
  // Prefer near-length alternatives even when the corpus has few identical-length phrases.
  const again=[...new Set(pool.filter(p=>p.grade===l.grade&&p.id!==l.id).map(p=>p[type]).concat(fallback))]
    .filter(s=>s&&s!==correct&&inVocab(s,allow)&&!l.story.join("").includes(s)&&!selected.includes(s))
    .sort((a,b)=>scoreRelation(correct,a)-scoreRelation(correct,b));
  for(const s of again)if(selected.length<2)selected.push(s);
 }
 if(selected.length<2)throw Error("Insufficient eligible distractors: "+l.id+" "+type+" "+correct);
 const [arr,right]=rotate(selected,correct,seed);
 return {options:arr,correct:right,delta:Math.max(...arr.map(s=>s.length))-Math.min(...arr.map(s=>s.length))};
}
function courseCorrect(l){
 const a=CUSTOM[l.id],facts=window.READING_COHERENCE_FACTS||{};
 const q=l.questions;
 const source={goal:a?.[0]||facts.goal?.[l.id]||q[1][1][q[1][2]],
  issue:a?.[1]||facts.issue?.[l.id]||q[2][1][q[2][2]],
  action:a?.[2]||facts.action?.[l.id]||q[3][1][q[3][2]],
  moral:moralFromStory(l),
  location:(()=>{
    const oldPlace=q[0][1][q[0][2]],text=l.story.join("");
    if(text.includes(oldPlace))return oldPlace;
    const opts=["东海岸公园","熟食中心","巴士转换站","学校图书馆","学校礼堂","学校食堂","学校课室","公园","学校","家里","巴士站","图书馆","地铁车厢"];
    return opts.find(x=>text.includes(x))||oldPlace;
  })()};
 // Prefer the actual new wording that is present in the revised story.
 return source;
}
window.balanceReadingQuestions=function(data,ctx){
 const pool=data.map(l=>({id:l.id,grade:l.grade,...courseCorrect(l)}));
 let maxDiff=0,totalQuestionCount=0,unbalanced=[],bad=[];
 const result=data.map((l,i)=>{
  const x=JSON.parse(JSON.stringify(l)),allow=taughtAllowed(x,ctx),hero=findHero(x);
  const correct=courseCorrect(x);
  const feel=getFeeling(x,allow);
  const useMood=Boolean(feel);
  const questionTexts=[
   useMood?"这时，"+hero+"心里怎么样？":x.questions[0][0],
   x.questions[1][0],x.questions[2][0],x.questions[3][0],x.questions[4][0]
  ];
  let firstAnswer;
  if(useMood){
   const moods=EMOTIONS.filter(v=>inVocab(v,allow)&&v!==feel&&Math.abs(v.length-feel.length)<=2&&!x.story[1].includes(v));
   const initialMoods=moods.sort((a,b)=>Math.abs(a.length-feel.length)-Math.abs(b.length-feel.length));
   if(initialMoods.length<2)throw Error("Insufficient feeling choices "+x.id+" "+feel);
   const moodChoice=rotate(initialMoods.slice(0,2),feel,i+3);
   firstAnswer={options:moodChoice[0],correct:moodChoice[1],delta:Math.max(...moodChoice[0].map(v=>v.length))-Math.min(...moodChoice[0].map(v=>v.length))};
  }else firstAnswer=generateOptions(correct.location,"location",x,pool,allow,i+3);
  const answers=[
   firstAnswer,
   ...["goal","issue","action","moral"].map((field,j)=>generateOptions(correct[field],field,x,pool,allow,i*7+j))
  ];
  x.questions=answers.map((a,j)=>{
   totalQuestionCount++;maxDiff=Math.max(maxDiff,a.delta);
   if(a.delta>4)unbalanced.push({id:x.id,question:j,diff:a.delta,options:a.options});
   const correctString=a.options[a.correct];
   if(!inVocab(questionTexts[j],allow)||a.options.some(t=>!inVocab(t,allow)))bad.push({id:x.id,question:j,problem:"outside vocabulary"});
   if(a.options.filter(z=>z===correctString).length!==1)bad.push({id:x.id,question:j,problem:"ambiguous same answer"});
   return [questionTexts[j],a.options,a.correct,"短文中可以看出："+correctString+"。"];
  });
  return x;
 });
 return {lessons:result,summary:{questions:totalQuestionCount,maxLengthDifference:maxDiff,unbalanced,bad}};
};
})();