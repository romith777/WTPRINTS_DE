const API_URI = window.location.origin;

document.addEventListener('DOMContentLoaded',()=>{
  async function fetchDiagnostics(){
    const wt_user = JSON.parse(localStorage.getItem('wt_user'));
    let username=wt_user.username;

    try{
      const response = await fetch(`${API_URI}/api/diagnostics/${username}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      diagnosticsProducts = data;
      localStorage.setItem('diagnostics',JSON.stringify(diagnosticsProducts));
      console.log(diagnosticsProducts);
      renderProducts(diagnosticsProducts);
    }
    catch(err){
      console.error(err);
      alert('error in products');
    }
  }
  fetchDiagnostics();

});