function updateTransitType(id){
    $.ajax({
        url: '/transit_type/'+id,
        type: 'PUT',
        data: $('#update-transit_type').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};