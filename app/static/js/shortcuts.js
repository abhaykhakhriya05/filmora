document.addEventListener("keydown",function(event){

    if(event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.isContentEditable)
    {
        return;
    }

    if(event.ctrlKey)
    {
        switch(event.key.toLowerCase())
        {
            case "h":
                event.preventDefault();
                window.location.href = "/";
                break;
            case "m":
                event.preventDefault();
                window.location.href = "/movie";
                break;
            case "l":
                event.preventDefault();
                window.location.href = "/login";
                break;
            case "r":
                event.preventDefault();
                window.location.href = "/register";
                break;
        }
      
    }
    if (event.altKey) {
        switch(event.key.toLowerCase())
        {
            case "d":
                event.preventDefault();
                window.location.href = "/dashboard";
                break;
            case "c":
                event.preventDefault();
                window.location.href = "/Categories";
                break;
            case "m":
                event.preventDefault();
                window.location.href = "/movie_list";
                break;
            case "s":
                event.preventDefault();
                window.location.href = "/show_series";
                break;
            case "a":
                event.preventDefault();
                window.location.href = "/add_seasons";
                break;
            
        }
    }

});