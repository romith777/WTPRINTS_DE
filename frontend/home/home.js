const API_URI = window.location.origin;


let userProducts = [];

document.addEventListener('DOMContentLoaded',()=>{
    if(!localStorage.getItem('loginToken')){
        window.location.href = '../login/login.html';
    }

    window.addEventListener("load", function() {
        document.querySelector(".loader-wrapper").style.display = "none";
        document.querySelector(".filter-blur").classList.remove("filter-blur");
    });
    const box=document.getElementById("dropbox");
    const inp=document.getElementById("fileinput");

    box.onclick=()=>inp.click();

    box.ondragover=e=>{
        e.preventDefault();
        box.style.borderColor="green";
    };

    box.ondrop=e=>{
        e.preventDefault();
        let files=e.dataTransfer.files;
        console.log(files);
        box.style.borderColor="#333";
        for(let f of files){
            let img=document.createElement("img");
            img.src=URL.createObjectURL(f);
            img.style.width="80px";
            box.appendChild(img);
        }
    };

    function formatCurrency(priceCents){
        return (priceCents/100).toFixed(2);
    }

    async function fetchProducts(){
        let wt_user = JSON.parse(localStorage.getItem('wt_user'));
        let username = wt_user.username ;
        console.log(username);
        try{
            const response = await fetch(`${API_URI}/api/products/${username}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            userProducts = data;
            console.log(userProducts);
            renderProducts();
        }
        catch(err){
            console.error(err);
            alert('error in products');
        }
    }
    fetchProducts();

    function renderProductContent(product){
        document.querySelector(".collection .loading-text").style.display = "none";
        let innerHTML = '';
        for(let i in product){
            innerHTML+=`
                <div class="browse-card">
                    <div class="browse-card-img">
                        <a href="#" style="cursor: pointer;" onclick="storeProduct('${product.id}')">
                            <img src="${product[i].image}" alt="${product[i].name}">
                        </a>
                    </div>
                    <div class="browse-card-information">
                        <div class="browse-card-information-area">
                            <div class="browse-card-information-area-text">
                                <p class="browse-card-information-text">${product[i].brandName}</p>
                                <p class="browse-card-information-text">${product[i].about}</p>
                                <p class="browse-card-information-text">Price: $<span class="browse-card-information-price">${formatCurrency(product[i].priceCents)}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        return innerHTML;
    }

    function renderProducts(){
        let innerHTML = '';
        let enter = false;
        for(let i in userProducts){
            if(userProducts[i].length){
                enter = true;
                let type = userProducts[i][0].productType;
                innerHTML+=`
                    <div class="sub-collection">
                        <div class="sub-heading">
                            <h1>${type.toUpperCase()}:</h1>
                        </div>
                        <div class="browsing-section">
                            ${renderProductContent(userProducts[i])}
                        </div>
                    </div>
                `;
            }
        }
        if(enter){
            document.querySelector(".collection").innerHTML = innerHTML;
            return;
        }
        document.querySelector(".collection").innerHTML = '<p class="no-products">No products added yet.</p>';
    }
});