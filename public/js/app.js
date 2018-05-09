$(document).ready(function() {
    
   //scrape button click NEED to refresh to work
    $(document).on("click","#scrape",function() {
        event.preventDefault();

        $.ajax({
            method: "GET",
            url: "/scrape",
        }).done(function(data) {
            console.log(data)
            window.location = "/"
            })
    });

    //save Article
    $(document).on("click","#saveArticle",function() {
        event.preventDefault();
            
        var thisId = $(this).attr("data-id");
        let isSaved = $(this).attr("saved")
            
        if (isSaved === "false") {
            $.ajax({
                method: "put",
                url: "/saved/" + thisId,
                data: {
                    saved: true
                }
            }).then(function (data) {
                
                window.location = "/";
            })
        };                  
    });

    //delete Article button
    $(document).on("click","#deleteArticle",function() {
        event.preventDefault();
        var thisId = $(this).attr("data-id");            
        let isSaved = $(this).attr("saved")            

    if (isSaved === "true") {
        $.ajax({
            method: "put",
            url: "/saved/" + thisId,
            data: {
                saved: false
            }
        }).then(function (data) {
            // console.log(data)
            
            window.location.reload();
        })
    };       
    });

    //click add note button
    $("#addnote").on("click", function() {
        console.log("add note clicked");
        var thisId = $(this).attr("data-id");
        console.log(thisId);
    
        $.ajax({
            method: "GET",
            url: "/saved/" + thisId,
            data: {
                text: $("#message-text" + thisId).val()
            }
        }).done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#message-text" + thisId).val("");
            $("#myModal").modal("hide");

            window.location.reload();
        });
    
    });


    // When you click the savenote button
    $("#savenote").on("click", function() {
    
        var thisId = $(this).attr("data-id");
    
       
        
       
    });

});//document ready function ends here