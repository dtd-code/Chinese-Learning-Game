
(function(){
const ISSUE={"p4-x20":"写着价钱的纸被风吹走了，大家不知道书签要卖多少钱","p5-ta2":"小林看了电脑很久，眼睛又累又看不清楚","p5-ta3":"小山不小心放了太多盐，汤变得很咸","p5-ta8":"表演的同学生病了，大家不知道谁来上台","p5-tb10":"两位队友为了谁先上场吵了起来","p5-tb15":"大家把高脚屋和雪屋的用处弄混了","p5-x01":"要读信的同学今天不能大声说话","p5-x02":"网上的一张动物相片原来是假的","p5-x11":"几个同学都想坐在窗边，谁也不让谁","p5-x13":"太阳太热，小树的叶子垂了下来","p5-x15":"外婆不会用手机和远方的家人说话","p5-x17":"一位老人拿着很重的袋子，不方便上巴士","p5-x21":"一个同学怕把表演要说的话说错","p6-x09":"有人看错了群里的一句话，同学们开始吵起来","p6-x19":"网上的一个视频没有日期，同学却以为是今天的事","p6-x21":"一些旧书已经破了，同学们想把书全丢了","p6-x26":"没有人用水时，装置还不停地响","p6-ta3":"有同学没有吃过清蒸菜，却说它一定不好吃","p6-tb9":"模型里的一个零件坏了，设备不能正常工作"},ACTION={"p5-ta3":"向姐姐请教，重新煮好紫菜汤","p5-x01":"让另一名同学来读信，大家一起练习","p5-x11":"请大家轮流说自己的想法，再安排座位","p5-x15":"把方法写在纸上，再陪外婆慢慢练习","p5-x17":"先问老人需不需要帮忙，再帮他拿袋子","p5-x02":"查找可信的资料，再换上真的动物相片","p5-ta2":"请老师帮忙，关掉电脑休息一下","p5-x13":"请爷爷和园丁一起照顾小树","p5-x21":"陪同学分段练习台词，再听听录音","p6-ta3":"向摊主问清楚，再自己尝一尝","p6-tb9":"仔细检查零件，再试一次","p6-x09":"请当事人说清楚自己真正的意思","p6-x21":"把还可以用的书送给小同学","p6-x26":"检查装置，再请同学试一试"},GOAL={"p5-x01":"小山和子安准备读一封信，感谢学校的清洁人员","p5-ta2":"两人要在电脑上查找学习资料","p5-ta8":"他们要一起表演花木兰的故事","p5-x02":"两人要做一张介绍动物的海报","p5-x08":"他们要在音乐会上表演","p5-x15":"小林要教外婆用手机和家人说话","p5-x17":"两人要乘巴士参加学校比赛","p5-x21":"两人要参加学校华文表演","p6-ta3":"两人要给同学介绍清蒸菜","p6-tb9":"两人要设计一种帮助长者的设备","p6-x09":"同学们正在群里商量毕业活动","p6-x19":"两人要学习怎样分辨网上的消息","p6-x21":"他们要在毕业前整理阅读角","p6-x26":"两人要做一种帮助大家节水的装置"};
const GENERIC=/有个同学忘了带要用的东西|一个同学不想一起做|有人不小心做错了|大家不知道该先做什么|有的东西找不到了|事情没有想的那样容易/;
function allowedFor(l,ctx){
 const out=new Set(ctx.base3),m=l.unit.match(/^([456])[AB] 第(\d+)课/),last=m?Number(m[2]):999;
 for(let g=4;g<=l.grade;g++)for(let n=1;n<={4:16,5:15,6:10}[g];n++){
  if(g===l.grade&&n>last)break;
  const k=g+(n<=({4:9,5:8,6:6}[g])?"A":"B")+"-"+n;
  for(const c of (ctx.read[k]||"")+(ctx.written[k]||""))out.add(c);
 }
 return out;
}
function safe(s,a){return [...s].every(c=>!/[\u3400-\u9fff]/u.test(c)||a.has(c))}
window.repairReadingContinuity=function(data,ctx){
 const report={updated:0,invalid:[],genericRemaining:[],fixed:[]};
 const lessons=data.map(l=>{
  const x=JSON.parse(JSON.stringify(l)),a=allowedFor(x,ctx),before=x.story.join("");
  if(ISSUE[x.id]){
   if(safe(ISSUE[x.id],a))x.story[1]=x.story[1].replace(GENERIC,ISSUE[x.id]);
   else report.invalid.push({id:x.id,field:"issue"});
  }
  if(ACTION[x.id]){
   if(safe(ACTION[x.id],a))x.story[2]=x.story[2].replace(/决定[^。]+。/,"决定"+ACTION[x.id]+"。");
   else report.invalid.push({id:x.id,field:"action"});
  }
  if(GOAL[x.id]){
   if(safe(GOAL[x.id],a)){
    const p=x.story[0].split("。");
    if(p.length>=3){p[1]=GOAL[x.id];x.story[0]=p.join("。");}
   }else report.invalid.push({id:x.id,field:"goal"});
  }
  for(let i=0;i<3;i++){
   for(const [oldText,newText] of [
     ["他们没有再吵","他们一起完成了这件事"],
     ["大家都想把事情做好","大家想一起完成活动"],
     ["回到秩序","又安静了"],["更很重要","更重要"],
     ["看着眼前的东西，",""]
   ])if(x.story[i].includes(oldText)&&safe(newText,a))x.story[i]=x.story[i].split(oldText).join(newText);
   x.story[i]=x.story[i].replace(/。{2,}/g,"。").replace(/，。/g,"。");
  }
  if(x.story.join("")!==before){report.updated++;report.fixed.push(x.id);}
  if(GENERIC.test(x.story[1]))report.genericRemaining.push(x.id);
  if(x.story.some(p=>!safe(p,a)))throw Error("Out-of-grade edited passage: "+x.id);
  return x;
 });
 return {lessons,report};
};
})();