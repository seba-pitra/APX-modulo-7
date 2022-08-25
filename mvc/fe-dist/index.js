async function pullProfile() {
    const form = document.querySelector(".form")
    const imagen = document.querySelector(".profile-picture")
    const res = await fetch("/profile")
    const data = await res.json()
    if(data) {
        form.name.value = data.fullname
        form.bio.value = data.bio
        imagen.src = data.pictureURL
    }
}

(function() {
    pullProfile()
    const form = document.querySelector(".form")
    let pictureFile;
    const myDropzone = new Dropzone(".profile-picture-container", {
        url: "/falsa",
        autoProcessQueue: false,
    });
      
    myDropzone.on("addedfile", function (file) {
        pictureFile = file
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const nombre = e.target.fullname.value
        const bio = e.target.bio.value
        fetch("/profile", {
            method:"POST",
            headers: {'content-type': "application/json"},
            body: JSON.stringify({
                nombre,
                bio,
                pictureDataURL: pictureFile.dataURL
            })
        })
        .then(res => res.json())
        
    })
})()