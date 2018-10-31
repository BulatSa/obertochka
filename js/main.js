/***********************
 Отправка формы в php BEGIN
 ***********************/
$(function () {
	$(".ajax-form").on("submit", function (event) {
		var form = $(this);
		var send = true;
		event.preventDefault();

		$(this).find("[data-req='true']").each(function () {
			if ($(this).val() === "") {
				$(this).parent('.input').addClass('error');
				send = false;
			}
			if ($(this).is('select')) {
				if ($(this).val() === null) {
					$(this).parent('.input').addClass('error');
					send = false;
				}
			}
			if ($(this).is('input[type="checkbox"]')) {
				if ($(this).prop('checked') !== true) {
					$(this).parent('.input').addClass('error');
					send = false;
				}
			}
			if ($(this).is('input[type="tel"]')) {
				if ($(this).cleanVal().length < 10) {
					$(this).parent('.input').addClass('error');
					send = false;
				}
			}
		});

		$(this).find("[data-req='true']").on('focus', function () {
			$(this).parent('.input').removeClass('error');
		});

		// empty file inputs fix for mac
		var fileInputs = $('input[type="file"]:not([disabled])', form);
		fileInputs.each(function (_, input) {
			if (input.files.length > 0) return;
			$(input).prop('disabled', true)
		});

		var form_data = new FormData(this);

		fileInputs.prop('disabled', false);

		$("[data-label]").each(function () {
			var input_name = $(this).attr('name');
			var input_label__name = input_name + '_label';
			var input_label__value = $(this).data('label').toString();
			form_data.append(input_label__name, input_label__value)
		});

		if (send === true) {
			$.ajax({
				type: "POST",
				async: true,
				url: "/send.php",
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,
				success: (function (result) {
					console.log(result);
					$.fancybox.close();
					if (result.indexOf("Mail FAIL") !== -1) {
						$.fancybox.open({src: '#modal-error'});
					} else {
						$.fancybox.open({src: '#modal-thanks'});
						setTimeout(function () {
							$.fancybox.close();
						}, 4500);
						form[0].reset();
					}
				})
			});
		}
	});
});
/***********************
 Отправка формы в php END
 ***********************/


/***********************
 Input mask BEGIN
 ***********************/
$(function () {
	$("input[type='tel']").mask("+7 (000) 000-00-00");
});
/***********************
 Input mask END
 ***********************/


/***********************
 fancybox BEGIN
 ***********************/
$.fancybox.defaults.backFocus = false;
$.fancybox.defaults.lang = 'ru';
$.fancybox.defaults.i18n =
	{
		'ru': {
			CLOSE: 'Закрыть',
			NEXT: 'Дальше',
			PREV: 'Назад',
			ERROR: 'Не удается загрузить. <br/> Попробуйте позднее.',
			PLAY_START: 'Начать слайдшоу',
			PLAY_STOP: 'Остановить слайдшоу',
			FULL_SCREEN: 'На весь экран',
			THUMBS: 'Превью'
		}
	};

function init_fancy() {
	$('.fancy').fancybox({
		buttons: ['close']
	});
	$('.fancy-modal').fancybox({
		selector: '',
		touch: false
	});
	$('.fancy-map').fancybox({
		toolbar: false,
		smallBtn: true,
		defaultType: "iframe"
	});
}

function init_fancy__video() {
	$('.fancy-video').fancybox({
		toolbar: false,
		smallBtn: true,
		youtube: {
			controls: 1,
			showinfo: 0,
			autoplay: 1
		}
	});
}

$(function () {
	init_fancy();
	init_fancy__video();
});
/***********************
 fancybox END
 ***********************/


/***********************
 MixItUp BEGIN
 ***********************/
$(function () {
	var items = $('.item');
	var itemQueue = [];
	var delay = 50;
	var queueTimer;

	function processItemQueue() {
		if (queueTimer) return; // We're already processing the queue
		queueTimer = window.setInterval(function () {
			if (itemQueue.length) {
				$(itemQueue.shift()).addClass('show');
				processItemQueue()
			} else {
				window.clearInterval(queueTimer);
				queueTimer = null;
			}
		}, delay)
	}

	items.waypoint(function () {
		itemQueue.push(this.element);
		processItemQueue()
	}, {
		offset: '100%'
	});

	var mixer = mixitup('.main-info__body', {
		"animation": {
			duration: 600,
			effects: 'fade translateY(50px)',
			clampHeight: false
		},
		callbacks: {
			onMixStart: function (state, futureState) {
				var itemsToShow = $(futureState.show.slice(0, 12));
				items.not(itemsToShow).removeClass('show');
				itemsToShow.addClass('show');
				Waypoint.destroyAll();
				itemQueue = [];
			},
			onMixEnd: function (state) {
				$(state.show).waypoint(function () {
					itemQueue.push(this.element);
					processItemQueue()
				}, {
					offset: '100%'
				});
			}
		}
	});

});

$(window).on('load', function () {
	Waypoint.refreshAll();
});
/***********************
 MixItUp END
 ***********************/


/***********************
 form BEGIN
 ***********************/
$(function ($) {
	var siteWrap = $('.site-wrap');
	var siteContent = $('.site-content');
	var overlay = $('.site-wrap__overlay');
	var scrollTop = window.pageYOffset;
	var isFormOpened = false;

	$('.js-open-form').on('click', function (e) {
		e.preventDefault();
		openForm();
	});

	console.log();

	overlay.on('click', function () {
		closeForm()
	});

	$('.aside__close').on('click', function (e) {
		closeForm();
	});

	window.addEventListener('resize', function (ev) {
		if (isFormOpened) {
			resizeFrame();
		}
	});

	function openForm() {
		resizeFrame();
		scrollTop = window.pageYOffset;
		siteContent.css('top', -window.pageYOffset);
		siteWrap.addClass('opened');
		siteWrap.addClass('transformed');
		Waypoint.enableAll();
		isFormOpened = true;
	}

	function closeForm() {
		siteWrap.removeClass('transformed');
		setTimeout(function () {
			siteContent.css('top', 0);
			siteWrap.css('width', 'auto');
			siteWrap.css('height', 'auto');
			siteWrap.removeClass('opened');
			Waypoint.refreshAll();
			window.scrollTo(0, scrollTop);
		}, 500);
		isFormOpened = false;
	}

	function resizeFrame() {
		var curScrollWidth = window.innerWidth - document.documentElement.clientWidth;
		var curWidth = document.documentElement.clientWidth;
		var curHeight = document.documentElement.clientHeight;
		siteWrap.css('width', curWidth);
		siteWrap.css('height', curHeight);
	}
});
/***********************
 form END
 ***********************/

/***********************
 Labels BEGIN
 ***********************/
$(function ($) {
	var inputs = $('.input__text');
	inputs.on('focus', function () {
		var thisInputWrap = $(this).parent('.input');
		thisInputWrap.addClass('not_empty');
		thisInputWrap.addClass('focused');
	});

	inputs.on('blur', function () {
		var thisInputWrap = $(this).parent('.input');
		thisInputWrap.removeClass('focused');
		if ($(this).val() !== "") {
			thisInputWrap.addClass('not_empty');
		} else {
			thisInputWrap.removeClass('not_empty');
		}
	});


	$('.form__files').each(function () {
		var
			$input = $(this).find('input'),
			$label = $input.next('label'),
			$labelVal = $label.find('span');

		$input.on('change', function (e) {
			if (this.files.length > 0) {
				var fileCount = this.files.length;
				$labelVal.html(fileCount);
				$labelVal.addClass('vis');
			} else {
				$labelVal.removeClass('vis');
			}
		});

		// Firefox bug fix
		$input
			.on('focus', function () {
				$input.addClass('has-focus');
			})
			.on('blur', function () {
				$input.removeClass('has-focus');
			});
	});

});
/***********************
 Labels END
 ***********************/