document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.in-login-signup-button').addEventListener('click',()=>{
        document.querySelector('.signup-box').style.display = 'block';
        document.querySelector('.login-box').style.display = 'none';
    });

    document.querySelector('.in-signup-login-button').addEventListener('click',()=>{
        document.querySelector('.signup-box').style.display = 'none';
        document.querySelector('.login-box').style.display = 'block';
    });

    m
})