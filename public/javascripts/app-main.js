var selectedProduct = {};
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

function showCreateDialog() {
	var modal = $('#myCreateModal');
  	modal.css('display', 'block');
  	var desc = $('#create-product').html();
  	modal.children("#create-modal-content").html(desc);
	var span = document.getElementsByClassName("create-close")[0];
	span.onclick = function() { 
  		modal.css('display', 'none');
	}
}

function createProduct(event) {

	event.preventDefault();
	var form = $('#create-product-form')[0];

	var data = new FormData(form);
    $("#btnSubmit").prop("disabled", true);

	$.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/products",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                $("#btnSubmit").prop("disabled", false);
				if(data.success)
  					$('#myCreateModal').hide();
  				else {
  					$('.error-message').text(data.error);
  				}
            },
            error: function (e) {

                $("#result").text(e.responseText);
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", false);

            }
        });
}

function showEditDialog(product) {
	var p = JSON.parse(product);
	console.log(p);
	selectedProduct = p;
	var modal = $('#myEditModal');
	modal.show();
  	var desc = $('#edit-product').html();
  	modal.children("#edit-modal-content").html(desc);
  	$('#EditPName').val(p.name);
  	$('#EditPDesc').html(p.description);
  	$('#EditStock').val(p.stock);
  	$('#EditPrice').val(p.price);
  	$('#EditCategory option[value="'+p.category+'"]').attr('selected','selected');
  	$('#EditStatus option[value="'+p.status+'"]').attr('selected','selected');
	var span = document.getElementsByClassName("edit-close")[0];
	span.onclick = function() { 
		$('#EditCategory option[value="'+p.category+'"]').removeAttr('selected');
  		$('#EditStatus option[value="'+p.status+'"]').removeAttr('selected');
  		selectedProduct = {};
		modal.hide();
	}
}

function updateProduct() {
	var updatedProduct = {
		name: $('#EditPName').val(), 
        category: $('#EditCategory').val(), 
        description: $('#EditPDesc').text(),
        status: $('#EditStatus').val(),
        stock: $('#EditStock').val(),
        price: $('#EditPrice').val(),
	};

	$.ajax({
  		url: '/products/'+selectedProduct._id,
  		type: 'PUT',
  		data: updatedProduct,
  		success: function(data) {
  			if(data.success)
  				$('#myEditModal').hide();
  			else {
  				$('.error-message').text(data.error);
  			}
  		}
	});
}

