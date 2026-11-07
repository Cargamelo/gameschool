(()=>{
  'use strict';
  // External Genially games are loaded only after an explicit click.
  const dialog=document.getElementById('game-viewer');
  const frame=document.getElementById('viewer-frame');
  const title=document.getElementById('viewer-title');
  const external=document.getElementById('viewer-external');
  const back=document.getElementById('back-to-games');
  let lastTrigger=null;
  const gameHosts=new Set(['view.genially.com']);
  document.querySelectorAll('.launch-game').forEach(button=>{
    button.addEventListener('click',()=>{
      const gameUrl=button.dataset.gameUrl;
      let url;
      try{url=new URL(gameUrl);}catch{return;}
      if(url.protocol!=='https:' || !gameHosts.has(url.hostname))return;
      if(typeof dialog.showModal!=='function'){
        window.open(url.href,'_blank','noopener,noreferrer');
        return;
      }
      lastTrigger=button;
      title.textContent=button.dataset.gameTitle||'Juego de repaso';
      frame.title=title.textContent;
      external.href=url.href;
      dialog.showModal();
      document.body.classList.add('game-open');
      frame.src=url.href;
    });
  });
  back.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{
    frame.removeAttribute('src');
    document.body.classList.remove('game-open');
    if(lastTrigger)lastTrigger.focus({preventScroll:true});
  });
  // Native dialog cancel handles Escape; we do not override its accessible behavior.

  // Two additions and three subtractions, each with at least one carried/borrowed digit.
  const problemsNode=document.getElementById('problems');
  const status=document.getElementById('math-feedback');
  const form=document.getElementById('math-form');
  let current=[];
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  function addition(){
    for(let i=0;i<400;i++){
      const a=rand(150,690),b=rand(110,299);
      if(a+b>999)continue;
      if((a%10+b%10>=10)||((Math.floor(a/10)%10)+(Math.floor(b/10)%10)>=10))return{a,b,op:'+',value:a+b};
    }
    return{a:267,b:158,op:'+',value:425};
  }
  function subtraction(){
    for(let i=0;i<400;i++){
      const a=rand(400,930),b=rand(115,a-90);
      if((a%10<b%10)||((Math.floor(a/10)%10)<(Math.floor(b/10)%10)))return{a,b,op:'−',value:a-b};
    }
    return{a:532,b:178,op:'−',value:354};
  }
  function newRound(){
    current=[addition(),addition(),subtraction(),subtraction(),subtraction()];
    problemsNode.replaceChildren();
    current.forEach((q,i)=>{
      const item=document.createElement('div');item.className='problem';
      const label=document.createElement('label');label.htmlFor='answer-'+i;label.textContent=`${i+1}.  ${q.a} ${q.op} ${q.b} =`;
      const input=document.createElement('input');
      input.id='answer-'+i;input.type='text';input.inputMode='numeric';input.autocomplete='off';input.maxLength=4;
      input.setAttribute('aria-label',`Resultado de ${q.a} ${q.op} ${q.b}`);
      item.append(label,input);problemsNode.appendChild(item);
    });
    status.textContent='Completa las cinco operaciones y comprueba tus resultados.';
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    let correct=0;const errors=[];
    current.forEach((q,i)=>{
      const input=document.getElementById('answer-'+i);
      const answer=input.value.trim();
      const right=/^\d{1,4}$/.test(answer) && Number(answer)===q.value;
      input.classList.toggle('right',right);
      input.classList.toggle('wrong',!right);
      input.setAttribute('aria-invalid',String(!right));
      input.title=right?'Correcto':`Resultado correcto: ${q.value}`;
      if(right)correct++;else errors.push(`${i+1}: ${q.value}`);
    });
    status.textContent=correct===5
      ? '¡Muy bien! Has acertado las cinco operaciones.'
      : `Has acertado ${correct} de 5. Comprueba estas soluciones (operación: resultado): ${errors.join(' · ')}.`;
  });
  document.getElementById('new-math').addEventListener('click',newRound);
  newRound();

  const summary=[
    '3.º C · CONTROLES DEL 10 Y 12 DE NOVIEMBRE DE 2026',
    '',
    'MARTES 10 · LENGUA: separar palabras en sílabas, clasificarlas por número de sílabas e identificar la sílaba tónica y las átonas.',
    '',
    'JUEVES 12 · MATEMÁTICAS: 2 sumas con llevadas y 3 restas con llevadas.',
    '',
    'Los cuatro Genially son juegos de repaso. El mensaje del profesor no los indica como deberes obligatorios. Se comenzarán a aprender las reglas de acentuación, pero no constan como contenido del control.',
    '',
    'Acceso: https://cargamelo.github.io/gameschool/3c/'
  ].join('\n');
  const copied=document.getElementById('copy-feedback');
  document.getElementById('copy-summary').addEventListener('click',async()=>{
    try{
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(summary);}
      else{
        const area=document.createElement('textarea');area.value=summary;
        area.style.cssText='position:fixed;left:-9999px;top:-9999px';document.body.appendChild(area);
        area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw Error('Copy refused');
      }
      copied.textContent='Aviso copiado. Ya puedes pegarlo en WhatsApp.';
    }catch{copied.textContent='El navegador no ha permitido copiarlo automáticamente. Puedes seleccionar el texto de esta página.';}
  });
  document.getElementById('print-summary').addEventListener('click',()=>window.print());
})();
