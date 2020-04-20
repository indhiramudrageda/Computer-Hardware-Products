function validateLogin() {
  	var UserName = document.getElementById('UserName').value;
  	var Password = document.getElementById('Password').value;

  	if (!$('#UserName').val().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
  		$('.UserName-error-message').css('display','inline');
  		$('.UserName-error-message').text('Email is not valid');
		return false;
	}
	alert();
	return true;
}