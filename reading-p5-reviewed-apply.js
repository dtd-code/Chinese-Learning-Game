/* P5 editorial review integration: 40 passages, 200 custom comprehension questions.
   Keep original P4 and P6 lesson records untouched. */
(function(){
"use strict";
const updates=window.P5_CONTENT_REVISIONS||{};
const bank=window.READ_AUDITED_LESSONS||[];
const expected=bank.filter(x=>x.grade===5);
if(expected.length!==40||Object.keys(updates).length!==40){
 console.error("P5 editorial review incomplete; original lesson bank left unchanged.");
 return;
}
const permutations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
const prepared=[];
for(let i=0;i<bank.length;i++){
 const old=bank[i],patch=updates[old.id];
 if(old.grade!==5){prepared.push(old);continue;}
 if(!patch||!Array.isArray(patch.q)||patch.q.length!==5){
  console.error("Missing five-question review:",old.id);
  return;
 }
 const questions=patch.q.map((raw,j)=>{
  const [question,a,b,c,correct]=raw,answers=[a,b,c];
  if(typeof question!=="string"||answers.some(s=>typeof s!=="string"||!s.trim())||
     new Set(answers).size!==3||![0,1,2].includes(correct)){
   throw Error("Invalid reviewed P5 question: "+old.id+" #"+(j+1));
  }
  const lens=answers.map(s=>Array.from(s).length);
  if(Math.max(...lens)-Math.min(...lens)>4){
   throw Error("P5 choices too different in length: "+old.id+" #"+(j+1));
  }
  const code=Array.from(old.id).reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
  const order=permutations[(code+j*7+i*11)%6];
  const arranged=order.map(k=>answers[k]);
  const answer=order.indexOf(correct);
  return [question,arranged,answer,"正确答案："+answers[correct]+"。请根据短文中的内容判断。"];
 });
 prepared.push({...old,story:patch.s||old.story,questions});
}
window.READ_AUDITED_LESSONS=prepared;
window.P5_EDITORIAL_QA={passages:expected.length,questions:expected.length*5,changedStories:expected.filter(x=>!!updates[x.id].s).length};
})();
