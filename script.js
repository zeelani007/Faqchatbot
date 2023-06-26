function myFunction() {
    var select = document.getElementById("dynamic_select");
    var selectedValue = select.value;
  
    if (selectedValue === "english") {
      window.location.href = "index.html";
    } else if (selectedValue === "hindi") {
      window.location.href = "hindi.html";
    }
  }