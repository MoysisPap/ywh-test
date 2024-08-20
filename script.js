let sidebar = document.querySelector("#sidebar");
let infoContainer = document.querySelector(".info__container");
let email = document.querySelector(".email");
let address = document.querySelector(".address");
let gender = document.querySelector(".gender");
let feeling = document.querySelector(".feeling");
let other = document.querySelector(".other");
let formEl = document.querySelector("#myForm");
let firstParagraph = document.querySelector(".first-paragraph");
let feedbackButton = document.querySelector(".feedbackBtn");
let mapEl = document.querySelector("#map");
let overlayEl = document.querySelector(".overlay");

function handleInfoButton() {
  infoContainer.style.display = "none";
  sidebar.style.display = "flex";
}

function handleFeedbackButton() {
  gender.style.display = "flex";
  feeling.style.display = "flex";
  other.style.display = "flex";
  email.style.display = "flex";
  formEl.style.display = "inline-block";
  styleSidebar(sidebar);
  firstParagraph.innerText = "Tell us how it feels";
  firstParagraph.style.marginBottom = "12px";
  feedbackButton.style.display = "none";
  address.style.display = "none";
}

function styleSidebar(element) {
  element.style.height = "95vh";
  element.style.gap = "12px";
  element.style.position = "absolute";
  element.style.left = "0";
  element.style.bottom = "0";
  element.style.justifyContent = "center";
}

function submitForm() {
  let checkBox = document.getElementById("accept");
  if (!checkBox.checked) {
    alert("Please accept the Term of Use and Privacy Policy.");
    return; // Prevent further execution of the function
  }

  // Gathering form data
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let gender = document.getElementById("gender").value;
  let feelingSelect = document.getElementById("feelingSelect").value;
  let location = document.getElementById("location").value;
  let other = document.getElementById("comment").value;

  let checkboxes = document.querySelectorAll(
    'input[name="reasonSelect"]:checked'
  );

  let reasonSelect = [];

  checkboxes.forEach(function (checkbox) {
    reasonSelect.push(checkbox.value);
  });

  sidebar.style.display = "none";
  mapEl.style.display = "none";
  overlayEl.style.display = "flex";

  // Preparing data for submission
  let data = new URLSearchParams({
    name: name,
    email: email,
    gender: gender,
    feeling: feelingSelect,
    location: location,
    comment: other,
    timeStamp: new Date().toLocaleString(),
    reason: reasonSelect.join(", "), // Join array into string
  });

  fetch(
    "https://script.google.com/macros/s/AKfycbx7dIFndWBfPzlGYnFX89A9f2VEzU2DTgpdwzq-WbQVw6MJ9yoCxig2ipFX5asWfCy_/exec",
    {
      method: "POST",
      body: data,
    }
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  console.log("clicked");
}

function redirectTo(url) {
  window.open(url, "_blank");
}

function onNewPinButtonClick() {
  document.getElementById("refreshButton").disabled = true;
  document.getElementById("loading").style.display = "block";
  location.reload();
}

let map;
let marker;

function initMap() {
  const initialLocation = {
    lat: 59.33091976142107,
    lng: 18.060195177256297,
  }; // Set initial location to default or user's location
  map = new google.maps.Map(document.getElementById("map"), {
    center: initialLocation,
    zoom: 16, // Adjust the zoom level as needed
  });
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: initialLocation,
  });
  // Add event listener for marker dragend
  google.maps.event.addListener(marker, "dragend", function () {
    updateLocationInput(marker.getPosition());
  });
}

function updateLocationInput(latLng) {
  // Use Geocoding API to get the address from LatLng
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: latLng }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        document.getElementById("location").value =
          results[0].formatted_address;
      }
    } else {
      console.error(
        "Geocode was not successful for the following reason: " + status
      );
    }
  });
}

function validateForm() {
  console.log("Form submitted"); // Debugging
  let checkBox = document.getElementById("accept");
  if (!checkBox.checked) {
    alert("Please accept the Term of Use and Privacy Policy.");
    return false; // Prevent form submission
  }
  return true; // Allow form submission
}
