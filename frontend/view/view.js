API_URI = window.location.origin;
const wt_user = JSON.parse(localStorage.getItem('wt_user'));
if(!localStorage.getItem('loginToken'))  window.location.href = '../login/login/html';

const urlParams = new URLSearchParams(window.location.search);
let currentProduct = null;
let imgs;

document.addEventListener('DOMContentLoaded',()=>{
  let newProduct = urlParams.get('id') ? false : true ;
  let prevType = urlParams.get('type') || null;
  let productId = urlParams.get('id') || null;
  let userProducts = JSON.parse(localStorage.getItem('userProducts'));
  
  window.addEventListener("load", function() {
    document.querySelector(".loader-wrapper").style.display = "none";
    document.querySelector(".filter-blur").classList.remove("filter-blur");
  });
  
  document.querySelector('.product-data form #brandName').value = wt_user.username;
  if(!newProduct){
    document.querySelector('.add-product-text').innerHTML = "Edit the Product of your Collection"
    currentProduct = JSON.parse(localStorage.getItem('currentProduct'));
    const formdata = document.querySelector('.product-data form');
    formdata.name.value = currentProduct.name;
    formdata.description.value = currentProduct.about;
    formdata.price.value = (currentProduct.priceCents)/100;
    formdata.type.value = currentProduct.productType;
  }
  
  imgs = newProduct ? JSON.parse(localStorage.getItem('imgs')) : currentProduct.image;
  
  let a=-1;
  let html ='';
  imgs.forEach(e => {
    let img = document.createElement('img');
    img.src = e;
    a++;
    if(!a){
      img.className = 'preview-image';
      document.querySelector('.image-box').appendChild(img);
      return;
    }
    img.className = 'other-preview-image';
    html+=`
      <div class="thumbnail" id="thumbnail-${a}">
        <img src="${e}" alt="thumbnail-${a}" class="thumbnail-image">
      </div>
    `;
    document.querySelector('.other-images').innerHTML = html;
  });

  document.querySelectorAll('.thumbnail-image').forEach(e=>{
    e.addEventListener('click',()=>{
      let preview = document.querySelector('.preview-image').src;
      let current = e.src;
      console.log(current);
      document.querySelector('.preview-image').src = current;
      e.src = preview;
    });
  });


  // save product
  let productForm = document.querySelector('.productForm');
  productForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    let data ={
      prevType : prevType,
      productId : productId,
      username : wt_user.username,
      arr : userProducts,
      newPro : {
        productType : productForm.type.value,
        name : productForm.name.value,
        brandName : productForm.brandName.value,
        about : productForm.description.value,
        priceCents : Math.floor(productForm.price.value*100),
        image : imgs,
        keyword : [productForm.name.value]
      }
    }

    const res = await fetch(`${API_URI}/api/saveProduct`,{
      method : 'post',
      headers :{ 'Content-Type' : 'application/json' },
      body : JSON.stringify(data)
    });

    const result = await res.json();

    if(result.success === true ){
      localStorage.removeItem('currentProduct');
      window.location.href = '../home/home.html?success=success';
    }
  });
});