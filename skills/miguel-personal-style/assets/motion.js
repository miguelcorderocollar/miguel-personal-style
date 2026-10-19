/** Small, opt-in native UI motion. No dependency or continuous render loop. */
export function createMotion({root=document.documentElement}={}) {
  const doc=root.ownerDocument,win=doc.defaultView;
  const preference=win.matchMedia('(prefers-reduced-motion: reduce)');
  const active=new Map(),cleanups=[],settlers=new Set();
  let input='keyboard',destroyed=false,interacted=false;
  root.classList.add('mcc-motion');root.dataset.mccInput=input;
  const ease=win.getComputedStyle(root).getPropertyValue('--mcc-ease-out').trim()||'cubic-bezier(.23,1,.32,1)';
  function listen(target,event,handler,options) {target.addEventListener(event,handler,options);cleanups.push(()=>target.removeEventListener(event,handler,options));}
  function modality(value) {input=value;interacted=true;root.dataset.mccInput=value;}
  listen(doc,'pointerdown',()=>modality('pointer'),true);
  listen(doc,'keydown',()=>{modality('keyboard');settle();},true);
  function cancel(element) {active.get(element)?.cancel();active.delete(element);}
  function settle() {for(const animation of active.values())animation.cancel();active.clear();for(const finish of settlers)finish();}
  listen(preference,'change',settle);
  function instant(origin=input) {return destroyed||origin==='keyboard';}
  async function tween(element,from,to,duration=180,{origin=input,persist=false,layout=false,delay=0,easing=ease}={}) {
    const current=active.has(element)?win.getComputedStyle(element):null;
    if(current)from=layout?{height:current.height,opacity:current.opacity}:{opacity:current.opacity,transform:current.transform};
    cancel(element);
    if(instant(origin))return true;
    const reduced=preference.matches;
    if(reduced) {from={opacity:from.opacity??1};to={opacity:to.opacity??1};}
    const animation=element.animate([from,to],{duration:reduced?80:duration,delay:reduced?0:delay,easing,fill:persist?'forwards':delay?'backwards':'none'});
    active.set(element,animation);
    try {await animation.finished;return true;}catch{return false;}
    finally {if(active.get(element)===animation&&!persist){active.delete(element);animation.cancel();}}
  }
  function enter(element,{duration=180,offset=4,scale,origin=input,delay=0}={}) {
    return tween(element,{opacity:0,transform:scale?`scale(${scale})`:`translateY(${offset}px)`},{opacity:1,transform:'none'},duration,{origin,delay});
  }
  function exit(element,{duration=120,offset=4,origin=input}={}) {
    return tween(element,{opacity:1,transform:'none'},{opacity:0,transform:`translateY(${offset}px)`},duration,{origin,persist:true});
  }
  function bindDialog(dialog,{placement='center'}={}) {
    const sheet=placement==='right',drawerEase='cubic-bezier(.32,.72,0,1)';
    dialog.classList.add('mcc-dialog');if(sheet)dialog.classList.add('mcc-dialog-sheet');
    let generation=0,closing=false,returnFocus=null;
    function finish() {generation++;cancel(dialog);if(closing){dialog.close();closing=false;}dialog.removeAttribute('data-mcc-closing');}
    settlers.add(finish);
    function open() {
      generation++;closing=false;returnFocus=doc.activeElement;
      dialog.removeAttribute('data-mcc-closing');dialog.dataset.mccVisible='false';
      if(!dialog.open)dialog.showModal();void dialog.offsetWidth;dialog.dataset.mccVisible='true';
      if(sheet)tween(dialog,{opacity:0,transform:'translateX(100%)'},{opacity:1,transform:'none'},280,{easing:drawerEase});
      else enter(dialog,{scale:.97,duration:240});
    }
    async function close({immediate=false}={}) {
      if(!dialog.open)return;
      const ticket=++generation,origin=immediate?'keyboard':input;closing=true;
      dialog.dataset.mccVisible='false';dialog.setAttribute('data-mcc-closing','');
      const finished=await tween(dialog,{opacity:1,transform:sheet?'none':'scale(1)'},{opacity:0,transform:sheet?'translateX(100%)':'scale(.97)'},sheet?200:180,{origin,persist:true,easing:sheet?drawerEase:ease});
      if(ticket!==generation||!finished)return;
      dialog.close();closing=false;cancel(dialog);dialog.removeAttribute('data-mcc-closing');
      if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    }
    listen(dialog,'cancel',event=>{event.preventDefault();modality('keyboard');close({immediate:true});});
    listen(dialog,'close',()=>{generation++;closing=false;cancel(dialog);dialog.dataset.mccVisible='false';dialog.removeAttribute('data-mcc-closing');});
    cleanups.push(()=>{if(dialog.open)dialog.close();if(sheet)dialog.classList.remove('mcc-dialog-sheet');});
    return {open,close};
  }
  function bindPopover(popover,trigger) {
    if(typeof popover.showPopover!=='function')return null;
    if(!popover.id)throw new TypeError('A popover needs an id.');
    const originalStyle=popover.getAttribute('style');
    const attributes=new Map(['popovertarget','aria-controls','aria-expanded'].map(name=>[name,trigger.getAttribute(name)]));
    popover.classList.add('mcc-popover');trigger.setAttribute('popovertarget',popover.id);trigger.setAttribute('aria-controls',popover.id);trigger.setAttribute('aria-expanded','false');
    const isOpen=()=>popover.matches(':popover-open');
    function place(){
      const rect=trigger.getBoundingClientRect(),width=popover.offsetWidth,height=popover.offsetHeight,gap=8,margin=16;
      const left=Math.max(margin,Math.min(rect.left,win.innerWidth-width-margin));
      const above=rect.bottom+gap+height>win.innerHeight-margin&&rect.top>height+gap;
      const top=Math.max(margin,Math.min(above?rect.top-height-gap:rect.bottom+gap,win.innerHeight-height-margin));
      popover.style.left=`${left}px`;popover.style.top=`${top}px`;popover.style.transformOrigin=`${Math.max(0,Math.min(width,rect.left+rect.width/2-left))}px ${above?'100%':'0%'}`;
    }
    function open(){popover.showPopover({source:trigger});place();trigger.setAttribute('aria-expanded','true');}
    function close(){if(isOpen())popover.hidePopover();trigger.setAttribute('aria-expanded','false');}
    listen(trigger,'click',event=>{event.preventDefault();if(isOpen())close();else open();});
    listen(popover,'toggle',()=>{trigger.setAttribute('aria-expanded',String(isOpen()));if(isOpen())place();});
    listen(win,'resize',()=>{if(isOpen())place();});
    listen(doc,'scroll',event=>{if(isOpen()&&!popover.contains(event.target))close();},true);
    cleanups.push(()=>{close();popover.classList.remove('mcc-popover');if(originalStyle===null)popover.removeAttribute('style');else popover.setAttribute('style',originalStyle);for(const [name,value]of attributes){if(value===null)trigger.removeAttribute(name);else trigger.setAttribute(name,value);}});
    return {open,close};
  }
  function bindPresence(element) {
    const originalInert=element.inert;let visible=!element.hidden,generation=0;
    function finish(){generation++;cancel(element);element.hidden=!visible;element.inert=visible?originalInert:true;}
    settlers.add(finish);cleanups.push(()=>{finish();element.inert=originalInert;});
    function show(){visible=true;generation++;element.hidden=false;element.inert=originalInert;return enter(element,{duration:180,offset:6});}
    async function hide({focusTarget}={}){visible=false;const ticket=++generation;if(element.contains(doc.activeElement))focusTarget?.focus({preventScroll:true});element.inert=true;await exit(element,{duration:160,offset:-4});if(ticket===generation){element.hidden=true;cancel(element);}}
    return {show,hide,get visible(){return visible;}};
  }
  function bindHold(button,{onConfirm,confirmKeyboard=()=>win.confirm('Confirm this action?'),duration=2000}={}) {
    if(typeof onConfirm!=='function')throw new TypeError('Hold confirmation needs an onConfirm callback.');
    const fill=doc.createElement('span');fill.className='mcc-hold-fill';fill.setAttribute('aria-hidden','true');button.prepend(fill);button.classList.add('mcc-hold');
    let pointer=null,timer,confirming=false;
    function release(){const id=pointer;pointer=null;if(id!==null&&button.hasPointerCapture(id))button.releasePointerCapture(id);}
    function reset({immediate=false}={}){clearTimeout(timer);release();button.removeAttribute('data-mcc-holding');fill.style.transitionDuration=immediate?'0ms':'200ms';fill.style.transitionTimingFunction=ease;fill.style.transform='scaleX(0)';}
    settlers.add(()=>reset({immediate:true}));
    listen(button,'pointerdown',event=>{
      if(event.button!==0||!event.isPrimary||pointer!==null||button.disabled||destroyed)return;
      pointer=event.pointerId;button.setPointerCapture(pointer);fill.style.transitionDuration='0ms';fill.style.transform='scaleX(0)';void fill.offsetWidth;
      fill.style.transitionDuration=`${duration}ms`;fill.style.transitionTimingFunction='linear';fill.style.transform='scaleX(1)';button.setAttribute('data-mcc-holding','');
      timer=setTimeout(()=>{if(pointer===null||button.disabled||destroyed||!button.isConnected||doc.hidden){reset({immediate:true});return;}release();button.removeAttribute('data-mcc-holding');onConfirm();},duration);
    });
    listen(button,'pointermove',event=>{if(event.pointerId!==pointer)return;const rect=button.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)reset();});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])listen(button,event,()=>{if(pointer!==null)reset();});
    listen(button,'contextmenu',event=>event.preventDefault());
    listen(button,'click',async event=>{event.preventDefault();if(event.detail!==0||confirming||button.disabled||destroyed)return;confirming=true;try{if(await confirmKeyboard())if(!destroyed&&button.isConnected&&!button.disabled)onConfirm();}finally{confirming=false;}});
    listen(doc,'visibilitychange',()=>{if(doc.hidden)reset({immediate:true});});listen(win,'blur',()=>reset({immediate:true}));
    cleanups.push(()=>{reset({immediate:true});fill.remove();button.classList.remove('mcc-hold');});
    return {reset,cancel:reset};
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
  function replace(element,update,options={}) {
    update();return enter(element,{duration:180,offset:4,...options});
  }
  const feedbackStates=new WeakMap();
  function feedback(label,text,{restoreAfter=1600}={}) {
    let state=feedbackStates.get(label);
    if(!state){state={original:label.textContent,timer:null};feedbackStates.set(label,state);cleanups.push(()=>{clearTimeout(state.timer);cancel(label);label.textContent=state.original;});}
    clearTimeout(state.timer);const origin=input;
    replace(label,()=>{label.textContent=text;},{duration:160,origin});
    state.timer=setTimeout(()=>replace(label,()=>{label.textContent=state.original;},{duration:160,origin}),restoreAfter);
  }
  function revealOnce(elements,{duration=240,offset=8,stagger=45}={}) {
    const targets=[...elements];
    const observer=new win.IntersectionObserver(entries=>{
      let index=0;
      for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);
        enter(entry.target,{duration,offset,delay:Math.min(index++*stagger,180),origin:interacted?input:'presentation'});
      }
    },{threshold:.12});
    targets.forEach(element=>observer.observe(element));cleanups.push(()=>observer.disconnect());
    return ()=>observer.disconnect();
  }
  function bindProgress(progress) {
    const shell=doc.createElement('span'),track=doc.createElement('span'),fill=doc.createElement('span');
    shell.className='mcc-progress-shell';track.className='mcc-progress-track';fill.className='mcc-progress-fill';track.setAttribute('aria-hidden','true');
    progress.before(shell);shell.append(progress,track);track.append(fill);progress.classList.add('mcc-progress-native');
    let mounted=false;
    function sync(){
      const ratio=progress.hasAttribute('value')?Math.max(0,Math.min(1,progress.value/progress.max)):null;
      const immediate=!mounted||instant()||preference.matches;
      fill.style.transitionDuration=immediate?'0ms':'200ms';
      fill.style.transform=`scaleX(${ratio??0})`;track.hidden=ratio===null;
      progress.classList.toggle('mcc-progress-native',ratio!==null);mounted=true;
    }
    const observer=new win.MutationObserver(sync);observer.observe(progress,{attributes:true,attributeFilter:['value','max']});sync();
    settlers.add(sync);
    cleanups.push(()=>{observer.disconnect();progress.classList.remove('mcc-progress-native');shell.replaceWith(progress);});
    return {sync};
  }
  function destroy() {if(destroyed)return;settle();destroyed=true;for(const cleanup of cleanups)cleanup();root.classList.remove('mcc-motion');delete root.dataset.mccInput;}
  return {enter,exit,replace,feedback,revealOnce,bindProgress,cancel,bindDialog,bindPopover,bindPresence,bindHold,bindToast,bindDisclosure,reserveSlot,destroy,get input(){return input;},get reduced(){return preference.matches;}};
}
