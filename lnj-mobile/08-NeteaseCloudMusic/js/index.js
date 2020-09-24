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
    initSearchList();
    function initSearchList() {
        // 关闭广告
        $('.search-ad>span').click(function () {
            $('.search-ad').remove();
        });
        // 处理搜索历史
        let historyArray = getHistory();
        if (historyArray.length === 0) {
            $('.search-history').hide();
        } else {
            $('.search-history').show();
            historyArray.forEach(function (item) {
                let oLi = $('<li>' + item + '</li>');
                $('.history-bottom').append(oLi);
            })
        }
        $('.header-center-box>input').blur(function () {
            // 如果输入框无值那么我们不需要保存
            if (!this.value) return;
            // 获取历史搜索记录
            historyArray.unshift(this.value);
            this.value = "";
            localStorage.setItem('history', JSON.stringify(historyArray));
        })
        $('.history-top>img').click(function () {
            localStorage.removeItem('history');
        })
        function getHistory() {
            let historyArray = localStorage.getItem('history');
            if (!historyArray) {
                historyArray = [];
            } else {
                // 将字符串转换为对象
                historyArray = JSON.parse(historyArray);
            }
            return historyArray;
        }
        // 处理热搜榜
        homeApis.getHomeHotDetail().then(function (data) {
            let html = template('hotDetail', data);
            $(".hot-bottom").html(html);
            searchScroll.refresh();
        }).catch(function (err) {
            console.log(err);
        })
        let searchScroll = new IScroll('.header-container', {
            mouseWheel: false,
            scrollbars: true,
            probeType: 3
            /* 
            1  滚动不繁忙的时候触发
            2  滚动时每隔一定时间触发
            3  每滚动一像素触发一次
             */
        });
    }

    // 公共的底部
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
        console.log(this.y);
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
    // 创建首页的Banner
    homeApis.getHomeBanner().then(function (data) {
        // console.log(data);
        let html = template('bannerSlide', data);
        $('.swiper-wrapper').html(html);
        myScroll.refresh();
        // 初始化Swiper
        // 注意：这里的Swiper一定要在异步获取数据后再更新因为Swiper的轮播图是根据图片数据确定
        // 后再在图片的前后添加若干图片来解决的无缝滚动的问题
        var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            // autoplay: true,
            autoplay: {
                delay: 1000,
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
    }).catch(function (err) {
        console.log(err);
    })
    // 导航栏里的日期
    $('.nav i').html(new Date().getDate());
    /*从服务器获取数据填充到模板中*/
    homeApis.getHomeRecommend()
        .then(function (data) {
            data.title = "推荐歌单";
            data.subTitle = "歌单广场";
            data.result.forEach(function (obj) {
                obj.width = 216 / 100;
                obj.playCount = formartNum(obj.playCount);
            });
            let html = template('category', data);
            $(".recommend").html(html);
            $(".recommend .category-title").forEach(function (ele) {
                $clamp(ele, { clamp: 2 });
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    homeApis.getHomeExclusive()
        .then(function (data) {
            data.title = "独家放送";
            data.subTitle = "网易出品";
            data.result.forEach(function (obj, index) {
                obj.width = 334 / 100;
                if (index === 2) {
                    obj.width = 690 / 100;
                }
            });
            let html = template('category', data);
            $(".exclusive").html(html);
            $(".exclusive .category-title").forEach(function (ele) {
                $clamp(ele, { clamp: 2 });
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    homeApis.getHomeAlbum()
        .then(function (data) {
            data.title = "新碟新歌";
            data.subTitle = "更多新碟";
            data.result = data["monthData"];
            data.result.forEach(function (obj) {
                obj.artistName = obj.artist.name;
                obj.width = 216 / 100;
            });
            let html = template('category', data);
            $(".album").html(html);
            $(".album .category-title").forEach(function (ele) {
                $clamp(ele, { clamp: 1 });
            });
            $(".album .category-singer").forEach(function (ele) {
                $clamp(ele, { clamp: 1 });
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    homeApis.getHomeMv()
        .then(function (data) {
            data.title = "推荐MV";
            data.subTitle = "更多MV";
            data.result.forEach(function (obj, index) {
                obj.width = 334 / 100;
            });
            let html = template('category', data);
            $(".mv").html(html);
            $(".mv .category-title").forEach(function (ele) {
                $clamp(ele, { clamp: 1 });
            });
            $(".mv .category-singer").forEach(function (ele) {
                $clamp(ele, { clamp: 1 });
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    homeApis.getHomeDJ()
        .then(function (data) {
            data.title = "主播电台";
            data.subTitle = "更多主播";
            data.result.forEach(function (obj, index) {
                obj.width = 216 / 100;
            });
            let html = template('category', data);
            $(".dj").html(html);
            $(".dj .category-title").forEach(function (ele) {
                $clamp(ele, { clamp: 2 });
            });
            myScroll.refresh();
        })
        .catch(function (err) {
            console.log(err);
        });

    function formartNum(num) {
        let res = 0;
        if (num / 100000000 > 1) {
            let temp = num / 100000000 + "";
            if (temp.indexOf(".") === -1) {
                res = num / 100000000 + "亿";
            } else {
                res = (num / 100000000).toFixed(1) + "亿";
            }
        } else if (num / 10000 > 1) {
            let temp = num / 10000 + "";
            if (temp.indexOf(".") === -1) {
                res = num / 10000 + "万";
            } else {
                res = (num / 10000).toFixed(1) + "万";
            }
        } else {
            res = num;
        }
        return res;
    }
})