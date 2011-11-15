(function ($) {			
			
	var scroller = 
		{ options: 
			{ direction:'left'
			, slides: 	'li'
			, easing: 	'swing'
			, duration: 500
			, property: null
			, delay: 	3000
			, repeat: 	true
			, control: 	null
			, smooth: 	true
			, circular: false
			, container:null
			, count:	null
			}
		, _name: 'scroller'
		, _init: 
			function () {
				var options = this.options;
				this.repetitions = 0;
				this.oldPosition = 0
				this.position = 0;
				this.slides = typeof options.slides === 'string' ? this.$element.find(options.slides) : options.slides;					
				this.container = typeof options.container === 'string' ? $(options.slides) : options.container || $(document.body);

				this.numOfSlides = this.slides.length;
				
				var $firstSlide = this.slides.first();
				this.amountToMove = options.direction === 'left' || options.direction ==='right' ? $firstSlide.outerWidth() : $firstSlide.outerHeight();
				
				if (options.smooth) {						
					$firstSlide.parent().append($firstSlide.clone());
				}
				
				this._updateCount();
				this._bindControl();
				this._animate();
			}
		, _bindControl:
			function () {
				var that	= this
				,	control = that.options.control;
				
				if (control) {
					$.each(control, function (key, val) {
						that['_'+val.type+'Control'](val);
					});
				}
			}
		, _scrollbarControl:
			function (control) {
				var that				= this
				,	options				= that.options
				, 	$target 			= typeof control.target === 'string' ? $(target) : control.target
				,	scrollArea 			= $target.parent().outerWidth()
				,	targetWidth 		= $target.width()
				,	amountToMove		= scrollArea / that.numOfSlides
				,	manuallySet 		= false
				,	amountToMoveRatio	= that.amountToMove / amountToMove
				;
				
				this.$scrollControl = $target;
				$target.draggable(
					{ axis: 'x'
					, containment: $target.parent()
					, snap: amountToMove
					}
				);
				
				$target
					.on('drag', function (event, ui) {
						that.stop();
						that.$element[0].style[options.direction] = -1 * amountToMoveRatio * ui.position.left + 'px'	;						
					})
					.on('dragstop', function (event, ui) {
							var handlePosition 		= ui.position.left
							,	newPosition 		= Math.round(handlePosition/amountToMove)
							,	newPosition 		= newPosition > -1 ? newPosition : 0
							;								
															
							$target[0].style.left = newPosition * amountToMove  + 'px';	
							manuallySet = true;								
							that.animate(newPosition, that._amountToMoveToPosition(newPosition));								
					})
					.parent()
					.on('click.scroller', function (event) {
						if (event.target !== $target[0]) {
							that.stop();
							
							var animationPosition = parseInt(that.$element[0].style[options.direction], 10)								
							, 	handlePosition = event.offsetX - targetWidth/2
							,	newPosition = Math.round(handlePosition/amountToMove)
							,	newPosition = newPosition > -1 ? newPosition : 0
							;
							
							that.$element[0].style[options.direction] = Math.round(animationPosition / that.amountToMove) * that.amountToMove + 'px';
							$target[0].style.left = newPosition * amountToMove  + 'px';
							manuallySet = true;
							that.animate(newPosition);
						}
					})
					;
				
				that.$element
						.on('scroller.animating', function () {
							if (!manuallySet) {
								var move;	
								if (that.position === that.oldPosition) {
									move = that.$element[0].style.left;
								}
								else if (that.position > that.oldPosition || !that.position) {
									move = '+=' + (that.position - that.oldPosition) * amountToMove; 
								}
								else {
									move = '-=' + (that.oldPosition - that.position) * amountToMove;
								}

								$target.animate({left: move}, !that.position ? 0 : options.duration, options.easing, function () {
									if (!that.position) {
										$target[0].style.left = '0';
									}
								});
							}
							manuallySet = false;
						})
						;
					
			}
		, _buttonControl:
			function (control) {
				var that		= this
				,	options		= that.options
				,	$container	= that.container				
				,	$next 		= (control.target && control.target.next) || $container.find('.next')
				,	$prev		= (control.target && control.target.prev) || $container.find('.prev')
				
				that.$scrollControl = $next.on('click', function (event) {
					event.preventDefault();
					if(!that.animating) {
						that.animate(null, null, options.repeat ? true : false );
						
						if (!options.circular) {
							that.position === 1 && $prev.removeClass('invisible');
							that.position + 1 === that.numOfSlides && $next.addClass('invisible');
						}
					}						
				});
				
				!options.circular && $prev.addClass('invisible');
				
				$prev.on('click', function (event) {
					event.preventDefault();
					
					if(!that.animating) {
						var newPosition = that.position - 1;
						
						if (newPosition < 0) { 
							newPosition = options.circular ? that.numOfSlides - 1 : 0;
						}
						
						that.animate(newPosition, null, options.repeat ? true : false);
						
						if (!options.circular) {
							!that.position && $prev.addClass('invisible');
							that.position === that.numOfSlides - 2 && $next.removeClass('invisible');
						}
					}
				});
			}
		, animate: 	
			function (position, amountToMove, doNotQueue) {
				var that 				= this
				, 	options 			= this.options	
				,	direction			= options.direction
				,	isCustomPosition 	=  position !== null && position !== undefined
				;
				
				if (that.$element.is(':visible')
					&& (that.position + 1 !== that.numOfSlides 
						|| isCustomPosition
						|| options.circular
						)
					) {
					that.oldPosition = that.position;
					if (that.position + 1 < that.numOfSlides) {
						that.position++;
					}
					else {
						that.position = 0;
					}
					
					that.position = isCustomPosition ? position : that.position;
					
					that.$element.trigger('scroller.animating');
					var move;	
					if (that.position === that.oldPosition) {
						move = that.$element[0].style[direction];
					}
					else if (that.position > that.oldPosition) {
						move = '-=' + (amountToMove || (that.position - that.oldPosition) * that.amountToMove); 
					}
					else if (!that.position && !isCustomPosition) {
						move = '-=' + (amountToMove || that.amountToMove); 
					}
					else {
						move = '+=' + (amountToMove || (that.oldPosition - that.position) * that.amountToMove);
					}
					
					that._updateCount();
					that.animation = that.animation || true;
					var animateDirection = {};
					animateDirection[direction] = move;
					that.animating = true;
					that.$element.animate(animateDirection, options.duration, options.easing, function () {
						that.animation = null;
						that.animating = false;
						if (!doNotQueue
							&& options.repeat 
							&& (options.repeat === true || that.repetitions < options.repeat)) {
							that.repetitions++;
							that._animate();							
						}

						if(!that.position) {
							that.$element[0].style[direction] = 0;
						}
						
						that.$element.trigger('scroller.animated');
					});
				}
			}

		, _animate:
			function (position) {					
				var that 	= this
				, 	options = this.options
				;
				
				if (options.delay !== 'manual') {
					this.animation = setTimeout(function () {that.animate();}, options.delay);
				}
			}
		, _updateCount:
			function () {
				var options = this.options;
				
				if (options.count) {
					var numOfCurrentSlideChildren = this.slides.eq(this.position).children().length;
					var numOfChildrenUpToPosition = this.slides.slice(0, this.position + 1).children().length;
					
					options.count.text((numOfChildrenUpToPosition - numOfCurrentSlideChildren) + ' - ' + numOfChildrenUpToPosition + ' of ' + this.slides.children().length);
				}
			}
		, stop:
			function (waitUntilAnimationEnds) {
				var that = this;
				function _stop() {
					clearTimeout(that.animation);
					that.animation = null
					that.$element.stop();
					that.$scrollControl.stop();
				}
				
				if (!waitUntilAnimationEnds) {
					_stop();
				}
				else {
					if (that.animating) {
						that.$element.on('scroller.animated', function () {
							_stop();
							that.$element.off('scroller.animated');
						});
					}
					else {
						_stop();
					}
				}
			}
		, _amountToMoveToPosition:
			function (position) {
				var that				= this	
				,	options				= that.options
				,	animationPosition 	= parseFloat(that.$element[0].style[options.direction])
				,	customAmountToMove 	= (position * that.amountToMove) + animationPosition;
				;								

				if (position < that.position) {
					customAmountToMove *= -1;
				}
												
				return customAmountToMove;	
			}
		, resume:
			function () {
				var that 	= this
				, 	options = that.options;
				;
				if (options.delay !== 'manual') {
					this.animation = setTimeout(function () {that.animate();}, options.delay);
				}
				else {
					that.animate();
				}
			}
		};
	
	$.pluginfy(scroller);
}(jQuery));
