$(function(){
    TweenMax.set('#egg-title',{
        scale: 0
    })
    
    var eggTL = new TimelineMax({
        delay: 2,
        onComplete: complete
    });
    
    function complete() {
        eggTL.restart();
    }
    
    eggTL.to('.e-home-egg',0.1,{
        top: '50.5%',
        left: '49.5%',
        ease: Power4.easeInOut
    }).to('.e-home-egg',0.1,{
        top: '49.5%',
        left: '50.5%',
        ease: Power4.easeInOut
    }).to('.e-home-egg',0.1,{
        top: '51%',
        left: '49%',
        ease: Power4.easeInOut
    }).to('.e-home-egg',0.1,{
        top: '50%',
        left: '50%',
        ease: Power4.easeInOut
    }).to('#egg-top',1.5,{
        x: '50%',
        y: '-43%',
        rotation: -5,
        ease: Power4.easeInOut
    }).to('#egg-bottom',1.5,{
        x: '-50%',
        y: '42%',
        rotation: 15,
        ease: Power4.easeInOut
    },'-=1.5').to('#egg-title',1,{
        scale: 1,
        ease: Power4.BounceInOut
    },'-=1').to('#egg-title',1,{
        delay: 10,
        scale: 0,
        ease: Power4.BounceInOut
    },'-=1').to('#egg-top',1.5,{
        x: '0%',
        y: '0%',
        rotation: 0,
        ease: Power4.easeInOut
    },'-=1.5').to('#egg-bottom',1.5,{
        x: '0%',
        y: '0%',
        rotation: 0,
        ease: Power4.easeInOut
    },'-=1.5')
    
    
    $('.e-remind__detail').hide()
    var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
    
    $('.e-remind__btn-more').click(function() {
        var $self = $(this)
        $self.toggleClass('is-active')
        $self.next().slideToggle(400);
        setTimeout(function(){
            $body.animate({
                scrollTop: $self.offset().top
            }, 400);
        },400)
    })
})