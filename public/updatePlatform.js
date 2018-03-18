function updatePlatform(id){
    $.ajax({
        url: '/platform/'+id,
        type: 'PUT',
        data: $('#update-platform').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};