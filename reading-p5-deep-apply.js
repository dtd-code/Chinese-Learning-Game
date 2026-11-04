/* P5 deep review – 40 individual narratives and 200 inferential questions.
   Only grade-five records are replaced. P4 and P6 remain unchanged. */
(function(){
"use strict";
const amendments=window.P5_DEEP_REVIEW||{};
const bank=window.READ_AUDITED_LESSONS||[];
const gradeFive=bank.filter(x=>x.grade===5);
if(gradeFive.length!==40||Object.keys(amendments).length!==40||
   gradeFive.some(x=>!amendments[x.id])){
 console.error("P5 deep review incomplete; original reading bank retained.");
 return;
}
const proposed=[];
let counter=0;
for(let i=0;i<bank.length;i++){
 const old=bank[i];
 if(old.grade!==5){proposed.push(old);continue;}
 const update=amendments[old.id];
 if(!Array.isArray(update.s)||update.s.length!==3||
    update.s.some(t=>typeof t!=="string"||!t.trim())||
    !Array.isArray(update.q)||update.q.length!==5){
  console.error("Malformed P5 revision:",old.id);return;
 }
 const questions=[];
 for(let j=0;j<5;j++){
  const entry=update.q[j];
  if(!Array.isArray(entry)||entry.length!==4||
     entry.some(t=>typeof t!=="string"||!t.trim())||
     new Set(entry.slice(1)).size!==3){
   console.error("Malformed P5 comprehension choices:",old.id,j);return;
  }
  const len=entry.slice(1).map(t=>Array.from(t).length);
  if(Math.max(...len)-Math.min(...len)>4){
   console.error("Unbalanced P5 comprehension choices:",old.id,j);return;
  }
  const answer=(i+j*7+Math.floor(i/3)*j)%3;
  const wrong=[entry[2],entry[3]];
  if((i+j)%2)wrong.reverse();
  const choices=Array(3);
  choices[answer]=entry[1];
  let n=0;
  for(let k=0;k<3;k++)if(k!==answer)choices[k]=wrong[n++];
  questions.push([entry[0],choices,answer,
    "参考答案："+entry[1]+"。请对照短文中的人物言行及前后情节。"]);
  counter++;
 }
 proposed.push({...old,title:update.t||old.title,story:update.s,questions});
}
window.READ_AUDITED_LESSONS=proposed;
window.P5_DEEP_QA={passages:gradeFive.length,questions:counter,rewrittenPassages:gradeFive.length};
})();
