; (function () {
    // axios.defaults.baseURL = 'http://music.it666.com:3666';
    axios.defaults.baseURL = 'http://127.0.0.1:3000/';
    axios.defaults.timeout = 3000;

    class LMHttp {
        static get(url = '', data = {}) {
            return new Promise(function (resolve, reject) {
                axios.get(url, {
                    params: {
                        data
                    }
                }).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            })
        }
        static post(url = '', data = {}) {
            return new Promise(function (resolve, reject) {
                axios.post(url, {
                    params: {
                        data
                    }
                }).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            })
        }
    }
    class homeApis {
        static getHomeBanner() {
            return LMHttp.get('/banner', { type: 2 });
        }
        static getHomeRecommend() {
            return LMHttp.get('/personalized?offset=0&limit=6');
        }
        static getHomeExclusive() {
            return LMHttp.get('/personalized/privatecontent');
        }
        static getHomeAlbum() {
            return LMHttp.get('/top/album?offset=0&limit=6');
        }
        static getHomeMv() {
            return LMHttp.get('/personalized/mv');
        }
        static getHomeDJ() {
            return LMHttp.get('/personalized/djprogram');
        }
        static getHomeHotDetail() {
            return LMHttp.get('/search/hot/detail');
        }
    }
    window.LMHttp = LMHttp;
    window.homeApis = homeApis;
})();
