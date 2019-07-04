jQuery(function($){
    $('#form_todo').submit(function(e){
        e.preventDefault();
        let val = $('input[name=todo]').val();
        $.ajax({
            type: 'POST',
            url: '/create',
            data: {todo : val},
            success: function(data){
                $('input[name=todo]').val('');
                if(data.success){
                    $('#green_bar').fadeIn();
                    $('#green_bar').html(data.success);
                    setTimeout(function(){
                        $('#green_bar').fadeOut();
                    }, 3000);
                    $('.todo_list ul').empty();
                    $('.todo_old_list ul').empty();
					$('.todo_old_list table tbody').empty();
                    let today_date = new Date().toJSON().split('T')[0];
                    $.ajax({
                        type: 'POST',
                        url: '/show',
                        success: function(result){
                            $.each(result, function(i, res){
                                if(res.old_todo){
                                    if(today_date === res.time_stamp){
                                        $('.todo_list ul').append('<li data-id="'+res.todo_id+'"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-success">completed</span></li>');
                                    }
                                    else{
                                        //$('.todo_old_list ul').append('<li data-id="'+res.todo_id+'" class="disabled"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-success">completed</span></li>');
										$('.todo_old_list table tbody').append('<tr data-id="'+res.todo_id+'"><td class="disabled"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-success">completed</span></td><td><button type="button" class="btn text-danger" data-id="'+res.todo_id+'">Delete</button></td></tr>');
                                    }
                                }
                                else{
                                    if(today_date === res.time_stamp){
                                        $('.todo_list ul').append('<li data-id="'+res.todo_id+'"><span>'+res.todo_name+'</span><span class="badge text-danger">incomplete</span></li>');
                                    }
                                    else{
                                        //$('.todo_old_list ul').append('<li data-id="'+res.todo_id+'" class="disabled"><span>'+res.todo_name+'</span><span class="badge text-danger">incomplete</span></li>');
										$('.todo_old_list table tbody').append('<tr data-id="'+res.todo_id+'"><td class="disabled"><span class="li-stire">'+res.todo_name+'</span><span class="badge text-danger">incomplete</span></td><td><button type="button" class="btn text-danger" data-id="'+res.todo_id+'">Delete</button></td></tr>');
                                    }
                                }
                            });
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
                if(data.error){
                    $('#red_bar').fadeIn();
                    $('#red_bar').html(data.error);
                    setTimeout(function(){
                        $('#red_bar').fadeOut();
                    }, 1000);
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});