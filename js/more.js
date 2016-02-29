$(document).ready(function(){
	var sp = $(".container").switchPage({
		'direction':'horizontal',
		'isloop':'true'
	});
	$more = $(".more");
	$more.each(function(){
		$(this).on("click",function(){
			//moveNext();
			sp.moveNext();
		})
	});
});

function moveNext(){
	var $container = $(".container");
	var currentTop = $container.offset().top;
	var height = $(".section").height();
	var index = Math.abs(currentTop / height);
	
	if(index < $(".section").length - 1){
		$container.animate({
			'top' : currentTop - height + "px"
		}, 500);
	}
	else{
		$container.animate({
			'top' : "0px"
		}, 500);
	}
}