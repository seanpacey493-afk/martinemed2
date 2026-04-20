function callSearching(){
    const reInterval = setInterval(()=>{
        let addresses = document.querySelectorAll(".property-address");
        let showcases = document.querySelectorAll(".property-showcase-box-top-details");
        const targetDiv = document.querySelector("#view0 > mat-grid-list > div > mat-grid-tile > figure > s2a-markdown > span > div:nth-child(3) > div.row.px-3.px-md-0.d-lg-flex.d-md-flex.d-sm-none.d-none > div.col-lg-10.col-9.col-md-11.pb-0.px-0.pt-0");
        const targetDiv2 = document.querySelector("#download-image > div > div.col-lg-5.col-md-5.col-sm-12.col-12.pl-0 > div.scrolable-card.d-lg-block.d-md-block.d-sm-none.d-none > div.property-card.pt-5 > div.heading-icon-box > div.text");
        const total = document.querySelector("#download-image > div > div.col-lg-7.col-md-7.col-sm-12.col-12.gallery-image-lg > div.summary-container > div.total > span");
        const base = document.querySelector("#download-image > div > div.col-lg-7.col-md-7.col-sm-12.col-12.gallery-image-lg > div.summary-container > div:nth-child(2) > span:nth-child(3)");
        const main = document.querySelector("#download-image > div > div.col-lg-5.col-md-5.col-sm-12.col-12.pl-0 > div.scrolable-card.d-lg-block.d-md-block.d-sm-none.d-none > div.property-card.pt-5 > div.heading-icon-box > h2");
        const badge = document.querySelector("#coming_on > p > b");
        if(addresses.length > 0){
            addresses.forEach((add)=>{
                const spans = add.querySelectorAll("span");
                if(spans.length < 2) return; 
                let text = spans[1].innerText;
                text    = text.split(",");
                let code = text.pop().trim();
                text = text.join(",").trim();
                spans[1].innerText = text;
                spans[0].remove();
            });
        }

        if(showcases.length > 0){
            showcases.forEach((showcase)=>{
                const h2 = showcase.querySelector("h2");

                if(h2 && ! h2.hasAttribute("data-price")){
                    let i = h2.querySelector("i");
                    let span = h2.querySelector("span");
                    let addition = h2.querySelector("span.additional-fees");
                    if(i) i.remove();
                    if(span) span.remove();
                    if(addition) addition.remove();
                    let price = parseInt( h2.innerText );
                    h2.innerHTML = "";
                    price = ( price / 2 ).toFixed(0);
                    h2.appendChild(i);
                    h2.appendChild(document.createTextNode(price));
                    h2.appendChild(span);
                    h2.appendChild(addition);
                    h2.setAttribute("data-price", price);
                }
            });
        }

        if(targetDiv && targetDiv2 && ! targetDiv.hasAttribute("data-code") && ! targetDiv2.hasAttribute("data-code")){
            let h2 = targetDiv.querySelector("h2");
            h2.remove();
            let p = targetDiv.querySelector("p");
            let text = p.innerText.split(",");
            let code = text.pop().trim();
            text = text.join(",").trim();
            p.innerText = text;
            let h2_2 = targetDiv2.querySelector("strong");
            h2_2.remove();
            let p_2 = targetDiv2.querySelector("p");
            let text_2 = p_2.innerText.split(",");
            let code_2 = text_2.pop().trim();
            text_2 = text_2.join(",").trim();
            p_2.innerText = text_2;
            targetDiv.setAttribute("data-code", code);
            targetDiv2.setAttribute("data-code", code_2);
            let month   = total.querySelector("span");
            month.remove();
            let price = parseInt( total.innerText.split("").filter(c => c != '$').join("") );
            price = ( price / 2 ).toFixed(0);
            total.innerHTML = "";
            total.appendChild(document.createTextNode("$" + price));
            total.appendChild(month);
             price = parseFloat( base.innerText.split("").filter(c => c != '$').join("") );
            price = ( price / 2 ).toFixed(0);
            base.innerText = "$" + price + ".00";
            let b = main.querySelector("b");
            let span = main.querySelector("span");
            let addition = main.querySelector("span.additional-fees");
            if(b) b.remove();
            if(span) span.remove();
            if(addition) addition.remove();
            price = parseInt( main.innerText );
            main.innerHTML = "";
            price = ( price / 2 ).toFixed(0);
            main.appendChild(b);
            main.appendChild(document.createTextNode(price));
            main.appendChild(span);
            main.appendChild(addition);
            main.setAttribute("data-price", price);
        }
    }, 500);
}

callSearching();

