addresses.forEach((add)=>{
   const spans = add.querySelectorAll("span");    
    let text = spans[1].innerText;
    text    = text.split(",");
     let code = text.pop().trim();
    text = text.join(",").trim();
    spans[1].innerText = text;
    spans[0].remove();
});