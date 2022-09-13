// if you see this grabish code - you should know - nobody can read this code!!! No functional stile!!!!!!! no object style!!!!! no any style if you think. It just simple - no sicret/﻿
var test_obj;
	var test_data;
	var test_arr;

function chart_start(){
	
	var current_url = window.location.href.split('//')[1].split('/')[0];
	//console.log('current_url',current_url);
	if (current_url == 'stage.rtf.com') {
		var config = {
			"api_url": "https://apimarketfunctions.airweb.ua/",
			"url": "https://marketfunctions.airweb.ua/",
			"img_url":"assets/img/staff/",
			"req_data": '/chart',
			"max_qnt_assessment_staff": 50
		}
	}else {
		var config = {
			"api_url": "https://apimarketfunctions.airweb.ua/",
			"url": "https://marketfunctions.airweb.ua/",
			"img_url":"assets/img/staff/",
			"req_data": '/chart',
			"max_qnt_assessment_staff": 50
		}
	}
	/*ФУНКЦИОНАЛ ОТРИСОВКИ ЧАРТА*/

	function call_chart(sub_user_id) {
		var chek_assessment_data = false;
		var chart = {};
		var circle = { 'l': [], 'f': {} };
		var division = { 'l': [], 'f': {} };
		var staff = { 'l': [], 'f': {} };
		//Общие настройки работы модуля диаграммы


		//Настройки отображения диаграммы
		var settings = {
			'max_sector': 0.30,
			'svg': 700,
			'rate_rang': { 'min': 0, 'max': 5 },
			'rate_color': { 'min': '#FF7900', 'max': '#7AB800' },
			'max_path_width': 40,
			'max_frequency': 20,
			'max_staff': 5,
			'boss_r': 340,
			'symmetric': false,
			'sector_sum': 0,
			'staff_r': 30,
			'circle':
				[
					{
						'r': 280,
						'staff': 1,
						'division':
							{
								'p2': 100,
							}
					},
					{
						'r': 310,
						'staff': 1.1,
						'division':
							{
								'p2': 110,
							}
					},
					{
						'r': 340,
						'staff': 1.2,
						'division':
							{
								'p2': 120,
							}
					}
				],
			'my_person':
				{
					'id': 150,
					'r': 40
				}
		};
		//Шаблон данных работы модуля отрисовки
		var data_frame = {
			'circle':
				[
					{
						'info':
							{
								'circle_name': 'Subordinates',
								'assess': { 'rotation': 0 }
							},
						'division':
							[]
					},
					{
						'info':
							{
								'circle_name': 'Colleagues',
								'assess': { 'rotation': 0 }
							},
						'division':
							[]
					},
					{
						'info':
							{
								'circle_name': 'Supervisor',
								'assess': { 'rotation': 0 }
							},
						'division': []
					}
				],
			'info':
				{
					'img': null,
					'assess':
						{
							'mark': 0,
							'frequency': 0,
							'real_frequency': 0,
						},
					'assess_me':
						{
							'rate': 0,
							'rate_sum': 0,
							'rate_count': 0,
							'frequency': 0,
							'real_frequency': 0,
						},
					'assess_other':
						{
							'rate': 0,
							'rate_sum': 0,
							'rate_count': 0,
							'frequency': 0,
							'real_frequency': 0,
						}
				},

		};

		//Компановщик структуры
		var diagram = {};
		diagram.settings = settings;
		diagram.data_frame = data_frame;
		diagram.config = config;
		diagram.user_info = new Object;

		test_obj = diagram;
		
		/*МЕТОДЫ РАБОТЫ МОДУЛЯ ДИАГРАММЫ*/
		//Получение данных пользователя из браузера
		diagram.get_user_info = function () {

			let chart_container = d3.select('#chart_container');

			let loading = chart_container.append('div').classed('loading', true);
			loading.append('svg').classed('spinner', true)
				.append('circle').attr("cx", 50).attr("cy", 50)
				.attr('r', '42px')
				.attr('fill', 'transparent').attr('stroke-width', '6px').attr('stroke', 'rgba(240,171,0,1)');
			var user_info = null;
			var user_info = {
					email: "Sophia@testmarket.com",
					full_name: "Sophia",
					groups: [
						{id: 2, code: "administrator", name: "administrator"}, 
						{id: 3, code: "root", name: "root"}
					],
					id: 81747,
					img: "p0.jpg",
					login: "Sophia",
					token: 225283664975388
				}
			this.user_info = user_info
			
		}
		
		
		/*ПОЛУЧЕНИЕ БАЗОВЫХ ДАННЫХ ДИАГРАММЫ С СЕРВЕРА И ИХ ПРОВЕРКА*/

		//Получение данных с ральными запросами оценок
		diagram.get_chart_data = function () {
			var req_url = config.api_url + config.req_data;
			var token = this.user_info.token;
			console.log('token', token)
			var callback = function (result) {
				result = JSON.parse(result);
				diagram.data= result;
				diagram.boss_reposition();
			}

			ajax_get(req_url, token, callback, sub_user_id);
		}
		

								/*ОБРАБОТКА ДАННЫХ*/;
		//Замена позиции босса в подразделении
		diagram.boss_replace = function (staff) {
			//console.log(staff);


		}
		//Перепозиционирование боссов в даграмме анализ подразделений
		diagram.boss_reposition = function () {
			//console.log('boss_is_present start');
			var main_user = this.data.main_user;
			if(this.data.division_list){
				var division_list = this.data.division_list;
			}else{
				this.data.division_list=[];
				var division_list = this.data.division_list;
			}
			//console.log('division_list',division_list);
			//console.log('main_user',main_user);
			this.settings.staff_qnt = 0;
			for (var i = 0; i < division_list.length; i++) {
				if (division_list[i].staff == undefined) {
					division_list.splice(i, 1);
				} else {
					var staff = division_list[i].staff;
					this.settings.staff_qnt = this.settings.staff_qnt + staff.length;
					if(staff.length > this.settings.max_staff){this.settings.max_staff = staff.length}
					if (staff.length > 2) {
						var boss = new Object;
						var boss_position;
						var boss_is_present = 0;

						for (var j = 0; j < staff.length; j++) {
							//console.log('staff[j]',staff[j]);
							if(staff[j].info.header_type != undefined){
								if (staff[j].info.header_type == 1) {
									boss_is_present = 1;
									boss = JSON.stringify(staff[j]);
									boss = JSON.parse(boss);
									staff.splice(j, 1);
								}
							}
						}

						if (boss_is_present == 1) {
							boss_position = Math.round(staff.length / 2);
							staff.splice(boss_position, 0, boss);
						}
						boss_is_present = 0;
					}
				}
			}
			this.treat_data();
		}

									/*ОСНОВНЫЕ ФУНКЦИИ ОТРИСОВКИ ДИАГРАММЫ ДАННЫХ*/;
		//Функция отрисовки самой диаграммы
		diagram.print_chart = function () {
			
			var token = this.user_info.token;
			var chart = {};
			var circle = { 'l': [], 'f': {} };
			var division = { 'l': [], 'f': {} };
			var staff = { 'l': [], 'f': {} };

			/*Отрисовка круговой диаграммы*/
			//console.log('this.data_frame',this.data_frame);
			let chart_container_html = document.getElementById('chart_container');
			chart_container_html.innerHTML = '';
			let style = document.createElement('style');
			style.innerHTML = '.assess:hover{cursor: pointer}';
			chart_container_html.appendChild(style);
			
			var display = false;
			/*Объекты Диаграммы*/
			var dara_str = {};
			dara_str.circle = this.data_frame.circle;
			dara_str.user = {};
			dara_str.user.info = this.data_frame.info;
			var settings_str = JSON.stringify(this.settings);


			chart = JSON.parse(JSON.stringify(dara_str));
			chart.settings = {};
			chart.settings = JSON.parse(settings_str);
			chart.user.__proto__ = chart;
			
			//var result_me = diagram.assess_list.result_me;
			//var result_other = diagram.assess_list.result_other;

			//console.log('chart', chart);
			test_arr = chart;
			
			
			let click_event = function(){
				let container = this;
				let btn = this.html;
				
				//console.log('btn', btn);
				
				
			}
			
			/*ОБЩИЕ МЕТОДЫ ДИАГРАММЫ*/
			//Генерация главного svg поля
			chart.svg_gen = function () {
				//Генерируем svg контейнер

				var chart_container = d3.select('#chart_container').style("width", this.settings.svg + 'px').style('height', this.settings.svg + 'px');
				let loading = chart_container.append('div').classed('loading', true).style('display', 'none');
				loading.append('svg').classed('spinner', true)
					.append('circle')
					.attr('r', '42px').attr("cx", '50').attr("cy", '50')
					.attr('fill', 'transparent').attr('stroke-width', '6px').attr('stroke', 'rgba(240,171,0,1)');

				var svg_container = chart_container.append('div').attr('id', 'svg_container');
				this.html = {};
				this.html.svg_container = svg_container;
				this.html.svg = svg_container.append('svg').attr('width', '' + settings.svg + 'px').attr('height', '' + settings.svg + 'px').classed('main_svg', true);
				this.html.svg_g = this.html.svg.append('g').attr('transform', 'translate(' + this.settings.svg / 2 + ',' + this.settings.svg / 2 + ')');
				this.html.g = this.html.svg_g.append('g').classed('chart', true);
				this.html.g_circle = this.html.g.append('g').classed('circle', true);

				this.settings.shift = {};
				this.settings.shift.x = chart.html.svg[0][0].getBoundingClientRect().left;
				this.settings.shift.y = chart.html.svg[0][0].getBoundingClientRect().top;



				this.html.division_info = {};
				var division_info_div = this.html.division_info.division_info_div = chart_container.append('div').classed('division_info_div person_container', true);
				this.html.division_info.division_info_div.html('<div class="left_arrow"></div> <div class="division_info" style="width: 310px; display: block;">  <div> <div class="position" id="department_info_name">Название подразделения или департамента</div> <div class="rate"> <div class="result ass_me"> <div> <div class="assess_icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> <path fill="#404040" d="M27.566 16.437a1.476 1.476 0 0 1 0 2.086l-2.589 2.589 1.654 1.653c.577.578.391 1.212-.6 1.209-1.061 0-4.044.014-4.93.014-.818 0-1.118-.386-1.118-1.145 0-.66-.018-4.1-.018-5.288 0-.612.58-.874 1.1-.354l1.82 1.82 2.589-2.589a1.474 1.474 0 0 1 2.085 0z"></path> <path fill="#ffd800" d="M17.333 23.842l-5.063-2.743a.553.553 0 0 0-.535 0l-5.022 2.828a.554.554 0 0 1-.816-.586l1.04-5.685a.557.557 0 0 0-.169-.509l-4.228-3.92a.557.557 0 0 1 .3-.96l5.706-.767a.555.555 0 0 0 .43-.319l2.409-5.251a.553.553 0 0 1 1-.008l2.486 5.212a.554.554 0 0 0 .435.312l5.716.675a.557.557 0 0 1 .317.956l-4.169 3.987a.558.558 0 0 0-.161.512l1.124 5.668a.555.555 0 0 1-.8.598z" data-name="Shape 1179 copy 7"></path> </svg> </div> <div class="assess_rate" id="department_info_assess_me_rate"> 3.0 </div> </div> <div class="txt"> <span>ratings</span> <span>received: <b id="dpertmant_assess_me_fr">35 </b></span> </div> </div> <div class="result ass_other"> <div> <div class="assess_icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> <path fill="#404040" d="M20.406 23.555a1.476 1.476 0 0 1 0-2.086l2.589-2.589-1.654-1.653c-.577-.578-.391-1.212.6-1.209 1.061 0 4.044-.014 4.93-.014.818 0 1.118.386 1.118 1.145 0 .66.018 4.1.018 5.288 0 .612-.58.874-1.1.354l-1.82-1.82-2.589 2.589a1.474 1.474 0 0 1-2.085 0z"></path> <path fill="#ffd800" d="M17.333 23.842l-5.063-2.743a.553.553 0 0 0-.535 0l-5.022 2.828a.554.554 0 0 1-.816-.586l1.04-5.685a.557.557 0 0 0-.169-.509l-4.228-3.92a.557.557 0 0 1 .3-.96l5.706-.767a.555.555 0 0 0 .43-.319l2.409-5.251a.553.553 0 0 1 1-.008l2.486 5.212a.554.554 0 0 0 .435.312l5.716.675a.557.557 0 0 1 .317.956l-4.169 3.987a.558.558 0 0 0-.161.512l1.124 5.668a.555.555 0 0 1-.8.598z" data-name="Shape 1179 copy 7"></path> </svg> </div> <div class="assess_rate" id="department_info_assess_other_rate"> 2.0 </div> </div> <div class="txt"> <span>ratings</span> <span>sent: <b id="dpertmant_assess_other_fr">20</b></span> </div> </div> </div> </div> <div class="left_arrow_overlay"></div> </div>');


			}
			//Генерация групп svg объектов
			chart.g_gen = function (name, id) {
				let p = this.html.g;
				let g = p.append('g');
				this.html = {};
				this.html.g = g.attr('id', name + '-' + id);
			}
			//Расчет ширины полосы в зависимости от частоты оценки
			chart.set_path_width = function () {
				let max_pw = chart.settings.max_path_width;
				let max_f = chart.settings.max_frequency;
				//console.log(this);
				let cur_f = this.info.assess.frequency;
				this.settings.path_width = (cur_f / max_f) * max_pw;
				if (this.info.assess.real_frequency == 0) {
					this.settings.path_style = 'not_real';
				} else {
					this.settings.path_style = 'real';
				}
			}
			//Метод вращения вектора на заданный угол
			chart.rotation_vector = function () {
				let angle = this.settings.angle;
				/*////console.log(angle);*/

				let xy = this.vector;
				deg = Math.PI * 2 * angle;

				let vector = {};
				let m =
					[
						[Math.cos(deg), Math.sin(deg)],
						[Math.sin(deg), Math.cos(deg)]
					];

				vector.p1 = [xy.p1[0], xy.p1[1]];
				vector.p2 = [(xy.p2[0] * m[0][0] + xy.p2[1] * m[0][1]), (xy.p2[0] * m[1][0] + xy.p2[1] * m[1][1])];
				this.vector = vector;
			}
			//Отрисовка центрального сотрудника
			chart.my_person = function () {
				let r = this.settings.my_person.r / 10; //Радиус круга персонала
				let cx = 0;
				let cy = 0;

				//console.log(this.vector);
				this.html = {};
				let p = chart.html.g;
				let g = p.append('g');
				this.html.person = g.append('rect').attr('x', cx).attr('y', cy).attr('width', '1px').attr('height', '1px').attr('id', 'person_id-' + this.info.id).classed('person_circle', true);
				/*
				let r = this.settings.my_person.r*2;
				let id = this.settings.my_person.id;
				let img = this.info.img;
				this.html.circle = this.html.g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 1).attr('id', id).classed('person_circle', true);
				
				var shift={}
				shift.x = this.settings.shift.x;
				shift.y =  this.settings.shift.y;
				
				let x = this.html.circle[0][0].getBoundingClientRect().left - shift.x;
				let y = this.html.circle[0][0].getBoundingClientRect().top - shift.y;
				
				var svg_container = chart.html.svg_container;
				
				this.html.person ={};
				//console.log(this);
				this.html.person = g.append('rect').attr('x',cx).attr('y',cy).attr('width','1px').attr('height','1px').attr('id', 'person_id-'+this.info.id).classed('person_circle', true);
				
				var person = this.html.person.block = svg_container.append('div').classed('person', true).attr('id', 'staff_container-'+id)
																					.style('width', r*1+'px').style('height', r*1+'px')
																					.style('top', y+'px').style('left', x+'px');
				var container = this.html.person.container = person.append('div').classed('person_container', true);
				
				this.html.person.assess_other = container.append('a').attr('href','#').classed('assess_other', true).html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 255.843L299.221 22.522v139.202h-45.238C113.712 161.724 0 275.437 0 415.708v73.77l20.094-22.016a360.571 360.571 0 0 1 266.324-117.5h12.803v139.202L512 255.843z" fill="#93d632"/><path d="M0 415.708v73.77l20.094-22.017a360.571 360.571 0 0 1 266.324-117.5h12.803v139.202L512 255.843H56.635C21.228 299.497 0 355.12 0 415.708z" fill="#86c42b"/></svg>');
				this.html.person.assess = container.append('a').attr('href','#').classed('assess', true).html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 255.843L299.221 22.522v139.202h-45.238C113.712 161.724 0 275.437 0 415.708v73.77l20.094-22.016a360.571 360.571 0 0 1 266.324-117.5h12.803v139.202L512 255.843z" fill="#93d632"/><path d="M0 415.708v73.77l20.094-22.017a360.571 360.571 0 0 1 266.324-117.5h12.803v139.202L512 255.843H56.635C21.228 299.497 0 355.12 0 415.708z" fill="#86c42b"/></svg>');
				this.html.person.full_name = container.append('div').classed('full_name', true).html(this.info.user_name);
				this.html.photo ={};
				this.html.photo.container = person.append('div').style('width', r+'px').style('height', r+'px').classed('photo_div', true).attr('id', 'staff_photo_id-'+id);
				this.html.photo.div =	this.html.photo.container.append('div');
																					
				this.html.photo.img =	this.html.photo.div.append('img').attr("src", "assets/img/staff/"+img).classed('staff_photo', true);
				*/
			}
			/*МЕТОДЫ КРУГОВ*/
			//Отрисовка кругов
			circle.f.path_gen = function (i) {
				let g = chart.html.g_circle;
				let r = this.settings.r;
				this.html.circle = g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', r).classed('circle', true).attr('id', 'circle_n-' + i);
				if(i==0){
					g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', r - 30).classed('circle_unvisible', true);
				}
				try{
					const tooltip = document.querySelector('.tooltip')
					const toolName = document.querySelector('.toolName')
					const popupOpen = () => {
						tooltip.style.display ='block'
						
						const e = window.event;
						const posX = e.clientX;
						const posY = e.clientY;
						tooltip.style.left = (posX+5)+'px'
						tooltip.style.top  = (posY+5)+'px'
						
						toolName.innerHTML= this.info.circle_name
						
					}
					const popupClose = () => {
						tooltip.style.display ='none'
					}
					this.html.circle[0][0].addEventListener("mouseover", popupOpen);
					this.html.circle[0][0].addEventListener("mousemove", popupOpen);
					this.html.circle[0][0].addEventListener("mouseleave", popupClose);
				}catch(err){
					console.log(err)
				}

			}

			/*МЕТОДЫ ПОДРАЗДЕЛЕНИЙ*/
			//Расчет координат вектора подразделений
			division.f.vector_gen = function () {
				this.settings.p2 = this.__proto__.__proto__.settings.division.p2;
				this.vector = { 'p1': [0, 0], 'p2': [0, this.settings.p2] };
				//console.log(this);
			}
			//Генерация path для векторов подразделений
			division.f.path_gen = function () {
				if (this.vector != undefined) {
					let vector = this.vector;
					this.html.path = this.html.g.append('line').classed('div_path ' + this.settings.path_style + '', true).style('cursor', 'pointer').attr('stroke-width', this.settings.path_width)
						.attr('x1', vector.p1[0]).attr('y1', vector.p1[1])
						.attr('x2', vector.p2[0]).attr('y2', vector.p2[1]);


					if (this.info) {
						if (this.info.assess_me) {
							if (this.info.assess_me.rate != undefined || this.info.assess_me.rate != null) {
								//console.log(color_picker(this.info.assess_me.rate));
								this.html.path.style('stroke', color_picker(this.info.assess_me.rate));
							}
						}
					}
				}
			}
			//Тултип, отображения информации частот по департаменту
			division.f.tooltip = function () {
				var current_div = this;
				var shift_x = current_div.settings.shift.x;
				var shift_y = current_div.settings.shift.y;

				var division_info_div = chart.html.division_info.division_info_div;

				this.html.path.node().onclick = function (e) {
					//console.log('current_div:', current_div);
					//console.log('e:', e);
					//document.getElementById('department_info_number').innerHTML = current_div.info.assess.real_frequency;
					document.getElementById('department_info_name').innerHTML = current_div.info.name;
					if (current_div.info.assess_me.rate != undefined & current_div.info.assess_me.rate != null & current_div.info.assess_me.rate != 0) {
						document.getElementById('department_info_assess_me_rate').innerHTML = Math.round(current_div.info.assess_me.rate * 10) / 10;
					} else {
						document.getElementById('department_info_assess_me_rate').innerHTML = "0.0";
					}

					if (current_div.info.assess_other.rate != undefined & current_div.info.assess_other.rate != null & current_div.info.assess_other.rate != 0) {
						document.getElementById('department_info_assess_other_rate').innerHTML = Math.round(current_div.info.assess_other.rate * 10) / 10;
					} else {
						document.getElementById('department_info_assess_other_rate').innerHTML = "0.0";
					}
					document.getElementById('dpertmant_assess_me_fr').innerHTML = current_div.info.assess_me.real_frequency;
					document.getElementById('dpertmant_assess_other_fr').innerHTML = current_div.info.assess_other.real_frequency;

					division_info_div.style('visibility', 'visible').style('opacity', '0').style('top', e.clientY + 'px').style('left', e.clientX + 'px');
					division_info_div.style('opacity', '1');

					division_info_div.node().onmouseleave = function () {
						division_info_div.style('opacity', '0');

						division_info_div.style('visibility', 'hidden');

						//setTimeout(func, 250);

					}
					//console.log(this);

				}


			}

			/*МЕТОДЫ ПЕРСОНАЛА*/
			//Генерация path для персонала
			staff.f.path_gen = function () {
				var vectors = this.path_vectors;
				var path_width = this.settings.path_width;

				let div_info = this.__proto__.__proto__.info;

				let id = 'staff_gradient_' + this.info.id;
				var group = this.html.g;
				if (this.settings.angle != 0) {
					if (this.info.assess_me.rate != undefined || this.info.assess_me.rate != null) {
						let defs = group.append('defs').append('linearGradient')
						.attr('id', id).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
						defs.html('<stop offset="0%" stop-color="' 
							+ color_picker(div_info.assess_me.rate) 
							+ '" /> <stop offset="100%" stop-color="' 
							+ color_picker(this.info.assess_me.rate) 
							+ '" />');
					}
					this.html.path2 = group.append('path').attr('d', function () {
						var d = 'M' + vectors[0].p1[0] + ' ' + vectors[0].p1[1] + ' C ' + vectors[0].p2[0] + ' ' + vectors[0].p2[1] + ' ' + vectors[1].p2[0] + ' ' + vectors[1].p2[1] + ' , ' + vectors[2].p2[0] + ' ' + vectors[2].p2[1];
						//console.log(d);
						return d;
					}).classed('staff_path ' + this.settings.path_style + '', true).attr('stroke-width', path_width).attr('fill', "transparent");
					this.html.path = group.append('path').attr('d', function () {
						var d = 'M' + vectors[0].p1[0] + ' ' + vectors[0].p1[1] + ' C ' + vectors[0].p2[0] + ' ' + vectors[0].p2[1] + ' ' + vectors[1].p2[0] + ' ' + vectors[1].p2[1] + ' , ' + vectors[2].p2[0] + ' ' + vectors[2].p2[1];
						//console.log(d);
						return d;
					}).classed('staff_path ' + this.settings.path_style + '', true).attr('stroke-width', path_width).attr('fill', "transparent");
				
				} else {
					
					if (this.info.assess_me.rate != undefined || this.info.assess_me.rate != null) {
						let defs = group.append('defs').append('linearGradient').attr('id', id).attr('x1', vectors[0].p1[0]).attr('y1', vectors[0].p1[1])
							.attr('x2', vectors[2].p2[0]).attr('y2', vectors[2].p2[1])
							.attr('gradientUnits', 'userSpaceOnUse');
						defs.html('<stop stop-color="' + color_picker(div_info.assess_me.rate) + '" offset="0" /> 	<stop stop-color="' + color_picker(this.info.assess_me.rate) + '" offset="1" />');
					}
					this.html.path2 = group.append('line').classed('staff_path ' + this.settings.path_style + '', true).attr('stroke-width', path_width)
						.attr('x1', vectors[0].p1[0]).attr('y1', vectors[0].p1[1])
						.attr('x2', vectors[2].p2[0]).attr('y2', vectors[2].p2[1]);
					this.html.path = group.append('line').classed('staff_path ' + this.settings.path_style + '', true).attr('stroke-width', path_width)
						.attr('x1', vectors[0].p1[0]).attr('y1', vectors[0].p1[1])
						.attr('x2', vectors[2].p2[0]).attr('y2', vectors[2].p2[1]);
				}
				if (this.info.assess_me.rate != undefined || this.info.assess_me.rate != null) {
					let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
					this.html.path2.style('stroke', color_picker(this.info.assess_me.rate));
					if (isIE11 != true) {
						this.html.path.style('stroke', 'url(#' + id + ')');
					}
				}
				//console.log('this.settings.angle',this.settings.angle, this.html.path[0][0])

			}
			//Рисуем людей
			staff.f.person_gen = function () {
				let r = this.settings.staff; //Радиус круга персонала
				let cx = this.vector.p2[0];
				let cy = this.vector.p2[1];

				//console.log(this.vector);
				let g = this.html.g;
				this.html.person = g.append('rect').attr('x', cx).attr('y', cy).attr('width', '1px').attr('height', '1px').attr('id', 'person_id-' + this.info.id).classed('person_circle', true);


			}
			//Расчет основных векторов персонала
			staff.f.vector_gen = function () {
				//Установка параметров точки старта
				var div_path_width = this.settings.path_width;
				var start_point = -div_path_width / 2;

				//Установка параметров длины вектора подразделений
				div_p2 = this.settings.p2;


				//Установка праметров угла
				var sf_qnt = this.staff.length;
				//console.log(sf_qnt);
				var max_sector = chart.settings.max_sector;
				var max_staff = chart.settings.max_staff;

				if (sf_qnt > 1) {
					if (chart.settings.symmetric == true) {
						var sector = (sf_qnt / max_staff) * max_sector;
						var angle = -sector / 2;
						var angle_step = sector / (sf_qnt - 1);
					} else {
						//console.log('max_sector',max_sector);
						var sector = this.settings.sector;
						var angle = -sector / 2 + this.settings.person_sector / 2;
						var angle_step = this.settings.person_sector;
					}

				} else if (sf_qnt == 1) {
					var sector = 0;
					var angle = 0;
					var angle_step = 0;
				} else {
					var sector = 0;
					var angle = 0;
					var angle_step = 0;
				}

				for (let i = 0; i < this.staff.length; i++) {
					let s = this.staff[i];
					let d = s.__proto__.__proto__;
					if (s.info.header_type) {
						if (d.info.level <= chart.user.info.level) {
							if (d.info.branch == true) {
								s.info.boss = 'my_boss';
							} else {
								s.info.boss = 'just_boss';
							}
						} else {
							s.info.boss = 'just_boss';
						}
					}
					//Радиус соответсвующего круга
					sf_p2 = this.settings.r;
					if (s.info.boss) {
						if (s.info.boss == 'my_boss') {
							sf_p2 = chart.settings.boss_r;
						}
					}

					s.settings.start_point = start_point + s.settings.path_width / 2;
					start_point = start_point + s.settings.path_width;


					s.vector = { 'p1': [0, 0], 'p2': [0, sf_p2] }
					s.settings.angle = angle;
					angle = angle + angle_step;

					s.rotation_vector();

					let sp = s.settings.start_point;
					s.path_vectors = [];
					s.path_vectors[0] = { 'p1': [sp, div_p2], 'p2': [sp, sf_p2 * 0.7] };
					s.path_vectors[1] = { 'p1': [sp, sf_p2 * 0.7], 'p2': [s.vector.p2[0] * 0.7, s.vector.p2[1] * 0.7] };
					s.path_vectors[2] = { 'p1': [s.vector.p2[0] * 0.7, s.vector.p2[1] * 0.7], 'p2': [s.vector.p2[0] * 0.95, s.vector.p2[1] * 0.95] };

					s.path_gen();
					s.person_gen();
				}
			}
			//Печать кнопки перехода к подчиненнным
			staff.f.set_subordinate = function () {
				let person_container = this.html.person.container;
				let photo_container = this.html.photo.container;

				let person_information = this.info;
				let r = this.settings.photo.r;

				let subordinate = person_container.append('div').attr('id', 's_id-' + this.info.id).classed('get_subordinate', true);

				subordinate.style('top', r / 2 + 'px').style('left', r / 1.8 + 'px');
				subordinate.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94"><path d="M86.75 70.981V59.5c0-6.934-4.594-17.25-17.25-17.25h-10c-7.06 0-7.717-3.464-7.75-5.25V23.02C56.014 21.178 59 16.939 59 12c0-6.626-5.373-12-12-12S35 5.374 35 12c0 4.939 2.986 9.178 7.25 11.02V37c0 1.294-.374 5.25-7.75 5.25h-10c-12.656 0-17.25 10.316-17.25 17.25v11.481C2.986 72.822 0 77.062 0 82c0 6.627 5.373 12 12 12s12-5.373 12-12c0-4.938-2.986-9.178-7.25-11.019V59.5c0-1.294.374-7.75 7.75-7.75h10c3.035 0 5.595-.459 7.75-1.237v20.469C37.986 72.822 35 77.062 35 82c0 6.627 5.373 12 12 12s12-5.373 12-12c0-4.938-2.986-9.178-7.25-11.019V50.513c2.155.778 4.715 1.237 7.75 1.237h10c7.06 0 7.717 5.964 7.75 7.75v11.481C72.986 72.822 70 77.062 70 82c0 6.627 5.373 12 12 12s12-5.373 12-12c0-4.938-2.986-9.178-7.25-11.019zM18.923 82a6.924 6.924 0 0 1-13.846 0 6.924 6.924 0 0 1 13.846 0zm21.154-70a6.924 6.924 0 0 1 13.846 0 6.924 6.924 0 0 1-13.846 0zm13.846 70a6.924 6.924 0 1 1-13.847-.001A6.924 6.924 0 0 1 53.923 82zM82 88.923a6.924 6.924 0 0 1 0-13.846 6.924 6.924 0 0 1 0 13.846z" fill="#030104"></path></svg>');
				subordinate.node().onclick = function () {
					//console.log(person_container);
					//console.log(this);
					d3.selectAll('.get_subordinate').style('visibility', 'hidden');
					d3.selectAll('.person_container').style('visibility', 'hidden');
					d3.selectAll('.main_svg').style('display', 'none');
					d3.selectAll('.person').style('display', 'none');

					//console.log('settings.my_person.r*2', settings.my_person.r*2)
					let staff_container = d3.select('#staff_container-' + person_information.id).style('display', 'block');
					staff_container.style('top', '350px').style('left', '350px');
					photo_container.style('width', settings.my_person.r * 2 + 'px').style('height', settings.my_person.r * 2 + 'px');
					//console.log('person_info', person_information);

					_person.item = {
						"full_name": person_information.user_name,
						"img": person_information.img,
						"position": person_information.position,
						"id": person_information.id
					}
					function func() {
						d3.select('.loading').style('display', 'block');
						_person.add_user(_person.item);
					}

					setTimeout(func, 250);

				}
			}
			//Отрисовка фотографии сотрудника
			chart.person_photo = function () {
				//console.log(this);
				var shift = {};
				shift.x = this.settings.shift.x;
				shift.y = this.settings.shift.y;
				let svg_container = chart.html.svg_container;

				let svg = chart.html.svg;
				let person_information = this.info;
				let img = get_img_url(person_information);
				
				let name = this.info.name;
				let id = this.info.id;

				var max_r = 0.85 * this.settings.person_sector * Math.PI * chart.settings.circle[1].r;

				if (max_r < this.settings.staff_r) {
					chart.settings.staff_r = max_r;
				}
				//console.log('staff_r',this.settings.staff_r);
				//console.log('max_r', max_r);
				//console.log(this.settings.person_sector);
				//console.log(this);
				this.settings.photo = {};
				if (this.info.boss) {
					if (this.info.boss == 'my_boss') {
						var r = this.settings.photo.r = chart.settings.staff_r * chart.settings.circle[2].staff * 2;
					} else if (this.info.boss == 'just_boss') {
						var r = this.settings.photo.r = chart.settings.staff_r * 1.1 * 2;
					}
				} else {
					var r = this.settings.photo.r = chart.settings.staff_r * this.settings.staff * 2;
				}
				if (this.info.main_user == true) {
					var r = this.settings.photo.r = chart.settings.my_person.r * 2;
				}
				//console.log('this',this);
				let x = this.settings.photo.x = this.html.person.node().getBoundingClientRect().left - shift.x;
				let y = this.settings.photo.y = this.html.person.node().getBoundingClientRect().top - shift.y;

				//console.log(this.html.person.node());
				this.html.person = {};
				var person = this.html.person.block = svg_container.append('div').classed('person', true).attr('id', 'staff_container-' + id)
					.style('width', r * 1 + 'px').style('height', r * 1 + 'px')
					.style('top', y + 'px').style('left', x + 'px');


				const container = this.html.person.container = person.append('div').classed('person_container', true);
				const person_info = this.html.person.person_info = container.append('div').classed('person_info', true)
				const choise_ranking = this.html.person.choise_ranking =  person_info.append('div').classed('choise_ranking', true);
				const ranking = this.html.person.ranking =  person_info.append('div').classed('ranking', true);
				const req_ranking = this.html.person.req_ranking =  person_info.append('div').classed('req_ranking', true);
				ranking.node().innerHTML =
				`<p>Assess your colleague on a five-point scale</p>
					<div class="stars">
						<svg enable-background="new 0 0 47.94 47.94" version="1.1" viewBox="0 0 47.94 47.94" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
							<path d="m26.285 2.486 5.407 10.956c0.376 0.762 1.103 1.29 1.944 1.412l12.091 1.757c2.118 0.308 2.963 2.91 1.431 4.403l-8.749 8.528c-0.608 0.593-0.886 1.448-0.742 2.285l2.065 12.042c0.362 2.109-1.852 3.717-3.746 2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403 0l-10.814 5.685c-1.894 0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096 1.431-4.403l12.091-1.757c0.841-0.122 1.568-0.65 1.944-1.412l5.407-10.956c0.946-1.919 3.682-1.919 4.629 0z"/>
						</svg>
						<svg enable-background="new 0 0 47.94 47.94" version="1.1" viewBox="0 0 47.94 47.94" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
							<path d="m26.285 2.486 5.407 10.956c0.376 0.762 1.103 1.29 1.944 1.412l12.091 1.757c2.118 0.308 2.963 2.91 1.431 4.403l-8.749 8.528c-0.608 0.593-0.886 1.448-0.742 2.285l2.065 12.042c0.362 2.109-1.852 3.717-3.746 2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403 0l-10.814 5.685c-1.894 0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096 1.431-4.403l12.091-1.757c0.841-0.122 1.568-0.65 1.944-1.412l5.407-10.956c0.946-1.919 3.682-1.919 4.629 0z"/>
						</svg>
						<svg enable-background="new 0 0 47.94 47.94" version="1.1" viewBox="0 0 47.94 47.94" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
							<path d="m26.285 2.486 5.407 10.956c0.376 0.762 1.103 1.29 1.944 1.412l12.091 1.757c2.118 0.308 2.963 2.91 1.431 4.403l-8.749 8.528c-0.608 0.593-0.886 1.448-0.742 2.285l2.065 12.042c0.362 2.109-1.852 3.717-3.746 2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403 0l-10.814 5.685c-1.894 0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096 1.431-4.403l12.091-1.757c0.841-0.122 1.568-0.65 1.944-1.412l5.407-10.956c0.946-1.919 3.682-1.919 4.629 0z"/>
						</svg>
						<svg enable-background="new 0 0 47.94 47.94" version="1.1" viewBox="0 0 47.94 47.94" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
							<path d="m26.285 2.486 5.407 10.956c0.376 0.762 1.103 1.29 1.944 1.412l12.091 1.757c2.118 0.308 2.963 2.91 1.431 4.403l-8.749 8.528c-0.608 0.593-0.886 1.448-0.742 2.285l2.065 12.042c0.362 2.109-1.852 3.717-3.746 2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403 0l-10.814 5.685c-1.894 0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096 1.431-4.403l12.091-1.757c0.841-0.122 1.568-0.65 1.944-1.412l5.407-10.956c0.946-1.919 3.682-1.919 4.629 0z"/>
						</svg>
						<svg enable-background="new 0 0 47.94 47.94" version="1.1" viewBox="0 0 47.94 47.94" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
							<path d="m26.285 2.486 5.407 10.956c0.376 0.762 1.103 1.29 1.944 1.412l12.091 1.757c2.118 0.308 2.963 2.91 1.431 4.403l-8.749 8.528c-0.608 0.593-0.886 1.448-0.742 2.285l2.065 12.042c0.362 2.109-1.852 3.717-3.746 2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403 0l-10.814 5.685c-1.894 0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096 1.431-4.403l12.091-1.757c0.841-0.122 1.568-0.65 1.944-1.412l5.407-10.956c0.946-1.919 3.682-1.919 4.629 0z"/>
						</svg>
					</div>
					<div class="assess me">
						<div class="txt_assess_other access_confirm">
							<div>Proceed</div>
						</div>
					</div>`
				req_ranking.node().innerHTML =
				`<br/><br/>
				<p>
					You asked your colleague to аssess you. After she(he) will assess you, you can see it on the diagram
				</p>
				<div class="assess me">
					<div class="txt_assess_me access_confirm">
						<div>Ok</div>
					</div>
				</div>`
				let mark_person = 0
				const assess_process =()=>{
					
					const stars = ranking.node().querySelectorAll('svg')
					stars.forEach((s,i)=>{
						s.onclick = function(){
							mark_person = i+1;
							stars.forEach((st,j)=>{
								if (j <= i){
									
									st.classList.add('active')
									//console.log(st)
								}else{
									st.classList.remove(...st.classList)
								}
								
							})
						}
					})
					
				}
				assess_process()
				let position = this.html.person.position = choise_ranking.append('div').classed('position', true);
				if (this.info.position) {
					position.html(this.info.position);
				}

				this.html.person.rate = choise_ranking.append('div').classed('rate', true);
				let ass_me = this.html.person.rate.append('div').classed('result ass_me', true);
				let ass_me_info = ass_me.append('div');
				ass_me_info.append('div').classed('assess_icon', true).html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#404040" d="M27.566 16.437a1.476 1.476 0 0 1 0 2.086l-2.589 2.589 1.654 1.653c.577.578.391 1.212-.6 1.209-1.061 0-4.044.014-4.93.014-.818 0-1.118-.386-1.118-1.145 0-.66-.018-4.1-.018-5.288 0-.612.58-.874 1.1-.354l1.82 1.82 2.589-2.589a1.474 1.474 0 0 1 2.085 0z"></path><path fill="#ffd800" d="M17.333 23.842l-5.063-2.743a.553.553 0 0 0-.535 0l-5.022 2.828a.554.554 0 0 1-.816-.586l1.04-5.685a.557.557 0 0 0-.169-.509l-4.228-3.92a.557.557 0 0 1 .3-.96l5.706-.767a.555.555 0 0 0 .43-.319l2.409-5.251a.553.553 0 0 1 1-.008l2.486 5.212a.554.554 0 0 0 .435.312l5.716.675a.557.557 0 0 1 .317.956l-4.169 3.987a.558.558 0 0 0-.161.512l1.124 5.668a.555.555 0 0 1-.8.598z" data-name="Shape 1179 copy 7"></path></svg>');
				if (this.info.assess_me.rate) {
					ass_me_info.append('div').classed('assess_rate', true).html(Math.round(this.info.assess_me.rate * 10) / 10);
				} else {
					ass_me_info.append('div').classed('assess_rate', true).style('color', 'rgba(0,0,0,0.3)').html('0.0');
				}

				let txt_me = ass_me.append('div').classed('txt', true);
				txt_me.append('span').html('received');
				if (this.info.assess_me.real_frequency != undefined & this.info.assess_me.real_frequency != null & this.info.assess_me.real_frequency != 0) {
					txt_me.append('span').html('ranks: ' + '<b>' + this.info.assess_me.real_frequency + '</b>');
				} else {
					txt_me.append('span').html('ranks: 0');
				}

				let ass_other = this.html.person.rate.append('div').classed('result ass_other', true);
				let ass_other_info = ass_other.append('div');
				ass_other_info.append('div').classed('assess_icon', true).html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#404040" d="M20.406 23.555a1.476 1.476 0 0 1 0-2.086l2.589-2.589-1.654-1.653c-.577-.578-.391-1.212.6-1.209 1.061 0 4.044-.014 4.93-.014.818 0 1.118.386 1.118 1.145 0 .66.018 4.1.018 5.288 0 .612-.58.874-1.1.354l-1.82-1.82-2.589 2.589a1.474 1.474 0 0 1-2.085 0z"></path><path fill="#ffd800" d="M17.333 23.842l-5.063-2.743a.553.553 0 0 0-.535 0l-5.022 2.828a.554.554 0 0 1-.816-.586l1.04-5.685a.557.557 0 0 0-.169-.509l-4.228-3.92a.557.557 0 0 1 .3-.96l5.706-.767a.555.555 0 0 0 .43-.319l2.409-5.251a.553.553 0 0 1 1-.008l2.486 5.212a.554.554 0 0 0 .435.312l5.716.675a.557.557 0 0 1 .317.956l-4.169 3.987a.558.558 0 0 0-.161.512l1.124 5.668a.555.555 0 0 1-.8.598z" data-name="Shape 1179 copy 7"></path></svg>');
				if (this.info.assess_other.rate) {
					ass_other_info.append('div').classed('assess_rate', true).html(Math.round(this.info.assess_other.rate * 10) / 10);
				} else {
					ass_other_info.append('div').classed('assess_rate', true).style('color', 'rgba(0,0,0,0.3)').html('0.0');
				}
				let txt_other = ass_other.append('div').classed('txt', true)
				txt_other.append('span').html('sent');
				if (this.info.assess_other.real_frequency != undefined & this.info.assess_other.real_frequency != null & this.info.assess_other.real_frequency != 0) {
					txt_other.append('span').html('ranks: ' + '<b>' + this.info.assess_other.real_frequency + '</b>');
				} else {
					txt_other.append('span').html('ranks: 0');
				}
				this.html.person.assess_me ={}; this.html.person.assess_other={}
			
				const assess_me_click =()=>{
					//console.log('assess_click')
					this.html.person.choise_ranking.style("transform","translateX(-100%)");
					this.html.person.req_ranking.node().style.transform = "translateX(0%)";		
				}
				const assess_other_click =()=>{
					
					this.html.person.choise_ranking.node().style.transform= "translateX(-100%)";
					this.html.person.ranking.node().style.transform = "translateX(0%)";		
				}
				const assess_confirm =()=>{
					this.html.person.choise_ranking.node().style.transform= "translateX(0%)";
					this.html.person.ranking.node().style.transform = "translateX(100%)";
					this.html.person.req_ranking.node().style.transform = "translateX(100%)";					
				}
				const txt_assess_other = person_info.node().querySelector('.txt_assess_other')
				txt_assess_other.onclick = function(){
					var req_url = config.api_url + '/assess_other';
					let sub_user_id = _person.item.id;
					const param ={
						"assessor_user_id": sub_user_id,
						"assessed_user_id": person_information.id,
						"rate": mark_person
					}
					const callback =(responce)=>{
						console.log(responce)
					}
					console.log(req_url, token, param)
					ajax_get_param(req_url, token, callback, param)
					assess_confirm()
				}
				const txt_assess_me = person_info.node().querySelector('.txt_assess_me')
				txt_assess_me.onclick = function(){
					assess_confirm()
				}
				//const current_person_id = this.info.id
				const print_popup_info_other =()=>{
					this.html.person.assess_me.href = config.url + '/rtf/ame/rtfcreaterequestme/'+this.info.id;
					this.html.person.assess_me.html = choise_ranking.append('div').classed('assess me', true);
					
					this.html.person.assess_me.html.node().addEventListener('click', assess_me_click)
					this.html.person.assess_me.html = this.html.person.assess_me.html.append('div')
					this.html.person.assess_me.html.append('div').classed('svg_assess_other', true).html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.a{fill:rgba(255,255,255,0);}.b{opacity:0.502;}</style></defs><g transform="translate(1 6)"><g transform="translate(-1172 -28)"><path class="a" d="M.171,0h32V32h-32Z" transform="translate(1170.829 22)"/></g><path d="M.018,6.841c0-.66-.018-4.1-.018-5.288C0,.942.581.679,1.1,1.2l1.827,1.82L5.53.429a1.481,1.481,0,0,1,2.1,2.091l-2.6,2.589L6.69,6.763c.579.577.393,1.211-.6,1.209-1.065,0-4.06.014-4.95.014C.319,7.986.018,7.6.018,6.841Z" transform="translate(18.707 10.403)"/><path class="b" d="M804.444,763.843,799.36,761.1a.557.557,0,0,0-.537,0l-5.042,2.828a.556.556,0,0,1-.819-.586l1.044-5.686a.556.556,0,0,0-.17-.509l-4.245-3.92a.556.556,0,0,1,.3-.96l5.729-.767a.556.556,0,0,0,.432-.319l2.419-5.251a.556.556,0,0,1,1.007-.008l2.5,5.212a.556.556,0,0,0,.437.312l5.74.675a.556.556,0,0,1,.318.956l-4.186,3.987a.557.557,0,0,0-.162.512l1.128,5.668A.557.557,0,0,1,804.444,763.843Z" transform="translate(-789.413 -745.607)"/></g></svg>');
					this.html.person.assess_me.html.append('div').classed('txt_assess_other', true).html('Request assess');
					
					
					this.html.person.assess_other.href = config.url + '/rtf/aother/rtfcreaterequestother/'+this.info.id;
					this.html.person.assess_other.html = choise_ranking.append('div').classed('assess other', true);
					this.html.person.assess_other.html.node().addEventListener('click', assess_other_click)
					
					this.html.person.assess_other.html = this.html.person.assess_other.html.append('div')
					this.html.person.assess_other.html.append('div').classed('svg_assess_other', true).html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.a{fill:rgba(255,255,255,0);}.b{opacity:0.502;}</style></defs><g transform="translate(2 6)"><g transform="translate(-1173 -28)"><path class="a" d="M.171,0h32V32h-32Z" transform="translate(1170.829 22)"/></g><path d="M.436,7.552a1.472,1.472,0,0,1,0-2.086l2.6-2.589L1.37,1.223C.791.645.977.011,1.97.014,3.035.018,6.03,0,6.92,0c.821,0,1.122.386,1.122,1.145,0,.66.018,4.1.018,5.288,0,.612-.582.874-1.1.354L5.129,4.966l-2.6,2.589a1.484,1.484,0,0,1-2.094,0Z" transform="translate(17.681 10.397)"/><path class="b" d="M785.444,822.843,780.36,820.1a.557.557,0,0,0-.537,0l-5.042,2.828a.556.556,0,0,1-.819-.586l1.044-5.685a.556.556,0,0,0-.17-.509l-4.245-3.92a.556.556,0,0,1,.3-.96l5.729-.767a.557.557,0,0,0,.432-.319l2.419-5.251a.556.556,0,0,1,1.007-.008l2.5,5.212a.557.557,0,0,0,.437.312l5.74.675a.556.556,0,0,1,.318.956l-4.186,3.987a.557.557,0,0,0-.162.512l1.128,5.668A.557.557,0,0,1,785.444,822.843Z" transform="translate(-770.413 -804.607)"/></g></svg>');
					this.html.person.assess_other.html.append('div').classed('txt_assess_other', true).html('Assess colleague');
				}
				const print_popup_info_me =()=>{
					this.html.person.assess_other.href = config.url + '/rtf/aself/rtfcreaterequestself/';
					this.html.person.assess_other.html = choise_ranking.append('div').classed('assess other', true);
					this.html.person.assess_other.clik = click_event;
					this.html.person.assess_other.clik();
					this.html.person.assess_other.html = this.html.person.assess_other.html.append('div');
					this.html.person.assess_other.html.append('div').classed('svg_assess_other', true).html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.a{fill:rgba(255,255,255,0);}.b{opacity:0.502;}</style></defs><g transform="translate(2 6)"><g transform="translate(-1173 -28)"><path class="a" d="M.171,0h32V32h-32Z" transform="translate(1170.829 22)"/></g><path d="M.436,7.552a1.472,1.472,0,0,1,0-2.086l2.6-2.589L1.37,1.223C.791.645.977.011,1.97.014,3.035.018,6.03,0,6.92,0c.821,0,1.122.386,1.122,1.145,0,.66.018,4.1.018,5.288,0,.612-.582.874-1.1.354L5.129,4.966l-2.6,2.589a1.484,1.484,0,0,1-2.094,0Z" transform="translate(17.681 10.397)"/><path class="b" d="M785.444,822.843,780.36,820.1a.557.557,0,0,0-.537,0l-5.042,2.828a.556.556,0,0,1-.819-.586l1.044-5.685a.556.556,0,0,0-.17-.509l-4.245-3.92a.556.556,0,0,1,.3-.96l5.729-.767a.557.557,0,0,0,.432-.319l2.419-5.251a.556.556,0,0,1,1.007-.008l2.5,5.212a.557.557,0,0,0,.437.312l5.74.675a.556.556,0,0,1,.318.956l-4.186,3.987a.557.557,0,0,0-.162.512l1.128,5.668A.557.557,0,0,1,785.444,822.843Z" transform="translate(-770.413 -804.607)"/></g></svg>');
					this.html.person.assess_other.html.append('div').classed('txt_assess_other', true).html('Assess yourself');
				}
				if (this.info.id != _person.item.id) {
					print_popup_info_other()
				} else {
					print_popup_info_me()
				}
				this.html.person.full_name = container.append('div').classed('full_name', true).html(this.info.user_name);

				this.html.photo = {};
				this.html.photo.container = person.append('div').style('width', r + 'px').style('height', r + 'px').classed('photo_div', true).attr('id', 'staff_photo_id-' + id);
				this.html.photo.div = this.html.photo.container.append('div').classed('photo_' + this.settings.path_style + '', true);

				this.html.photo.img = this.html.photo.div.append('img').attr("src", img).classed('staff_photo img_' + this.settings.path_style + '', true);
				//test_data = this;
				//console.log(this);

				if (this.__proto__.__proto__.__proto__) {
					let subordinate_circle = this.__proto__.__proto__.__proto__.__proto__.info.circle_name;
					if (subordinate_circle == 'Подчиненные') {
						this.set_subordinate();
					} else {
						let per_division = this.__proto__.__proto__.info;
						let per_hid = this.__proto__.__proto__.info.hid;
						let owner_hid = _person.owner.hid;

						let result = [];
						let subortinate = false;
						if (owner_hid.length < per_hid.length) {
							result = owner_hid.diff(per_hid);
							//console.log('owner_hid',owner_hid);
							//console.log('per_hid',per_hid);
							//console.log('result',result);
							if (result.length == 0) {
								if (_person.owner.header_type == 1) {
									subortinate = true;
								}
							}
						} else if (owner_hid.length == per_hid.length) {
							result = per_hid.diff(owner_hid);
							//console.log('owner_hid',owner_hid);
							//console.log('per_hid',per_hid);
							//console.log('result',result);
							if (result.length == 0) {
								if (_person.owner.header_type == 1) {
									subortinate = true;
								}
							}
						}
						if (subortinate == true) {
							this.set_subordinate();
						}
						//console.log('per_division', per_division);
						//console.log('_person.owner',_person.owner);
					}
				}

			}
			//Окно дополнительной информации о сотруднике
			chart.person_popup = function () {
				var current_person = this;
				const person = this.html.person.block.node();
				
				person.onmouseenter = function () {
					this.style.zIndex = 100;
					var person = d3.select(this);
					var container = person.select('.person_container');
					var subordinate = person.select('.get_subordinate');
					subordinate.style('display', 'none');
					person_foto = person.select('.photo_div').select('div');
					person_foto.style('transform', 'scale(1.2)');
					person_foto.style('box-shadow', '0px 0px 12px 0px rgba(0,0,0,0.75)');
					person_foto.style('border-box', '0px 0px 12px 0px rgba(0,0,0,0.75)')
					container.style('display', 'block');
					container.style('opacity', '1');
					person.select('.full_name').style('border', '1px solid rgba(200,200,200,1)');
					this.onmouseleave = function () {
						this.style.zIndex = 25;
						var person = d3.select(this);
						var container = person.select('.person_container');
						person_foto = person.select('.photo_div').select('div');
						person_foto.style('box-shadow', 'none');
						person_foto.style('transform', 'scale(1.0)');
						container.style('display', 'none');
						container.style('opacity', '0');

						var person_info = person.select('.person_info');
						person_info.style('display', 'none');
						person.select('.full_name').style('border', '1px solid rgba(200,200,200,1)');

					}
					const person_info_transform =(person)=>{
						//console.log('person', person.select('.choise_ranking'));
						try{
							person.select('.choise_ranking').style('transform', 'translateX(0%)')
							person.select('.req_ranking').style('transform', 'translateX(100%)')
							person.select('.ranking').style('transform', 'translateX(100%)')
						}catch(err){
							console.log(err)
						}
					}
					person_info_transform(person)		
					this.onclick = function () {
						
						subordinate.style('display', 'block');
						const person = d3.select(this);
						
						var full_name = person.select('.full_name');
						full_name.style('border', 'none');
						var width_full_name = full_name.node().getClientRects()[0].width;
						if (width_full_name > 270) {
							person.select('.person_info').style('width', width_full_name + 20 + 'px')
						}
						person_foto = person.select('.photo_div').select('div');
						person_foto.style('transform', 'scale(1.0)');
						person_foto.style('box-shadow', 'none');
						var person_info = person.select('.person_info');
						person_info.style('display', 'block');
						//console.log(current_person);



						//console.log(full_name);
					}

				}
			}


			/*ОБЩИЕ МЕТОДЫ ГЕНЕРАЦИИ ДИАГРАММЫ*/
			//Генерируем объекты персонала
			chart.staff_generation = function () {
				if (this.staff != undefined) {
					this.staff.__proto__ = this;
					//миксинг свойств пототипов
					for (var key in staff.f) {
						this.staff.__proto__[key] = staff.f[key];
					}

					var path_width = this.settings.path_width;
					var start_point = -path_width / 2;

					for (let i = 0; i < this.staff.length; i++) {
						this.staff[i].__proto__ = this.staff;
						let s = this.staff[i];
						let l = staff.l;
						l.push(s);

						s.settings = {};
						s.assess = {};

						s.settings.__proto__ = this.settings;
						s.g_gen('staff', s.info.id);
						s.set_path_width();


					}
					this.vector_gen();
				}
			}
			//Генерируем объекты подразделений
			chart.division_generation = function () {
				//console.log('max_staff',this.settings.max_staff); console.log('staff_qnt',this.settings.staff_qnt);
				if (this.settings.max_staff / this.settings.staff_qnt < this.settings.max_sector) {
					this.settings.max_sector = this.settings.max_staff / this.settings.staff_qnt;
				}
				if (this.division != undefined) {
					this.division.__proto__ = this;
					for (var key in division.f) {
						this.division.__proto__[key] = division.f[key];
					}
					for (let i = 0; i < this.division.length; i++) {
						this.division[i].__proto__ = this.division;
						let d = this.division[i];
						let l = division.l;
						l.push(d);
						d.settings = {};
						d.settings.__proto__ = this.settings;

						if (this.settings.symmetric == false) {
							d.settings.sector = this.settings.max_sector * d.staff.length / this.settings.max_staff;

							d.settings.person_sector = d.settings.sector / d.staff.length;
							chart.settings.sector_sum = chart.settings.sector_sum + d.settings.sector;

						}
						d.g_gen('division', d.info.id);
						d.set_path_width();
						d.vector_gen();
						d.path_gen();
						d.tooltip();
						d.staff_generation();
					}
				}
			}
			//Генерируем объекты кругов
			chart.circle_generation = function () {
				chart.circle.__proto__ = this;
				chart.svg_gen();

				for (var key in circle.f) {
					this.circle.__proto__[key] = circle.f[key];
				}
				for (let i = this.circle.length-1; i > -1; i--) {
					console.log(this.circle[i]);
					this.circle[i].__proto__ = this.circle;
					let c = this.circle[i];
					let l = circle.l;
					l.push(c);
					this.settings.circle[i].__proto__ = this.settings;
					c.settings = {};
					c.settings.__proto__ = this.settings.circle[i];
					c.g_gen('circle', l.length - 1);
					c.path_gen(i);
					c.division_generation();

				}
				chart.user.my_person();
				chart.user.person_photo();
				chart.user.person_popup();
			}

			chart.circle_generation();

			/*МЕТОДЫ РАБОТЫ С МАССИВАМИ ОБЪЕКТОВ*/

			//поворот подразделений на нужный угол
			division.rotation = function () {

				if (chart.settings.symmetric == true) {
					let div = this.l;
					let rotation = -60;
					let rot_step = 360 / div.length;

					for (let i = 0; i < div.length; i++) {
						let g = div[i].html.g.attr('transform', 'rotate(' + rotation + ')');
						rotation = rotation + rot_step;
					}
				} else {
					let div = this.l;
					let space = (1 - chart.settings.sector_sum) / div.length;
					let rotation = 0;
					for (let i = 0; i < div.length; i++) {
						if (i == 0) {
							rotation = div[i].settings.sector / 2;
							let g = div[i].html.g.attr('transform', 'rotate(' + rotation * 360 + ')');
						} else {
							rotation = rotation + div[i - 1].settings.sector / 2 + space + div[i].settings.sector / 2;
							let g = div[i].html.g.attr('transform', 'rotate(' + rotation * 360 + ')');
						}

					}
				}
			}
			//Отрисовка фотографий персонала
			staff.foto_adding = function () {
				var stf = this.l;

				for (let i = 0; i < stf.length; i++) {
					stf[i].person_photo();
					stf[i].person_popup();
				}
			}


			division.rotation();
			staff.foto_adding();

			test_obj = chart;
			
			
		}
		//Функция подготовки и сортировки данных по кругам для отрисовки самой диаграммы
		diagram.treat_data = function () {
			
			var data = this.data;
			var data_frame = this.data_frame;
			var settings = this.settings;
			var url = this.config.url;
			//console.log(data);
			test_data = data;
			let division_list = data.division_list;
			//console.log(division_list);
			if ((1 / division_list.length) < settings.max_sector) { settings.symmetric = false }
			let main_user = data.main_user;
			//console.log('main_user')
			main_user.hid = main_user.hid.split("/");
			main_user.hid.pop();

			//console.log('div_user ',main_user.hid);
			data_frame.info = data.main_user.info;
			data_frame.info.user_name = data.main_user.user_name;
			data_frame.info.login = data.main_user.login;
			data_frame.info.position = data.main_user.position;
			data_frame.info.id = data.main_user.id;
			data_frame.info.level = data.main_user.level;
			data_frame.info.main_user = true;
			
			data_frame.info.hid = main_user.hid;
			if (main_user.header_type == undefined) {
				//console.log('Юзер не руководитель');
				data_frame.info.boss = false;
				if (data.main_user.img != '') {
					data_frame.info.img = data.main_user.img;
					
				}
				for (let i = 0; i < division_list.length; i++) {
					division_list[i].info.hid = division_list[i].info.hid.split("/");
					division_list[i].info.hid.pop();
					//set_frequency(division_list[i], data_frame, settings);
					if (main_user.level == division_list[i].info.level) {
						//console.log('Один уровень');
						var result = division_list[i].info.hid.diff(main_user.hid)
						if (result.length == 0) {
							//console.log('Один отдел:', division_list[i].info.name);
							division_list[i].info.branch = true;
							//console.log('division_list[i]',division_list[i]);
							data_frame.circle[1].division.push(division_list[i]);
						} else {
							//console.log('Разные отделы:', division_list[i].info.name);
							division_list[i].info.branch = false;
							data_frame.circle[1].division.push(division_list[i]);
						}

					} else if (main_user.level > division_list[i].info.level) {
						var result = division_list[i].info.hid.diff(main_user.hid)
						if (result.length == 0) {
							//console.log('Выше Один департамент:', division_list[i].info.name);
							division_list[i].info.branch = true;
							data_frame.circle[1].division.push(division_list[i]);
						} else {
							//console.log('Выше Разные департаменты:', division_list[i].info.name);
							division_list[i].info.branch = false;
							data_frame.circle[1].division.push(division_list[i]);
							//set_frequency(data_frame.circle[2]);
						}
					} else if (main_user.level < division_list[i].info.level) {
						var result = main_user.hid.diff(division_list[i].info.hid)
						//console.log(result);
						if (result.length == 0) {
							//console.log('Ниже Один департамент:', division_list[i].info.name);
							division_list[i].info.branch = true;
							data_frame.circle[1].division.push(division_list[i]);

						} else {
							//console.log('Ниже Разные департаменты:', division_list[i].info.name);
							division_list[i].info.branch = false;
							data_frame.circle[1].division.push(division_list[i]);
						}
					}

				}
			} else {
				data_frame.info.boss = true;
				if (data.main_user.img != '') {
					data_frame.info.img = data.main_user.img;
				}
				for (let i = 0; i < division_list.length; i++) {
					division_list[i].info.hid = division_list[i].info.hid.split("/");
					division_list[i].info.hid.pop();
					//set_frequency(division_list[i], data_frame, settings);
					if (main_user.level == division_list[i].info.level) {
						//console.log('Один уровень');
						var result = division_list[i].info.hid.diff(main_user.hid)
						//console.log('main_user.hid',main_user.hid);
						if (result.length == 0) {
							//console.log('Один отдел:', division_list[i].info.name);
							division_list[i].info.branch = true;
							//console.log('division_list[i]',division_list[i]);
							data_frame.circle[0].division.push(division_list[i]);
						} else {
							//console.log('Разные отделы:', division_list[i].info.name);
							division_list[i].info.branch = false;
							data_frame.circle[1].division.push(division_list[i]);
						}

					} else if (main_user.level > division_list[i].info.level) {
						var result = division_list[i].info.hid.diff(main_user.hid)
						if (result.length == 0) {
							//console.log('Выше Один департамент:', division_list[i].info.name);
							division_list[i].info.branch = true;
							data_frame.circle[1].division.push(division_list[i]);
						} else {
							//console.log('Выше Разные департаменты:', division_list[i].info.name);
							division_list[i].info.branch = false;
							data_frame.circle[1].division.push(division_list[i]);
							//set_frequency(data_frame.circle[2]);
						}
					} else if (main_user.level < division_list[i].info.level) {
						var result = main_user.hid.diff(division_list[i].info.hid)
						//console.log(result);
						if (result.length == 0) {
							//console.log('Ниже Один департамент:', division_list[i].info.name);
							division_list[i].info.branch = true;
							data_frame.circle[0].division.push(division_list[i]);

						} else {
							//console.log('Ниже Разные департаменты:', division_list[i].info.name);
							division_list[i].info.branch = false;
							data_frame.circle[1].division.push(division_list[i]);
						}
					}
				}
			}
			
			this.print_chart();


			window.onresize = function () {
				//console.log(diagram)

				diagram.print_chart();
			}
			/*
			var diagram  = document.getElementsByClassName('diagram')[0];
			//console.log(diagram);
	
			if(diagram!=undefined){
				var mutationObserver = new MutationObserver(function(mutations) {
					//console.log(mutations);
				  mutations.forEach(function(mutation) {
					if(diagram.style.display =='flex'){
						print_chart(data_frame, settings,url);
						mutationObserver.disconnect();
						//console.log(mutations);
					}
				  });
				});
				mutationObserver.observe(diagram, {
				  attributes: true,
				  characterData: false,
				  childList: false,
				  subtree: false,
				  attributeOldValue: false,
				  characterDataOldValue: false
				});
			}*/
		}


		/*ОБЩИЕ ФУНКЦИИ МОДУЛЯ*/
		function set_frequency(division, data_frame, settings) {
			if (division.staff != undefined) {
				assess_temlate =
					{
						'rate': 0,
						'rate_sum': 0,
						'rate_count': 0,
						'frequency': 0,
						'real_frequency': 0,
					};
				//console.log("data_frame", data_frame);
				if (data_frame.info.assess == undefined) {
					data_frame.info.assess = JSON.parse(JSON.stringify(assess_temlate));
					data_frame.info.assess_me = JSON.parse(JSON.stringify(assess_temlate));
					data_frame.info.assess_other = JSON.parse(JSON.stringify(assess_temlate));
				}

				let staff = division.staff;
				var max_frequency = 1;
				if (staff.length > settings.max_staff) { settings.max_staff = staff.length }
				division.info.assess = JSON.parse(JSON.stringify(assess_temlate));
				division.info.assess_me = JSON.parse(JSON.stringify(assess_temlate));
				division.info.assess_other = JSON.parse(JSON.stringify(assess_temlate));

				for (let i = 0; i < staff.length; i++) {
					staff[i].info.assess.real_frequency = 0;
					staff[i].info.assess_me = {}; staff[i].info.assess_other = {};
					staff[i].info.assess_me.real_frequency = 0; staff[i].info.assess_other.real_frequency = 0;

					if (staff[i].info.result_me) {
						staff[i].info.assess_me.real_frequency = staff[i].info.result_me.length;
						calc_assess_rate(staff[i].info.assess_me, staff[i].info.result_me);
					}
					if (staff[i].info.result_other) {
						staff[i].info.assess_other.real_frequency = staff[i].info.result_other.length;
						calc_assess_rate(staff[i].info.assess_other, staff[i].info.result_other);
					}

					staff[i].info.assess.real_frequency = staff[i].info.assess_me.real_frequency + staff[i].info.assess_other.real_frequency;
					staff[i].info.assess.frequency = staff[i].info.assess.real_frequency + 1;

					if (staff[i].info.assess.frequency > settings.max_frequency) { settings.max_frequency = staff[i].info.assess.frequency };

					division.info.assess_me.real_frequency = division.info.assess_me.real_frequency + staff[i].info.assess_me.real_frequency;

					if (staff[i].info.assess_me.rate) {
						division.info.assess_me.rate_sum = division.info.assess_me.rate_sum + staff[i].info.assess_me.rate_sum;
						division.info.assess_me.rate_count = division.info.assess_me.rate_count + staff[i].info.assess_me.rate_count;
						division.info.assess_me.rate = division.info.assess_me.rate_sum / division.info.assess_me.rate_count;
						//division.info.assess_me.rate =3;

						data_frame.info.assess_me.frequency = data_frame.info.assess_me.frequency + staff[i].info.assess_me.frequency;
						data_frame.info.assess_me.real_frequency = data_frame.info.assess_me.real_frequency + staff[i].info.assess_me.real_frequency;
						data_frame.info.assess_me.rate_sum = data_frame.info.assess_me.rate_sum + staff[i].info.assess_me.rate_sum;
						data_frame.info.assess_me.rate_count = data_frame.info.assess_me.rate_count + staff[i].info.assess_me.rate_count;
						if (data_frame.info.assess_me.rate_count > 0) { data_frame.info.assess_me.rate = data_frame.info.assess_me.rate_sum / data_frame.info.assess_me.rate_count; }
					}
					division.info.assess_other.real_frequency = division.info.assess_other.real_frequency + staff[i].info.assess_other.real_frequency;
					if (staff[i].info.assess_other.rate) {
						division.info.assess_other.rate_sum = division.info.assess_other.rate_sum + staff[i].info.assess_other.rate_sum;
						division.info.assess_other.rate_count = division.info.assess_other.rate_count + staff[i].info.assess_other.rate_count;
						division.info.assess_other.rate = division.info.assess_other.rate_sum / division.info.assess_other.rate_count;

						data_frame.info.assess_other.frequency = data_frame.info.assess_other.frequency + staff[i].info.assess_other.frequency;
						data_frame.info.assess_other.real_frequency = data_frame.info.assess_other.real_frequency + staff[i].info.assess_other.real_frequency;
						data_frame.info.assess_other.rate_sum = data_frame.info.assess_other.rate_sum + staff[i].info.assess_other.rate_sum;
						data_frame.info.assess_other.rate_count = data_frame.info.assess_other.rate_count + staff[i].info.assess_other.rate_count;
						if (data_frame.info.assess_other.rate_count > 0) { data_frame.info.assess_other.rate = data_frame.info.assess_other.rate_sum / data_frame.info.assess_other.rate_count; }
					}

					division.info.assess.real_frequency = division.info.assess.real_frequency + staff[i].info.assess.real_frequency;
					division.info.assess.frequency = division.info.assess.frequency + staff[i].info.assess.frequency;

					data_frame.info.assess.frequency = data_frame.info.assess.frequency + staff[i].info.assess.frequency;
					data_frame.info.assess.real_frequency = data_frame.info.assess.real_frequency + staff[i].info.assess.real_frequency;






				}


			}
			//console.log('division',division);
		}
		function calc_assess_rate(assess, result) {
			//console.log(result);
			assess.list_assess = []; assess.rate = null;

			let rate = 0; let count = 0;
			for (let i = 0; i < result.length; i++) {
				let competence = result[i].competence;

				for (let ii = 0; ii < competence.length; ii++) {
					let bullets = competence[ii].bullet;
					for (let j = 0; j < bullets.length; j++) {
						let bullet = bullets[j];
						if (bullet.rate != null) {
							if (bullet.locked) {
								if (bullet.locked != true) {
									if (bullet.rate != NaN || bullet.rate != null || bullet.rate != undefined) {
										rate = rate + bullet.rate;
										count++;
									}
								} else {
									//console.log('bullet', bullet);
								}
							} else {
								if (bullet.rate != NaN || bullet.rate != null || bullet.rate != undefined) {
									rate = rate + bullet.rate;
									count++;
								}

							}
							//console.log('bullet', bullet);

						}
					}
				}
			}
			if (count == 0) { count = 1 }

			//Реальные результаты

			assess.rate = rate / count;
			assess.rate_sum = rate;
			assess.rate_count = count;


			//Случайные результаты
			/*
			assess.rate = (Math.random())*3;
			assess.rate_sum = assess.rate*count;
			assess.rate_count = count;
			*/
		}
		Array.prototype.diff = function (a) {
			//console.log('a',a); console.log('this', this);
			let div = this;
			let length = div.length; 
			if(a.length > div.length){
				length = a.length; 
			}
			let result =[];
			for(i=0; i<div.length; i++){
				if(div[i] != a[i]){
					result.push(div[i]);
				}
			}
		
			
			return result;
		};

		

		function test_ajax(req_url, token, callback) {
			result = "";
			callback(result);
		}

		function color_picker(rate) {
			let color = 'rgba(200,200,200,1)';
			let gradient = [
				{ 'p': 0, 'c': 'rgba(255,0,0,1)' },
				{ 'p': 10, 'c': 'rgba(255,80,0,1)' },
				{ 'p': 20, 'c': 'rgba(255,130,0,1)' },
				{ 'p': 30, 'c': 'rgba(255,150,0,1)' },
				{ 'p': 40, 'c': 'rgba(255,180,0,1)' },
				{ 'p': 50, 'c': 'rgba(254,209,0,1)' },
				{ 'p': 60, 'c': 'rgba(255,209,0,1)' },
				{ 'p': 70, 'c': 'rgba(230,200,0,1)' },
				{ 'p': 80, 'c': 'rgba(200,190,0,1)' },
				{ 'p': 90, 'c': 'rgba(150,184,0,1)' },
				{ 'p': 100, 'c': 'rgba(122,184,0,1)' }
			];

			if (rate != null & rate > 0) {
				rate = (rate / settings.rate_rang.max) * 100;
				for (let i = 0; i < gradient.length; i++) {

					if (rate >= gradient[i].p) {
						color = gradient[i].c;
					}
				}
				return color;
			} else {
				return color;
			}
		}

		diagram.get_user_info();
		diagram.get_chart_data();
	}


	/*ФУНКЦИОНАЛ ОТБОРА ДЕМОНСТРАЦИИ ЧАРТОВ ПОДЧИНЕННЫХ*/

	var _person = {};
	_person.list = [];
	_person.add_list_items = function () {

		let _person_list_container = d3.select('#person_list_container');
		_person_list_container.html('');
		_person_list_container.style('width', _person.list.length * 70 + 'px');
		let person_onfo_container = d3.select('#person_onfo_container').style('width', 700 - _person.list.length * 70 + 'px');
		for (var i = 0; i < _person.list.length; i++) {
			item_person = _person.list[i];
			//console.log('item_person', item_person);
			item_person.__proto__ = _person;

			let item_person_container = item_person.html = _person_list_container.append('div');
			if (i < _person.list.length - 1) {
				item_person_container.classed('person_container peroson_active', true);
			} else {
				item_person_container.classed('person_container', true);
			}
			let img = item_person_container.append('div').classed('img', true);
			let img_url = get_img_url(item_person);
			
			img.append('img').attr('src', img_url);
			
			let _person_info = item_person_container.append('div').classed('person_container_name', true).html(item_person.full_name);
			item_person_container.style('left', i * 70 + 5 + 'px');


			person_onfo_container.html('<div class="full_name">' + item_person.full_name + '</div><div class="person_position"><span><b>Position: </b></span>' + item_person.position + '</div>')

			item_person.index = i;
			item_person.change_user();

		}


	}
	_person.add_user = function (_person_list_item) {
		_person.get_chart_list_boss_user();
		sub_user_id = _person.item.id;
		call_chart(sub_user_id);
	}
	_person.change_user = function () {
		//console.log(this);
		let item = this;

		item.html.node().onclick = function () {
			if (item.index < _person.list.length - 1) {
				item.html.node().classList.remove("peroson_active")
				sub_user_id = item.id;
				call_chart(sub_user_id);

				if (item.index < _person.list.length) {

					for (var i = item.index + 1; i < _person.list.length; i++) {
						//console.log(_person.list);
						//console.log('_person.list[i]', _person.list[i]);
						let person_div = _person.list[i].html;
						person_div.remove();

					}

					let qnt_items = _person.list.length - item.index;
					_person.list.splice(item.index + 1, qnt_items);

					_person_list_container = d3.select('#person_list_container');
					_person_list_container.style('width', _person.list.length * 70 + 'px');
					person_onfo_container = d3.select('#person_onfo_container').style('width', 700 - _person.list.length * 70 + 'px');
					person_onfo_container.html('<div class="full_name">' + item.full_name + '</div><div class="person_position"><span><b>Position: </b></span>' + item.position + '</div>')
				}
			} else { }
		}

	}
	_person.get_own_user = function () {
		var authInfo ={
			email: "Sophia@testmarket.com",
			full_name: "Sophia",
			groups: [
				{id: 2, code: "administrator", name: "administrator"}, 
				{id: 3, code: "root", name: "root"}
			],
			id: 81747,
			img: "p0.jpg",
			login: "Sophia",
			token: 225283664975388
		}

		if (authInfo) {
			try {
				var _person_list = [];
				callback = function (result) {
					//console.log(result);
					if (result) {
						if (result != '') {
							if (JSON.parse(result)) {
								user_info = JSON.parse(result);
								_person.item = {
									"full_name": user_info.full_name,
									"position": user_info.position,
									"img": user_info.img,
									"id": user_info.id
								};
								let hid = user_info.hid
								hid = hid.split("/");
								hid.pop();
								_person.owner = {
									"full_name": user_info.full_name,
									"division": user_info.division,
									"hid": hid,
									"level": user_info.level,
									"position": user_info.position,
									"img": user_info.img,
									"id": user_info.id,
									"header_type": user_info.header_type,
									"token": authInfo.token
								};

								_person.add_user(_person.item);
							}
						}
					}

				}
				let req_url = config.api_url + '/userInfoMe';
				let token = authInfo.token;

				ajax_get(req_url, token, callback)


			} catch (err) {
				//console.log(err);
			}
		}
	}

	_person.get_chart_list_boss_user = function () {
		let req_url = config.api_url + '/chart_list_boss_user';
		let token = _person.owner.token;
		let sub_user_id = _person.item.id;
		callback = function (result) {
			if (result) {
				if (result != '') {
					if (JSON.parse(result)) {
						_person.list = JSON.parse(result);
						_person.add_list_items();
					}
				}
			}
		}
		//console.log(_person);
		ajax_get(req_url, token, callback, sub_user_id);
	}
	_person.get_own_user();

	
	function get_img_url(user){
		//console.log(user);
		let img_url = config.img_url;
		
		let img; let check_http; let login; let folder;
		try{
			img = user.img
			//console.log('img', img);
			check_http =  img.charAt(0)+ img.charAt(1)+img.charAt(2)+img.charAt(3)
			if(check_http =='http'){
				return img;
			}else if(check_http.length >0){
				login = user.login;
				folder = login.charAt(0); 
				folder=folder.toLowerCase();
				img = img_url+img;
				return img;
				
			}else{
				img =img_url +'/user_none.svg';
				return img;
			}
			
		}catch(err){
			img =img_url +'/user_none.svg';
			return img;
		}
	}

function ajax_get(req_url, token, callback, sub_user_id) {
	//console.log(req_url);
	if (sub_user_id) {
		sub_user_id = '/' + sub_user_id;
	} else {
		sub_user_id = '';
	}
	var xhr = new XMLHttpRequest();
	xhr.onerror = function () { }
	xhr.open("GET", req_url + sub_user_id, true)
	xhr.setRequestHeader('token', token);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var result = xhr.responseText;
				callback(result);
			}
		}
	}
	xhr.send();
}

function ajax_get_param(req_url, token, callback, param, id) {
	//console.log('ajax_get req_url',req_url);
	if(id!=undefined){
		req='/'+id+'';
	}else{
		req='';
	}
	
	if(param != null & param != undefined){
		let index =0;
		for (let key in param){
			if(index ==0 ){
				req=req+'?'+key+'='+param[key];
			}else{
				req=req+'&'+key+'='+param[key];
			}
			index++;
		}
		
	}
	//console.log('req',req);
	req_url = req_url+ req;
	var xhr = new XMLHttpRequest();
		xhr.onerror = function () { }
		xhr.open("GET", req_url , true)
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
		xhr.setRequestHeader('token', token);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var result = xhr.responseText;
					if (result == ''){
						result = '[]';
						callback(result);
					}else{
						callback(result);
					}
				}else if(xhr.status == 401){
					// error treatment
				}else{
					// error treatment
				}
			}
		}
		xhr.send();
		
}

}

chart_start();
