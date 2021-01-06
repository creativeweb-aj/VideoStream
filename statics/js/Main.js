/**
 * check if os mac or window
 * 
 * 
 * **/



$(document).ready(function() {
	
	try{
		Main.contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
		
		if(Main.contextPath==""){
			Main.contextPath="";
		}
		if(Main.contextPath=="/v1"){
			Main.contextPath="";
		}
	}catch(e){
		
	}
	
	if (window.navigator.platform == 'MacIntel') {
		$('body').addClass('macos');
	}
	
	
	
})
/**
 * 
 * define class in javaScript
 * **/
var Main = function() {

};

Main.contextPath = "";
/**
 * root path for all url
 * 
 * **/
Main.version = "";
/**
 * 
 * To get value from the name of the field
 * 
 * **/
Main.getParam = function(name) {
	if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)'))
			.exec(location.search))
		return decodeURIComponent(name[1]);
};
/**
 * common date format using moment.js 
 * 
 * **/
Main.dateToString = function(intDate) {
	return moment(intDate).format('MM-DD-YYYY')
	//return moment(intDate).format('YYYY-MM-DD')
};

Main.dateToStringMonthName = function(intDate) {
	return moment(intDate).format('DD-MMM-YYYY')
	//return moment(intDate).format('YYYY-MM-DD')
};

Main.TimeStampTodateTime = function(intDate){
		return moment(intDate).format('MMMM Do YYYY, h:mm:ss a');
}

Main.TimeStampToEnddateTime = function(intDate){
	// return moment(intDate).format('MMMM Do YYYY, h:mm:ss a');
	return moment(intDate).format('DD MMM YYYY h:mm A');
}

Main.TimeStampToEndDateTimeNew = function(intDate){
	// return moment(intDate).format('MMMM Do YYYY, h:mm:ss a');
	return moment(intDate).format('YYYY/MM/DD H:mm');
}

Main.dateToCalenderFormat = function(intDate){
	return moment(intDate).format('MM/DD/YYYY')
}

Main.stringToDate = function(str){
	return moment(str, 'MM-DD-YYYY').toDate();
}

Main.getAge = function(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


/**
 * this will destroy session of the user (logout from the application)
 * 
 * **/
Main.logout = function() {
	// localStorage.removeItem('sessionToken');
	
	window.location=Main.contextPath+"/logout";
	
}
/**
 *JSON.stringify => Convert a JavaScript object into a string 
 * _success => this is a handler for api success event which passes response model as a parameter
 * Main.headers => we generally use it for Security or to identify OS 
 * **/

Main.callApi = function(_url, _data, _success) {
	var _d = JSON.stringify(_data);
	var _u = Main.contextPath+Main.version + _url;
	$.ajax({
		url : _u,
		type : "POST",
		data : _d,
		contentType : "application/json",
		headers : Main.headers,
		dataType : "json",
		success : function(response) {
			returnData = response;
			
			Main.processResponse(_url,response,_success);

			

		},
		error : function(error) {
			returnData = error;

		}

	});

};

/**
 * 
 * Prepare formData
 * 
 * var _form_admin = this;
    var _profile_image = $('#profile_image').val();
    var formdata =  new FormData(_form_admin);
    formdata.append("profile_image", _profile_image);
 * callFormApi
 * 
 */

Main.callFormApi = function(_url, _formData, _success){
	
	var _u = Main.contextPath+Main.version + _url;
	
	 $.ajax({
         url: _u,
         type: 'POST',
         data: _formData,
         async: false,
         cache: false,
         contentType: false,
         processData: false,
         xhrFields: {
             withCredentials: true
         },
         success: function(data) {
        	 Main.processResponse(_url,data,_success);
         }
     });
};


Main.processResponse = function(_url,r,_success){
	var response = null;
	try{
		response = JSON.parse(r);
	}catch(e){
		response = r;
	}
	
	
	if (_url != Main.contextPath+'/v1/web/login') {
		
		// if url is other then login
		
		if (response.status == "UNAUTHORIZE") {

			Main.logout();
		} else if (response.status == "ACCOUNT_NOT_ACTIVE") {
			window.location = Main.contextPath+"/vendor/info/account_not_verified";

		} else {
			_success(response);

		}
	} else {
		
		//If url is equal to login
		
		_success(response);

	}
	
}

Main.headers = {
		
	"sessiontoken" : Main.token,
	"XAPPHEADERKEY" : "RqFeOLhJWJ9ww1TU8sH4XloyoFQ=",
	"os" : "WEB",
	"deviceId" : "string",
	"Content-Type" : "application/json",
	"Accept" : "*/*"
}

Main.headers1 = {
		
		"sessiontoken" : Main.token,
		"XAPPHEADERKEY" : "RqFeOLhJWJ9ww1TU8sH4XloyoFQ=",
		"os" : "WEB",
		"deviceId" : "string",
		"Accept" : "*/*"
	}


Main.loader = function(isShow){
	try{
		if(isShow==true || isShow.toLowerCase() == "show"){
			jQuery("#preloader").fadeIn("slow");
		}else{
			jQuery("#preloader").fadeOut("slow");
		}
	}catch (e) {
		jQuery("#preloader").fadeOut("slow");
	}
	
	
}

Main.langTypeTimer = null;


/**
 * Initialize search input. this method provide timer for calling search api.
 * 
 * example:
 * 
   Main.initSearchInput("#inputId", "keyup/click", "/api/searchApi", function(custEvent){
   			
   			//custEvent: is object of action (keyup/click) event
   			
   			var v =  $(custEvent).val();
			if(v.trim()==""){
			
				//return null if you don't want to hit API
				return null;
			}
   			
   			var data = {
   				key:value
   			}
   			
   			return data;
   
   }, function(response){
   		
   		//create search list
   
   });
 * 
 */

Main.initSearchInputTimer = function(filterId, event, timeDoneEvent){
	$(filterId).on(event,function(){
		
		var custEvent = this;
		
		if(Main.langTypeTimer!=null){
			clearTimeout(Main.langTypeTimer);
		}
		
		Main.langTypeTimer = setTimeout(function(){
		  	
		  	timeDoneEvent(custEvent);
		  	
	 	},500);
		
	});
}

Main.initSearchInput = function(filterId, event, apiUrl, dataFunction, callback){
	
	var URL = apiUrl;
	
	Main.initSearchInputTimer(filterId,event,function(custEvent){
		
		var data = dataFunction(custEvent);
	  	
	  	if(data==null){
	  		clearTimeout(Main.langTypeTimer);
	  		return;
	  	}
		
		Main.callApi(URL,data, function(response){
	  		
	  		try{
	  			callback(response);
	  		}catch (e) {
	  			
			}
	  		
			clearTimeout(Main.langTypeTimer);
	  	});
	});
    
}

function tostModal(msg, _callback){
	
	$('#alert-msg').html(msg);
	$('#alert').show('slow');

	setTimeout(function(){
		$('#alert').hide('slow');
		try{
			_callback();
		}catch(e){}
	},1000*5);
}