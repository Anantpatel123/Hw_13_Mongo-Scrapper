$(document).ready(function() {
    
   //scrape button click NEED to refresh to work
    $(document).on("click","#scrape",function() {
        event.preventDefault();

        // $("#scrape").on("click", function() {
            $.ajax({
                method: "GET",
                url: "/scrape",
            }).done(function(data) {
                console.log(data)
                window.location = "/"
            })
        // });
    });

    //save Article
    $(document).on("click","#saveArticle",function() {
        event.preventDefault();
            
            var thisId = $(this).attr("data-id");
            console.log("savearticle clicked id ", thisId);
            let isSaved = $(this).attr("saved")
            console.log("saved value BEFORE ", isSaved);

        if (isSaved === "false") {
            $.ajax({
                method: "put",
                url: "/saved/" + thisId,
                data: {
                    saved: true
                }
            }).then(function (data) {
                // console.log(data)
                console.log("SaveArticle button clicked data ", data);
                console.log("saved value AFTER ", isSaved);
                window.location = "/";
            })
        };     
             
    });


    //delete Article button
    $(document).on("click","#deleteArticle",function() {
        event.preventDefault();

            var thisId = $(this).attr("data-id");
            console.log("deletearticle clicked id ", thisId);
            let isSaved = $(this).attr("saved")
            console.log("saved value BEFORE ", isSaved);

    if (isSaved === "true") {
        $.ajax({
            method: "put",
            url: "/saved/" + thisId,
            data: {
                saved: false
            }
        }).then(function (data) {
            // console.log(data)
            console.log("delete button clicked data ", data);
            console.log("saved value AFTER ", isSaved);
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
    // $(document).on("click", "#savenote", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
    
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {        
            // Value taken from note textarea
            body: $("#message-text").val()
            }
        }).then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#myModal").empty();
            window.location = "/articles";
        });
        window.location = "/articles";
        $("#message-text").val("");
    });

});//document ready function ends here