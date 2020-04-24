function validateLogin() {
  	if (!$('#Email').val().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
  		$('.Email-error-message').css('display','inline');
  		$('.Email-error-message').text('Email is not valid');
		return false;
	}
	return true;
}

function validateSignup() {
  	if (!$('#Email').val().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
  		$('.Email-error-message').css('display','inline');
  		$('.Email-error-message').text('Email is not valid');
		return false;
	}
	return true;
}

function checkPasswordStrength() {
	var number = /([0-9])/;
	var alphabets = /([a-zA-Z])/;
	var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
	if($('#Password').val().length<6) {
		$('#password-strength-status').removeClass();
		$('#password-strength-status').addClass('weak-password');
		$('#password-strength-status').css('display','inline');
		$('#password-strength-status').html("Weak (should be atleast 6 characters.)");
	} else {  	
		if($('#Password').val().match(number) && $('#Password').val().match(alphabets) && $('#Password').val().match(special_characters)) {            
			$('#password-strength-status').removeClass();
			$('#password-strength-status').addClass('strong-password');
			$('#password-strength-status').html("Strong");
			$('#password-strength-status').css('display','inline');
		} else {
			$('#password-strength-status').removeClass();
			$('#password-strength-status').addClass('medium-password');
			$('#password-strength-status').html("Medium (should include alphabets, numbers and special characters.)");
			$('#password-strength-status').css('display','inline');
		}
	}
}

function validatePassword() {
	var pswd = $('#Password').val();
	if ( pswd.length < 8 ) {
    	$('#length').removeClass('valid').addClass('invalid');
	} else {
    	$('#length').removeClass('invalid').addClass('valid');
	}

	if ( pswd.match(/[a-z]/) ) {
    	$('#lowercase').removeClass('invalid').addClass('valid');
	} else {
    	$('#lowercase').removeClass('valid').addClass('invalid');
	}

	if ( pswd.match(/[A-Z]/) ) {
    	$('#uppercase').removeClass('invalid').addClass('valid');
	} else {
    	$('#uppercase').removeClass('valid').addClass('invalid');
	}

	//validate number
	if ( pswd.match(/\d/) ) {
    	$('#number').removeClass('invalid').addClass('valid');
	} else {
    	$('#number').removeClass('valid').addClass('invalid');
	}
}