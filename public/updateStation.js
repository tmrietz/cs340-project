function updateStation(id){
    $.ajax({
        url: '/station/'+id,
        type: 'PUT',
        data: $('#update-station').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};