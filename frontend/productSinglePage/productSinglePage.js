let API_URI = window.location.origin;
const wt_user = JSON.parse(localStorage.getItem('wt_user'));

let currentProduct = null;
let quantity = 1;

let allProducts = JSON.parse(localStorage.getItem('userProducts'));

const urlParams = new URLSearchParams(window.location.search);

let productId = urlParams.get('id');
let productType = urlParams.get('type');

function goToProductEdit(productId,productType) {
    window.location.href = `../view/view.html?id=${productId}&type=${productType}`;
}

function goToProduct(productId,productType) {
    window.location.href = `productSinglePage.html?id=${productId}&type=${productType}`;
}

function deleteProduct(productId,productType){
    document.querySelector('.product-detail-container').style.opacity = 0.2;
    document.querySelector('.delete-opinion').style.display = 'flex';
}

async function deleteProductConfirm(){
    allProducts[productType] = allProducts[productType].filter(p => p._id != productId);
    console.log(allProducts);
    let data = {
        username : wt_user.username,
        productType : productType,
        arr : allProducts
    }
    try{
        const result = await fetch(`${API_URI}/api/deleteProduct`,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type':'application/json'}
        })
        
        const res = await result.json();
        
        if(res.success){
            localStorage.removeItem('currentProduct');
            localStorage.setItem('userProducts',JSON.stringify(allProducts));
            window.location.href = '../home/home.html';
        }
    }
    catch (err){
        console.log(err);
        alert('error deleting');
    }
}

document.addEventListener('DOMContentLoaded',()=>{
  let productsInitialized = false;

  function formatCurrency(priceCents){
      return (priceCents/100).toFixed(2);
  }

  // Mobile menu toggle
  function toggleMobileMenu(){
      const navDropDown = document.getElementById('navDropDown');
      navDropDown.classList.toggle('open');
  }

  function getProductFromURL() {


      if (productId) {
        currentProduct = allProducts[productType].find(p => p._id === productId);
      }

      if (!currentProduct) {
          const storedProduct = localStorage.getItem('currentProduct');
          if (storedProduct) {
              currentProduct = JSON.parse(storedProduct);
          }
      }
      localStorage.setItem('currentProduct',JSON.stringify(currentProduct));
      return currentProduct;
  }

  function renderProductDetail(product) {
      if (!product) {
          document.querySelector('.new-body').innerHTML = `
              <div style="text-align: center; padding: 100px 20px;">
                  <h1>Product not found</h1>
                  <p style="margin: 20px 0;">The product you're looking for doesn't exist.</p>
                  <a href="./productsPage.html"><button class="add-to-cart-btn">Back to Products</button></a>
              </div>
          `;
          return;
      }
      let additionalImages = product.image.slice(1,product.image.size);
      console.log(additionalImages);
      const html = `
        <div class="delete-opinion">
            <div class="delete-opinion-text">Are you sure you wanna delete ?</div>
            <div class="delete-opinion-options">
                <button class="delete-opinion-option" onclick="deleteProductConfirm()">Yes</button>
                <button class="delete-opinion-option" onclick="document.querySelector('.delete-opinion').style.display='none';document.querySelector('.product-detail-container').style.opacity=1">No</button>
            </div>
        </div>
          <div class="product-detail-container">
              <div class="product-image-section">
                  <img src="${product.image[0]}" alt="${product.name}" class="product-main-image" id="mainImage">
                  <div class="product-thumbnails">
                      <img src="${product.image[0]}" alt="Thumbnail 1" class="product-thumbnail active" onclick="changeMainImage('${product.image[0]}', this)">
                      ${additionalImages ? additionalImages.map(img => 
                          `<img src="${img}" alt="Thumbnail" class="product-thumbnail" onclick="changeMainImage('${img}', this)">`
                      ).join('') : ''}
                  </div>
              </div>

              <div class="product-info-section">
                  <p class="product-brand">${product.brandName}</p>
                  <h1 class="product-name">${product.name}</h1>
                  <div class="product-price">$${formatCurrency(product.priceCents)}</div>

                  <p class="product-description">
                      ${product.about || 'High-quality product made with premium materials. Perfect for everyday wear and designed for maximum comfort and style.'}
                  </p>
                  <button class="edit-product" onclick="goToProductEdit('${product._id}','${product.productType}')">EDIT</button>
                  <button class="edit-product" onclick="deleteProduct('${product._id}','${product.productType}')">DELETE</button>
                  <div class="product-features">
                      <h3>Edit Your Product</h3>
                      <ul>
                          <li>Name: ${product.name}</li>
                          <li>Brand Name: ${product.brandName}</li>
                          <li>Price: $${formatCurrency(product.priceCents)}</li>
                          <li>About: ${product.about}</li>
                      </ul>
                  </div>
              </div>
          </div>
      `;
      document.querySelector('.new-body').innerHTML = html;
  }

  function shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
  }

  function renderRelatedProducts(currentProduct) {
      if (!currentProduct || allProducts.length === 0) return;
      
      let availableProducts = [];
      for(let product in allProducts){
        for(let i in allProducts[product]){
          if(allProducts[product][i]._id != currentProduct._id){
            availableProducts.push(allProducts[product][i]);
          }
        }
      }
      let randomizedProducts = shuffleArray(availableProducts);
      let relatedProducts = randomizedProducts.slice(0, 10);
      
      const html = `
          <div class="related-products-wrapper">
              <div class="related-products-header">
                  <h2 class="section-title">Your Other Products</h2>
                  <div class="slider-controls">
                      <button class="slider-btn" id="prevBtn">‹</button>
                      <button class="slider-btn" id="nextBtn">›</button>
                  </div>
              </div>
              <div class="related-products-container">
                  ${relatedProducts.map(product => `
                      <div class="related-product-card" onclick="goToProduct('${product._id}','${product.productType}')">
                          <div class="related-product-img">
                              <img src="${product.image[0]}" alt="${product.name}">
                          </div>
                          <div class="related-product-info">
                              <h4>${product.brandName}</h4>
                              <p>${product.about}</p>
                              <p class="related-product-price">$${formatCurrency(product.priceCents)}</p>
                          </div>
                      </div>
                  `).join('')}
              </div>
          </div>
      `;

      const relatedSection = document.createElement('div');
      relatedSection.className = 'related-products-section';
      relatedSection.innerHTML = html;
      document.querySelector('.new-body').appendChild(relatedSection);

      initializeSlider();
  }

  function initializeSlider() {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const container = document.querySelector('.related-products-container');
      
      if (!prevBtn || !nextBtn || !container) return;
      
      prevBtn.addEventListener('click', () => {
          container.scrollBy({ left: -300, behavior: 'smooth' });
      });
      
      nextBtn.addEventListener('click', () => {
          container.scrollBy({ left: 300, behavior: 'smooth' });
      });
      
      function updateSliderButtons() {
          const maxScroll = container.scrollWidth - container.clientWidth;
          
          if (container.scrollLeft <= 0) {
              prevBtn.style.opacity = '0.3';
              prevBtn.style.pointerEvents = 'none';
          } else {
              prevBtn.style.opacity = '1';
              prevBtn.style.pointerEvents = 'auto';
          }
          
          if (container.scrollLeft >= maxScroll - 5) {
              nextBtn.style.opacity = '0.3';
              nextBtn.style.pointerEvents = 'none';
          } else {
              nextBtn.style.opacity = '1';
              nextBtn.style.pointerEvents = 'auto';
          }
      }
      
      container.addEventListener('scroll', updateSliderButtons);
      updateSliderButtons();
  }

  function renderFooter() {
      const footerHTML = `
          <footer class="footer">
              <div class="footer-content">
                  <div class="footer-brand">
                      <h2><span class="brand-highlight">WT</span>PRINTS</h2>
                      <p>Your trusted fashion destination for bold, expressive, and stylish clothing. Stay unique. Stay printed.</p>
                  </div>
                  <div class="footer-links">
                      <div>
                          <h4>Men</h4>
                          <ul>
                              <li><a href="#">Oversized T-Shirts</a></li>
                              <li><a href="#">T-Shirts</a></li>
                              <li><a href="#">Joggers</a></li>
                              <li><a href="#">Cargos</a></li>
                              <li><a href="#">Caps</a></li>
                          </ul>
                      </div>
                      <div>
                          <h4>Women</h4>
                          <ul>
                              <li><a href="#">Oversized T-Shirts</a></li>
                              <li><a href="#">T-Shirts</a></li>
                              <li><a href="#">Crop Tops</a></li>
                              <li><a href="#">Co-ord Sets</a></li>
                          </ul>
                      </div>
                      <div>
                          <h4>About</h4>
                          <ul>
                              <li><a href="#">Our Story</a></li>
                              <li><a href="#">Sustainability</a></li>
                              <li><a href="#">Careers</a></li>
                          </ul>
                      </div>  
                      <div>
                          <h4>Follow Us</h4>
                          <ul>
                              <li><a href="#">Instagram</a></li>
                              <li><a href="#">Facebook</a></li>
                              <li><a href="#">Twitter</a></li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div class="footer-bottom">
                  <p>&copy; 2025 WTPRINTS. All rights reserved.</p>
              </div>
          </footer>
      `;
    
      document.querySelector('.new-body').insertAdjacentHTML('beforeend', footerHTML);
  }

  function initializeProductPage() {
      allProducts = JSON.parse(localStorage.getItem('userProducts'));
      const product = getProductFromURL();
      
      if (product) {
          currentProduct = product;
          // console.log('Displaying product:', product);
          const titleElement = document.querySelector('.js-product-type-product');
          if (titleElement) {
              titleElement.textContent = `${product.brandName} - WTP`;
          }
          renderProductDetail(product);
          renderRelatedProducts(product);
          renderFooter();
          selectedSize = 'M';
          productsInitialized = true;
      }
  }
  initializeProductPage();

  window.addEventListener('productsLoaded', (event) => {
      initializeProductPage();
  });

  window.changeMainImage = function(imageSrc, thumbnailElement) {
    document.getElementById('mainImage').src = imageSrc;
    
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
  }
});