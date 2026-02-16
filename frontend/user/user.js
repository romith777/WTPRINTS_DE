document.addEventListener('DOMContentLoaded',()=>{
  window.addEventListener("load", function() {
    document.querySelector(".loader-wrapper").style.display = "none";
    document.querySelector(".filter-blur").classList.remove("filter-blur");
  });

  if(!localStorage.getItem('loginToken'))
    window.location.href = '../login/login.html';

  function logout(){
    localStorage.removeItem('loginToken');
    localStorage.removeItem('wt_user');
    window.location.href = '../login/login.html';
  };

  document.getElementById('logoutBtn').addEventListener('click',()=>{
    document.querySelector('.logout-msg').classList.remove('hidden');
    document.querySelector('.logout-msg').classList.add('active');
    document.querySelector('main').style.filter='blur(3px)';
  });
  document.querySelector('.logout-msg .yes').addEventListener('click',()=>{
    document.querySelector('.logout-msg').classList.remove('active');
    document.querySelector('.logout-msg').classList.add('hidden');
    document.querySelector('main').style.filter='blur(0px)';
    logout();
  });
  document.querySelector('.logout-msg .no').addEventListener('click',()=>{
    document.querySelector('.logout-msg').classList.remove('active');
    document.querySelector('.logout-msg').classList.add('hidden');
    document.querySelector('main').style.filter='blur(0px)';
  });

  const totalProducts = localStorage.getItem('totalProducts')||0;
  const wt_user = JSON.parse(localStorage.getItem('wt_user'));
  document.querySelector('.avatar-circle').innerHTML = wt_user.username.charAt(0).toUpperCase();
  document.querySelector('.sidebar-username').innerHTML = wt_user.username;
  document.querySelector('#overview-section #display-name').innerHTML = wt_user.username;
  document.querySelector('#overview-section #display-email').innerHTML = wt_user.email;
  document.querySelector('#overview-section #stat-totalProducts').innerHTML = totalProducts;
  console.log(totalProducts);

  // Sidebar Navigation
  const menuItems = document.querySelectorAll('.menu-item:not([href^="../"])');
  const contentSections = document.querySelectorAll('.content-section');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const section = item.getAttribute('data-section');
      
      // Update active menu item
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');
      
      // Show corresponding section
      contentSections.forEach(cs => cs.classList.remove('active'));
      document.getElementById(`${section}-section`).classList.add('active');
    });
  });
});