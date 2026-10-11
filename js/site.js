(function(){
var b=document.querySelector('.menu-btn'),n=document.getElementById('menu');
if(b&&n){
  var set=function(o){n.classList.toggle('open',o);b.setAttribute('aria-expanded',o);b.textContent=o?'Fechar':'Menu'};
  b.addEventListener('click',function(){set(!n.classList.contains('open'))});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&n.classList.contains('open')){set(false);b.focus()}});
}
var m=document.querySelector('[data-map]');
if(m){m.querySelector('button').addEventListener('click',function(){
  var f=document.createElement('iframe');f.src=m.getAttribute('data-map');f.title='Mapa com a localização da Dentallys';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';
  m.textContent='';m.classList.add('loaded');m.appendChild(f)})}
var r=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');o.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  r.forEach(function(el){o.observe(el)});
}else r.forEach(function(el){el.classList.add('is-in')});
})();
