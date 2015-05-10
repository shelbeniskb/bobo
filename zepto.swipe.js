/*
* zepto.swiper.js
* version 1.0
* Shelben
*/

(function($) {
    //防止出现bounce效果
    $(document).on('touchmove', function(e){
        e.preventDefault();
    });
    
    $.fn.swiper = function(option) {
        var opts = $.extend({}, $.fn.swiper.defaultOpts, option),
            $swiper = this,
            $items = $swiper.find(opts.itemSelector),
            swiperPositionStyle = $swiper.css('position'),
            swiperHeight = $swiper.height(),
            swiperWidth = $swiper.width(),
            isVertical = (opts.direction == 'v'),
            oldPos = 0,
            step = 0,
            backMove = false,
            forwardMove = false,
            isAnimate = false,
            moveItemPos = 0,
            curItemIdx = 0,
            moveItemIdx = 0,
            distance = isVertical ? swiperHeight : swiperWidth;
        $swiper.css({'position': 'relative'});
        $items.each(function(i, item){
            $items.eq(i).css({
                'position': 'absolute',
                'top': isVertical ? swiperHeight + 'px' : 0,
                'left': isVertical? 0 : swiperWidth + 'px',
                'z-index': '500'

            });
        });
        $items.eq(0).css(isVertical ? 'top' : 'left', 0);

        $swiper.on('touchstart', function(e){
            var touch = e.touches[0];
            oldPos = isVertical ? touch.clientY: touch.clientX;
            step = 0;
            backMove = false;
            forwardMove = false;
        }).on('touchmove', function(e){
            var touch = e.touches[0],
                curPos = isVertical ? touch.clientY: touch.clientX,
                gap = curPos - oldPos;
            step += gap;
            if (gap < 0 && !isAnimate) { //向上或向左滑动
                if (backMove) {
                    moveItemPos = -distance + step;
                    moveItemIdx = curItemIdx === 0 ? curItemIdx : curItemIdx - 1;
                    moveItem(moveItemIdx, moveItemPos, curItemIdx);
                } else if(curItemIdx !== $items.length - 1){
                    moveItemPos = distance + step;
                    moveItemIdx = curItemIdx + 1;
                    moveItem(moveItemIdx, moveItemPos, curItemIdx);
                    forwardMove = true;
                }
            }

            if (gap > 0 &&　!isAnimate) { //向下或向右滑动
                if (forwardMove) {
                    moveItemPos = distance + step;
                    moveItemIdx = curItemIdx === $items.length -1 ? curItemIdx : curItemIdx + 1;
                    moveItem(moveItemIdx, moveItemPos, curItemIdx);
                } else if(curItemIdx !== 0) {
                    moveItemPos = -distance + step;
                    moveItemIdx = curItemIdx - 1;
                    moveItem(moveItemIdx, moveItemPos, curItemIdx);
                    backMove = true;
                }
            }
            oldPos = curPos;
        }).on('touchend', function(e){
            if (forwardMove) {
                animateItem(1);
            }

            if (backMove) {
                animateItem(-1);
            }
        });

        function animateItem(flag) {
            isAnimate = true;
            var percent = Math.abs(step) / distance,
                animTarget = percent > opts.swpiePercent ? '0px' : distance * flag + 'px',
                animProperty = isVertical ? {'top' : animTarget} : {'left': animTarget},
                oldTarget = -distance * flag + 'px',
                oldProperty = isVertical ? {'top' : oldTarget} : {'left': oldTarget};
            $items.eq(curItemIdx + flag).animate(animProperty, 250, 'ease-in', function() {
                if (percent > opts.swpiePercent) {
                    $items.eq(curItemIdx).css(oldProperty).css('opacity', '');
                    $items.eq(curItemIdx + flag).css({'transition': '', 'z-index': 500});
                    curItemIdx += flag;
                    opts.onMoveEnd(curItemIdx);
                } else {
                    $items.eq(curItemIdx).css('opacity', '');
                }
                isAnimate = false;
            });
        }

        function moveItem(moveItemIdx, moveItemPos, curItemIdx) {
            $items.eq(curItemIdx).css('opacity', 1 - Math.abs(step) / distance);
            $items.eq(moveItemIdx).css(isVertical ? 'top' : 'left', moveItemPos + 'px').css({'z-index': 1000});
        }

        return this;

    }

    $.fn.swiper.defaultOpts = {
       direction: 'v', //'v'纵向，'h'横向
       swpiePercent: 0.3, //超过这个阈值就翻页
       itemSelector: 'div',
       onMoveEnd: function(index) {

       } 
    };
})(Zepto)