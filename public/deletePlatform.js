function deletePlatform(id){
    $.ajax({
        url: '/platform/'+id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};