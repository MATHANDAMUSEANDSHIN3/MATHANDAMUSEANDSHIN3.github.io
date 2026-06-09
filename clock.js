 function clock(){
    setInterval(myTimer, 1000);

function myTimer() {
  const date = new Date();
  
  document.getElementById("clock").innerHTML = date.toLocaleTimeString();
}
  }

  clock();