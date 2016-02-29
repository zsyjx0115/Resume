//为了更好的兼容性，开始前有个分号
(function($){//$作为匿名函数的形参
	//可以使用$作为jQuery的缩写别名
	var defaults={
		'container': '.container',
		'sections': '.section',
		'easing': 'ease',//切换特效方式
		'duration': 1000,//切换时间
		'pagination': true,//是否显示分页
		'isloop': false,//循环开关
		'keyboard': true,//键盘切换开关
		'direction': 'vertical',//滑动的方向 horizontal,vertical
		'curindex': 0,//初始展示页面的index值
		'callback': ''//回调函数
	};
	var container,sections;
	var options = {};
	var canScroll = true;
	var switchP = $.fn.extend({
		"switchPage": function(option){
			//设置参数
			options = $.extend(defaults,option || {});
			container = $(options.container);
			sections = container.find(options.sections);
			options.curindex = options.curindex >= sections.length ? 0 : options.curindex;
			sections.eq(options.curindex).addClass("active");
			return this.each(function(){
				if(options.direction == "horizontal"){
					//横向翻页的样式布局
					initLayout();
				}
				if(options.pagination){
					//添加导航分页
					addPagination();
				}
				if(options.keyboard){
					//使能键盘控制
					addKeydown();
				}
			});
		}
	});

	//横向布局初始化
	function initLayout(){
		var length = sections.length,
			width = (length*100)+"%",
			cellWidth = (100/length).toFixed(2)+"%";
		container.width(width).addClass("left");
		sections.width(cellWidth).addClass("left");
	}


	//向下翻一页
	switchP.moveNext = function(){
		var index = options.curindex;
		if(index < sections.length - 1){
			index++;
		}
		else{
			index = options.isloop ? 0 : index;
			if(index !== 0)
				return;
		}
		options.curindex = index;
		ScrollPage(index);
	};
	//向上翻一页
	switchP.movePrev = function(){
		var index = options.curindex;
		if(index > 0){
			index--;
		}
		else{
			index = options.isloop ? sections.length - 1 : index;
			if(index === 0)
				return;
		}
		options.curindex = index;
		ScrollPage(index);
	};

	function ScrollPage(index){
		var position = sections.eq(index).position();
		canScroll = false;

		var transform = ["-webkit-transform","-ms-transform","-moz-transform","transform"],
			transition = ["-webkit-transition","-ms-transition","-moz-transition","transition"];
		//翻页动画
		if(isSuportCss(transform) && isSuportCss(transition)){
			var describe = "";
			if(options.direction == 'vertical'){
				describe = '0px,-' +position.top + 'px,0px';
			}
			else{
				describe = '-' + position.left + 'px,0px,0px';
			}
			container.css({
				'transform' : 'translate3d('+ describe + ')',
				'transition' : 'all ' + options.duration + 'ms ' + options.easing,
			});
			container.bind("webkitTransitionEnd msTransitionend mozTransitionend transitionend",function(){
				canScroll = true;
			});
		}
		else{
			if(options.direction == "vertical"){
				container.animate({
					'top' : '-' + position.top + 'px',
				},options.duration,function(){
					canScroll = true;
				});
			}
			else{
				container.animatie({
					'left' : '-' + position.left + 'px'
				},options.duration,function(){
					canScroll = true;
				});
			}
		}
		
		sections.eq(index).addClass("active")
			.siblings().removeClass("active");
		//分页显示样式更换
		if(options.pagination){
			ChangeActive();
		}
	}

	//是否支持css的某个属性
	function isSuportCss(property){
		var body = $("body")[0];
		for(var i=0; i<property.length;i++){
			if(property[i] in body.style){
				return true;
			}
		}
		return false;
	}
	//分页标示变化
	function ChangeActive(){
		var pages = $("#page li");
		pages.eq(options.curindex).addClass("active");
		pages.eq(options.curindex).siblings().removeClass("active");
	}

	function addPagination(){
		var $page = $("<ul id='page'></ul>");
		for(var i = 0; i < sections.length; i++){
			if(i != options.curindex)
				$page.append("<li></li>");
			else
				$page.append("<li class='active'></li>");
		}
		$("body").append($page);

		addClickChangePage();
	}
	//绑定导航分页圆点的点击事件
	function addClickChangePage(){
		var $page = $("#page li");
		$page.each(function(index){
			$(this).bind("click",function(){
				options.curindex = index;
				ScrollPage(index);
			});
		});
	}

	$(document).bind("mousewheel DOMMouseScroll",function(e){
		e = e || window.e;
		e.preventDefault();
		if(canScroll){
			var direc = e.originalEvent.wheelDelta || - e.originalEvent.detail;
			if(direc > 0){
				//向上滚动
				switchP.movePrev();
			}
			else{
				switchP.moveNext();
			}
		}
	});

	function addKeydown(){
		$(document).bind("keydown",function(e){
			var code = e.keyCode;
			if(code == 37 || code == 38){
				switchP.movePrev();
			}
			else if(code == 39 || code == 40){
				switchP.moveNext();
			}
		});
	}

})(jQuery);//jQuery作为实参传递给匿名函数