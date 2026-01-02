const API_URI = window.location.origin;


let userProducts = [];
let totalProducts = 0;

document.addEventListener('DOMContentLoaded',()=>{
    const urlParams = new URLSearchParams(window.location.search);
    let success = urlParams.get('success');

    if(success){
        document.querySelector('.success-message-box').style.display = 'flex';
        setTimeout(()=>{
            document.querySelector('.success-message-box').style.display = 'none';
        },4000)
    }

    document.querySelector('.success-message').addEventListener('click',()=>{
        document.querySelector('.success-message-box').style.display = 'none';
    });

    if(!localStorage.getItem('loginToken')){
        window.location.href = '../login/login.html';
    }

    window.addEventListener("load", function() {
        document.querySelector(".loader-wrapper").style.display = "none";
        document.querySelector(".filter-blur").classList.remove("filter-blur");
    });
    const box=document.getElementById("dropbox");
    const inp=document.getElementById("fileinput");

    // click box → open file picker
    box.onclick = () => inp.click();

    // drag support
    box.ondragover = e => e.preventDefault();
    box.ondrop = e => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    // file selected by clicking
    inp.addEventListener("change", e => {
        handleFiles(e.target.files);
    });

    async function handleFiles(files){
        if(!files || files.length === 0) return;

        let imgs = [];

        document.querySelector(".loader-wrapper").style.display = "flex";
        document.querySelector(".loader-wrapper").style.justifyContent = "center";
        document.querySelector(".filter-body").classList.add("filter-blur");

        for(const f of [...files].slice(0,6)){
            const fd = new FormData();
            fd.append("image", f);

            const res = await fetch(`${API_URI}/api/upload`, {
                method: "POST",
                body: fd
            });

            const data = await res.json();
            imgs.push(data.url);
        }

        document.querySelector(".loader-wrapper").style.display = "none";
        document.querySelector(".filter-body").classList.remove("filter-blur");

        localStorage.setItem("imgs", JSON.stringify(imgs));
        window.location.href = "../view/view.html";
    }


    function formatCurrency(priceCents){
        return (priceCents/100).toFixed(2);
    }

    async function fetchProducts(){
        let wt_user = JSON.parse(localStorage.getItem('wt_user'));
        let username = wt_user.username ;
        // console.log(username);
        try{
            const response = await fetch(`${API_URI}/api/products/${username}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            userProducts = data;
            localStorage.setItem('userProducts',JSON.stringify(userProducts));
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
            totalProducts++;
            innerHTML+=`
            <div class="browse-card")>
                <div class="browse-card-img">
                    <a href="../productSinglePage/productSinglePage.html?id=${product[i]._id}&type=${product[i].productType}" style="cursor: pointer;" >
                        <img src="${product[i].image[0]}" alt="${product[i].name}">
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
                console.log(type);
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
        localStorage.setItem('totalProducts',totalProducts);
        if(enter){
            document.querySelector(".collection").innerHTML = innerHTML;
            return;
        }
        document.querySelector(".collection").innerHTML = '<p class="no-products">No products added yet.</p>';

    }
});