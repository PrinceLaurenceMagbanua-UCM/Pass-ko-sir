const $ = (id) => document.getElementById(id);
const toast = $('toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
function updateClock(){ $('clock').textContent=new Date().toLocaleTimeString([], {hour12:false}); }
updateClock();setInterval(updateClock,1000);
const navLinks=[...document.querySelectorAll('.nav-link')];
const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
window.addEventListener('scroll',()=>{let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<180)current=section;}navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+current.id));},{passive:true});
$('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');notify(document.body.classList.contains('light')?'Soft light mode enabled.':'Crimson archive restored.');});
$('runCode').addEventListener('click',()=>{$('terminalOutput').textContent='> Script executed. Progress is still in motion.';notify('A little reminder: keep going.');});
const seals=new Set();
function earnSeal(name){if(seals.has(name))return;seals.add(name);$(name+'Seal').textContent='✦ SEAL EARNED';$(name+'Seal').classList.add('earned');$('progressText').textContent=seals.size+' / 3 SEALS FOUND';$('progressBar').style.width=(seals.size/3*100)+'%';$('progressHint').textContent=seals.size===3?'All seals collected. The Keeper’s Trial is complete.':'Keep exploring — '+(3-seals.size)+' seal'+(seals.size===2?'s':'')+' remaining.';if(seals.size===3){$('finishTitle').textContent='The archive recognizes its Keeper.';$('finishText').textContent='You explored the records, completed the trials, and earned every seal. Thanks for staying a little longer.';notify('All three seals collected. Trial complete!');}else notify('A seal has been added to your archive.');}
const runeSymbols=['✦','◈','☾','⌘'];let sequence=[],runeInput=[],runeLocked=true,runeRound=0;
function showRunes(){const slots=[...document.querySelectorAll('#runeDisplay span')];slots.forEach((slot,i)=>{slot.textContent=sequence[i]||'?';slot.classList.toggle('lit',i<sequence.length);});}
function beginRune(){sequence=[];runeInput=[];runeRound=0;runeLocked=true;$('runeStatus').textContent='Watch carefully...';$('runeStart').disabled=true;nextRune();}
function nextRune(){sequence.push(Math.floor(Math.random()*4));showRunes();let index=0;const buttons=[...document.querySelectorAll('[data-rune]')];buttons.forEach(b=>b.disabled=true);const display=()=>{if(index>=sequence.length){runeLocked=false;buttons.forEach(b=>b.disabled=false);$('runeStatus').textContent='Your turn. Repeat the sequence.';return;}const target=buttons[sequence[index]];target.classList.add('active');$('runeDisplay').children[index].classList.add('lit');setTimeout(()=>{target.classList.remove('active');index++;display();},560);};display();}
$('runeStart').addEventListener('click',beginRune);
document.querySelectorAll('[data-rune]').forEach(button=>button.addEventListener('click',()=>{if(runeLocked||!sequence.length)return;const value=Number(button.dataset.rune);runeInput.push(value);const position=runeInput.length-1;if(sequence[position]!==value){runeLocked=true;runeInput=[];runeRound=0;$('runeStatus').textContent='Not quite. Reset the sequence and try again.';$('runeStart').disabled=false;document.querySelectorAll('[data-rune]').forEach(b=>b.disabled=true);return;}if(runeInput.length===sequence.length){runeRound++;if(runeRound>=3){runeLocked=true;$('runeStatus').textContent='Perfect recall. Three rounds complete.';$('runeStart').disabled=false;document.querySelectorAll('[data-rune]').forEach(b=>b.disabled=true);earnSeal('rune');}else{$('runeStatus').textContent='Correct! Round '+(runeRound+1)+' is longer.';runeInput=[];runeLocked=true;setTimeout(nextRune,700);}}}));
let reactionState='idle',reactionTimeout=null,reactionStarted=0;
function armReaction(){clearTimeout(reactionTimeout);reactionState='waiting';$('reactionOrb').className='reaction-orb';$('reactionOrb').querySelector('small').textContent='WAIT';$('reactionStatus').textContent='Wait for the glow...';$('reactionStart').disabled=true;reactionTimeout=setTimeout(()=>{if(reactionState!=='waiting')return;reactionState='ready';$('reactionOrb').classList.add('ready');$('reactionOrb').querySelector('small').textContent='CLICK';reactionStarted=performance.now();},1300+Math.random()*2600);}
$('reactionStart').addEventListener('click',armReaction);
$('reactionOrb').addEventListener('click',()=>{if(reactionState==='waiting'){clearTimeout(reactionTimeout);reactionState='idle';$('reactionOrb').classList.add('early');$('reactionOrb').querySelector('small').textContent='EARLY';$('reactionStatus').textContent='Too soon! Arm the orb and wait for the glow.';$('reactionStart').disabled=false;}else if(reactionState==='ready'){const elapsed=Math.round(performance.now()-reactionStarted);reactionState='done';$('reactionOrb').querySelector('small').textContent=elapsed+' ms';$('reactionStatus').textContent='Reaction time: '+elapsed+' ms. Nice timing!';$('reactionStart').disabled=false;earnSeal('reaction');}else{$('reactionStatus').textContent='Press ARM THE ORB to try again.';}});
const questions=[{q:'Which field is the Keeper studying?',a:['Graphic Design','Information Technology','Architecture'],correct:1},{q:'Which activity takes the Keeper beyond the screen?',a:['Hiking','Cooking','Skateboarding'],correct:0},{q:'What is the Keeper’s long-term goal?',a:['Become a professional athlete','Travel to the moon','Build a comfortable future'],correct:2}];let quizIndex=0,quizScore=0,quizLocked=false;
function renderQuestion(){const item=questions[quizIndex];$('quizCount').textContent='QUESTION '+(quizIndex+1)+' / 3';$('quizScore').textContent=quizScore+' CORRECT';$('quizQuestion').textContent=item.q;$('quizOptions').innerHTML=item.a.map((answer,index)=>'<button data-answer="'+index+'">'+answer+'</button>').join('');$('quizStatus').textContent='Choose an answer to continue.';quizLocked=false;document.querySelectorAll('#quizOptions button').forEach(button=>button.addEventListener('click',()=>answerQuiz(Number(button.dataset.answer))));}
function answerQuiz(choice){if(quizLocked)return;quizLocked=true;const item=questions[quizIndex];const buttons=[...document.querySelectorAll('#quizOptions button')];buttons.forEach((button,index)=>{button.disabled=true;if(index===item.correct)button.classList.add('correct');if(index===choice&&choice!==item.correct)button.classList.add('wrong');});if(choice===item.correct){quizScore++;$('quizStatus').textContent='Correct. The archive remembers.';}else{$('quizStatus').textContent='Not quite — the correct answer is highlighted.';}$('quizScore').textContent=quizScore+' CORRECT';setTimeout(()=>{quizIndex++;if(quizIndex<questions.length)renderQuestion();else{$('quizCount').textContent='TRIAL COMPLETE';$('quizQuestion').textContent='You answered '+quizScore+' out of 3 correctly.';$('quizOptions').innerHTML='';$('quizStatus').textContent=quizScore===3?'A perfect record.':'The records are open if you want to explore again.';if(quizScore>=2)earnSeal('quiz');else $('quizStatus').textContent+=' Earn at least 2 correct answers to earn the seal.';}},950);}
renderQuestion();
$('resetTrials').addEventListener('click',()=>{seals.clear();['rune','reaction','quiz'].forEach(name=>{$(name+'Seal').textContent='◇ SEAL NOT YET EARNED';$(name+'Seal').classList.remove('earned');});$('progressText').textContent='0 / 3 SEALS FOUND';$('progressBar').style.width='0%';$('progressHint').textContent='Complete any of the three activities to collect a seal.';$('finishTitle').textContent='Three trials. Three chances to explore.';$('finishText').textContent='Complete the activities to unlock the Keeper\'s final message.';sequence=[];runeInput=[];runeRound=0;runeLocked=true;showRunes();$('runeStatus').textContent='Press BEGIN to start the sequence.';$('runeStart').disabled=false;document.querySelectorAll('[data-rune]').forEach(b=>b.disabled=true);clearTimeout(reactionTimeout);reactionState='idle';$('reactionOrb').className='reaction-orb';$('reactionOrb').querySelector('small').textContent='WAIT';$('reactionStatus').textContent='Press ARM to prepare the test.';$('reactionStart').disabled=false;quizIndex=0;quizScore=0;renderQuestion();notify('Trial progress reset. Begin again anytime.');});
const roomRecords = {
  gaming: { label: 'ROOM 01 / GAME HALL', title: 'A world with another quest.', text: 'I enjoy exploring game worlds, learning how their systems work, and finding challenges that reward patience and practice.', fact: 'CURRENT INTEREST: SINGLE-PLAYER ADVENTURES' },
  reading: { label: 'ROOM 02 / READING NOOK', title: 'One more chapter.', text: 'Manga gives me a break from screens full of code and games. I like stories with memorable characters, interesting settings, and worlds worth discovering.', fact: 'CURRENT INTEREST: MANGA & FICTION' },
  trails: { label: 'ROOM 03 / TRAIL MAP', title: 'A different kind of adventure.', text: 'Hiking is a chance to step away from the computer, enjoy the outdoors, and see somewhere new. The journey matters as much as the destination.', fact: 'CURRENT INTEREST: OUTDOOR EXPLORATION' }
};
document.querySelectorAll('[data-room]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-room]').forEach(room => room.classList.remove('active'));
    button.classList.add('active');
    const record = roomRecords[button.dataset.room];
    $('roomLabel').textContent = record.label;
    $('roomTitle').textContent = record.title;
    $('roomText').textContent = record.text;
    $('roomFact').textContent = record.fact;
  });
});
const foundSigils = new Set();
document.querySelectorAll('[data-sigil]').forEach(button => {
  button.addEventListener('click', () => {
    const number = button.dataset.sigil;
    if (foundSigils.has(number)) return;
    foundSigils.add(number);
    button.classList.add('found');
    button.textContent = '✦';
    $('sigilCount').textContent = foundSigils.size + ' / 3 FOUND';
    $('sigilBar').style.width = (foundSigils.size / 3 * 100) + '%';
    if (foundSigils.size === 3) {
      $('sigilMessage').textContent = 'All three sigils found. You have a sharp eye, Keeper. Side quest complete!';
      notify('Secret side quest complete!');
    } else {
      $('sigilMessage').textContent = 'A sigil has been found. ' + (3 - foundSigils.size) + ' more to discover.';
      notify('Hidden sigil discovered.');
    }
  });
});
