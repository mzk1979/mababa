$.fn.extend({  
    "fixedSerialize": function () {  
        var $f = $(this);  
        var data = $(this).serialize();  
        var $chks = $(this).find(":checkbox:not(:checked)");    //取得所有未选中的checkbox  

        if ($chks.length == 0) {  
            return data;  
        }  
        var nameArr = [];  
        var tempStr = "";  
        $chks.each(function () {  
            var chkName = $(this).attr("name");   
            if ($.inArray(chkName, nameArr) == -1 && $f.find(":checkbox[name='" + chkName + "']:checked").length == 0) {  
                nameArr.push(chkName);  
                tempStr += "&" + chkName + "=";  
            }  
        });  
        data += tempStr;  
        return data;  
    }  
});

    var opts = {            
            lines: 13, // 花瓣数目
            length: 20, // 花瓣长度
            width: 10, // 花瓣宽度
            radius: 30, // 花瓣距中心半径
            corners: 1, // 花瓣圆滑度 (0-1)
            rotate: 0, // 花瓣旋转角度
            direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
            color: '#5882FA', // 花瓣颜色
            speed: 1, // 花瓣旋转速度
            trail: 60, // 花瓣旋转时的拖影(百分比)
            shadow: false, // 花瓣是否显示阴影
            hwaccel: false, //spinner 是否启用硬件加速及高速旋转            
            className: 'spinner', // spinner css 样式名称
            zIndex: 2e9, // spinner的z轴 (默认是2000000000)
            top: '80%', // spinner 相对父容器Top定位 单位 px
            left: '50%'// spinner 相对父容器Left定位 单位 px
        };

    var spinner = new Spinner(opts);

function is_wechat(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return true;  
    } else {  
        return false;  
    }  
}
/*function test() {  
    var data = $("form:first").fixedSerialize();  
    alert(data);  
}
*/
function ajax_get(params,url){
    $.ajax({  
         type:'get',      
         url:url,  
         data:params,
         async:true,  
         cache:false,  
         dataType:'json',  
         success:function(data){
            popup(data);
         },
         error:function(data){
            popup(data);
         }  
    }); 
}

function ajax_post(params,url,goto){
    $.ajax({  
         type:'POST',      
         url:url,  
         data:params,  
         cache:false,
         async:true,  
         dataType:'json',         
        beforeSend: function () {
                    //异步请求时spinner出现
                    $("#firstDiv").text("");
                    var target = $("#firstDiv").get(0);
                    spinner.spin(target);                    
                },
         success:function(data){
          spinner.spin();
            popup(data,goto);
            return true;
         },
         error:function(data){
          spinner.spin();
            popup(data,goto);
            return false;
         }  
    }); 
}

function popup(data,gotourl){
   if (data.errCode===0){
      var thisClass="text-success";
      //var action=window.wxc.xcConfirm.typeEnum.info;
   }else{
      var thisClass="text-danger";
      //var action=window.wxc.xcConfirm.typeEnum.error;
   }
   // alert(data.msg);
   // location.reload();
   //window.wxc.xcConfirm(data.msg, action);
   //location.reload();
   $.confirm({
      title: '叮咚!',
      content: '<span class="'+thisClass+'">'+data.msg+'</span>',
      confirmButton: '确认',
      confirmButtonClass: 'btn-primary',
      icon: 'fa fa-bell',
      //theme: 'bootstrap',
      animation: 'zoom',                                    
      confirm: function () {
        if (gotourl==null || gotourl == undefined){
          location.reload();
        }else if (gotourl=="close"){
          
        }
        else{
          location.href = gotourl;
        }
        
      }
  });
   /*$("#res").html(data.msg);

   if (data.errCode===0){
      $("#popup").removeClass("alert-danger");
      $("#popup").addClass("alert-success");
   }else{
        if (!data.msg){
            $("#res").html("通讯失败，请联系管理员！");
        }
      $("#popup").removeClass("alert-success");
      $("#popup").addClass("alert-danger");
   }
    $(document).scrollTop(0);
   $("#popup").show();
    //$("#table").bootstrapTable('refresh');
    setTimeout(function(){
        $("#popup").hide();
    },5000);*/
}

//自动将json数据填充到表单中
function loadData(jsonStr){
    var obj = eval("("+jsonStr+")");
    //var obj = jsonStr;
    var key,value,tagName,type,arr;
    for(x in obj){
        key = x;
        value = obj[x];
        
        $("[name='"+key+"'],[name='"+key+"[]']").each(function(){
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if(tagName=='INPUT'){
                if(type=='radio'){
                    $(this).attr('checked',$(this).val()==value);
                }else if(type=='checkbox'){
                    arr = value.split(',');
                    for(var i =0;i<arr.length;i++){
                        if($(this).val()==arr[i]){
                            $(this).attr('checked',true);
                            break;
                        }
                    }
                }else{
                    $(this).val(value);
                }
            }else if(tagName=='SELECT' || tagName=='TEXTAREA'){
                $(this).val(value);
            }
            
        });
    }
}