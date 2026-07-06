const cards=document.querySelectorAll(".card");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";
entry.target.style.transform="translateY(0)";

}

});

});

cards.forEach(card=>{

card.style.opacity="0";
card.style.transform="translateY(50px)";
card.style.transition="1s";

observer.observe(card);

});

function showInfoMessage(text) {
  const msg = document.querySelector('.info-message');
  msg.textContent = text;
  msg.style.opacity = '1';
  msg.style.animation = 'bubbleBorder 6s linear infinite, bubbleFloat 5s ease-in-out forwards';
}
