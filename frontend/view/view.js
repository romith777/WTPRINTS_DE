API_URI = window.location.origin;
const wt_user = JSON.parse(localStorage.getItem('wt_user'));
if(!localStorage.getItem('loginToken'))  window.location.href = '../login/login/html';

document.addEventListener('DOMContentLoaded',()=>{
  let userProducts = JSON.parse(localStorage.getItem('userProducts'));
  let type = "tees";
  console.log(userProducts);

  window.addEventListener("load", function() {
    document.querySelector(".loader-wrapper").style.display = "none";
    document.querySelector(".filter-blur").classList.remove("filter-blur");
  });

  document.querySelector('.product-data form #brandName').value = wt_user.username;

  let imgs = JSON.parse(localStorage.getItem('imgs'));
  console.log(imgs);
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
    let type = productForm.type.value;
    let data ={
      username : wt_user.username,
      arr : userProducts,
      newPro : {
        productType : productForm.type.value,
        name : productForm.name.value,
        brandName : productForm.brandName.value,
        about : productForm.description.value,
        priceCents : Math.floor(productForm.price.value*100),
        image : imgs
      }
    }

    const res = await fetch(`${API_URI}/api/saveProduct`,{
      method : 'post',
      headers :{ 'Content-Type' : 'application/json' },
      body : JSON.stringify(data)
    });

    const result = await res.json();

    if(result.success === true ){
      alert('Product saved');
      window.location.href = '../home/home.html';
    }
  });
});