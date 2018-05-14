/**
 * Created by LONG on 2017-08-03.
 */
var ScrollUpdater = function(selector,sets,callback){
    var common = {};
    common._this = $(selector);
    common.callback = callback||function(){};

    common.EZtrigger = (sets.EZtrigger&&sets.EZtrigger==true);

    common.isDown = (!sets.direction||sets.direction=="down");
    if(common.isDown){common.containerName = "down-refresh-info-container";}
    else {common.containerName = "up-refresh-info-container";}

    common.startObjPoint = {x:0,y:0};
    common.startClientPoint = {x:0,y:0};
    common.scrollTop = common._this[0].scrollTop;
    common.scrollHeight = common._this[0].scrollHeight;
    common.screenHeight = window.innerHeight;
    common.moveClientPoint = {};
    common.VerticalOffsetY=0;
    common.VerticalOffsetX=0;
    common.canRefresh = false;

    var initContainer = function(){
        var refreshInfoContainer = document.createElement("div");
        refreshInfoContainer.setAttribute("class",common.containerName);
        refreshInfoContainer.innerHTML = "我还没有生效";
        refreshInfoContainer.style.height="0px";
        refreshInfoContainer.style.width="100%";
        refreshInfoContainer.style.textAlign="center";
        refreshInfoContainer.style.overflow="hidden";
        refreshInfoContainer.style.lineHeight="200px";

        if(common.isDown){
            $(selector).append(refreshInfoContainer);
        }else {
            $(selector).prepend(refreshInfoContainer);
        }
    };
    initContainer();

    common._this.on("touchstart",function(e){
        var touch = e.originalEvent.targetTouches[0];
        common.startObjPoint.x = touch.pageX;
        common.startObjPoint.y = touch.pageY;
        common.startClientPoint.x = e.originalEvent.changedTouches[0].clientX;
        common.startClientPoint.y = e.originalEvent.changedTouches[0].clientY;
    });

    common._this.on("touchmove",function(e){
        common.scrollTop = common._this[0].scrollTop;
        common.scrollHeight = common._this[0].scrollHeight;
        common.screenHeight = window.innerHeight;

        common.moveClientPoint.x = e.originalEvent.changedTouches[0].clientX;
        common.moveClientPoint.y = e.originalEvent.changedTouches[0].clientY;
        if(common.isDown){
            common.VerticalOffsetY = common.startClientPoint.y-common.moveClientPoint.y;
        }else {
            common.VerticalOffsetY = common.moveClientPoint.y-common.startClientPoint.y;
        }

        if(common.VerticalOffsetY>200){common.VerticalOffsetY=200;}
        if(common.VerticalOffsetY<0){common.VerticalOffsetY=0;}

        if(common.EZtrigger){

            if(common.isDown){
                if(common.scrollHeight-common.screenHeight<=common.scrollTop){
                    common.callback();
                }
            }else {
                if(common.scrollTop<=0){
                    common.callback();
                }
            }

        }else {
            if(common.isDown){
                if(common.scrollHeight-common.screenHeight<=common.scrollTop){
                    common.canRefresh = true;
                    $("."+common.containerName).css("height",common.VerticalOffsetY+"px");
                }else {
                    common.canRefresh = false;
                }
            }else {
                if(common.scrollTop<=0){common.canRefresh = true;$("."+common.containerName).css("height",common.VerticalOffsetY+"px");
                }else {common.canRefresh = false;}
            }
        }



        if($("."+common.containerName).css("height")=="200px"&&common.canRefresh){$("."+common.containerName).html("松开手指刷新");
        }else {$("."+common.containerName).html("我还未生效");}
    });


    common._this.on("touchend",function(){
        if(common.EZtrigger){return;}
        (function(){
            if($("."+common.containerName).css("height")=="200px"&&common.canRefresh){
                common.callback();
                $("."+common.containerName).animate({"height":"0"});
            }else {
                $("."+common.containerName).animate({"height":"0"});
            }
        })();
    })
}