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