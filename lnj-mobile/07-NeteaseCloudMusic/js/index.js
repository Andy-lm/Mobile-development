$(function () {
    $('.header-center-box>input').focus(function () {
        $('.header').addClass('active');
    })
    $('.header-cancle').click(function () {
        $('.header').removeClass('active');
    })
    $('.header-switch>span').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.header-switch>i').animate({ left: this.offsetLeft }, 100);
    })
    let pageArr = ['home', 'video', 'me', 'friend', 'account'];
    $('.footer>ul>li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        let url = $(this).find('img').attr('src');
        url = url.replace('normal', 'selected');
        $(this).find('img').attr('src', url);
        $(this).siblings().find('img').forEach(Oimg => {
            // 这里获取到原生的html元素
            Oimg.src = Oimg.src.replace('selected', 'normal');
        });
        $('.header').removeClass().addClass('header ' + pageArr[$(this).index()]);
    })
    // 获取svg路径
    let length = $('#refreshLogo')[0].getTotalLength();
    // 让svg隐藏
    $('#refreshLogo').css({ 'stroke-dasharray': length });
    $('#refreshLogo').css({ 'stroke-dashoffset': length });
    // 创建IScroll
    let myScroll = new IScroll('.main', {
        mouseWheel: false,
        scrollbars: true,
        probeType: 3
        /* 
        1  滚动不繁忙的时候触发
        2  滚动时每隔一定时间触发
        3  每滚动一像素触发一次
         */
    });
    let logoHeigh = $('.pull-down').height();
    let isPullDown = false;
    // 防止多次刷新
    let isRefresh = false;
    let bottomHeigh = $('.pull-up').height();
    let maxOffsetY = myScroll.maxScrollY - bottomHeigh;
    let isPullUp = false;
    myScroll.on('scroll', function () {
        if (this.y > logoHeigh) {
            if ((this.y - logoHeigh) * 5 < length) {
                $('#refreshLogo').css({ 'stroke-dashoffset': length - (this.y - logoHeigh) * 5 });
            } else {
                // 图标完全显示，让其不完全回弹，开始刷新数据
                this.minScrollY = 140;
                isPullDown = true;
            }
        } else if (this.y <= maxOffsetY) {
            $('.pull-up>p>span').html('松手加载更多');
            this.maxScrollY = maxOffsetY;
            isPullUp = true;
        }

    })
    myScroll.on('scrollEnd', function () {
        if (isPullDown && !isRefresh) {
            // 去网上刷新数据
            isRefresh = true;
            refreshDown();
        } else if (isPullUp && !isRefresh) {
            $('.pull-up>p>span').html('加载中...');
            isRefresh = true;
            refreshUp();
        }
    })
    function refreshDown() {
        let i = 3;
        let time = setInterval(function () {
            if (i === 1) {
                clearInterval(time);
            }
            console.log('还剩' + i + '秒刷新完');
            --i;
        }, 1000)
        setTimeout(function () {
            console.log('数据刷新完毕');
            isPullDown = false;
            isRefresh = false;
            myScroll.minScrollY = 0;
            myScroll.scrollTo(0, 0);
            $('#refreshLogo').css({ 'stroke-dashoffset': length });
        }, 3000)
    }
    function refreshUp() {
        setTimeout(function () {
            console.log('数据刷新完毕', "up");
            $('.pull-up>p>span').html('上拉加载更多');
            isPullUp = false;
            isRefresh = false;
            myScroll.maxScrollY = maxOffsetY + bottomHeigh;
            myScroll.scrollTo(0, myScroll.maxScrollY);
            $('#refreshLogo').css({ 'stroke-dashoffset': length });
        }, 3000)
    }
    // 初始化Swiper
    var mySwiper = new Swiper('.swiper-container', {
        // autoplay: {
        //     delay: 1000
        // },
        loop: true,
        initialSlide: 0,
        centeredSlides: true,
        // autoplay: true,
        autoplay: {
            delay: 1000,
            stopOnLastSlide: true,
            disableOnInteraction: false
        },
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            bulletClass: 'my-bullet',
            bulletActiveClass: 'my-bullet-active',
        },
        loopAdditionalSlides: 3,
        observer: true,
        observeParents: true,
        observeSlideChildren: true
    });
    // 创建首页的Banner
    homeApis.getHomeBanner().then(function (data) {
        // console.log(data);
        let html = template('bannerSlide', data);
        $('.swiper-wrapper').html(html);
        myScroll.refresh();
    }).catch(function (err) {
        console.log(err);
    })
    // 导航栏里的日期
    $('.nav i').html(new Date().getDate());
    // 创建推荐歌单
    homeApis.getHomeRecommend().then(function (data) {
        // console.log(data);
        let html = template('recommendItem', data);
        $('.recommend-bottom').html(html);
        $('.recommend-title').forEach(function (ele) {
            $clamp(ele, { clamp: 2 });
        })
        myScroll.refresh();
    }).catch(function (err) {
        console.log(err);
    })
    homeApis.getHomeExclusive().then(function (data) {
        let html = template('exclusiveItem', data);
        $('.exclusive-bottom').html(html);
        $('.exclusive-title').forEach(function (ele) {
            $clamp(ele, { clamp: 2 });
        })
        myScroll.refresh();
    }).catch(function (err) {
        console.log(err);
    })
    homeApis.getHomeAlbum().then(function (data) {
        // console.log(data);
        let html = template('albumItem', data);
        $('.album-bottom').html(html);
        $('.album-title').forEach(function (ele) {
            $clamp(ele, { clamp: 1 });
        })
        myScroll.refresh();
    }).catch(function (err) {
        console.log(err);
    })
    homeApis.getHomeMv().then(function (data) {
        let html = template('mvItem', data);
        $('.mv-bottom').html(html);
        $('.mv-title').forEach(function (ele) {
            $clamp(ele, { clamp: 1 });
        })
        $('.mv-singer').forEach(function (ele) {
            $clamp(ele, { clamp: 1 });
        })
        myScroll.refresh();
    }).catch(function (err) {
        console.log(err);
    })
    homeApis.getHomeDJ().then(function (data) {
        // console.log(data);
        let html = template('djItem', data);
        $('.dj-bottom').html(html);
        $('.recommend-title').forEach(function (ele) {
            $clamp(ele, { clamp: 1 });
        })
        myScroll.refresh();
    }).catch(function (err) {
        console.log(err);
    })
})