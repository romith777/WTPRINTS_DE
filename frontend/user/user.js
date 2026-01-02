document.addEventListener('DOMContentLoaded',()=>{
  window.addEventListener("load", function() {
    document.querySelector(".loader-wrapper").style.display = "none";
    document.querySelector(".filter-blur").classList.remove("filter-blur");
  });

  if(!localStorage.getItem('loginToken'))
    window.location.href = '../login/login.html';

  document.getElementById('logoutBtn').addEventListener('click',()=>{
    localStorage.removeItem('loginToken');
    localStorage.removeItem('wt_user');
    window.location.href = '../login/login.html';
  });

  const totalProducts = localStorage.getItem('totalProducts')||0;
  const wt_user = JSON.parse(localStorage.getItem('wt_user'));
  document.querySelector('.avatar-circle').innerHTML = wt_user.username.charAt(0).toUpperCase();
  document.querySelector('.sidebar-username').innerHTML = wt_user.username;
  document.querySelector('#overview-section #display-name').innerHTML = wt_user.username;
  document.querySelector('#overview-section #display-email').innerHTML = wt_user.email;
  document.querySelector('#overview-section #stat-totalProducts').innerHTML = totalProducts;
  console.log(totalProducts);
});