const API_URI = window.location.origin;

document.addEventListener('DOMContentLoaded',()=>{
    window.addEventListener("load", function() {
        document.querySelector(".loader-wrapper").style.display = "none";
        document.querySelector(".filter-blur").classList.remove("filter-blur");
    });
    if(localStorage.getItem('loginToken')){
        window.location.href = '../home/home.html';
    }
    console.log(localStorage.getItem('loginToken'));
    document.querySelector('.in-login-signup-button').addEventListener('click',()=>{
        document.querySelector('.signup-box').style.display = 'block';
        document.querySelector('.login-box').style.display = 'none';
    });

    document.querySelector('.in-signup-login-button').addEventListener('click',()=>{
        document.querySelector('.signup-box').style.display = 'none';
        document.querySelector('.login-box').style.display = 'block';
    });

    urlParams = new URLSearchParams(window.location.search);

    if(urlParams.get("signup")){
        if(urlParams.get("signup") == "success" ){
            document.getElementById('login-message').style.display = 'block';
            document.getElementById('login-message').innerHTML = "Signup successful! Please login.";
            setTimeout(()=>{
                document.getElementById('login-message').style.display = 'none';
            },4000);
        }
        else if(urlParams.get("signup") == "exists"){
            document.querySelector('.signup-box').style.display = 'block';
            document.querySelector('.login-box').style.display = 'none';
            const signupMessage = document.getElementById('signup-message'); 
            signupMessage.style.display = 'block';
            signupMessage.innerHTML = "Email or Username already exists";
            signupMessage.style.backgroundColor = 'rgb(238, 82, 82)';
            setTimeout(()=>{
                signupMessage.style.display = 'none';
            },4000);
        }
    }   
    else if(urlParams.get("login")){
        if(urlParams.get("login") == "nouser" ){
            const loginMessage = document.getElementById('login-message'); 
            loginMessage.style.backgroundColor = 'rgb(238, 82, 82)';
            loginMessage.style.display = 'block';
            loginMessage.innerHTML = "Invalid Username or Password";
            setTimeout(()=>{
                loginMessage.style.display = 'none';
            },4000);
        }
    }
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const data = {
            username : loginForm.username.value,
            password : loginForm.password.value
        }
        try{
            const res = await fetch(`${API_URI}/login`,{
                method : "POST",
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(data)
            });
            const result = await res.json();
            console.log(result);
            if(result.status == "success"){
                window.location.href = `login.html?login=success&wt_user=${result.wt_user.username}&email=${result.wt_user.email}`;
                localStorage.setItem('loginToken', true);
                localStorage.setItem('wt_user', JSON.stringify(result.wt_user));
            }
            else if(result.status == "nouser"){
                window.location.href = `login.html?login=nouser`;
            }
            else{
                alert("login error");
            }
        }
        catch (err){
            console.error(err);
            alert('server error');
        }
    });

    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const data = {
            username : signupForm.username.value,
            email : signupForm.email.value,
            password : signupForm.password.value
        }
        try{
            const res = await fetch(`${API_URI}/signup`,{
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(data)
            });

            const result = await res.json();
            if(result.status == 'success'){
                window.location.href = `login.html?signup=success`;
            }
            else if(result.status == 'exists'){
                window.location.href = `login.html?signup=exists`;
            }
            else{
                alert('signup error');
            }
        }
        catch(err){
            console.error(err);
            alert('server error');
        }
    });

});