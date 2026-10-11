(function(){
var d=document,h=d.documentElement;
// Abertura de marca
var intro=d.getElementById('intro');
if(intro&&h.classList.contains('intro-on')){
  var parts=[d.querySelector('.site-header'),d.getElementById('conteudo'),d.querySelector('.site-footer'),d.querySelector('.dock')];
  parts.forEach(function(p){p&&p.setAttribute('inert','')});
  d.body.style.overflow='hidden';
  var skip=intro.querySelector('button');skip.focus();
  var done=false,end=function(){if(done)return;done=true;intro.classList.add('out');
    setTimeout(function(){h.classList.remove('intro-on');intro.remove();d.body.style.overflow='';parts.forEach(function(p){p&&p.removeAttribute('inert')})},500)};
  intro.addEventListener('click',end);d.addEventListener('keydown',function(e){if(e.key==='Escape')end()});
  setTimeout(end,2400);
}else if(intro){intro.remove()}
// Menu
var b=d.querySelector('.menu-btn'),n=d.getElementById('menu');
if(b&&n){var set=function(o){n.classList.toggle('open',o);b.setAttribute('aria-expanded',o);b.textContent=o?'Fechar':'Menu'};
  b.addEventListener('click',function(){set(!n.classList.contains('open'))});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&n.classList.contains('open')){set(false);b.focus()}})}
// Cabeçalho com sombra ao rolar e revelar seções
var hd=d.querySelector('.site-header'),rv=[].slice.call(d.querySelectorAll('.reveal'));
var tick=function(){hd&&hd.classList.toggle('scrolled',scrollY>8);var lim=innerHeight*.92;
  rv=rv.filter(function(el){if(el.getBoundingClientRect().top<lim){el.classList.add('is-in');return false}return true})};
addEventListener('scroll',function(){requestAnimationFrame(tick)},{passive:true});
addEventListener('load',tick);addEventListener('hashchange',function(){rv.forEach(function(el){el.classList.add('is-in')});rv=[]});
if(location.hash){rv.forEach(function(el){el.classList.add('is-in')});rv=[]}
tick();
// Aberto agora (horário de Lages)
var chips=d.querySelectorAll('[data-status]');
if(chips.length){
  var p={};new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
  var wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),m=+p.hour*60+ +p.minute,s,t;
  if(wd>=1&&wd<=5&&m>=540&&m<720){s='open';t='Aberto agora · atende até 12h'}
  else if(wd>=1&&wd<=5&&m>=720&&m<840){s='break';t='Intervalo · volta às 14h'}
  else if(wd>=1&&wd<=5&&m>=840&&m<1170){s='open';t='Aberto agora · atende até 19h30'}
  else{s='closed';t=(wd>=1&&wd<=5&&m<540)?'Fechado agora · abre hoje às 9h':(wd>=1&&wd<=4)?'Fechado agora · abre amanhã às 9h':'Fechado agora · abre segunda às 9h'}
  chips.forEach(function(c){c.setAttribute('data-state',s);c.querySelector('.st').textContent=t});
}
// Mapa só após clique
var mp=d.querySelector('[data-map]');
if(mp){mp.querySelector('button').addEventListener('click',function(){var f=d.createElement('iframe');f.src=mp.getAttribute('data-map');f.title='Mapa com a localização da Dentallys';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';mp.textContent='';mp.appendChild(f)})}
// Vídeo da hero (só com data-video)
var v=d.querySelector('[data-video]'),cn=navigator.connection;
if(v&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(cn&&cn.saveData)){var img=v.querySelector('img'),vd=d.createElement('video');
  vd.muted=vd.loop=vd.playsInline=vd.autoplay=true;vd.preload='metadata';vd.poster=img.currentSrc||img.src;vd.src=v.getAttribute('data-video');vd.setAttribute('aria-hidden','true');img.replaceWith(vd)}
})();
