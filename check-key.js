
async function checkKey() {
    const key = "AIzaSyAyU7fCFeaKC6S_SRRjva7xznxPEch2W7A";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

checkKey();
