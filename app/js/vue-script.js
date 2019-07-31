let vm = new Vue({
	el: "#app",
	data: {
		isActiveTabs: {
			sex: true,
			gey: true,
			webcam: true
		},
		topSliderDATA: '',
		instagramDATA: [],
		topActiveDATA: [],
		mapsDATA: '',
		mapsLocalization: '',
		videoDATA: '',
		filterDATA: '',
		filterIam: '',
		filterLooking: '',
		tabsDATA: '',
		footerDATA: '',
		owlInit: {
			loop: true,
			margin: 0,
			nav: false,
			loop: true,
			responsive: {
				320:{items: 3},
				546:{items: 4},
				768:{items: 5},
				992:{items: 6},
				1140:{items: 6}
			}
		},

	},
	methods: {

		activateTab(value) {
			for(let i in this.isActiveTabs) this.isActiveTabs[i] = false;
			this.isActiveTabs[value] = true;
		},

		getJSON(url, callback) {
 			var req = new XMLHttpRequest();
			// req.responseType = 'json'; // not support in IE11
			req.overrideMimeType("application/json");
			req.open('GET', url, true);
			req.onload  = function() { // запрос завершился
				var result = JSON.parse(req.responseText);

				if ( req.responseText.length == 0 ) {
					console.error(" AJAX Error");
				}

				console.log("result", result);
				callback(result);
			};
			req.send(null);

		},

		separetaJSON(json) {
			console.log('json', json);
			// top slider
			this.topSliderDATA = json.top_slider;
			console.log('topSliders', this.topSliderDATA);
			
			// instagram
			var randIndex = Math.floor(Math.random() * json.instagram.length);
			this.instagramDATA = json.instagram[randIndex];
			console.log('instagramDATA', this.instagramDATA);
			
			// maps
			this.mapsDATA = json.maps;
			this.userIP = this.mapsDATA.user_ip.split(",");
			var test = typeof(this.mapsDATA.user_ip);
			// console.dir('IP - all', typeof(this.mapsDATA.user_ip) );
			console.log('IP-1', test );
			console.log('IP', this.userIP );

			this.getUserLocationFromServer();

			// top active
			for (var i = 0; i < json.top_active.length; i++) {
				var random = Math.floor(Math.random() * json.top_active.length);
				var item = json.top_active[random];
				
				if( this.topActiveDATA.indexOf(item) === -1 &&
				this.topActiveDATA.length < 4 
				){
					this.topActiveDATA.push(item);
				}
			}
			console.log('topActiveDATA', this.topActiveDATA);
			
			// video
			this.videoDATA = json.videos;
			console.log('videoDATA', this.videoDATA);

			// filter
			this.filterDATA = json.filter;
			console.log('filterDATA', this.filterDATA);

			// tabs
			this.tabsDATA = json.tabs;
			console.log('tabsDATA', this.tabsDATA);
			
			// footer
			this.footerDATA = json.footer;
			console.log('footerDATA', this.tabsDATA);

		},
		
		topCarousel() {
			$("#carousel").owlCarousel({
				loop: true,
				margin: 0,
				nav: false,
				loop: true,
				responsive:{
					320:{items: 5},
					546:{items: 10},
					768:{items: 12},
					992:{items: 10},
					1140:{items: 15}
				}
			});
		},
		
		owl_sex() {
			$("#owl_sex").owlCarousel(this.owlInit);
			var owl = $('#owl_sex');
			$('.owl_sex.prev').click(function() {
				owl.trigger('prev.owl.carousel', [250]);
			});
			$('.owl_sex.next').click(function() {
				owl.trigger('next.owl.carousel', [250]);
			});
		},
		
		owl_gey() {
			$("#owl_gey").owlCarousel(this.owlInit);
			var owl = $('#owl_gey');
			$('.owl_sex.prev').click(function() {
				owl.trigger('prev.owl.carousel', [250]);
			});
			$('.owl_sex.next').click(function() {
				owl.trigger('next.owl.carousel', [250]);
			});
		},
		
		owl_webcam() {
			$("#owl_webcam").owlCarousel(this.owlInit);
			var owl = $('#owl_webcam');
			$('.owl_sex.prev').click(function() {
				owl.trigger('prev.owl.carousel', [250]);
			});
			$('.owl_sex.next').click(function() {
				owl.trigger('next.owl.carousel', [250]);
			});
		},

		randomNum() {
			return Math.floor(Math.random() * 10)
		},

		initialVideo() {
			const player = new Plyr('#player', {
				title: 'Example Title',
				// controls: [],
				controls: ['play-large', 'play', 'progress', 'current-time1', 'volume', 'captions', ],
				muted: true,
				loop: { active: true }
			});

			var playerCont = document.querySelector(".video__cont");
			playerCont.addEventListener("mouseover", function(){
				player.play();
			});
			playerCont.addEventListener("mouseleave", function(){
				player.pause();
			});
		},

		filterRedirect() {
			var value = this.filterIam + "-" + this.filterLooking;
			var newlink = this.filterDATA[value];
			console.log('newlink', newlink);
			window.location = newlink;
		},

		initialMap(arrLocations){
			var location = ( arrLocations != undefined) ? arrLocations : [30.455, 50.414] ;
			
			console.log("initialMap", arrLocations);
			console.log("initialMap", location);

			mapboxgl.accessToken = 'pk.eyJ1IjoibmEzYXIxeSIsImEiOiJjanloM29tenQwNzRtM2hwYWw4emUyaXhlIn0.PuWkJSZ5w1Ijq-surIhTsw';

			var map = new mapboxgl.Map({
				container: 'mapBox',
				style: 'mapbox://styles/na3ar1y/cjyq06c1y1my31cpit9snzpsi',
				center: location,
				zoom: 10
			});

			// https://docs.mapbox.com/mapbox-gl-js/example/locate-user/
			// Add geolocate control to the map.
			map.addControl(new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: false
				},
				trackUserLocation: false
			}));

		},
		
		isLink(value){
			return value.indexOf('http') != -1;
		},

		getUserLocation(userIp) {
			// BLOCKED BY SERVICE - DEPRICATED
			userIp = ( userIp != undefined) ? userIp : '194.183.167.96' ; //IP Kyiv

			var req = new XMLHttpRequest();
			var url = "https://api.ipinfodb.com/v3/ip-city/?key=10376990a6c7e07567a8beeda379911a15af1bcc5e86e898820530ab5c79dc1c&ip=" + userIp;

			req.overrideMimeType("text/html");
			req.open('GET', url, true);
			req.onload  = function() { // запрос завершился
				var result = req.responseText;
				if ( req.responseText.length == 0 ) console.error("AJAX Error - in getUserLocation()");
				console.log("getUserLocation ! ! !: ", result);
			};
			req.send(null);

		},

		getUserLocationFromServer(){
			var req = new XMLHttpRequest();
			var url = window.location.href + "php/get_localizetion.php";
			var self = this;

			req.overrideMimeType("application/json");
			req.open('GET', url, true);
			req.onload  = function() { // запрос завершился
				var localization = req.responseText;
				// var localization = ["OK","","194.183.167.96","UA","Ukraine","Kyiv","Kiev","03150","50.4547","30.5238","+03:00"]; // test response
				var result = JSON.parse(localization);

				if ( req.responseText.length == 0 ) console.error("AJAX Error - in getUserLocationFromServer()");
				
				var LocalizArr = [];
				LocalizArr.push(result[9]);
				LocalizArr.push(result[8]);

				// var LocalizArr = [ -0.102505, 51.501462 ]; // test londow (in google maps [51.501462, -0.102505])
				console.log("AdaptiveMaps Coordinate: - all", localization);
				console.log("AdaptiveMaps Coordinate: - all2", result);
				console.log("AdaptiveMaps Coordinate: - localization", LocalizArr);
				
				self.initialMap(LocalizArr);

				console.log("AdaptiveMaps Coordinate: initialMap - OK");
			};
			req.send(null);
		}
	},
	beforeMount(){},
	mounted(){
		
		var url = window.location.href + "php/";
		var urlLocal = window.location.href + "php/data.json";
		// this.getJSON(url, this.separetaJSON);
		this.getJSON(urlLocal, this.separetaJSON);

		this.initialVideo();
		// this.initialMap();

		this.$nextTick(function () {
			// Код, который будет запущен только после
			// отображения всех представлений
			var self = this;
			setTimeout(()=>{ 
				this.owl_sex();
				this.owl_gey();
				this.owl_webcam();
				this.activateTab('sex') 
			}, 1000);

			setTimeout(function(){
				self.topCarousel();
			}, 800);
		});
	}
});