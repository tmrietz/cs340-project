function updateSystem(id){
    $.ajax({
        url: '/system/'+id,
        type: 'PUT',
        data: $('#update-system').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};