
(function () {
	var $scroller = $('#spotlight').find('.scroller')
	,	$spotlightList = $scroller.find('ul')
	,	$spotlightGames = $spotlightList.children()
	,	$firstSpotlight = $spotlightGames.first()
	,	$firstImg 		= $firstSpotlight.find('img');
	
	$firstImg.load(function () {				
		$scroller.scroller(
			{control: 
				{type: 'scrollbar'
				, target: $('#scroller-control').find('.handle')
				}
			, circular: true	
			});
	});	

	var src = $firstImg[0].src;
	$firstImg[0].src = '';
	$firstImg[0].src = src;
	
	var $pc 			= $('#pc')
	,	$mac			= $('#mac')
	,	$featured 		= $('#featured')
	,	$newReleases 	= $('#newreleases')
	,	$videos			= $('#videos')
	,	$demos			= $('#demos')
	;
	
	var scrollerDefaults = 
		{ smooth: false
		, delay: 'manual'
		, control: {type: 'button'}
		};
	
	$pc.find('div.scroller').scroller($.extend({}, scrollerDefaults, 
			{ slides: $pc.find('ul.page')
			, container: $pc
			, count: $pc.find('span.count')
			}
		)
	);			
	
	$mac.find('div.scroller').scroller($.extend({}, scrollerDefaults,
			{ slides: $mac.find('ul.page')
			, container: $mac
			, count: $mac.find('span.count')
			}
		)
	);
	
	$newReleases.find('div.scroller').scroller($.extend({}, scrollerDefaults,
			{ slides: $newReleases.find('ul.slide')
			, container: $newReleases
			, count: $newReleases.find('span.count')
			, direction: 'top'
			}
		)
	);
	
	$videos.find('div.scroller').scroller($.extend({}, scrollerDefaults, 
			{ slides: $videos.find('ul.slide')
			, container: $videos
			, count: $videos.find('span.count')
			}
		)
	);
	
	
	$demos.find('div.scroller').scroller($.extend({}, scrollerDefaults, 
			{ slides: $demos.find('ul.slide')
			, container: $demos
			, count: $demos.find('span.count')
			}
		)
	);
	
	var $miscScrollers = $('#misc').find('div.scroller');
	$miscScrollers.find('.slide > li:even').addClass('even');			
	$miscScrollers.find('.slide > li:odd').addClass('odd');

	var $moreInfoContainer = $('#more-info-container');
	$('#featured, #misc')
		.on('mouseenter', '.more-info', function (event) {
			$moreInfoContainer
				.show()
				.html('<div class="details">'
									+'<div class="tip"><div class="inner"></div></div>'
									+'<div class="content">'
									+'<h2>RAGE</h2>'
									+'<p class="description">RAGE is a groundbreaking first-person shooter set in the not-too-distant future after an asteroid impacts Earth, leaving a ravaged world behind. You emerge into this vast wasteland to discover humanity working to rebuild itself against such forces as bandit gangs, mutants, and the Authority – an...	</p>'
									+'<p class="genre">Genre: Action, Indie</p>'
									+'<p class="release">Release: Oct 17, 2011</p>'
									+'<ul class="specs">'
									+'<li>'
									+'<span class="sprite sprite-ico_singlePlayer"></span> Single Player'
									+'</li>'
									+'<li>'
									+'<span class="sprite sprite-ico_singlePlayer"></span> Single Player'
									+'</li>'
									+'</ul>'
									+'</div>'
									+'</div>')
				.position(
					{ of: $(event.target).closest('li')
					, at: 'right top'
					, my: 'left top'
					, offset: '5 0'
					, collision: 'none'
					}
				)
				;
		})
		.on('mouseleave', '.more-info', function (event) {
			$moreInfoContainer.hide();
		})
		.tabs({selected: 0})
		;
}());
