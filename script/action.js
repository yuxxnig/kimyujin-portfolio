$('float_menu a').click(function(){
    let sectionTop = $(this).attr('href');
    $(window).animate({scrollTop:sectionTop})
})





gsap.registerPlugin(ScrollTrigger);

// 1) 새로고침 시 브라우저 스크롤 복원 방지
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const img = document.querySelector("#kimyujinImg");
const water = document.querySelector("#section1 .water");
const maxIndex = 23;

// 초기 강제 세팅 (1번 고정)
img.src = `images/kimyujin1.png`;
img.style.opacity = '1';
water.style.display = 'none';
water.style.bottom = '-80px';

// 프레임 상태 + 스크롤 시작 여부 플래그
const state = { frame: 1 };
let hasUserScrolled = false; // 사용자가 실제 스크롤했는지

// 2) 유저 스크롤 감지(한 번이라도 스크롤하면 true)
const onUserScroll = () => { hasUserScrolled = true; };
window.addEventListener('wheel', onUserScroll, { passive: true });
window.addEventListener('touchmove', onUserScroll, { passive: true });
window.addEventListener('keydown', (e) => {
    // 키보드 스크롤(화살표/스페이스/pgUp/pgDn 등)
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', 'Home', 'End', ' '];
    if (keys.includes(e.key)) hasUserScrolled = true;
});

// (권장) 이미지 프리로드
for (let i = 1; i <= maxIndex; i++) {
    const pre = new Image();
    pre.src = `images/kimyujin${i}.png`;
}

k=0
// GSAP fromTo
const soundWater = document.querySelector('.sound_water');
const tl = gsap.fromTo(
    state,
    { frame: 1 },
    {
        frame: maxIndex,
        ease: "none",
        snap: { frame: 1 },
        immediateRender: false,
        scrollTrigger: {
            trigger: "#section1",
            start: "bottom 80%",
            end: "+=2500",
            scrub: true,
            // pin: true,

            // 섹션이 활성화되더라도, 사용자가 실제 스크롤하기 전엔 1프레임 고정
            onUpdate: (self) => {
                let idx = Math.round(state.frame);

                if (!hasUserScrolled) {
                    idx = 1;           // 강제 1프레임
                    state.frame = 1;
                }

                idx = Math.min(maxIndex, Math.max(1, idx));
                img.src = `images/kimyujin${idx}.png`;

                if (idx > 10) {
                    water.style.display = 'block';
                    water.style.bottom = `-60px`;

                    if(k==0 && idx > 10){
                        soundWater.muted = false;
                        soundWater.play().catch(err => {
                            console.log("재생 실패:", err);
                        });
                        k=1
                    }
                    
                } else {
                    water.style.display = 'none';
                    water.style.bottom = '-60px';
                }
                img.style.opacity = (idx > 11) ? '0.5' : '1';
            },

            // 뷰포트 밖일 땐 고정(위=1, 아래=max)
            onToggle: (self) => {
                if (!self.isActive) {
                    const idx = self.progress <= 0 ? 1 : maxIndex;
                    state.frame = idx;
                    img.src = `images/kimyujin${idx}.png`;
                    img.style.opacity = (idx > 11) ? '0.5' : '1';
                }
            }
        }
    }
);

// 3) 모든 리소스 로드 뒤, 꼭 맨 위로 올리고 refresh
window.addEventListener('load', () => {
    window.scrollTo(0, 0);         // 최상단으로
    ScrollTrigger.refresh();       // 위치 재계산
});



// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// ScrollSmoother.create({
//     wrapper: "#wrapper",
//     content: "#wrap",
//     smooth: 4,   
//     effects: true, 
// });

const lenis = new Lenis()

lenis.on('scroll', (e) => {
    console.log(e)
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)



// 04 : 이미지 축소하기
const ani1 = gsap.timeline();
ani1.fromTo("#section1 .t1", { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
    .fromTo("#section1 .t2", { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
    .fromTo("#section1 .t3", { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
    .fromTo(".moon_box", { scale: 0.6 }, { scale: 0.4 })

ScrollTrigger.create({
    animation: ani1,
    trigger: "#section1",
    start: "top top",
    end: "100% top",
    scrub: true,
    pin: true,
    anticipatePin: 1,
    markers: false
});


const ani2 = gsap.timeline();
ani2.fromTo("#section2 .text", { y: 400, autoAlpha: 0 }, { y: 0, autoAlpha: 0.5 })
ani2.fromTo("#section2 .text", { y: 0, letterSpacing: 0, autoAlpha: 0.5 }, { y: 200, letterSpacing: 100, autoAlpha: 0 })

ScrollTrigger.create({
    animation: ani2,
    trigger: "#section2",
    start: "top top",
    end: "bottom 50%",
    scrub: true,
    anticipatePin: 1,
    // markers: true
});




// 동그란 사진
const horizontal = document.querySelector("#section3");
const sections = gsap.utils.toArray(".profile-image ul li ");

let scrollTween = gsap.to(sections, {
    yPercent: 100 * (sections.length - 1),
    filter:'grayscale(0%)',
    ease: "none",
    scrollTrigger: {
        trigger: horizontal,
        start: "top top",
        end: "+=2000",
        pin: true,
        ainicipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        snap: 1 / (sections.length - 1),

    }
});




// pro1 → ani4-1
const ani4_1 = gsap.timeline({ defaults: { ease: "none", duration: 1 } });
    ani4_1.fromTo("#section4 .pro1 .laptop-container",
        { x: 1100, y: -100, autoAlpha: 0 },
        { x: 180, y: 200, autoAlpha: 1, immediateRender: false }
    )
    .fromTo("#section4 .pro1 .content_box",
        { y: 200, autoAlpha: 0 },
        { y: 100, autoAlpha: 1, immediateRender: false }, "<"
    )
    .to("#section4 .pro1 .screen img",
        {transform: 'translateY(0)'}, "<"
    )
    .to("#section4 .pro1 .laptop-container",
        { x: -750, y: -280, autoAlpha: 0.9 }
    )
    .to("#section4 .pro1 .content_box",
        { y: 0, autoAlpha: 0 }, "<"
    )
    ani4_1.to("#section4 .bg-circle",
        {backgroundColor:'#FCC300'}, "<"
    )

ScrollTrigger.create({
    animation: ani4_1,
    trigger: "#section4 .pro1",
    start: "top top",
    end: "+=2000",
    scrub: true,
    pin: true,
    anticipatePin: 1,
});

// pro2 → ani4-2
const ani4_2 = gsap.timeline({ defaults: { ease: "none", duration: 1 } });
    ani4_2.fromTo("#section4 .pro2 .laptop-container",
        { x: 1100, y: -100, autoAlpha: 0 },
        { x: 180, y: 200, autoAlpha: 1, immediateRender: false }
    )
    .fromTo("#section4 .pro2 .content_box",
        { y: 200, autoAlpha: 0 },
        { y: 100, autoAlpha: 1, immediateRender: false }, "<"
    )
    .to("#section4 .pro2 .screen img",
        {transform: 'translateY(0)'}, "<"
    )
    .to("#section4 .pro2 .laptop-container",
        { x: -750, y: -280, autoAlpha: 0.9 }
    )
    .to("#section4 .pro2 .content_box",
        { y: 0, autoAlpha: 0 }, "<"
    )
    .to("#section4 .bg-circle",
        {backgroundColor:'#5C6172'}, "<"
    )

ScrollTrigger.create({
    animation: ani4_2,
    trigger: "#section4 .pro2",
    start: "top top",
    end: "+=2000",
    scrub: true,
    pin: true,
    anticipatePin: 1,
});

// pro3 → ani4-3
const ani4_3 = gsap.timeline({ defaults: { ease: "none", duration: 1 } });
    ani4_3.fromTo("#section4 .pro3 .laptop-container",
    { x: 1100, y: -100, autoAlpha: 0 },
    { x: 180, y: 200, autoAlpha: 1, immediateRender: false }
    )
    .fromTo("#section4 .pro3 .content_box",
    { y: 200, autoAlpha: 0 },
    { y: 100, autoAlpha: 1, immediateRender: false }, "<"
    )
    .to("#section4 .pro3 .screen img",
    {transform: 'translateY(0)'}, "<"
    )
    .to("#section4 .pro3 .laptop-container",
    { x: -750, y: -280, autoAlpha: 0.9 }
    )
    .to("#section4 .pro3 .content_box",
    { y: 0, autoAlpha: 0 }, "<"
    )
    .to("#section4 .bg-circle",
        {backgroundColor:'#885800'}, "<"
    )

ScrollTrigger.create({
    animation: ani4_3,
    trigger: "#section4 .pro3",
    start: "top top",
    end: "+=2000",
    scrub: true,
    pin: true,
    anticipatePin: 1,
});

// pro4 → ani4-4
const ani4_4 = gsap.timeline({ defaults: { ease: "none", duration: 1 } });
    ani4_4.fromTo("#section4 .pro4 .laptop-container",
    { x: 1100, y: -100, autoAlpha: 0 },
    { x: 180, y: 200, autoAlpha: 1, immediateRender: false }
    )
    .fromTo("#section4 .pro4 .content_box",
    { y: 200, autoAlpha: 0 },
    { y: 100, autoAlpha: 1, immediateRender: false }, "<"
    )
    .to("#section4 .pro4 .screen img",
    {transform: 'translateY(0)'}, "<"
    )
    .to("#section4 .pro4 .laptop-container",
    { x: -750, y: -280, autoAlpha: 0.9 }
    )
    .to("#section4 .pro4 .content_box",
    { y: 0, autoAlpha: 0 }, "<"
    )
    .to("#section4 .bg-circle",
        {backgroundColor:'#fff'}, "<"
    )

ScrollTrigger.create({
    animation: ani4_4,
    trigger: "#section4 .pro4",
    start: "top top",
    end: "+=2000",
    scrub: true,
    pin: true,
    anticipatePin: 1,
});

const master4 = gsap.timeline();
master4.add(ani4_1).add(ani4_2);

ScrollTrigger.create({
  animation: master4,
  trigger: "#section4",
  pin: true,            
  start: "top top",
  end: "+=5600",        
  scrub: true,
  anticipatePin: 1,
  // markers: true,
  invalidateOnRefresh: true
});


const ani5 = gsap.timeline();
ani5.to("#section5 .bg",{ left: 0, top:0, transform: 'skewY(0deg)', backgroundColor:'#172D3E'})

ScrollTrigger.create({
  animation: ani5,
  trigger: "#section5",
  start: "top-=200 top-=200",
  end:"30% top",
  scrub: true,
  anticipatePin: 1,
});



const ani52 = gsap.timeline();
ani52.from("#section5 .ex .line1",{height:'0'})
    .from("#section5 .ex .line1",{width:'0'})
    .from("#section5 .ex p",{opacity:'0'})

ScrollTrigger.create({
  animation: ani52,
  trigger: "#section5 .content",
  start: "top 90%",
  end:"top 50%",
  scrub: true,
  anticipatePin: 1,
//   markers:true
});



const ani6 = gsap.timeline();
ani6.from("#section6 .ex .line1",{height:'0'})
    .from("#section6 .ex .line1",{width:'0'})
    .from("#section6 .ex p",{opacity:'0'})

ScrollTrigger.create({
  animation: ani6,
  trigger: "#section6 .content",
  start: "top bottom",
  end:"70% center",
  scrub: true,
//   anticipatePin: 1,
//   markers:true
});

const ani62 = gsap.timeline();
ani62.from("#section6 .content2 .ex .line_box",{width:'0'})
    .to("#section6 .content2 .ex p",{opacity:'1'})

ScrollTrigger.create({
  animation: ani62,
  trigger: "#section6 .content2",
  start: "top 80%",
  end:"bottom center",
  scrub: true,
//   anticipatePin: 1,
//   markers:true
});

const ani63 = gsap.timeline();
ani63.from("#section6 .content3 .ex .line_box",{width:'0'})
    .to("#section6 .content3 .ex p",{opacity:'1'})

ScrollTrigger.create({
  animation: ani63,
  trigger: "#section6 .content3",
  start: "top 80%",
  end:"bottom center",
  scrub: true,
//   anticipatePin: 1,
//   markers:true
});


//팝업
const banner = gsap.timeline();
        banner.from("#section7 .content li", {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            rotate:5
        })

        ScrollTrigger.create({
            animation: banner,
            trigger: "#section7",
            start: "top 50%",
            end: "20% top",
            scrub: true,
            // pin: true,
            anticipatePin: 1,
            toggleActions: "play none none reset",
            // markers: true
        });





    // 타임라인 (제목 애니메이션)
        const popup = gsap.timeline();
        popup.to("#section8 .view", {
            x:0
        })

        ScrollTrigger.create({
            animation: popup,
            trigger: "#section8 .content",
            start: "top top",
            end: "100% bottom",
            scrub: true,
            pin: "#section8 .view",
            // markers: true
        });


        // 리스트 아이템별로 ScrollTrigger 생성
        const listItems = document.querySelectorAll("#section8 .list li");
        const viewImg = document.querySelector("#section8 .view img");

        listItems.forEach((li, i) => {
            ScrollTrigger.create({
                trigger: li,
                start: "top center",      // li가 화면 중앙에 올 때
                end: "bottom center",
                onEnter: () => {
                    viewImg.src = li.querySelector("img").src; // 오른쪽 이미지 교체
                },
                onEnterBack: () => {
                    viewImg.src = li.querySelector("img").src; // 위로 스크롤 시 교체
                }
            });
        }); 

    // 