window.setInterval(heart, 119000); 
function heart() { 
	$.ajax({
		url: module + "/Heartnobase/changeLogin",
		dataType: "json",
		success:function(data){
			if(data['status']=='ERROR'){
				//alert(data['data']);
			}else{
				//alert(data[])		
			}
		},
		error : function(XMLHttpRequest){
			alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
		}
	});
	
} 
