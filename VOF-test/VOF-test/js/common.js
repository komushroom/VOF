var button_chk="N";


function MM_openBrWindow(theURL,winName,features) 
{ 
	window.open(theURL,winName,features); 
}

function checkSpace( str ) {
	if(str.search(/\s/) != -1){
		return 1;
	}
	else {
		return "";
	}
}

function IDchecker(obj) {
	
	var iform = document.getElementById("f_member");

	// 입력한 텍스트 추출
	var Value = obj.value;
	var Kor="1"
	var retVal = checkSpace( Value );

	iform.iddup.value="N";

	if( retVal != "" ) {
		alert("아이디는 빈 공간 없이 연속된 영문 소문자와 숫자만 사용할 수 있습니다.");
		obj.value=""
		obj.focus();
		return 0;
	}

	for(b=0; b<Value.length; b++){
		var c = Value.charCodeAt(b);
		if(!( (  48 <= c && c <= 57 ) || (  65 <= c && c <= 90 ) || (  97 <= c && c <= 122 ))){
			alert("아이디는 영어와 숫자만 사용할 수 있습니다.");
			obj.value=""
			obj.focus();
			return 0;
		}
	}
}


var idCheck = function() {
	var iform = document.getElementById("f_member");
	if (iform.id.value == "") {
		alert("아이디를 입력해주십시오.");
		iform.id.focus();
		return;
	}
	if (iform.id.value.length < 6 || iform.id.value.length > 20) {
		alert("아이디는 6~20자 사이의 숫자와 영문 대문자여야 합니다.");
		iform.id.focus();
		return;
	}
	var SendUrl = "../inc/CheckID.php";

	var param = "";
	param += "UID=" + encodeURIComponent(iform.id.value);

	$.ajax({
		type: "POST",
		url: SendUrl,
		data: param,
		dataType: "text",
		success: function(res){

			if (res == "OK") {
				alert("사용하실 수 있는 아이디 입니다.")
				iform.iddup.value="Y";
				
			} else {
				alert("중복된 아이디가 있습니다.\n다른 아이디를 입력해주십시오.");
				iform.iddup.value="N";
			}
		}
	});
};


var snCheck = function() {
	var iform = document.getElementById("f_member");
	if (iform.sn1.value == "") {
		alert("사업자번호를 입력해주십시오.");
		iform.sn1.focus();
		return;
	}

	if (iform.sn2.value == "") {
		alert("사업자번호를 입력해주십시오.");
		iform.sn2.focus();
		return;
	}

	if (iform.sn3.value == "") {
		alert("사업자번호를 입력해주십시오.");
		iform.sn3.focus();
		return;
	}
	if (iform.sn1.value.length < 3) {
		alert("올바른 사업자 번호가 아닙니다.");
		iform.sn1.focus();
		return;
	}

	if (iform.sn2.value.length < 2) {
		alert("올바른 사업자 번호가 아닙니다.");
		iform.sn2.focus();
		return;
	}

	if (iform.sn3.value.length < 2) {
		alert("올바른 사업자 번호가 아닙니다.");
		iform.sn3.focus();
		return;
	}


	var SendUrl = "../inc/CheckSN.php";

	var param = "";
	param += "USN1=" + encodeURIComponent(iform.sn1.value);
	param += "&USN2=" + encodeURIComponent(iform.sn2.value);
	param += "&USN3=" + encodeURIComponent(iform.sn3.value);

	$.ajax({
		type: "POST",
		url: SendUrl,
		data: param,
		dataType: "text",
		success: function(res){
	
			if (res == "OK") {
				alert("사용하실 수 있는 사업자번호 입니다.")
				iform.sndup.value="Y";
				
			} else {
				alert("중복된 사업자번호가 있습니다.");
				iform.sndup.value="N";
			}
		}
	});
};

function member_chk(ruser_kind, rpage_kind) {
		
/*
		if(button_chk == "Y")
	    {
     	  alert("처리중 입니다.");
		  return false;
		}
*/
		button_chk="Y";

		//var fr=document.getElementById("f_member");
		
		var fr = document.f_member;

		var aChar = fr.id.value.split("\\");
		var chr;
		chChar = aChar[aChar.length-1];

		if(!fr.id.value) {
			button_chk="N";
			fr.id.focus();
			alert("아이디를 입력 해 주세요.");
			return false;
	    }

		if(fr.iddup.value == "N") {
			button_chk="N";
			alert("아이디 중복체크를 해주세요.");
			return false;
	    }

		for (var i=0; i<chChar.length; i++) {
			chr = chChar.substr(i, 1);

			if( i==0 && (chr < 'A' || chr > 'Z') && (chr < 'a' || chr > 'z')) {
				button_chk="N";
				fr.id.focus();
				alert("아이디 첫자는 영문자만 입력가능합니다.");
				return false;
			}
			if((chr < '0' || chr > '9') && (chr < 'A' || chr > 'Z') && (chr < 'a' || chr > 'z')) {
				button_chk="N";
				fr.id.focus();
				alert("아이디는 영문자와 숫자만 입력가능합니다.");
				return false;
			}
		}

		if ( fr.id.value.length < 6 ||  fr.id.value.length > 12 ) {
			button_chk="N";
			fr.id.focus();
			alert("아이디는 6자이상 12자 이하로 입력하세요.");
			return false;
		}

		if(!fr.passwd.value){
			button_chk="N";
			fr.passwd.focus();
			alert("비밀번호를 입력 해 주세요.");
			return false;
		}
		if ( fr.passwd.value.length < 8 ||  fr.passwd.value.length > 20 ) {
			button_chk="N";
			fr.passwd.focus();
			alert("비밀번호는 8자이상 20자 이하로 입력하세요.");
			return false;
		}
		if(!fr.passwd2.value){
			button_chk="N";
			fr.passwd2.focus();
			alert("비밀번호 확인을 입력 해 주세요.");
			return false;
		}
		if(fr.passwd.value != fr.passwd2.value){
			button_chk="N";
			fr.passwd2.value="";
			fr.passwd2.focus();
			alert("비밀번호 확인을 다시 입력 해 주세요.");
			return false;
		}
		
		if(!fr.name.value){
			button_chk="N";
			fr.name.focus();
			alert("성명을 입력 해 주세요.");
			return false;
		}

		if(!fr.email_f.value){
			button_chk="N";
			fr.email_f.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
		}

		if(!fr.email_b.value){
			button_chk="N";
			fr.email_b.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
		}

		if(!fr.hp1.value){
			button_chk="N";
			fr.hp1.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
		}

		if(!fr.hp2.value){
			button_chk="N";
			fr.hp2.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
		}

		if(!fr.hp3.value){
			button_chk="N";
			fr.hp3.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
		}

		if(fr.check_util.value != "Y")
	    { 
			button_chk="N";
			alert("이용약관에 동의하지 않으셨습니다.");
			return false;
    	}

		if(fr.check_another.value != "Y")
	    { 
			button_chk="N";
			alert("개인정보 취급방침에 동의하지 않으셨습니다.");
			return false;
     	}

	


		if(ruser_kind == "S")
	    {
		  if(!fr.company.value){
			button_chk="N";
			fr.company.focus();
			alert("회사명을 입력 해 주세요.");
			return false;
		  }

		  if(fr.sndup.value == "N") {
			button_chk="N";
			alert("사업자번호 중복체크를 해주세요.");
			return false;
	      }

		  if(!fr.ph1.value){
			button_chk="N";
			fr.ph1.focus();
			alert("전화번호를 입력 해 주세요.");
			return false;
		  }

		  if(!fr.ph2.value){
			button_chk="N";
			fr.ph2.focus();
			alert("전화번호를 입력 해 주세요.");
			return false;
		  }

		  if(!fr.ph3.value){
			button_chk="N";
			fr.ph3.focus();
			alert("전화번호를 입력 해 주세요.");
			return false;
		  }
		  
		}

		if(document.getElementById("authType_p").checked && !fr.authKey.value)
	    {
		   button_chk="N";
		   fr.authKey.focus();
           alert("인증번호를 입력 해 주세요.");
		   return false;
	    }
        
 
 
 
		 try {
		     fr.tph1.value = fr.ph1.value;
				 fr.tph2.value = fr.ph2.value;
				 fr.tph3.value = fr.ph3.value;
		}
		catch(exception){
		     fr.tph1.value = "";
				 fr.tph2.value = "";
				 fr.tph3.value = "";
		}
 
 
		var SendUrl = "/inc/member_input.php";
		var param = "";
	    
		param += "UID=" + encodeURIComponent(fr.id.value);
	    param += "&PASSWD=" + encodeURIComponent(fr.passwd.value);
		param += "&NAME=" + encodeURIComponent(fr.name.value);
		param += "&EMAIL_F=" + encodeURIComponent(fr.email_f.value);
		param += "&EMAIL_B=" + encodeURIComponent(fr.email_b.value);
		
		param += "&HP1=" + encodeURIComponent(fr.hp1.value);
		param += "&HP2=" + encodeURIComponent(fr.hp2.value);
		param += "&HP3=" + encodeURIComponent(fr.hp3.value);
		
		param += "&UTIL=" + encodeURIComponent(fr.check_util.value);
		param += "&PRIVATE=" + encodeURIComponent(fr.check_private.value);
		param += "&ANOTHER=" + encodeURIComponent(fr.check_another.value);
		param += "&USER_KIND="+ruser_kind;
		
		param += "&SKYPEID="+encodeURIComponent(fr.skypeid.value);
		
		 param += "&TPH1="+encodeURIComponent(fr.tph1.value);
		 param += "&TPH2="+encodeURIComponent(fr.tph2.value);
		 param += "&TPH3="+encodeURIComponent(fr.tph3.value);
        
		if(ruser_kind == "S")
	    {
          param += "&COMPANY=" + encodeURIComponent(fr.company.value);
		//  param += "&SN1=" + encodeURIComponent(fr.sn1.value);
		//  param += "&SN2=" + encodeURIComponent(fr.sn2.value);
		//  param += "&SN3=" + encodeURIComponent(fr.sn3.value);
		
		  param += "&PH1=" + encodeURIComponent(fr.ph1.value);
		  param += "&PH2=" + encodeURIComponent(fr.ph2.value);
		  param += "&PH3=" + encodeURIComponent(fr.ph3.value);
		
		  param += "&CKIND=" + encodeURIComponent(fr.ckind.value);
		}
		
		if(document.getElementById("authType_e").checked)
		   param += "&authType=E";
        else
	    {
		   param += "&authType=P";
		   param += "&authKey=" + encodeURIComponent(fr.authKey.value);
        }
		
	    $.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if (res == "OK") 
			{

				 button_chk="N";

				if(rpage_kind == "leveltest")
				{
					 leveltest_chk();
					 return;
				}
				else
				{

 				  if(document.getElementById("authType_e").checked)
				     location.href="member04.htm";
			      else
				     location.href="member05.htm";
				}

			}
			else if(res == "ERROR_AUTH") 
			{
			  
			  button_chk="N";
			  alert("인증번호가 일치하지 않습니다.");
			  return false;

			} 
			else if(res == "ERROR_EMAIL") 
			{
			  
			  button_chk="N";
			  alert("인증 이메일이 발송되지 않았습니다. 다시 시도해 주세요.");
			  return false;
            
			} 
			else if(res == "ERROR_INSERT") 
			{
			  
			  button_chk="N";
			  alert("등록 오류 입니다. 관리자에게 문의해 주세요.");
			  return false;

			} 
			else if(res == "DUP_INSERT") 
			{
			  
			  button_chk="N";
			  alert("이미 가입된 회원번호입니다. 관리자에게 문의해 주세요.");
			  return false;

			} 			
			else 
			{
				button_chk="N";
				alert("ERROR");
				return false;
 			}
		   }
      });

}

function member_modify_chk(ruser_kind) {
		

		if(button_chk == "Y")
	    {
     	  alert("처리중 입니다.");
		  return false;
		}

		button_chk="Y";

		var fr=document.getElementById("f_member");

		var aChar = fr.id.value.split("\\");
		var chr;
		chChar = aChar[aChar.length-1];

		if( fr.passwd.value != ""  || fr.passwd2.value != ""  )
		{
					if(!fr.passwd.value){
						button_chk="N";
						fr.passwd.focus();
						alert("비밀번호를 입력 해 주세요.");
						return false;
					}
					if ( fr.passwd.value.length < 8 ||  fr.passwd.value.length > 20 ) {
						button_chk="N";
						fr.passwd.focus();
						alert("비밀번호는 8자이상 20자 이하로 입력하세요.");
						return false;
					}
					
					if(!fr.passwd2.value){
						button_chk="N";
						fr.passwd2.focus();
						alert("비밀번호 확인을 입력 해 주세요.");
						return false;
					}
					if(fr.passwd.value != fr.passwd2.value){
						button_chk="N";
						fr.passwd2.value="";
						fr.passwd2.focus();
						alert("비밀번호 확인을 다시 입력 해 주세요.");
						return false;
					}
	  }
	   	
		if(!fr.name.value){
			button_chk="N";
			fr.name.focus();
			alert("성명을 입력 해 주세요.");
			return false;
		}

		if(!fr.email_f.value){
			button_chk="N";
			fr.email_f.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
		}

		if(!fr.email_b.value){
			button_chk="N";
			fr.email_b.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
		}

		if(!fr.hp1.value){
			button_chk="N";
			fr.hp1.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
		}

		if(!fr.hp2.value){
			button_chk="N";
			fr.hp2.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
		}

		if(!fr.hp3.value){
			button_chk="N";
			fr.hp3.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
		}


		if(ruser_kind == "S")
	    {
		  if(!fr.company.value){
			button_chk="N";
			fr.company.focus();
			alert("회사명을 입력 해 주세요.");
			return false;
		  }

		 
		  if(!fr.ph1.value){
			button_chk="N";
			fr.ph1.focus();
			alert("전화번호를 입력 해 주세요.");
			return false;
		  }

		  if(!fr.ph2.value){
			button_chk="N";
			fr.ph2.focus();
			alert("전화번호를 입력 해 주세요.");
			return false;
		  }

		  if(!fr.ph3.value){
			button_chk="N";
			fr.ph3.focus();
			alert("전화번호를 입력 해 주세요.");
			return false;
		  }
		  
		}

		
		var SendUrl = "../inc/member_modify.php";

	    var param = "";
	    param += "UID=" + encodeURIComponent(fr.id.value);
	    param += "&PASSWD=" + encodeURIComponent(fr.passwd.value);
		param += "&NAME=" + encodeURIComponent(fr.name.value);
		param += "&EMAIL_F=" + encodeURIComponent(fr.email_f.value);
		param += "&EMAIL_B=" + encodeURIComponent(fr.email_b.value);
		param += "&HP1=" + encodeURIComponent(fr.hp1.value);
		param += "&HP2=" + encodeURIComponent(fr.hp2.value);
		param += "&HP3=" + encodeURIComponent(fr.hp3.value);
		param += "&USER_KIND="+ruser_kind;

		if(ruser_kind == "S")
	    {
          param += "&COMPANY=" + encodeURIComponent(fr.company.value);
		  param += "&SN1=" + encodeURIComponent(fr.sn1.value);
		  param += "&SN2=" + encodeURIComponent(fr.sn2.value);
		  param += "&SN3=" + encodeURIComponent(fr.sn3.value);
		  param += "&PH1=" + encodeURIComponent(fr.ph1.value);
		  param += "&PH2=" + encodeURIComponent(fr.ph2.value);
		  param += "&PH3=" + encodeURIComponent(fr.ph3.value);
		  param += "&CKIND=" + encodeURIComponent(fr.ckind.value);
		}
		
		
		
		
	    $.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if (res == "OK") 
			{
				button_chk="N";

				location.href="/";

			}
			else if(res == "ERROR_INSERT") 
			{
			  
			  button_chk="N";
			  alert("등록 오류 입니다. 관리자에게 문의해 주세요.");
			  return false;

			} 
			else 
			{
				button_chk="N";
				alert("ERROR");
				return false;
 			}
		   }
      });

}


function SendAuth()
{
  var fr=document.getElementById("f_member");
  
  if(!fr.id.value) {
			button_chk="N";
			fr.id.focus();
			alert("아이디를 입력 해 주세요.");
			return false;
  }

  if(fr.iddup.value == "N") {
			button_chk="N";
			alert("아이디 중복체크를 해주세요.");
			return false;
  }
  
  if(!fr.hp1.value){
			button_chk="N";
			fr.hp1.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
  }

  if(!fr.hp2.value){
			button_chk="N";
			fr.hp2.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
  }

  if(!fr.hp3.value){
			button_chk="N";
			fr.hp3.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
  }


  param  = "UID=" + encodeURIComponent(fr.id.value);
  param += "&HP1=" + encodeURIComponent(fr.hp1.value);
  param += "&HP2=" + encodeURIComponent(fr.hp2.value);
  param += "&HP3=" + encodeURIComponent(fr.hp3.value);
  
  var SendUrl = "../inc/auth_key.php";

  $.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){
			


			if (res == "ERROR") {
				alert("ERROR");
				return false;
               
			}else {
				alert("인증번호가 전송되었습니다.");
 			}
		}
      });

}

function CheckAuthType(rchk)
{
	if(rchk == "p")
       document.getElementById('div_authField').style.visibility = 'visible';
    else
       document.getElementById('div_authField').style.visibility = 'hidden';
}

function FindIdCheck(rchk)
{
	document.getElementById('tr_autyData_email').style.display = 'none';
	document.getElementById('tr_autyData_phone').style.display = 'none';

    if(rchk == "p")
       document.getElementById('tr_autyData_phone').style.display = 'block';
    else
       document.getElementById('tr_autyData_email').style.display = 'block';
}


function check_email(rval)
{
  document.getElementById('email_b').value=rval;
}



function FindId()
{
  var fr=document.getElementById("f_member");
  
  
  if(!fr.name.value){
			fr.name.focus();
			alert("이름을 입력 해 주세요.");
			return false;
  }

  if(document.getElementById("authType_e").checked)
  {
     if(!fr.email_f.value){
			fr.email_f.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
	}

	if(!fr.email_b.value){
			fr.email_b.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
	}
  }

  if(document.getElementById("authType_p").checked)
  {
    if(!fr.hp1.value){
			button_chk="N";
			fr.hp1.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
    }

    if(!fr.hp2.value){
			button_chk="N";
			fr.hp2.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
    }

    if(!fr.hp3.value){
			button_chk="N";
			fr.hp3.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
    }
  }

  param  = "mode=ID_FIND";
  param += "&USER_KIND=" + encodeURIComponent(fr.user_kind.value);
  param += "&NAME=" + encodeURIComponent(fr.name.value);
  param += "&EMAIL_F=" + encodeURIComponent(fr.email_f.value);
  param += "&EMAIL_B=" + encodeURIComponent(fr.email_b.value);
  param += "&HP1=" + encodeURIComponent(fr.hp1.value);
  param += "&HP2=" + encodeURIComponent(fr.hp2.value);
  param += "&HP3=" + encodeURIComponent(fr.hp3.value);
  
  if(document.getElementById("authType_p").checked)
     param += "&authType=P";

  if(document.getElementById("authType_e").checked)
     param += "&authType=E";

  var SendUrl = "searchid.htm";
  
  
  $.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if(res == "ERROR") {
				alert("일치하는 회원정보가 없습니다.");
				return false;
               
			}
            else if(res == "ERROR_EMAIL") {
				alert("이메일을 전송하지 못 하였습니다. 관리자에게 문의해 주세요.");
				return false;
               
			}
			else
			{
			   alert("아이디를 전송하였습니다.");
			   return false;
			}
		}
      });

}


function FindPW()
{
  var fr=document.getElementById("f_member");
  
  
  
  if(!fr.id.value){
			fr.id.focus();
			alert("아이디를 입력 해 주세요.");
			return false;
  }

  if(!fr.name.value){
			fr.name.focus();
			alert("이름을 입력 해 주세요.");
			return false;
  }

  if(document.getElementById("authType_e").checked)
  {
     if(!fr.email_f.value){
			fr.email_f.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
	}

	if(!fr.email_b.value){
			fr.email_b.focus();
			alert("이메일을 입력 해 주세요.");
			return false;
	}
  }

  if(document.getElementById("authType_p").checked)
  {
    if(!fr.hp1.value){
			button_chk="N";
			fr.hp1.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
    }

    if(!fr.hp2.value){
			button_chk="N";
			fr.hp2.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
    }

    if(!fr.hp3.value){
			button_chk="N";
			fr.hp3.focus();
			alert("휴대전화번호를 입력 해 주세요.");
			return false;
    }
  }

  param  = "mode=PW_FIND";
  param += "&USER_KIND=" + encodeURIComponent(fr.user_kind.value);
  param += "&UID=" + encodeURIComponent(fr.id.value);
  param += "&NAME=" + encodeURIComponent(fr.name.value);
  param += "&EMAIL_F=" + encodeURIComponent(fr.email_f.value);
  param += "&EMAIL_B=" + encodeURIComponent(fr.email_b.value);
  param += "&HP1=" + encodeURIComponent(fr.hp1.value);
  param += "&HP2=" + encodeURIComponent(fr.hp2.value);
  param += "&HP3=" + encodeURIComponent(fr.hp3.value);
  
  if(document.getElementById("authType_p").checked)
     param += "&authType=P";

  if(document.getElementById("authType_e").checked)
     param += "&authType=E";

  var SendUrl = "searchpw.htm";
  
  
  $.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if(res == "ERROR") {
				alert("일치하는 회원정보가 없습니다.");
				return false;
               
			}
            else if(res == "ERROR_EMAIL") {
				alert("이메일을 전송하지 못 하였습니다. 관리자에게 문의해 주세요.");
				return false;
               
			}
			else
			{
			   alert("비밀번호를 전송하였습니다.");
			   return false;
			}
		}
      });

}


function phone_chk(m)
{
  var fr=document.getElementById("f_phone");

  if(!fr.phone_name.value || fr.phone_name.value == "이름을 적어주세요") {
		fr.phone_name.focus();
		alert("이름을 입력 해 주세요.");
		return false;
  }

  if(!fr.phone_email.value || fr.phone_email.value == "이메일을 적어주세요") {
		fr.phone_email.focus();
		alert("이메일을 입력 해 주세요.");
		return false;
  }

  if(!fr.phone_hp1.value) {
		fr.phone_hp1.focus();
		alert("연락처를 입력 해 주세요.");
		return false;
  }

  if(!fr.phone_hp2.value) {
		fr.phone_hp2.focus();
		alert("연락처를 입력 해 주세요.");
		return false;
  }

  if(!fr.phone_hp3.value) {
		fr.phone_hp3.focus();
		alert("연락처를 입력 해 주세요.");
		return false;
  }
        

  var param = "mode=PHONE_WRITE_ACTION";
  param += "&name=" + encodeURIComponent(fr.phone_name.value);
  param += "&email=" + encodeURIComponent(fr.phone_email.value);
  param += "&hp1=" + encodeURIComponent(fr.phone_hp1.value);
  param += "&hp2=" + encodeURIComponent(fr.phone_hp2.value);
  param += "&hp3=" + encodeURIComponent(fr.phone_hp3.value);
  
  var SendUrl = "/inc/phone_write.php";
  var mode = m;
  $.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if (res == "ERROR") {
				alert("잠시후 다시 시도해 주세요.");
				return false;
			}
			else
			  {
				alert("전화상담 요청 되었습니다.");
				if(mode=="m"){
					location.href="/";
				}
				return false;
			  }
		}
      });

}


function chat_chk1()
{
  window.open("/chattingIndex.php","VOF Chatting", "width=500, height=738, resizable=no, scrollbard=no");
}

function chat_chkE()
{
   window.open("/eChat/chattingIndex.php", "전화영어 채팅", "width=600, height=900, resizable=no");
}
   
function chat_chk2()
{
  location.href="/chattingIndex.php";
}


function online_passwd_chk()
{
  var rpasswd = $.trim($("#passwd").val());

    if(!rpasswd) 
	{
		$("#passwd").focus();
		alert("비밀번호를 입력 해 주세요.");
		return false;
    }

	 $("#f_write").submit();
}

function online_write_chk(rmode)
{
	var ruser_name = $.trim($("#user_name").val());
	var rtitle = $.trim($("#title").val());
	var rhp1 = $.trim($("#hp1").val());
	var rhp2 = $.trim($("#hp2").val());
	var rhp3 = $.trim($("#hp3").val());
	var rpasswd = $.trim($("#passwd").val());
	var rcontent = $.trim($("#content").val());
	var msg;

    
	if(!ruser_name) 
	{
		$("#user_name").focus();
		alert("작성자를 입력 해 주세요.");
		return false;
    }

	if(!rtitle) 
	{
		$("#title").focus();
		alert("제목을 입력 해 주세요.");
		return false;
    }

	if(!rtitle) 
	{
		$("#title").focus();
		alert("제목을 입력 해 주세요.");
		return false;
    }

	if(!rhp1) 
	{
		$("#hp1").focus();
		alert("연락처를 입력 해 주세요.");
		return false;
    }

	if(!rhp2) 
	{
		$("#hp2").focus();
		alert("연락처를 입력 해 주세요.");
		return false;
    }

	if(!rhp3) 
	{
		$("#hp3").focus();
		alert("연락처를 입력 해 주세요.");
		return false;
    }
/*
	if(!rpasswd) 
	{
		$("#passwd").focus();
		alert("비밀번호를 입력 해 주세요.");
		return false;
    }
*/
	if(!rcontent) 
	{
		$("#content").focus();
		alert("내용을 입력 해 주세요.");
		return false;
    }
    
	if(rmode == "WRITE")
	   msg="등록 하시겠습니까?";

	if(rmode == "MODIFY")
	   msg="수정 하시겠습니까?";
	   
	if(confirm(msg))
	   $("#f_write").submit();
}

function del_chk()
{
	var rpasswd = $.trim($("#passwd").val());

	if(!rpasswd) 
	{
		$("#passwd").focus();
		alert("비밀번호를 입력 해 주세요.");
		return false;
    }

	if(confirm("삭제 하시겠습니까?"))
	   $("#f_del").submit();
}


function know_write_chk(rgubn) {
		

		if(button_chk == "Y")
	    {
     	  alert("처리중 입니다.");
		  return false;
		}

		button_chk="Y";

    oEditors.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);

		var rtitle = $.trim($("#title").val());
	    var rpdcode = $.trim($("#pdcode").val());
		var rpjcode = $.trim($("#pjcode").val());
		var rmoney = $.trim($("#money").val());
		var rcontent = $.trim($("#content").val());
		var rallim = $.trim($("#allim").val());
		var rtags = $.trim($("#tags").val());
	    var rhp1 = $.trim($("#hp1").val());
	    var rhp2 = $.trim($("#hp2").val());
	    var rhp3 = $.trim($("#hp3").val());
	    var rph1 = $.trim($("#ph1").val());
	    var rph2 = $.trim($("#ph2").val());
	    var rph3 = $.trim($("#ph3").val());
        var rwork = $.trim($("#work").val());

/*
		var ruserfile1 = $.trim($("#userfile1").val());
		var ruserfile2 = $.trim($("#userfile2").val());
		var ruserfile3 = $.trim($("#userfile3").val());
		var ruserfile4 = $.trim($("#userfile4").val());
*/

		var ruserfile1 = "";
		var ruserfile2 = "";
		var ruserfile3 = "";
		var ruserfile4 = "";

    var strFile = "";
    for(nLoop=1; nLoop <= $("#max_file_cnt").val(); nLoop++)
    {
    	 if ( strFile != "" ) 
    	    strFile += ",";
    	    
    	    strFile += $.trim($("#userfile" + nLoop).val());
    }

		var roptions_a1 = $.trim($("#options_a1").val());
		var roptions_a2 = $.trim($("#options_a2").val());
		var roptions_a3 = $.trim($("#options_a3").val());

		var roptions_b1 = $.trim($("#options_b1").val());
		var roptions_b2 = $.trim($("#options_b2").val());
		var roptions_b3 = $.trim($("#options_b3").val());

		var roptions_c1 = $.trim($("#options_c1").val());
		var roptions_c2 = $.trim($("#options_c2").val());
		var roptions_c3 = $.trim($("#options_c3").val());

		var roptions_d1 = $.trim($("#options_d1").val());
		var roptions_d2 = $.trim($("#options_d2").val());
		var roptions_d3 = $.trim($("#options_d3").val());

		var roptionyn="N";

		if($("#optionyn").prop("checked"))
           roptionyn="Y";

		
		var fr=document.getElementById("f_write");

		if(!rtitle){
			button_chk="N";
			alert("제목을 입력 해 주세요.");
			$("#title").focus();
			return false;
		}

		if(!rpdcode){
			button_chk="N";
			alert("카테고리를 선택 해 주세요.");
			$("#pdcode").focus();
			return false;
		}

		if(!rpjcode){
			button_chk="N";
			alert("카테고리를 선택 해 주세요.");
			$("#pjcode").focus();
			return false;
		}

		if(!rwork){
			button_chk="N";
			alert("작업기간을 입력 해 주세요.");
			$("#work").focus();
			return false;
		}
        

		var SendUrl = "";
		
		if (rgubn == "I")
		  SendUrl = "market_apply.htm";
	
		if (rgubn == "M")
		  SendUrl = "market_talent_modify.htm";
		
	    var param = "";
	    param += "mode=WRITE_ACTION";
      param += "&title="+rtitle;
      param += "&pdcode="+rpdcode;
      param += "&pjcode="+rpjcode;
      param += "&money="+rmoney;
			param += "&content="+rcontent;
			param += "&allim="+rallim;
			param += "&tags="+rtags;
			param += "&hp1="+rhp1;
			param += "&hp2="+rhp2;
			param += "&hp3="+rhp3;
			param += "&ph1="+rph1;
			param += "&ph2="+rph2;
			param += "&ph3="+rph3;
			param += "&ph3="+rph3;
			param += "&work="+rwork;
			
			param += "&userfile="+strFile;
			
			
			param += "&userfile1="+ruserfile1;
			param += "&userfile2="+ruserfile2;
			param += "&userfile3="+ruserfile3;
			param += "&userfile4="+ruserfile4;
			param += "&options_a1="+roptions_a1;
			param += "&options_a2="+roptions_a2;
			param += "&options_a3="+roptions_a3;
			param += "&options_b1="+roptions_b1;
			param += "&options_b2="+roptions_b2;
			param += "&options_b3="+roptions_b3;
			param += "&options_c1="+roptions_c1;
			param += "&options_c2="+roptions_c2;
			param += "&options_c3="+roptions_c3;
			param += "&options_d1="+roptions_d1;
			param += "&options_d2="+roptions_d2;
			param += "&options_d3="+roptions_d3;
			param += "&optionyn="+roptionyn;
        
		if (rgubn == "M")
		  param += "&seq="+$.trim($("#seq").val());

        
        
		if (rgubn == "I")
	    {
	    	if(!confirm("등록 하시겠습니까?"))
	        {
		      button_chk="N";
		  	  return false;
		    }
        }

		if (rgubn == "M")
	    {
	    	if(!confirm("수정 하시겠습니까? 기존 재능은 노출되지 않으며 수정재능은 재승인 받으셔야 합니다."))
	        {
		      button_chk="N";
		  	  return false;
		    }
        }


		$.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){
			if(res == "OK") 
			{
				button_chk="N";
				alert("관리자 최종 승인후 노출됩니다.");

				if(rgubn == "I")
				   location.href="market_sub.htm?dcode="+rpdcode+"&jcode="+rpjcode;

				if(rgubn == "M")
				   location.href="market_talent_list.htm";
				return false;
          
			}
			else 
			{
				button_chk="N";
				alert("ERROR");
				return false;
 			}
		   }
      });

}

function know_profile_write_chk() {
		

		if(button_chk == "Y")
	    {
     	  alert("처리중 입니다.");
		  return false;
		}

		button_chk="Y";

		var ruserfile1 = $.trim($("#userfile1").val());
	    var rfilenm1 = $.trim($("#filenm1").val());
		var rhomepage = $.trim($("#homepage").val());
		var rnick_name = $.trim($("#nick_name").val());
		var rintro = $.trim($("#intro").val());
		var rinterest1 = $.trim($("#interest1").val());
		var rinterest2 = $.trim($("#interest2").val());
		var rinterest3 = $.trim($("#interest3").val());
		
		var fr=document.getElementById("f_write");

		
		var SendUrl = "market_mypage_profile.htm";

	    var param = "";
	    param += "mode=WRITE_ACTION";
        param += "&userfile="+ruserfile1;
        param += "&filenm="+rfilenm1;
        param += "&homepage="+rhomepage;
        param += "&nick_name="+rnick_name;
		param += "&intro="+rintro;
		param += "&interest1="+rinterest1;
		param += "&interest2="+rinterest2;
		param += "&interest3="+rinterest3;

		
		if(!confirm("등록 하시겠습니까?"))
			return false;
		
		$.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if(res == "OK") 
			{
			    	button_chk="N";
		        alert("등록 되었습니다.");
		        window.location.href="/market_mypage.htm";
				return false;
          
			}
			else 
			{
				button_chk="N";
				alert("ERROR");
				return false;
 			}
		   }
      });

}

function know_profile_my_pw_chk() {
		

		if(button_chk == "Y")
	    {
     	  alert("처리중 입니다.");
		  return false;
		}

		button_chk="Y";

		var rhpw = $.trim($("#hpw").val());
	    var rcpw1 = $.trim($("#cpw1").val());
		var rcpw2 = $.trim($("#cpw2").val());

        var fr=document.getElementById("f_write");

		if(!rhpw){
			button_chk="N";
			alert("현재비밀번호를 입력 해 주세요.");
			$("#hpw").focus();
			return false;
		}

		if(!rcpw1){
			button_chk="N";
			alert("변경할 비밀번호를 입력 해 주세요.");
			$("#cpw1").focus();
			return false;
		}

		if ( rcpw1.length < 8 ||  rcpw1.length > 20 ) {
			button_chk="N";
			alert("비밀번호는 8자이상 20자 이하로 입력하세요.");
			$("#cpw1").focus();
			return false;
		}

		if(!rcpw2){
			button_chk="N";
			alert("확인비밀번호를 입력 해 주세요.");
			$("#cpw2").focus();
			return false;
		}

		if(rcpw1 != rcpw2) {

			button_chk="N";
			alert("확인비밀번호가 일치하지 않습니다.");
			$("#cpw2").focus();
			return false;
		}

		
		var SendUrl = "market_mypage_my.htm";

	    var param = "";
	    param += "mode=PWCHANGE_ACTION";
        param += "&hpw="+rhpw;
        param += "&cpw="+rcpw1;
		
		if(!confirm("수정 하시겠습니까?"))
			return false;
		
		$.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if(res == "OK") 
			{
				button_chk="N";
		        alert("수정 되었습니다.");
				return false;
          
			}
			else if(res == "ERROR1")
			{
				button_chk="N";
				alert("현재 비밀번호가 회원님의 비밀번호와 일치하지 않습니다.");
				return false;
			}
			else 
			{
				button_chk="N";
				alert("ERROR");
				return false;
 			}
		   }
      });

}


function know_profile_my_out_chk() {
		

		if(button_chk == "Y")
	    {
     	  alert("처리중 입니다.");
		  return false;
		}

		button_chk="Y";

		var rtpw = $.trim($("#tpw").val());
		var rreason="";

        var fr=document.getElementById("f_write");

		if($("#reason1").prop("checked"))
  	      rreason = $("#reason1").val();

		if($("#reason2").prop("checked"))
  	      rreason = $("#reason2").val();

		if($("#reason3").prop("checked"))
  	      rreason = $("#reason3").val();

		if($("#reason4").prop("checked"))
  	      rreason = $("#reason4").val();

		if($("#reason5").prop("checked"))
  	      rreason = $("#reason5").val();

		if($("#reason6").prop("checked"))
  	      rreason = $("#reason_etc").val();

		
		if(!rtpw){
			button_chk="N";
			alert("비밀번호를 입력 해 주세요.");
			$("#tpw").focus();
			return false;
		}

		
		
		var SendUrl = "market_mypage_my.htm";

	    var param = "";
	    param += "mode=OUT_ACTION";
        param += "&tpw="+rtpw;
        param += "&reason="+rreason;
		

		if(!confirm("탈퇴 하시겠습니까?"))
	    {
			button_chk="N";
			return false;
		}

		$.ajax({
		  type: "POST",
		  url: SendUrl,
		  data: param,
		  dataType: "text",
		  success: function(res){

			if(res == "OK") 
			{
				button_chk="N";
		        alert("탈퇴 되었습니다.");
				location.href="/login.htm?mode=LOGOUT_ACTION";
				return false;
          
			}
			else if(res == "ERROR1")
			{
				button_chk="N";
				alert("현재 비밀번호가 회원님의 비밀번호와 일치하지 않습니다.");
				return false;
			}
			else 
			{
				button_chk="N";
				alert("ERROR");
				return false;
 			}
		   }
      });

}

