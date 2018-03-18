function deleteTransitType(id){
    $.ajax({
        url: '/transit_type/'+id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};