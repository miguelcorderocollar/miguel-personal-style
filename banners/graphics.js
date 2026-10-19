// Original procedural banner artwork. Fixed geometry, no random or animated state.
const banner=document.querySelector('.banner');
const kind=banner.dataset.banner;
const styles=getComputedStyle(banner),ink=styles.getPropertyValue('--mcc-ink').trim(),accent=styles.getPropertyValue('--mcc-accent').trim(),rule=styles.getPropertyValue('--mcc-rule').trim();
const rect=(x,y,w,h,fill,opacity=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
const circle=(x,y,r,fill,opacity=1)=>`<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="${fill}" opacity="${opacity}"/>`;
let marks='';
if(kind==='identity'){
  const cx=1110,cy=350,R=230,step=7;
  for(let y=-R;y<=R;y+=step)for(let x=-R;x<=R;x+=step){
    const q=(x*x+y*y)/(R*R);if(q>1)continue;
    const z=Math.sqrt(1-q),light=Math.max(0,-.45*x/R-.55*y/R+.65*z);
    const radius=.40+2.75*Math.pow(1-light,1.05);
    const orange=x>130&&y>60&&x+y>260;
    marks+=circle(cx+x,cy+y,radius,orange?accent:ink);
  }
  marks+=`<path d="M858 161h-17v17M1355 524v17h-17" fill="none" stroke="${rule}"/>`;
  for(const [x,y,s,o]of[[1255,549,23,1],[1278,526,23,1],[1301,503,23,1],[1324,480,23,1],[1324,526,11,.4],[1360,503,11,.25]])marks+=rect(x,y,s,s,accent,o);
  marks+=`<text x="1350" y="116" text-anchor="end" fill="${ink}" font-family="JetBrains Mono" font-size="10" letter-spacing="1">FORM / 01</text>`;
}
if(kind==='components'){
  // A large open pixel square, a stepped trail and a final solid signal.
  const x=790,y=127,s=37,gap=10;
  const cells=[[0,0,.18],[1,0,.4],[2,0,.7],[2,1,1],[2,2,.7],[1,2,.4],[0,2,.18],[0,1,.12]];
  for(const [c,r,o]of cells)marks+=rect(x+c*(s+gap),y+r*(s+gap),s,s,accent,o);
  marks+=`<path d="M964 195h98M1054 187l8 8-8 8" fill="none" stroke="${rule}"/>`;
  for(let i=0;i<4;i++)marks+=rect(1100+i*42,248-i*37,30,30,accent,.24+i*.25);
  marks+=rect(1298,118,9,9,ink);
  marks+=`<g fill="${ink}" font-family="JetBrains Mono" font-size="10" letter-spacing="1"><text x="790" y="325">WAIT</text><text x="1100" y="325">CHANGE</text><text x="1294" y="325" text-anchor="end">READY</text></g>`;
  marks+=`<path d="M745 109v225" stroke="${rule}"/>`;
}
if(kind==='light'){
  const cx=1083,cy=230,outer=140;
  for(let y=-outer;y<=outer;y+=7)for(let x=-outer;x<=outer;x+=7){
    const r=Math.hypot(x,y),angle=Math.atan2(y,x);if(r>outer||r<72)continue;
    const tone=.25+.75*(.5+.5*Math.cos(angle+.8));
    marks+=circle(cx+x,cy+y,2.6*tone,ink);
  }
  marks+=`<path d="M799 122v195M790 131h18M790 307h18" stroke="${rule}" fill="none"/>`;
  for(const [x,y,size]of[[1216,283,22],[1238,261,22],[1260,239,22],[1282,217,22],[1282,261,11]])marks+=rect(x,y,size,size,accent);
  marks+=`<path d="M1066 227h34m-17-17v34" stroke="${accent}" stroke-width="2"/>`;
}
if(kind==='motion'){
  // Each column samples the same wave. Orange describes one passing band.
  for(let x=745;x<1400;x+=8)for(let row=-10;row<=10;row++){
    const center=224+45*Math.sin((x-745)/78),y=center+row*7;
    const taper=Math.pow(1-Math.abs(row)/11,.8),r=.35+2.2*taper;
    const colour=x>1064&&x<1128?accent:ink;
    marks+=circle(x,y,r,colour,.35+.65*taper);
  }
  marks+=`<path d="M798 117h196m-9-6 9 6-9 6" fill="none" stroke="${rule}"/><path d="M1150 323h172m-9-6 9 6-9 6" fill="none" stroke="${rule}"/>`;
  marks+=rect(1090,98,8,8,accent);
}
document.querySelector('.art').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 ${kind==='identity'?720:440}" aria-hidden="true">${marks}</svg>`;
window.__ready=Promise.all([500,600,800].map(weight=>document.fonts.load(`${weight} 16px "JetBrains Mono"`))).then(()=>document.fonts.ready);
