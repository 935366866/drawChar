$(function(){
    //打开时根据窗口大小选择
    checkWindowSize(".change_box");
    //变动时根据浏览器大小选择样式
    $(window).resize(checkWindowSize);

    //导航下拉菜单
    var nav_list_all = ["nav1_list1","nav2_list1","nav2_list2"];
    for(var i in nav_list_all){
        var name = nav_list_all[i];
        $("."+name).mouseover(function(){
            $(this).addClass("listshow");
        });
        $("."+name).mouseout(function(){
            $(this).removeClass("listshow");
        });
    };
});	

//导航条
	$(function(){
		$(".main_nav1_left li").mouseover(function(){
			$(this).css("background","#d3d5e4").children("a").css("color","#13438b");
		})
		$(".main_nav1_left li").mouseout(function(){
			$(this).css("background","#13438b").children("a").css("color","#ddd");
		})
		$(".main_nav2_left li").mouseover(function(){
			$(this).children("a").addClass("active");
		})
		$(".main_nav2_left li").mouseout(function(){
			$(this).children("a").removeClass("active");
		})

	})


//搜索框
$(function() {
	$("#searchIcon").on("click", function() {
		$("#search_news").fadeIn(500);
		$(".main_nav1_left li:not(.dodo)").fadeOut();
		$("#search_news_input").focus();
		$(this).fadeOut()
	})
    $("#search_news_input").blur(function(){
     	$("#search_news").fadeOut(500);
     	$(".main_nav1_left li").fadeIn();
     	$("#searchIcon").fadeIn()
     });
     function searchClick(){

	     	$("#search_news").fadeOut(500);
	     	$(".main_nav1_left li").fadeIn();
	     	$("#searchIcon").fadeIn()

     }
     $(document).keypress(function(event){

     	if (event.keyCode==13) {//回车键的键值为13
     		searchClick(); //调用登录按钮的登录事件
     		
     	}
     })	

     	
})

//===========================函数========================
//1.根据浏览器大小选择样式
function checkWindowSize(){
    var id=".change_box";
    if($(window).width()>=1200){
        $(id).addClass("bigbox_1200");
        $(id).removeClass("bigbox");
    }else{
        $(id).addClass("bigbox");
        $(id).removeClass("bigbox_1200");
    };
};

// 获得选中的id
function getIdSelections(tableId,colName) {  //输入当前table的ID，需要获取的列
	var checkedId=""

	$.map($("#"+tableId).bootstrapTable('getSelections'), function (row) {
		if(checkedId == ""){
			checkedId += row[colName]
			}
		else{
			checkedId += ','+row[colName]
			}
	});
	return checkedId  //返回以逗号分隔的列明
};
//统计选中的checkbox的数量，传入bootstrap table的ID， 返回选中数字。
function checkedNum(tableId){
	check_num=0
	$("#" + tableId + " tr input[type='checkbox']").each(function(i){	
				if (i !== 0 && this.checked == true){
					check_num += 1;
				};
		});
	return check_num
}

//删除bootstrap table 中选中的项目，确认删除的时候发送删除的id
function remove_confirm(tableId,colName,number,url, param){
	if(number == 0){ 
		alert("您还未选中任何项！")
		}
	else{
		var r=confirm("您确定要删除这" + number + "项吗？");
		if (r==true)
		  {
			 checkedId =  getIdSelections(tableId,colName)   //该函数获取ID
			 //post方式发送数据
			 $.ajax({
				    url:url,  
				    type:'post',
				    data:{ids:checkedId},
				    dataType: "json",
				    success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
							$("#"+tableId).bootstrapTable('refresh');      //刷新
				    		alert(data['data']);
				    	}else{
				    		if(typeof(param)=='object'){
				    			$("#"+tableId).bootstrapTable('refresh',param);
				    		}else{
				    			$("#"+tableId).bootstrapTable('refresh');
				    		}
							
							//alert(data['data']);	
				    	}
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		  }
		}
};
//刷新bootstra table 需要提供表格的ID
function rf_bsTable(tableId) {
	$("#"+tableId).bootstrapTable('refresh');
	};

//实时显示选中的checkbox数量
function checkedNow(tableId,showId){
	$('#'+ tableId).on('check.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	$('#'+ tableId).on('uncheck.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	 $('#'+ tableId).on('check-all.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	 $('#'+ tableId).on('uncheck-all.bs.table', function () {   
	 	num = checkedNum("maintable");
		$('#' + showId).html(num);
	 });
	};
//向后台查看此目录是否存在 参数依次为需要检查的URL， 后台的地址， 需要更新的输入框id， 需要刷新的bootstrap table
function checkUrl(uncheckedUrl,url,inputId,tableId){
	var path = uncheckedUrl?uncheckedUrl:'/';
	path = path.replace('//','/');
	$.ajax({
				    url:url,  
				    type:'post',
				    data:{url:path},
				    dataType: "json",
				    success:function(data,textStatus) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
				    		var obj=data['data']
							$('#' + inputId).val(path);
							$('#' + tableId).bootstrapTable('load',obj);
				    	}
				   	  },    
				    error : function(XMLHttpRequest) {
				       	alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
				     }
				}); 
		
	};
function uploadFile(url,uploadId,inputId,ddir){  
		dpath = '';
		if(typeof(ddir)!='undefined'|| ddir=='undefined' ||ddir==''){
			dpath = ddir;
		}
	    $('#'+uploadId).fileupload({
	        url: url,
	        dataType: 'json',
	        done: function (e, data) {   //设置文件上传完毕事件的回调函数  
				var status = data.result.status;
				if(status == "ERROR"){
					alert(data.result.data);
					}
				else{
					var url = data.result.data;
					$(inputId).val(url);    //
		//			alert("上传成功！");
					}
	        }
	    })
};	
	
//双击行，判断是否是目录，若是，则进入目录。（三个参数：模态框中table的ID， input的ID， url为后台地址。）
function dblCilck(tableId,inputId,url) {
	$('#' + tableId).bind('dbl-click-row.bs.table',function(row, $element){
		var typeChr = $element.type.charAt(0);
		if(typeChr == 'd'){
			newUrl= $("#" + inputId).val()+'/'+$element.name;
			checkUrl(newUrl,url,inputId,tableId);
		}
	});
};

//数据目录中填入数据
function dataTableGet(data,sequencingType){
		var objData=[];
		var arr = new Array();  //数组，存放所有的文件名
		var arrSample = new Array(); //数组，存放所有的sample name
		var patt =/\.fq\.gz$/i;
		
		//双端
		if(sequencingType == "pe"){
			for(var i=0;i<data.length;i++){  
			   for(var key in data[i]){
				 if(key == "name"){

				   var name = data[i][key].trim();
				   arr.push(name);
				   if(patt.test(name)){

					   var sample = name.split("_")[0];
					   if($.inArray(sample,arrSample) == -1){
					   arrSample.push(sample);
						};
					}; 
				 }
			   }  
		   } 
		   
		   //组成JSON
		  for (var i=0;i<arrSample.length; i++){
			var fq1=arrSample[i]+"_1.fq.gz";
			var fq2=arrSample[i]+"_2.fq.gz";
			var adap1=arrSample[i]+"_1.adaptor.list";
			var adap2=arrSample[i]+"_2.adaptor.list";
			if($.inArray(fq1,arr) != -1){
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']=fq1;
				if($.inArray(adap1,arr) != -1){
					tmp['adap']=adap1;
				}
				else{
					tmp['adap']='<font color="red">' + adap1 + '</font>';
				}
				objData.push(tmp)
			}
			else{
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']= '<font color="red">' + fq1 + '</font>'
				if($.inArray(adap1,arr  != -1)){
					tmp['adap']=adap1;
				}
			   else{
					tmp['adap']= '<font color="red">' + adap1 + '</font>';
				}
				objData.push(tmp)
			}
		  if($.inArray(fq2,arr)  != -1){
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']=fq2;
				if($.inArray(adap2,arr)  != -1){
					tmp['adap']=adap2;
				}
				else{
					tmp['adap']= '<font color="red">' + adap2 + '</font>';
				}
				objData.push(tmp)
			}
			else{
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']= '<font color="red">' + fq2 + '</font>'
				if($.inArray(adap2,arr) != -1){
					tmp['adap']=adap2;
				}
			   else{
					tmp['adap']= '<font color="red">' + adap2 + '</font>';
				}
				objData.push(tmp)
			}
		}
		   
		   
		}
		if(sequencingType == "se"){
			for(var i=0;i<data.length;i++){  
			   for(var key in data[i]){
				 if(key == "name"){

				   var name = data[i][key];
				   arr.push(name);
				   if(patt.test(name)){

					   var sample = name.split(".")[0];
					   if($.inArray(sample,arrSample) == -1){
					   arrSample.push(sample);
						};
					}; 
				 }
			   }  
		   }
		   
		   for (var i=0;i<arrSample.length; i++){
			var fq=arrSample[i]+".fq.gz";
			var adap=arrSample[i]+".adaptor.list";
			if($.inArray(fq,arr) != -1){
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']=fq;
				if($.inArray(adap,arr) != -1){
					tmp['adap']=adap;
				}
				else{
					tmp['adap']='<font color="red">' + adap + '</font>';
				}
				objData.push(tmp)
			}
			else{
				var tmp = {};
				tmp['sample']=arrSample[i]
				tmp['fq']= '<font color="red">' + fq + '</font>'
				if($.inArray(adap1,arr  != -1)){
					tmp['adap']=adap;
				}
			   else{
					tmp['adap']='<font color="red">' + adap + '</font>';
				}
				objData.push(tmp)
			}

		  }
		}
	return objData
};



function myAjax(url,data1,callback,dom){

	$.ajax({
		url:url,  
		type:'get',
		data:data1,
		dataType: "json",
		success:function(data,textStatus) {
			if(data['status']=='ERROR'){    //请求成功但没有执行成功
				alert(data['data']);
				//console.log("bbb");
			}else{
				callback(data,data1,dom);
			//	console.log("cc");
			}
			},    
		error : function(XMLHttpRequest) {
			alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
			//alert('请登录');
		//	console.log("aaa");
			}
	}); 
};
//实时显示选中的checkbox数量
function checkedNow1(tableId,showId){
	var checkAll = ["check.bs.table","uncheck.bs.table","check-all.bs.table","uncheck-all.bs.table"]; //对其中的每一项进行绑定
	for(var i=0; i<checkAll.length; i++){
		$('#'+ tableId).on(checkAll[i], function () {   
	 		num = checkedNum(tableId);
			$('#' + showId).html(num);
	 	});
	}
};

//刷新按钮绑定该表格选中项清除，注意只在页面加载时调用一次
function refreshTable(divId,checkBoxId){
	$("#"+divId+" button[name='refresh']").click(function(){
		$("#" + checkBoxId +"").text(0);
	});	
};

//获该行所有数据，打开模态框
function editParams(tableId,modalId){   //三个参数分别是，要编辑的table的id， 需要打开的模态框的名字， 返回值为选中行的所有参数
	num = checkedNum(tableId);
	if(num == 1){
		var rowData
		$('#'+modalId).modal('show');      //打开模态框
		$.map($("#"+tableId).bootstrapTable('getSelections'), function (row) {
			rowData = row;
		});
		return rowData;
	}
	else{
		alert("请选择 1 项进行编辑！")
		return false;
		}
};

//删除选中的行
function remove(tableId,colName,url){
	num = checkedNum(tableId);					//选中个数
	remove_confirm(tableId,colName,num,url);	//删除。参数分别是bootstrap的名字（用来刷新），列名字（ID），删除的数量（用于显示删除几项），后台传输的地址
};
