/* Grade 6 editorial review integration: 40 passages, 200 balanced questions.
   Original P4 and P5 records are preserved. */
(function(){
"use strict";
const patch=window.P6_CONTENT_REVISIONS||{};
const original=window.READ_AUDITED_LESSONS||[];
const sixth=original.filter(row=>row.grade===6);
if(sixth.length!==40||Object.keys(patch).length!==40||
   sixth.some(row=>!patch[row.id])){
 console.error("P6 editorial patch is incomplete; lesson bank unchanged.");
 return;
}
const result=[];
let changed=0;
let questionCount=0;
for(let i=0;i<original.length;i++){
 const row=original[i];
 if(row.grade!==6){result.push(row);continue;}
 const edit=patch[row.id];
 if(!Array.isArray(edit.q)||edit.q.length!==5||
    (edit.s&&(!Array.isArray(edit.s)||edit.s.length!==3))){
  console.error("Invalid P6 review structure:",row.id);return;
 }
 const questions=[];
 for(let j=0;j<5;j++){
  const entry=edit.q[j];
  if(!Array.isArray(entry)||entry.length!==4)throw Error("Invalid P6 question: "+row.id+" "+j);
  const [stem,correct,wrong1,wrong2]=entry,options=[correct,wrong1,wrong2];
  if(typeof stem!=="string"||!stem.trim()||
     options.some(s=>typeof s!=="string"||!s.trim())||
     new Set(options).size!==3){
    throw Error("Invalid or ambiguous P6 question choices: "+row.id+" "+j);
  }
  const lengths=options.map(s=>Array.from(s).length);
  if(Math.max(...lengths)-Math.min(...lengths)>4){
    throw Error("Unbalanced P6 question choices: "+row.id+" "+j);
  }
  const correctIndex=(i+j*7+Math.floor(i/3)*j)%3;
  const others=(i+j)%2?[wrong2,wrong1]:[wrong1,wrong2];
  const rotated=Array(3);
  rotated[correctIndex]=correct;
  let k=0;
  for(let a=0;a<3;a++)if(a!==correctIndex)rotated[a]=others[k++];
  questions.push([stem,rotated,correctIndex,"正确答案："+correct+"。请根据短文中的情节与线索判断。"]);
  questionCount++;
 }
 if(edit.s)changed++;
 result.push({...row,title:edit.t||row.title,story:edit.s||row.story,questions});
}
window.READ_AUDITED_LESSONS=result;
window.P6_EDITORIAL_QA={passages:sixth.length,questions:questionCount,rewrittenPassages:changed};
})();
