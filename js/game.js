var stop = false;
var time = 0;
var name;
var serverURL = "http://scorer-potray.rhcloud.com/Scorer/rest/scorer";

function loop() {
    //Recursive call that sets a timer.
    setTimeout(function () {
        if (!stop) {
            time++;
            loop();
            $("#time").html(time.toString());
        }
    }, 1000);
}

function JSONifyUserAndPassword() {
    return JSON.stringify({
        "userName": $("#name").val(),
        "password": $("#password").val()
    });
}

function JSONifyScore() {
    return JSON.stringify({
        "userName": name,
        "game": "Simpliest Game in the World",
        "score": time
    });
}

function postScore() {
    $.ajax({
        url: serverURL + "/addScore",
        type: "POST",
        contentType: "application/json",
        data: JSONifyScore(),
        dataType: "json",
        success: function (response) {
            if (response.response !== "Ok")
                alert("There was some problem adding your score. Sorry :(");
        }
    });
}

function getScores() {
    $.ajax({
        url: serverURL + "/scores",
        type: "GET",
        contentType: "application/json",
        data: {
            game: "Simpliest Game in the World",
            userName: name
        },
        dataType: "json",
        success: function (response) {
            var table = "";
            //Get the scores
            var scores = $.parseJSON(response.scores);
            //Add every score data to a table row
            for (var i = scores.length - 1; i >= 0; i--) {
                table += "<tr><td>" + scores[i].score + "</td><td>" +
                        scores[i].date + "</td></tr>";
            }

            //Show the table
            $("#scoreTable").css("display", "");
            $("#results").html(table);
        }
    });
}

$(document).ready(function () {
    //Button callbacks
    $("#end").click(function () {
        postScore();
        window.setTimeout(getScores, 1000);

        $("#start").css("display", "none");
        $("#game").css("display", "none");
        $("#result").css("display", "");
        $("#endText").css("display", "");
        $("#score").html("Your score was " + time + " seconds.");
        stop = true;
    });

    $("#play").click(function () {
        name = $("#name").val();
        var password = $("#password").val();

        //Validate data
        if (!name.trim()) {
            alert("User name can't be empty");
        }
        else if (!password.trim()) {
            alert("Password can't be empty");
        }
        else {
            //Send request to server
            $.ajax({
                url: serverURL + "/login",
                type: "POST",
                contentType: "application/json",
                data: JSONifyUserAndPassword(),
                dataType: "json",
                success: function (response) {
                    //Parse response
                    code = response.response;

                    if (code !== "Ok") {
                        alert(code);
                    }
                    else {
                        //Start game
                        loop();
                        $("#game").css("display", "");
                        $("#form").css("display", "none");
                        $("#spanName").html(name);
                    }
                }
            });
        }
    });


    $("#playAgain").click(function () {
        stop = false;
        time = 0;
        $("#time").html("0");
        loop();
        $("#game").css("display", "");
        $("#result").css("display", "none");
        $("#endText").css("display", "none");
    });
});

