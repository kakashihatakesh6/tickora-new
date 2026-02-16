
async function checkImages() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/movies');
        const data = await response.json();

        console.log("Status:", response.status);
        if (data.length > 0) {
            console.log("First movie sample:");
            console.log(JSON.stringify(data[0], null, 2));
            console.log("\nImage URLs:");
            data.slice(0, 5).forEach(m => console.log(`- ${m.title}: ${m.image_url}`));
        } else {
            console.log("No movies found");
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

checkImages();
