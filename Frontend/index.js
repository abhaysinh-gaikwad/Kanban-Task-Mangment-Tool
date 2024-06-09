let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");
let loginEmailInput =document.getElementById("loginEmail");
let loginPasswordInput = document.getElementById("loginPassword");
let loginbtn = document.getElementById("loginbtn");
let signupNameInput = document.getElementById("signupName");
let signupEmailInput =document.getElementById("signupEmail");
let signupPasswordInput = document.getElementById("signupPassword")
let signupbtn =document.getElementById("signupbtn");
let signupConfirmPasswordInput = document.getElementById("passwordconfirm");

signup.addEventListener("click", () => {
	slider.classList.add("moveslider");
	formSection.classList.add("form-section-move");
});

login.addEventListener("click", () => {
	slider.classList.remove("moveslider");
	formSection.classList.remove("form-section-move");
});


loginbtn.addEventListener("click",loginUser)

async function loginUser(){
    try{
        const user={
            email:loginEmailInput.value,
            password:loginPasswordInput.value
        }
        const res = await fetch("https://kanban-task-mangment-tool-1.onrender.com/user/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(user),
        })
        const data = await res.json();
        console.log(data);
        
        if(data.token){
            localStorage.setItem("token",data.token);
            window.location.href = "kanban.html";
        }
    }
    catch(err){
        console.log(err);
    }
}

signupbtn.addEventListener("click", registerUser);

async function registerUser() {
    try {
        const name = signupNameInput.value;
        const email = signupEmailInput.value;
        const password = signupPasswordInput.value;
        const confirmPassword = signupConfirmPasswordInput.value;

        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }

        const user = {
            name,
            email,
            password
        };

        const res = await fetch("https://kanban-task-mangment-tool-1.onrender.com/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}