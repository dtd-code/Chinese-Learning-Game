/* Original reading stories and comprehension questions for P4–P6 */
(function(){
"use strict";
const introductions=[
a=>"那天，"+a.who+"和"+a.friend+"来到"+a.place+"。"+a.aim+"。"+a.who+"微笑着做好准备，眼里闪着期待的光。",
a=>"放学前后，"+a.place+"十分热闹。"+a.who+"和"+a.friend+"一起参加活动。"+a.aim+"。两人说说笑笑，心里都很期待。",
a=>"清晨，阳光照进"+a.place+"。"+a.who+"和"+a.friend+"早早来到这里。"+a.aim+"。"+a.who+"抿着嘴，认真地做好准备。",
a=>"那天下午，"+a.who+"跟"+a.friend+"来到"+a.place+"。"+a.aim+"。想到能学到新本领，"+a.who+"就兴奋得笑了起来。",
a=>"那一天，"+a.place+"传来阵阵说话声。"+a.who+"和"+a.friend+"也在其中。"+a.aim+"。"+a.who+"一边观察，一边暗暗给自己打气。",
a=>"星期三，"+a.who+"带着"+a.friend+"来到"+a.place+"。"+a.aim+"。"+a.who+"仔细检查准备好的东西，生怕漏掉什么。"
];
const problems=[
a=>"可是事情没有想象中顺利："+a.problem+"。"+a.who+a.feeling+"，忍不住皱起眉头，心想：“再急也要先想清楚。”"+a.friend+"轻声问：“我们该怎么办？”",
a=>"正忙着，意外发生了："+a.problem+"。"+a.who+a.feeling+"，手心微微出汗。"+a.friend+"望着"+a.who+"，小声说：“别急，还有办法。”",
a=>"忽然，"+a.problem+"。"+a.who+a.feeling+"，脸上的笑容一下子消失了。"+a.friend+"伸手拍了拍"+a.who+"的肩膀，鼓励道：“我们一起解决。”",
a=>"没想到，"+a.problem+"。"+a.who+a.feeling+"，站在原地想了好一会儿。看见"+a.friend+"担心的神情，"+a.who+"决定不能轻易放弃。",
a=>"就在这时，"+a.problem+"。"+a.who+a.feeling+"，心跳得很快。"+a.friend+"提醒说：“遇到难题，先冷静下来。”",
a=>"事情却起了变化："+a.problem+"。"+a.who+a.feeling+"，低头想：“如果我是对方，会有什么感受？”"+a.friend+"也认真思考起来。"
];
const solutions=[
a=>a.who+"深吸一口气，决定"+a.action+"。"+a.who+"对"+a.friend+"说：“我们一起试试看！”"+a.friend+"点了点头，两人小心地把事情做好。",
a=>a.who+"没有逃避，而是"+a.action+"。"+a.friend+"露出笑容，说：“这个办法不错！”他们分工合作，一步一步完成任务。",
a=>a.who+"想了想，主动"+a.action+"。"+a.friend+"也赶紧帮忙。大家一边商量，一边调整方法，终于看见了希望。",
a=>"想清楚后，"+a.who+"立刻"+a.action+"。"+a.friend+"担心地问：“真的行吗？”"+a.who+"坚定地回答：“只要肯试，就有机会。”",
a=>a.who+"认真观察后，先"+a.action+"。"+a.friend+"在旁边配合，两人没有互相埋怨，而是耐心解决问题。",
a=>"犹豫了一会儿，"+a.who+"终于"+a.action+"。"+a.friend+"听完说明，轻轻点头。他们互相提醒，慢慢把难题解开。"
];
const endings=[
a=>"最后，"+a.outcome+"。"+a.who+"舒了一口气，嘴角扬起笑容。过了一会儿，"+a.who+"明白了一个道理："+a.lesson+"。",
a=>"不久，"+a.outcome+"。"+a.friend+"笑着竖起大拇指，"+a.who+"也觉得心里暖暖的。这件事让"+a.who+"懂得："+a.lesson+"。",
a=>"经过大家的努力，"+a.outcome+"。"+a.who+"回想起刚才的困难，心里充满感激，也更相信"+a.lesson+"。",
a=>"到了活动结束时，"+a.outcome+"。"+a.who+"的紧张化成笑容，默默记住："+a.lesson+"。",
a=>"终于，"+a.outcome+"。"+a.friend+"高兴得拍起手来，"+a.who+"却认真地说：“我学到了，"+a.lesson+"。”",
a=>"事情有了好结果："+a.outcome+"。"+a.who+"轻声向"+a.friend+"道谢，也在心里记下了："+a.lesson+"。"
];
function makeOptions(answer,wrong,seed){const opts=[answer,...wrong.filter(x=>x!==answer).slice(0,2)];while(opts.length<3)opts.push("故事没有提到的另一种情况");const correct=seed%3,result=Array(3);result[correct]=answer;let k=1;for(let i=0;i<3;i++)if(i!==correct)result[i]=opts[k++];return [result,correct]}
window.generateReadingBank=function(){
 const raw=[...(window.READING_BANK_P4||[]),...(window.READING_BANK_P5||[]),...(window.READING_BANK_P6||[])],ids=new Set();
 return raw.map((v,idx)=>{
  const [grade,id,unit,title,place,who,friend,aim,problem,feeling,action,outcome,lesson,words]=v;
  if(ids.has(id))throw Error("重复的篇章编号："+id);ids.add(id);
  const a={grade,id,unit,title,place,who,friend,aim,problem,feeling,action,outcome,lesson},i=idx%6;
  const story=[introductions[i](a),problems[i](a),solutions[i](a)+endings[i](a)];
  if(grade===6)story[1]+=who+"知道，自己的决定不仅影响结果，也会影响同伴的感受。";
  const peers=raw.filter(x=>x[0]===grade&&x[1]!==id);
  const other=(col)=>{const arr=[];for(let j=1;j<=peers.length&&arr.length<2;j++){const v=peers[(idx+j*7)%peers.length][col];if(!arr.includes(v))arr.push(v)}return arr};
  const specs=[["故事主要发生在哪里？",place,other(4)],[who+"一开始要做什么？",aim,other(7)],["故事遇到了什么问题？",problem,other(8)],[who+"怎样解决问题？",action,other(10)],["这个故事告诉我们什么道理？",lesson,other(12)]];
  const questions=specs.map(([q,a,wrong],k)=>{const [opts,correct]=makeOptions(a,wrong,idx+k);return [q,opts,correct,"短文提到："+a+"。"]});
  return {id,grade,unit,title,focus:words.split("、").filter(Boolean),story,questions};
 });
};
})();