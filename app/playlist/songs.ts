// Type definition for a Song object
export type Song = {
    id: string // Unique identifier for the song
    title: string // Title of the song
    artist: string // Name of the artist(s)
    image: string // URL to the album or song's cover image
}

// Exporting a constant array of songs
export const songs: Song[] = [



        {
        id: "chii",
        title: "Aarzu-trash version(ft.Adil)",
        artist: "Adil",
        image: "/audio/arzu.jpeg",
    },
    {
        id: "RTC Bonus",
        title: "Rakhlo tum chupake",
        artist: "Armpit Bala",
        image: "https://i.pinimg.com/736x/8e/05/b9/8e05b97803800d59f905b815cf5108ca.jpg",
    },
    {
        id: "Afterhours",
        title: "Afterhours",
        artist: "idk",
        image: "https://i.pinimg.com/736x/00/a2/9a/00a29a532c8617be6d737e73b64eba5e.jpg",
    },
    {
        id: "نحن مجرد خطاة",
        title: "نحن مجرد خطاة",
        artist: "Al Ba Ta",
        image: "/assets/playlist/ali.jpg",
    },
    {
        id: "The Kid LAROI - NIGHTS LIKE THIS (Lyrics)",
        title: "NIGHTS LIKE THIS",
        artist: "Kid Laroi",
        image: "https://i.pinimg.com/736x/9b/08/82/9b0882f666c6ac5a45b83db6170acb12.jpg",
    },
    {
        id: "tu-hoti-toh",
        title: "TU-hoti-toh",
        artist: "Bharat Chauhan",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqFbp7KfXStIMQoLMFDkiqLsQUyoEWZNNSXg&s",
    },
    {
        id: "gulabo",
        title: "gulabo",
        artist: "Dang Bala",
        image: "https://i.pinimg.com/736x/10/d7/ac/10d7ac5531653720794a71d35bd40a13.jpg",
    },
     {
        id: "k",
        title: "woh lamhein",
        artist: "Atif Aslam",
        image: "https://i.pinimg.com/1200x/a8/6a/d0/a86ad0fd9ac164d979c96877e5b4a14f.jpg",
    },
     {
        id: "z",
        title: "zama khkule janana",
        artist: "Wajid Layaq",
        image: "https://t2.genius.com/unsafe/430x430/https%3A%2F%2Fimages.genius.com%2F16d5a899e5484e14e57ce90b26abd660.1000x1000x1.jpg",
    },
].reverse()