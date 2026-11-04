/* Editorial QA and consistency pass; reads the original 120-story bank and teaching scope. */
(function(){
"use strict";
const han=/[\u3400-\u9fff]/u;
const cleanRules=[
 ["两人要做的事","两人准备"],["他们要做的事","他们准备"],["要做的事制作","准备制作"],
 ["今天，他们要做的事","今天，他们准备"],["最后，最后","最后"],
 ["最后，大家最后","最后，大家"],["后来，最后","后来"],
 ["最后，老师看了也很开心","后来，大家都很开心"],
 ["再重新","再"],["查阅资料查一查","查看资料，再认真比较"],
 ["写下写下","写下"],["完成观察写下","把观察的东西写下来"],
 ["完成写下","写下来"],["更很重要","更重要"],
 ["完成活动，也","做完了活动，也"],["完成观察","做好观察"],
 ["受到同学们的笑声","让同学们笑了起来"],
 ["有了好结果","解决了问题"],["老师看了也很开心","老师看后，也开心地笑了"],
 ["小红有点生气","小红有点难过"],["很着急得","急得"],
 ["最后，队友互相道歉，最后重新投入练习","最后，队友互相道歉，又开始练习"],
 ["等绿灯亮起再过马路","等绿灯亮了才过马路"]
];
const endingFixes={
 "p4-x17":"小红明白了，帮助别人时，要先听清楚他遇到了什么问题。",
 "p4-x24":"小文明白了，得到奖牌不是最重要的，朋友的努力同样值得鼓励。",
 "p5-ta7":"小山明白了，珍惜时间并按计划做事，才能更好地完成学习任务。",
 "p5-ta4":"小平明白了，分享食物前还要检查好坏，才能真正帮助别人。",
 "p5-ta8":"小晴明白了，当朋友遇到困难时，大家合作才能把表演做好。",
 "p6-x09":"小月明白了，网上的话可能被别人想错，有问题要先说清楚。",
 "p6-x26":"小美明白了，做新的东西要先试一试，发现问题后再改进。",
 "p6-x13":"小晴明白了，介绍过去的生活时，要认真找资料，不能随意猜测。"
};
function taughtSet(l,read,written,base){
 const unit=l.unit.match(/^([456][AB]) 第(\d+)课/);
 const limit=unit?Number(unit[2]):999;
 const set=new Set(base);
 for(const [k,wr] of Object.entries(written)){
  const g=Number(k[0]),n=Number(k.slice(3));
  if(g>l.grade||(g===l.grade&&n>limit))continue;
  for(const c of String(wr)+(read[k]||""))set.add(c);
 }
 return set;
}
function outside(str,set){
 return [...new Set([...String(str)].filter(c=>han.test(c)&&!set.has(c)))];
}
function simplify(str,allowed){
 let result=String(str);
 for(const [a,b] of cleanRules){
  if(result.includes(a)&&outside(b,allowed).length===0)result=result.split(a).join(b);
 }
 return result;
}
function reviseStory(l,o,allow){
 const story=(o?.story||l.story).map(x=>simplify(x,allow));
 const title=o?.title||l.title;
 if(endingFixes[l.id]){
  const last=story[story.length-1];
  const fix=endingFixes[l.id];
  if(outside(fix,allow).length===0){
   const match=last.match(/(?:[。！？])([^。！？]{0,32})(?:明白了|知道了|知道|懂得了)[，：][^。]*。?$/);
   if(match)story[story.length-1]=last.slice(0,match.index+1)+fix;
   else story[story.length-1]=last.replace(/(?:[^。！？]*)(?:明白了|知道了|知道|懂得了)[，：][^。]*。?$/,fix);
  }
 }
 return {...l,title,story};
}
function correctChoice(q){
 return String(q[1][q[2]]);
}
function scoreSimilarity(a,b){
 const aa=new Set([...a]),bb=new Set([...b]);
 const union=new Set([...aa,...bb]).size;
 const common=[...aa].filter(c=>bb.has(c)).length;
 return common/Math.max(1,union);
}
function rotateChoices(correct,wrong,i){
 const idx=(i*7+Math.floor(i/5))%3,arr=Array(3);arr[idx]=correct;
 let j=0;for(let n=0;n<3;n++)if(n!==idx)arr[n]=wrong[j++];
 return [arr,idx];
}
function topicMatch(a,b){
 const words=["车资卡","招领","柜台","水壶","书包","巴士","司机","图书","阅读","书签","相片","照片","网上","网络","留言","消息","球","比赛","练习","跑步","运动","食物","食品","厨房","食堂","钱","奶奶","外婆","妈妈","爸爸","爷爷","朋友","动物","壁虎","小猫","鸟儿","海边","树","花","植物","雨伞","马路","地图","课室","舞台","表演","台词","读书","书本","学校","社区","居民","保护","安全","道歉","诚实","规则","学习"];
 return words.filter(k=>a.includes(k)&&b.includes(k)).length;
}
function distractors(correct,original,index,l,all,allow){
 if(l.id==="p4-x06"&&index===3)return ["先把小芽搬到阴凉的地方","找同学帮忙把花盆搬走"];
 if(l.id==="p4-x24"&&index===3)return ["请朋友以后不要再参加比赛","只让朋友看奖牌，不去练习"];
 if(l.id==="p5-x21"&&index===2)return ["小青在表演时说错了一句话","一位同学生病，不能参加表演"];
 if(l.id==="p5-x21"&&index===3)return ["先请老师替子安上台表演","让子安一个人背完所有台词"];
 if(l.id==="p5-x22"&&index===3)return ["先把相片给大家看，再找老师商量","只关心受伤同学，不管网上的相片"];
 if(index===0){
  const choices={
    "心里很担心":["心里很开心","心里很生气"],
    "心里很着急":["心里很开心","心里很轻松"],
    "心里很难过":["心里很开心","心里很生气"],
    "心里很生气":["心里很开心","心里很担心"],
    "心里很紧张":["心里很开心","心里很轻松"],
    "心里有点怕":["心里很开心","心里很高兴"]
  };
  const opts=choices[correct];
  if(opts&&opts.every(v=>outside(v,allow).length===0))return opts;
 }

 const range=correct.length<=9?2:correct.length<=18?3:4;
 const accepted=s=>s&&s!==correct&&outside(s,allow).length===0
  &&Math.abs(s.length-correct.length)<=range&&s.length>=3
  &&!l.story.join("").includes(s);
 const initial=original.filter(accepted);
 const pool=[];
 for(const other of all){
  if(other.id===l.id||other.grade!==l.grade)continue;
  const question=other.questions[index];
  if(!question)continue;
  for(const c of [correctChoice(question),...question[1]])if(accepted(c)&&!pool.includes(c))pool.push(c);
 }
 const scored=pool.map((s,i)=>{
  const sim=scoreSimilarity(correct,s);
  const topic=l.story.join("");
  const relevance=scoreSimilarity(topic,s);
  const shape=(correct.includes("，")===s.includes("，")?1:0)
   +(correct.includes("再")===s.includes("再")?.5:0);
  return {s,value:Math.abs(s.length-correct.length)*-.75+sim*3+relevance*1.25+shape*.4-Math.abs(sim-.42)*1.5-i*.0001};
 }).sort((a,b)=>b.value-a.value);
 const out=[];
 // Keep a plausible original distractor but avoid always using only one-word substitution.
 const one=initial.find(x=>scoreSimilarity(x,correct)<.70)||initial.find(x=>scoreSimilarity(x,correct)<.77);
 if(one)out.push(one);
 for(const {s} of scored){
  if(out.length===2)break;
  if(topicMatch(correct,s)>0&&!out.includes(s)&&scoreSimilarity(correct,s)<.77&&out.every(w=>scoreSimilarity(w,s)<.80))out.push(s);
 }
 for(const alt of initial)if(out.length<2&&!out.includes(alt))out.push(alt);
 for(const {s} of scored)if(out.length<2&&!out.includes(s)&&scoreSimilarity(correct,s)<.77)out.push(s);
 if(out.length!==2)throw Error("Not enough balanced alternatives for "+l.id+" q"+index+" correct="+correct);
 return out;
}
const firstEmotion={
 "担心":["心里很担心","心里很开心","心里很生气"],
 "着急":["心里很着急","心里很开心","心里很平静"],
 "害怕":["心里有点怕","心里很高兴","心里很生气"],
 "难过":["心里很难过","心里很高兴","心里很生气"],
 "后悔":["心里很后悔","心里很高兴","心里很生气"],
 "生气":["心里很生气","心里很高兴","心里很难过"],
 "紧张":["心里很紧张","心里很轻松","心里很高兴"]
};
function inferEmotion(l,allowed){
 const paragraph=l.story[1]||"";
 for(const [key,options] of Object.entries(firstEmotion)){
  if(paragraph.includes(key)&&options.every(s=>outside(s,allowed).length===0))return options;
 }
 return null;
}
function extractLesson(l){
 const end=l.story[l.story.length-1];
 const patterns=[
  /(?:明白了|知道了|知道|懂得了)[，：]([^。！？]+)[。！？]?\s*$/,
  /(?:写道|说)[：：“”]+([^。！？]{9,45})[。！？]?[”"]?\s*$/
 ];
 for(const rx of patterns){const m=end.match(rx);if(m&&m[1])return m[1].replace(/[”"。！？]+$/,"").trim()}
 return null;
}
window.reviewReadingBank=function(bank,overrides,read,written,base){
 const prepared=bank.map(l=>reviseStory(l,overrides[l.id],taughtSet(l,read,written,base)));
 const problems=[];
 const out=prepared.map((l,i)=>{
  const allow=taughtSet(l,read,written,base);
  const qOriginal=l.questions;
  const checkedFacts=window.READING_QUIZ_FACTS?.[l.id]||null;
  const qq=[];
  for(let k=0;k<5;k++){
   let question=qOriginal[k][0],answer=correctChoice(qOriginal[k]);
   if(!checkedFacts&&k===0&&/(心里|感受|怎么样)/.test(question)){
    const em=inferEmotion(l,allow);
    if(em){question="主人公遇到问题时心里怎么样？";answer=em[0]}
   }
   if(k===0&&l.id==="p6-ta6"){question="故事发生在哪里？";answer="学校礼堂";}
   if(k===4&&!checkedFacts){
    const moral=extractLesson(l);
    if(moral&&moral.length>=7&&moral.length<=18&&outside(moral,allow).length===0)answer=moral;
    question="哪句话最符合故事的道理？";
   }
   if(k===4&&!checkedFacts&&answer.length>25){const tail=answer.split(/[，,]/).pop().trim();if(tail.length>=7&&tail.length<=25&&outside(tail,allow).length===0)answer=tail;}
   if(checkedFacts){answer=checkedFacts[k];if(k===0)question="主人公遇到问题时心里怎么样？";}
   if(k===4)question="哪句话最符合故事的道理？";
   if(k===3)question="面对问题，哪种做法最合适？";
   if(k===2)question="故事中主要发生了什么事？";
   if(k===1)question="故事开始时，他们想做什么？";
   if(outside(question,allow).length)question=qOriginal[k][0];
   const sp=k===0?window.READING_Q0_SPECIAL?.[l.id]:null;
   if(sp){question=sp[0];answer=sp[1];}
   const wrong=sp?[sp[2],sp[3]]:distractors(answer,qOriginal[k][1].filter((_,n)=>n!==qOriginal[k][2]),k,l,prepared,allow);
   const [choices,correct]=rotateChoices(answer,wrong,i*5+k);
   const explanation="答案是："+answer+"。";
   qq.push([question,choices,correct,explanation]);
  }
  const edited={...l,questions:qq};
  for(const [type,str] of [["title",edited.title],["story",edited.story.join("")],["quiz",edited.questions.flat(Infinity).join("")]]){
   const bad=outside(str,allow);if(bad.length)problems.push({id:l.id,type,bad:bad.join("")});
  }
  return edited;
 });
 return {lessons:out,issues:problems};
};
})();