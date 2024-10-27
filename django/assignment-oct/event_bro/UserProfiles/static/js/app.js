console.log("working");
document.addEventListener('DOMContentLoaded', function() {
  // Locate the element by id
  const positionDiv = document.getElementById('div_id_location');
  
  if (positionDiv) {
    // Create the new anchor element for location
    const newLink = document.createElement('a');
    newLink.href = '/events/add-location/';
    newLink.target = '_blank';
    newLink.className = 'btn btn-link text-decoration-none';
    newLink.textContent = 'Not here? Add New Location here';

    // Append the link to the position div
    positionDiv.appendChild(newLink);
  } else {
    console.warn("Element 'div_id_location' not found.");
  }

  const positionDiv2 = document.getElementById('div_id_cat');
  
  if (positionDiv2) {
    // Create the new anchor element for category
    const newLink2 = document.createElement('a');
    newLink2.href = '/events/add-category/';
    newLink2.target = '_blank';
    newLink2.className = 'btn btn-link text-decoration-none';
    newLink2.textContent = 'Not here? Add New Category here';

    // Append the link to the position div
    positionDiv2.appendChild(newLink2);
  } else {
    console.warn("Element 'div_id_cat' not found.");
  }
});

// Initialize Bootstrap tooltips
console.log("inside tooltip trigger 1");
const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => {
  console.log("inside tooltip trigger");
  return new bootstrap.Tooltip(tooltipTriggerEl);
});


