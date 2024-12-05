function addbeverage() {
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.image = document.getElementById("image").value;
    jsonData.price = document.getElementById("price").value;
    jsonData.category = document.getElementById("category").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.rating = document.getElementById("rating").value;
    jsonData.quantity = document.getElementById("quantity").value;  

    if (jsonData.name == "" || jsonData.image == "" || jsonData.price == "" || jsonData.category == "" || jsonData.description == "" || jsonData.rating == "" || jsonData.quantity == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        alert('All fields are required!');
        return;
    }

    if (jsonData.rating < 1 || jsonData.rating > 5) {
        document.getElementById("message").innerHTML = 'Rating must be between 1 and 5.';
        document.getElementById("message").setAttribute("class", "text-danger");
        alert('Rating must be between 1 and 5.');
        return;
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/add-beverage", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Beverage: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            alert('Beverage successfully added: ' + jsonData.name);  

            // Clear the input fields after successful submission
            document.getElementById("name").value = "";
            document.getElementById("image").value = "";
            document.getElementById("price").value = "";
            document.getElementById("category").value = "";
            document.getElementById("description").value = "";
            document.getElementById("rating").value = "";
            document.getElementById("quantity").value = "";     
        } else {
            document.getElementById("message").innerHTML = 'Unable to add beverage!';
            document.getElementById("message").setAttribute("class", "text-danger");
            alert('Failed to add beverage!');  
        }
    };

    // Send the data as a JSON object
    request.send(JSON.stringify(jsonData));
}

function previewImage() {
    var imageUrl = document.getElementById("image").value;
    var imagePreview = document.getElementById("imagePreview");
    
    // Check if the URL is a valid image URL
    var img = new Image();
    img.onload = function() {
        imagePreview.src = imageUrl;
        imagePreview.style.display = "block"; // Show the image preview
    }
    img.onerror = function() {
        imagePreview.style.display = "none"; // Hide the preview if image URL is not valid
    }
    img.src = imageUrl;
}

