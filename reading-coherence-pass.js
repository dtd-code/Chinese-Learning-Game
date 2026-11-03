
(function(){
const ISSUE={"p4-x20":"写着多少钱的纸被风吹走了，大家不知道书签要卖多少钱","p5-ta2":"小林看了电脑很久，眼睛又累又看不清楚","p5-ta3":"小山不小心放了太多盐，汤的味道不好","p5-ta8":"表演的同学生病了，大家不知道谁来上台","p5-tb10":"两位队友为了谁先上场吵了起来","p5-tb15":"大家把高脚屋和雪屋的用处弄混了","p5-x01":"要读信的同学突然不能大声说话","p5-x02":"网上的一张动物相片原来是假的","p5-x11":"几个同学都想坐在窗边，谁也不让谁","p5-x13":"太阳太热，小树的叶子没有精神","p5-x15":"外婆不会用手机和远方的家人说话","p5-x17":"一位老人拿着很重的袋子，不方便上巴士","p5-x21":"一个同学怕把表演要说的话说错","p6-x09":"有人看错了群里的一句话，同学们开始吵起来","p6-x19":"网上的一段影片没有日期，同学却以为是今天的事","p6-x21":"一些旧书已经破了，同学们想把书全丢了","p6-x26":"没有人用水时，装置还不停地响","p6-ta3":"有同学没有吃过清蒸菜，却说它一定不好吃","p6-tb9":"模型里的一个零件坏了，设备不能正常工作"},ACTION={"p5-ta3":"向姐姐请教，重新煮好紫菜汤","p5-x01":"让另一名同学来读信，大家一起练习","p5-x11":"请大家轮流说自己的想法，再安排座位","p5-x15":"把方法写在纸上，再陪外婆慢慢练习","p5-x17":"先问老人需不需要帮忙，再帮他拿袋子","p5-x02":"查找可信的资料，再换上真的动物相片","p5-ta2":"请老师帮忙，关掉电脑休息一下","p5-x13":"请爷爷和园丁一起照顾小树","p5-x21":"陪同学分段练习台词，再听听录音","p6-ta3":"向摊主问清楚，再自己尝一尝","p6-tb9":"仔细检查零件，再试一次","p6-x09":"请当事人说清楚自己真正的意思","p6-x21":"把还可以用的书送给小同学","p6-x26":"检查装置，再请同学试一试"},GOAL={"p5-x01":"小山和子安准备读一封信，感谢学校的清洁人员","p5-ta2":"两人要用电脑查找学习的东西","p5-ta8":"他们要一起表演花木兰的故事","p5-x02":"两人要做一张介绍动物的海报","p5-x08":"他们要在音乐会上表演","p5-x15":"小林要教外婆用手机和家人说话","p5-x17":"两人要乘巴士参加学校比赛","p5-x21":"两人要参加学校华文表演","p6-ta3":"两人要给同学介绍清蒸菜","p6-tb9":"两人要设计一种帮助长者的设备","p6-x09":"同学们正在群里商量毕业活动","p6-x19":"两人要学习怎样查清网上的消息","p6-x21":"他们要在毕业前整理阅读角","p6-x26":"两人要做一种帮助大家节水的装置"};
const GENERIC=/有个同学忘了带要用的东西|一个同学不想一起做|有人不小心做错了|大家不知道该先做什么|有的东西找不到了|事情没有想的那样容易/;
window.READING_COHERENCE_FACTS={goal:GOAL,issue:ISSUE,action:ACTION};
const MOOD={
 "p5-x01":["小山有点生气","小山心里很担心"],
 "p5-ta3":["小山有点生气","小山心里很着急"],
 "p5-ta2":["子安心里有点难过","子安心里很着急"],
 "p5-ta8":["小晴心里有点难过","小晴心里很担心"],
 "p5-x11":["小华有点不开心","小华心里很担心"]
};
Object.assign(ACTION,{"p4-x02":"陪同学慢慢跑，再一起完成练习","p4-x06":"看看种花的情况，再按老师说的话浇水","p4-tb16":"请大家不要走近壁虎，安静地看它爬行","p4-x24":"陪朋友继续练习，再告诉他不要放弃","p5-x25":"重新安排学习和休息的时间，做一张简单的表","p6-ta5":"先告诉老师自己碰坏了铜钟，再一起修好","p6-x02":"请老师帮忙提醒游客不要走进泥滩","p6-x06":"先问长者需要什么，再改好机器人","p6-x12":"改用画纸，把想说的话画出来","p6-x15":"先问教练正确的动作，再陪奶奶慢慢练习","p6-x16":"先问同学愿不愿意把相片放上网","p6-x18":"先向家人问清楚，再查一查节日的资料","p6-x20":"请大家说说不同角色的工作，再安排表演","p6-x29":"请大家轮流说想法，一起安排重要工作"});
const REWRITES={"p4-ta5":[["听见打针的声音","看见护士拿着针"]],"p4-x07":[["学校里突然被打翻的果汁弄脏","学校的地上有打翻的果汁"]],"p4-x19":[["新同学最后开心地笑了","新同学开心地笑了"]],"p4-x08":[["最后，终于有一球飞过球网","最后，有一球飞过球网"]],"p4-tb14":[["地面一片很乱","地上有很多东西"]],"p4-x20":[["写着多少钱的纸","写着书签要卖多少钱的纸"]],"p5-x01":[["要读信的同学突然不能大声说话","要读信的同学感冒了，说话声音很小"]],"p6-x17":[["朋友笑着说谢谢","大家又做了一次实验，也把结果写下来"]],"p6-x29":[["朋友笑着说谢谢","同学们都有了做重要工作的机会"]],"p4-x24":[["大家把这件事做好了","朋友不再难过，还想继续练习"]],"p6-x01":[["这件事有了好结果","同学慢慢安排好学习和休息的时间"]],"p6-x19":[["这件事有了好结果","同学们知道了消息不一定是真的"]],"p6-x24":[["大家都明白了","同学们不再传没有查清楚的消息"]]};
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
  const mood=MOOD[x.id];
  if(mood&&x.story[1].includes(mood[0])&&safe(mood[1],a))x.story[1]=x.story[1].replace(mood[0],mood[1]);
  for(let i=0;i<3;i++){
   for(const [oldText,newText] of [
     ["他们没有再吵","他们一起完成了这件事"],
     ["大家都想把事情做好","大家想一起完成活动"],
     ["回到秩序","又安静了"],["更很重要","更重要"],
     ["看着眼前的东西，",""]
   ])if(x.story[i].includes(oldText)&&safe(newText,a))x.story[i]=x.story[i].split(oldText).join(newText);
   x.story[i]=x.story[i].replace(/。{2,}/g,"。").replace(/，。/g,"。");
  }
  for(const pair of REWRITES[x.id]||[]){
   if(x.story.some(p=>p.includes(pair[0]))&&safe(pair[1],a)){
    x.story=x.story.map(p=>p.split(pair[0]).join(pair[1]));
   }else report.invalid.push({id:x.id,field:"rewrite",from:pair[0]});
  }
  x.story[2]=x.story[2].replace(/没有一直难过，决定/g,"想了想，决定")
   .replace(/最后，最后/g,"最后").replace(/后来，后来/g,"后来")
   .replace(/做完了完成/g,"做完了");
  if(x.story.join("")!==before){report.updated++;report.fixed.push(x.id);}
  if(GENERIC.test(x.story[1]))report.genericRemaining.push(x.id);
  if(x.story.some(p=>!safe(p,a)))throw Error("Out-of-grade edited passage: "+x.id);
  return x;
 });
 return {lessons,report};
};
})();