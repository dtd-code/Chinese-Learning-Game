/* Sixth-grade deep editorial review: 40 revised passages, 200 comprehension questions.
   Only grade-six records are updated; grades four and five are preserved. */
(function(){
"use strict";
const patches=window.P6_DEEP_REVIEW||{};
const bank=window.READ_AUDITED_LESSONS||[];
const sixth=bank.filter(row=>row.grade===6);
if(sixth.length!==40||Object.keys(patches).length!==40||
   sixth.some(row=>!patches[row.id])){
 console.error("P6 review incomplete; existing reading bank retained.");
 return;
}
let count=0;
const next=[];
for(let i=0;i<bank.length;i++){
 const row=bank[i];
 if(row.grade!==6){next.push(row);continue;}
 const patch=patches[row.id];
 if(!Array.isArray(patch.s)||patch.s.length!==3||
   patch.s.some(p=>typeof p!=="string"||!p.trim())||
   !Array.isArray(patch.q)||patch.q.length!==5){
  console.error("Invalid P6 story or question structure:",row.id);return;
 }
 const questions=[];
 for(let j=0;j<5;j++){
  const q=patch.q[j];
  if(!Array.isArray(q)||q.length!==4||q.some(s=>typeof s!=="string"||!s.trim())
     ||!q[0].endsWith("？")||new Set(q.slice(1)).size!==3){
   console.error("Invalid P6 question:",row.id,j);return;
  }
  const lens=q.slice(1).map(s=>Array.from(s).length);
  if(Math.max(...lens)-Math.min(...lens)>4){
   console.error("P6 answer lengths unbalanced:",row.id,j);return;
  }
  const answer=(i+j*7+Math.floor(i/3)*j)%3;
  const wrong=[q[2],q[3]];
  if((i+j)%2)wrong.reverse();
  const choices=Array(3);
  choices[answer]=q[1];
  let n=0;for(let k=0;k<3;k++)if(k!==answer)choices[k]=wrong[n++];
  questions.push([q[0],choices,answer,
    "参考答案："+q[1]+"。请回到短文，比较选项与具体情节、线索和人物反应是否一致。"]);
  count++;
 }
 next.push({...row,title:patch.t||row.title,story:patch.s,questions});
}
window.READ_AUDITED_LESSONS=next;
window.P6_DEEP_QA={passages:sixth.length,questions:count,rewrittenPassages:sixth.length};
})();
