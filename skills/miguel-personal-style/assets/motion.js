/** Small, opt-in native UI motion. No dependency or continuous render loop. */
export function createMotion({root=document.documentElement}={}) {
  const doc=root.ownerDocument,win=doc.defaultView;
  const preference=win.matchMedia('(prefers-reduced-motion: reduce)');
  const active=new Map(),cleanups=[],settlers=new Set();
  let input='keyboard',destroyed=false;
  root.classList.add('mcc-motion');root.dataset.mccInput=input;
  const ease=win.getComputedStyle(root).getPropertyValue('--mcc-ease-out').trim()||'cubic-bezier(.23,1,.32,1)';
  function listen(target,event,handler,options) {target.addEventListener(event,handler,options);cleanups.push(()=>target.removeEventListener(event,handler,options));}
  function modality(value) {input=value;root.dataset.mccInput=value;}
  listen(doc,'pointerdown',()=>modality('pointer'),true);
  listen(doc,'keydown',()=>{modality('keyboard');settle();},true);
  function cancel(element) {active.get(element)?.cancel();active.delete(element);}
  function settle() {for(const animation of active.values())animation.cancel();active.clear();for(const finish of settlers)finish();}
  listen(preference,'change',settle);
  function instant(origin=input) {return destroyed||origin==='keyboard';}
  async function tween(element,from,to,duration=180,{origin=input,persist=false,layout=false}={}) {
    const current=active.has(element)?win.getComputedStyle(element):null;
    if(current)from=layout?{height:current.height,opacity:current.opacity}:{opacity:current.opacity,transform:current.transform};
    cancel(element);
    if(instant(origin))return true;
    const reduced=preference.matches;
    if(reduced) {from={opacity:from.opacity??1};to={opacity:to.opacity??1};}
    const animation=element.animate([from,to],{duration:reduced?80:duration,easing:ease,fill:persist?'forwards':'none'});
    active.set(element,animation);
    try {await animation.finished;return true;}catch{return false;}
    finally {if(active.get(element)===animation&&!persist){active.delete(element);animation.cancel();}}
  }
  function enter(element,{duration=180,offset=4,scale,origin=input}={}) {
    return tween(element,{opacity:0,transform:scale?`scale(${scale})`:`translateY(${offset}px)`},{opacity:1,transform:'none'},duration,{origin});
  }
  function exit(element,{duration=120,offset=4,origin=input}={}) {
    return tween(element,{opacity:1,transform:'none'},{opacity:0,transform:`translateY(${offset}px)`},duration,{origin,persist:true});
  }
  function bindDialog(dialog) {
    dialog.classList.add('mcc-dialog');let generation=0,closing=false,returnFocus=null;
    function finish() {generation++;cancel(dialog);if(closing){dialog.close();closing=false;}dialog.removeAttribute('data-mcc-closing');}
    settlers.add(finish);
    function open() {
      generation++;closing=false;returnFocus=doc.activeElement;
      dialog.removeAttribute('data-mcc-closing');dialog.dataset.mccVisible='false';
      if(!dialog.open)dialog.showModal();void dialog.offsetWidth;dialog.dataset.mccVisible='true';
      enter(dialog,{scale:.97,duration:240});
    }
    async function close({immediate=false}={}) {
      if(!dialog.open)return;
      const ticket=++generation,origin=immediate?'keyboard':input;closing=true;
      dialog.dataset.mccVisible='false';dialog.setAttribute('data-mcc-closing','');
      const finished=await tween(dialog,{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.97)'},180,{origin,persist:true});
      if(ticket!==generation||!finished)return;
      dialog.close();closing=false;cancel(dialog);dialog.removeAttribute('data-mcc-closing');
      if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    }
    listen(dialog,'cancel',event=>{event.preventDefault();modality('keyboard');close({immediate:true});});
    listen(dialog,'close',()=>{generation++;closing=false;cancel(dialog);dialog.dataset.mccVisible='false';dialog.removeAttribute('data-mcc-closing');});
    return {open,close};
  }
  function bindToast(host,{duration=3200}={}) {
    host.classList.add('mcc-toast');let timer,exitTimer,generation=0,origin='keyboard',remaining=duration,deadline=0,hovered=false,ticking=false;
    function clear() {clearTimeout(timer);clearTimeout(exitTimer);ticking=false;}
    function dismiss() {
      clearTimeout(timer);ticking=false;const ticket=++generation;
      const delay=instant(origin)?0:preference.matches?80:160;
      host.toggleAttribute('data-mcc-instant',delay===0);host.style.transitionDuration=`${delay}ms`;host.dataset.mccVisible='false';
      exitTimer=setTimeout(()=>{if(ticket===generation)host.textContent='';},delay);
    }
    function schedule() {clearTimeout(timer);if(hovered||doc.hidden)return;deadline=win.performance.now()+remaining;ticking=true;timer=setTimeout(dismiss,remaining);}
    function pause() {if(!host.textContent||!ticking)return;remaining=Math.max(0,deadline-win.performance.now());clearTimeout(timer);ticking=false;}
    function show(message) {
      clear();generation++;origin=input;remaining=duration;
      host.toggleAttribute('data-mcc-instant',instant(origin));host.style.transitionDuration=`${instant(origin)?0:preference.matches?80:200}ms`;
      if(!host.textContent){host.dataset.mccVisible='false';host.textContent=message;void host.offsetWidth;}else host.textContent=message;
      host.dataset.mccVisible='true';schedule();
    }
    listen(host,'pointerenter',()=>{hovered=true;pause();});listen(host,'pointerleave',()=>{hovered=false;schedule();});
    listen(doc,'visibilitychange',()=>{if(doc.hidden)pause();else if(host.textContent)schedule();});
    settlers.add(()=>{host.setAttribute('data-mcc-instant','');if(host.dataset.mccVisible==='false'){clear();host.textContent='';}});
    cleanups.push(()=>{clear();host.textContent='';});return {show,dismiss};
  }
  function bindDisclosure(details) {
    const summary=details.querySelector('summary');
    const content=doc.createElement('div');content.className='mcc-disclosure-content';
    for(const child of [...details.childNodes])if(child!==summary)content.append(child);
    details.append(content);let generation=0,target=details.open;
    function finish() {generation++;cancel(content);details.open=target;content.style.overflow='';summary.removeAttribute('aria-expanded');}
    settlers.add(finish);
    listen(summary,'click',async event=>{
      event.preventDefault();const origin=event.detail===0?'keyboard':input;target=!target;const ticket=++generation;
      summary.setAttribute('aria-expanded',String(target));
      if(instant(origin)){finish();return;}
      const fromHeight=details.open?content.getBoundingClientRect().height:0;
      const fromOpacity=details.open?win.getComputedStyle(content).opacity:0;
      details.open=true;content.style.overflow='hidden';
      const height=content.scrollHeight;
      const done=await tween(content,{height:`${fromHeight}px`,opacity:fromOpacity},{height:`${target?height:0}px`,opacity:target?1:0},180,{origin,layout:true,persist:true});
      if(ticket===generation&&done)finish();
    });
    cleanups.push(()=>{finish();content.replaceWith(...content.childNodes);});
  }
  function reserveSlot(slot,first,second) {
    slot.classList.add('mcc-slot');let largest=0;
    function measure() {for(const child of [first,second])if(!child.hidden)largest=Math.max(largest,child.getBoundingClientRect().height);slot.style.setProperty('--mcc-slot-height',`${Math.ceil(largest)}px`);}
    const observer=new win.ResizeObserver(measure);observer.observe(first);observer.observe(second);measure();cleanups.push(()=>observer.disconnect());
    return measure;
  }
  function destroy() {if(destroyed)return;settle();destroyed=true;for(const cleanup of cleanups)cleanup();root.classList.remove('mcc-motion');delete root.dataset.mccInput;}
  return {enter,exit,cancel,bindDialog,bindToast,bindDisclosure,reserveSlot,destroy,get input(){return input;},get reduced(){return preference.matches;}};
}
