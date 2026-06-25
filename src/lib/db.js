import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// Mendeteksi apakah menggunakan local development (tanpa env KV Vercel)
const isLocal = !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN;
const localDbPath = path.join(process.cwd(), 'public', 'db.json');

// Inisialisasi data default jika file database lokal belum ada
function initLocalDb() {
  if (!fs.existsSync(localDbPath)) {
    const parentDir = path.dirname(localDbPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    const seedData = {
      content: {
        heroTitle_id: "Experience Art. Feel Indonesia.",
        heroTitle_en: "Experience Art. Feel Indonesia.",
        heroSubtitle_id: "Learn. Create. Experience.",
        heroSubtitle_en: "Learn. Create. Experience.",
        heroCardOpacity: "0.85",
        heroBirdsTop: "10%",
        navLayout: "floating",
        navOpacity: "0.65",
        heroDescription_id: "Belajar langsung dari seniman profesional Indonesia melalui kelas online interaktif, workshop intim, dan festival seni imersif. Selami warisan budaya lokal yang kaya dan kembangkan kreativitas kontemporer Anda.",
        heroDescription_en: "Learn directly from professional Indonesian artists through interactive online classes, intimate workshops, and immersive art festivals. Dive into our rich local cultural heritage and develop your contemporary creativity.",
        aboutTitle_id: "When passion meets arts",
        aboutTitle_en: "When passion meets arts",
        aboutSubtitle_id: "Gerbang Utama Anda Menuju Dunia Seniman",
        aboutSubtitle_en: "Your Gateway to the World of Artists",
        aboutDescription_id: "Berseni lahir dari kesadaran sederhana bahwa banyak orang ingin lebih dekat dengan dunia seni rupa, tetapi bingung harus mulai dari mana. Akses ke seniman profesional seringkali terasa eksklusif dan berjarak.\n\nKami memutuskan untuk membuka jalan itu. Di Berseni, Anda tidak hanya belajar teknik melukis dasar, tetapi juga berinteraksi langsung dengan seniman praktisi. Memahami proses kreatif, cerita, serta perjalanan karya mereka.\n\nKami percaya seni tidak hanya milik segelintir orang. Seni adalah ruang inklusif untuk semua orang belajar, tumbuh, dan terhubung satu sama lain.",
        aboutDescription_en: "Berseni was born from a simple realization that many people want to get closer to the visual art world, but are confused about where to start. Access to professional artists often feels exclusive and distant.\n\nWe decided to open that path. At Berseni, you do not only learn basic painting techniques, but also interact directly with practicing artists. Understand their creative processes, stories, and the journey of their works.\n\nWe believe art does not only belong to a select few. Art is an inclusive space for everyone to learn, grow, and connect with one another.",
        visiTitle_id: "Visi Kami",
        visiTitle_en: "Our Vision",
        visiDescription_id: "Menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia, menumbuhkan ekosistem ekonomi seni yang berkelanjutan dan apresiasi seni yang bermakna.",
        visiDescription_en: "To become the primary global bridge between the general public and local Indonesian artists, nurturing a sustainable art economy ecosystem and meaningful art appreciation.",
        misiTitle_id: "Misi Kami",
        misiTitle_en: "Our Mission",
        misiList_id: [
          "Membuka akses langsung bagi publik untuk berinteraksi dan belajar dari seniman profesional.",
          "Mendukung pemberdayaan ekonomi seniman lokal melalui eksposur, kolaborasi, dan apresiasi karya.",
          "Membina komunitas pecinta seni yang inklusif, suportif, dan berkelanjutan di seluruh Indonesia."
        ],
        misiList_en: [
          "Opening direct access for the public to interact and learn from professional artists.",
          "Supporting the economic empowerment of local artists through exposure, collaboration, and work appreciation.",
          "Nurturing an inclusive, supportive, and sustainable community of art lovers across Indonesia."
        ],
        statsUsers: "20k+",
        statsDescription_id: "Pengguna Berseni",
        statsDescription_en: "Berseni Users",
        partners: [
          "/support/1.png",
          "/support/2.png",
          "/support/3.png",
          "/support/4.png",
          "/support/5.png",
          "/support/6.png",
          "/support/7.png",
          "/support/8.png"
        ],
        blogAboutTitle_id: "Tentang Berseni",
        blogAboutTitle_en: "About Berseni",
        blogAboutDesc_id: "Berseni adalah platform kolaboratif dan komunitas seni rupa terbesar di Indonesia, menjembatani seniman lokal dan masyarakat umum untuk saling belajar, berkarya, dan mengapresiasi keindahan seni bersama-sama.",
        blogAboutDesc_en: "Berseni is a collaborative platform and the largest visual art community in Indonesia, bridging local artists and the general public to learn, create, and appreciate the beauty of art together.",
        testimonials: [
          {
            id: "testi-1",
            name: "Ahmad Fauzi",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Kelas Basic Oil Realism sangat direkomendasikan! Penjelasan Mas Srinthil mudah dipahami bahkan untuk saya yang baru mulai melukis.",
            comment_en: "Basic Oil Realism class is highly recommended! Mas Srinthil's explanation is easy to understand even for me who just started painting.",
            borderColor: "var(--color-tosca)",
            videoThumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600",
            videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          {
            id: "testi-2",
            name: "Riana Lestari",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Puas banget ikutan workshop Meowna Lisa kemarin! Mentornya sabar, vibes studionya asyik, dan bisa bawa pulang lukisan kucing buatan sendiri.",
            comment_en: "Extremely satisfied with the Meowna Lisa workshop! The mentor was patient, the studio vibe was fun, and I could bring home my own cat painting.",
            borderColor: "var(--color-maroon)",
            videoThumbnail: "",
            videoLink: ""
          },
          {
            id: "testi-3",
            name: "Budi Santoso",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Karya lukis orisinalnya sangat indah dan bersertifikat COA resmi. Dipajang di ruang tamu langsung bikin suasana rumah jadi lebih estetik.",
            comment_en: "The original paintings are stunning and come with an official COA. Hanging it in the living room instantly makes the house look aesthetic.",
            borderColor: "var(--color-kunyit)",
            videoThumbnail: "",
            videoLink: ""
          },
          {
            id: "testi-4",
            name: "Siti Rahma",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
            rating: 4,
            comment_id: "Pendaftaran kelas online sangat mudah via Lynk.id. Video pembelajarannya HD dan aksesnya seumur hidup. Sangat worth it!",
            comment_en: "Registering for the online class was very easy via Lynk.id. The instructional videos are HD with lifetime access. Highly worth it!",
            borderColor: "var(--color-tosca)",
            videoThumbnail: "",
            videoLink: ""
          },
          {
            id: "testi-5",
            name: "Dewi Kartika",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Workshop Summer in Pink di Yello Hotel kemarin seru banget! Dapet snack enak, alat lukis lengkap, dan dapet kenalan baru sesama pencinta seni.",
            comment_en: "The Summer in Pink workshop at Yello Hotel was so much fun! Got delicious snacks, complete painting tools, and met new friends who love art.",
            borderColor: "var(--color-maroon)",
            videoThumbnail: "",
            videoLink: ""
          },
          {
            id: "testi-6",
            name: "Hendra Wijaya",
            avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Lukisan 'It's OK Offline' yang saya beli kualitas cat dan detail kanvasnya luar biasa. Pengirimannya aman menggunakan packing kayu.",
            comment_en: "The quality of the paint and canvas detail on the 'It's OK Offline' painting I bought is amazing. Shipping was safe using a wooden crate.",
            borderColor: "var(--color-kunyit)",
            videoThumbnail: "",
            videoLink: ""
          },
          {
            id: "testi-7",
            name: "Linda Permata",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
            rating: 4,
            comment_id: "Baru pertama kali melukis di workshop Tweet your Heart, ternyata menyenangkan sekali. Step-by-step-nya dipandu telaten oleh seniman.",
            comment_en: "First time painting at the Tweet your Heart workshop, and it turned out to be super fun. The artist guided us step-by-step with patience.",
            borderColor: "var(--color-tosca)",
            videoThumbnail: "",
            videoLink: ""
          },
          {
            id: "testi-8",
            name: "Rico Pratama",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Suka sekali dengan konsep komunitas Berseni. Bisa sharing progress lukisan di grup WhatsApp dan dapet arahan langsung dari tutor profesional.",
            comment_en: "Love the concept of the Berseni community. We can share painting progress in the WhatsApp group and get direct feedback from professional tutors.",
            borderColor: "var(--color-maroon)",
            videoThumbnail: "",
            videoLink: ""
          }
        ],
        heroBtn1Link: "#products",
        heroBtn1Status: "active",
        heroBtn2Link: "/about",
        heroBtn2Status: "active",
        prog1Link: "/classes?type=offline",
        prog1Status: "active",
        prog2Link: "/classes?type=online",
        prog2Status: "active",
        prog3Link: "/store",
        prog3Status: "active",
        galleryBtnLink: "/store",
        galleryBtnStatus: "active",
        blogBtnLink: "/blog",
        blogBtnStatus: "active",
        ctaBtnLink: "https://wa.me/6281234567890?text=Halo%20Berseni%21%20Saya%20tertarik%20untuk%20bergabung%20sebagai%20early%20supporter%20dan%20ingin%20mendapatkan%20info%20terbaru%20mengenai%20karya%20seni%20dan%20workshop.",
        ctaBtnStatus: "active",
        aboutCommitBtnLink: "/#products",
        aboutCommitBtnStatus: "active",
        aboutCtaBtn1Link: "/#products",
        aboutCtaBtn1Status: "active",
        aboutCtaBtn2Link: "/#programs",
        aboutCtaBtn2Status: "active",
        collabBrandBtnLink: "https://wa.me/6281234567890?text=Halo%20Berseni%21%20Brand%2FPerusahaan%20kami%20tertarik%20untuk%20berkolaborasi%20kreatif%20dengan%20Berseni.",
        collabBrandBtnStatus: "active",
        collabVenueBtnLink: "https://wa.me/6281234567890?text=Halo%20Berseni%21%20Saya%20memiliki%20venue%2Ftempat%20yang%20tertarik%20untuk%20berkolaborasi%20dengan%20komunitas%20Berseni.",
        collabVenueBtnStatus: "active",
        classesTitle_id: "Kelas & Akademi Seni Berseni.",
        classesTitle_en: "Berseni Art Classes & Academy.",
        classesSubtitle_id: "Ikuti workshop offline dan kelas online interaktif kami bersama maestro pelukis Nusantara.",
        classesSubtitle_en: "Join our offline workshops and interactive online classes with Indonesian maestros.",
        classesSearchPlaceholder_id: "Cari kelas atau workshop...",
        classesSearchPlaceholder_en: "Search classes or workshops...",
        resultsCountClasses_id: "Menampilkan {count} kelas / workshop seni",
        resultsCountClasses_en: "Showing {count} art classes / workshops",
        emptyClassesTitle_id: "Tidak ada kelas yang cocok",
        emptyClassesTitle_en: "No matching classes",
        emptyClassesDesc_id: "Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.",
        emptyClassesDesc_en: "Try using other search keywords or choose a different category.",
        showAllClasses_id: "Tampilkan Semua Kelas",
        showAllClasses_en: "Show All Classes",
        defaultLanguage: "id",
        bg_navbar: "#FAF5EB",
        bg_home_hero: "#FAF5EB",
        bg_home_partners: "#FFFFFF",
        bg_home_programs: "#FAF5EB",
        bg_home_gallery: "#FFFFFF",
        bg_home_testimonials: "#FAF5EB",
        bg_home_blog: "#FFFFFF",
        bg_home_cta: "#14789B",
        bg_about_hero: "#FAF5EB",
        bg_about_feature: "#FFFFFF",
        bg_about_empower: "#FAF5EB",
        bg_about_pillars: "#FFFFFF",
        bg_about_stats: "#14789B",
        bg_about_cta: "#FAF5EB",
        bg_collab_hero: "#FAF5EB",
        bg_collab_brand: "#FFFFFF",
        bg_collab_venue: "#FAF5EB",
        bg_store_main: "#FAF5EB",
        bg_classes_main: "#FAF5EB",
        bg_blog_header: "#FAF5EB",
        bg_blog_content: "#FFFFFF",
        bg_blog_detail_main: "#FFFFFF",
        bg_blog_detail_cta: "#FAF5EB"
      },
      products: [
        {
          id: "prod-1",
          title_id: "Original Artwork - \"It's OK Offline\"",
          title_en: "Original Artwork - \"It's OK Offline\"",
          category: "artwork",
          price: 2500000,
          originalPrice: 3500000,
          image: "https://cdn.lynkid.my.id/products/26-05-2026/1779800809427_9496616.webp",
          description_id: "“It’s Okay Offline” mengajak kita untuk berhenti sejenak dari hiruk pikuk dunia digital dan kembali menikmati momen nyata di sekitar kita.",
          description_en: "\"It's Okay Offline\" invites us to pause for a moment from the hustle and bustle of the digital world and return to enjoying the real moments around us.",
          specs_id: "Cat Akrilik di atas Kanvas, Stretcher Frame, 75 x 55 cm, 100% Buatan Tangan Orisinal, Termasuk Sertifikat Keaslian (COA)",
          specs_en: "Acrylic on Canvas, Stretcher Frame, 75 x 55 cm, 100% Original Handmade, Certificate of Authenticity (COA) Included",
          link: "https://lynk.id/berseni.id/6vjowxvlvrl4"
        },
        {
          id: "prod-2",
          title_id: "Original Artwork - \"Diving Mind\"",
          title_en: "Original Artwork - \"Diving Mind\"",
          category: "artwork",
          price: 2000000,
          originalPrice: 2800000,
          image: "https://cdn.lynkid.my.id/products/26-05-2026/1779801131170_3780421.webp",
          description_id: "“Diving Mind” menggambarkan perjalanan menyelami pikiran dan emosi di tengah dunia yang penuh distraksi dan tekanan.",
          description_en: "\"Diving Mind\" depicts the journey of diving into thoughts and emotions amidst a world full of distractions and pressure.",
          specs_id: "Cat Akrilik di atas Kanvas, Stretcher Frame, 60 x 50 cm, 100% Buatan Tangan Orisinal, Termasuk Sertifikat Keaslian (COA)",
          specs_en: "Acrylic on Canvas, Stretcher Frame, 60 x 50 cm, 100% Original Handmade, Certificate of Authenticity (COA) Included",
          link: "https://lynk.id/berseni.id/w6qw2e16v1k9"
        },
        {
          id: "prod-3",
          title_id: "Original Artwork - \"Noise of Innocence\"",
          title_en: "Original Artwork - \"Noise of Innocence\"",
          category: "artwork",
          price: 750000,
          originalPrice: 990000,
          image: "https://cdn.lynkid.my.id/products/26-05-2026/1779801340343_5323694.webp",
          description_id: "“Noise of Innocence” menggambarkan semangat polos dan kebahagiaan sederhana yang tetap bersinar di tengah dunia yang ramai dan penuh tekanan.",
          description_en: "\"Noise of Innocence\" depicts the pure spirit and simple happiness that keep shining in the middle of a busy and high-pressure world.",
          specs_id: "Cat Akrilik di atas Papan Potong (Perkiraan), Siap dipajang, 17 x 29 cm, 100% Buatan Tangan Orisinal, Termasuk Sertifikat Keaslian (COA)",
          specs_en: "Acrylic on Cutting Board (Approx.), Ready to display, 17 x 29 cm, 100% Original Handmade, Certificate of Authenticity (COA) Included",
          link: "https://lynk.id/berseni.id/365jyrd698l3"
        },
        {
          id: "prod-4",
          title_id: "Original Artwork - \"Laughing at the End of the World\"",
          title_en: "Original Artwork - \"Laughing at the End of the World\"",
          category: "artwork",
          price: 750000,
          originalPrice: 990000,
          image: "https://cdn.lynkid.my.id/products/26-05-2026/1779801656466_5721379.webp",
          description_id: "“Laughing at the End of the World” menggambarkan keberanian untuk tetap tersenyum dan menikmati hidup meski dunia terasa penuh tekanan.",
          description_en: "\"Laughing at the End of the World\" depicts the courage to keep smiling and enjoying life even when the world feels full of pressure.",
          specs_id: "Cat Akrilik di atas Papan Potong (Perkiraan), Siap dipajang, 17 x 29 cm, 100% Buatan Tangan Orisinal, Termasuk Sertifikat Keaslian (COA)",
          specs_en: "Acrylic on Cutting Board (Approx.), Ready to display, 17 x 29 cm, 100% Original Handmade, Certificate of Authenticity (COA) Included",
          link: "https://lynk.id/berseni.id/249rj2lyypww"
        },
        {
          id: "prod-5",
          title_id: "Meowna Lisa - Workshop Melukis Cat Akrilik",
          title_en: "Meowna Lisa - Acrylic Painting Workshop",
          category: "offline",
          price: 500000,
          originalPrice: 550000,
          image: "/offline-meowna-lisa.png",
          description_id: "Belajar melukis kucing kesayangan Anda dengan gaya ikonik Mona Lisa ('Meowna Lisa') menggunakan cat akrilik. Workshop offline interaktif ini cocok untuk pemula maupun tingkat lanjut, dipandu langsung oleh instruktur berpengalaman di Seven Sumatra Beans, Jakarta Barat.\n\nTanggal: 28 Juni 2026\nWaktu: 13.00 - 16.00 WIB\nLokasi: Seven Sumatra Beans, Tanjung Duren, Jakarta Barat\n\nInvestasi Early Bird hanya berlaku sampai 10 Juni 2026.",
          description_en: "Learn to paint your beloved cat in the iconic style of Mona Lisa ('Meowna Lisa') using acrylic paint. This interactive offline workshop is suitable for beginners to advanced levels, guided directly by experienced instructors at Seven Sumatra Beans, West Jakarta.\n\nDate: June 28, 2026\nTime: 1:00 PM - 4:00 PM WIB\nLocation: Seven Sumatra Beans, Tanjung Duren, West Jakarta\n\nEarly Bird investment is only valid until June 10, 2026.",
          specs_id: "Kanvas 30x40 cm (bisa dibawa pulang), Alat & Bahan Lukis Disediakan, Free Minuman & Makanan Ringan",
          specs_en: "Canvas 30x40 cm (can be taken home), Painting Tools & Materials Provided, Free Drinks & Light Snacks",
          link: "https://bit.ly/berseniart"
        },
        {
          id: "prod-6",
          title_id: "Basic Oil Realism Painting dengan Sriyadi \"Srinthil\" (Kelas Online)",
          title_en: "Basic Oil Realism Painting with Sriyadi \"Srinthil\" (Online Class)",
          category: "online",
          price: 199000,
          originalPrice: 250000,
          image: "https://cdn.lynkid.my.id/products/02-05-2026/1777680516349_7984832.webp",
          description_id: "Kelas online melukis cat minyak dari nol yang dibimbing langsung oleh seniman Sriyadi \"Srinthil\". Pahami bentuk, cahaya, dan volume agar lukisan Anda terasa hidup dan berdimensi. Cocok untuk pemula tanpa pengalaman sebelumnya.\n\nBab Materi:\n- Bab 1: Mengenal Sriyadi \"Srinthil\"\n- Bab 2: Persiapan dan Bahan\n- Bab 3: Sketsa dan Teori Bayangan\n- Bab 4: Pewarnaan\n- Bab 5: Detail Objek\n- Bab 6: Pewarnaan Background\n- Bab 7: Finishing Background\n- Bab 8: Kirim Karya Seni Anda\n- Bab 9: Sesi Gabung Komunitas & Sharing\n- Bab 10: Unduh E-sertifikat Anda",
          description_en: "An online oil painting class from scratch guided directly by artist Sriyadi \"Srinthil\". Understand shapes, light, and volume so your paintings feel alive and dimensional. Suitable for beginners with no prior experience.\n\nCourse Chapters:\n- Chapter 1: Getting to Know Sriyadi \"Srinthil\"\n- Chapter 2: Preparation and Materials\n- Chapter 3: Sketching and Shadow Theory\n- Chapter 4: Coloring\n- Chapter 5: Object Detailing\n- Chapter 6: Background Coloring\n- Chapter 7: Finishing Background\n- Chapter 8: Submit Your Art Work\n- Chapter 9: Join Community & Sharing Session\n- Chapter 10: Download Your E-certificate",
          specs_id: "Akses Video Selamanya (10 Bab), Bimbingan & Arahan Seniman, Grup Komunitas Belajar, E-Sertifikat Kelulusan",
          specs_en: "Lifetime Video Access (10 Chapters), Artist Guidance & Direction, Learning Community Group, E-Certificate of Graduation",
          link: "https://lynk.id/berseni.id/kydxrrno2564"
        },
        {
          id: "prod-7",
          title_id: "Paw-casso - Workshop Melukis Cat Akrilik",
          title_en: "Paw-casso - Acrylic Painting Workshop",
          category: "offline",
          price: 500000,
          originalPrice: 550000,
          image: "/offline-paw-casso.png",
          description_id: "Lukis anjing menggemaskan kesayangan Anda langkah demi langkah dalam workshop akrilik Paw-casso yang interaktif dan menyenangkan. Sangat cocok untuk semua umur dan tingkat keahlian, dipandu langsung oleh instruktur berpengalaman di Seven Sumatra Beans, Jakarta Barat.\n\nTanggal: 28 Juni 2026\nWaktu: 13.00 - 16.00 WIB\nLokasi: Seven Sumatra Beans, Tanjung Duren, Jakarta Barat\n\nInvestasi Early Bird hanya berlaku sampai 10 Juni 2026.",
          description_en: "Paint your adorable beloved pup step-by-step in our interactive and fun Paw-casso acrylic workshop. Perfectly suited for all ages and skill levels, guided directly by experienced instructors at Seven Sumatra Beans, West Jakarta.\n\nDate: June 28, 2026\nTime: 1:00 PM - 4:00 PM WIB\nLocation: Seven Sumatra Beans, Tanjung Duren, West Jakarta\n\nEarly Bird investment is only valid until June 10, 2026.",
          specs_id: "Kanvas 30x40 cm (bisa dibawa pulang), Alat & Bahan Lukis Disediakan, Free Makanan Ringan & Minuman",
          specs_en: "Canvas 30x40 cm (can be taken home), Painting Tools & Materials Provided, Free Light Snacks & Drinks",
          link: "https://bit.ly/berseniart"
        },
        {
          id: "prod-8",
          title_id: "Summer in Pink - Workshop Melukis Cat Akrilik",
          title_en: "Summer in Pink - Acrylic Painting Workshop",
          category: "offline",
          price: 400000,
          originalPrice: 550000,
          image: "/offline-summer-in-pink.png",
          description_id: "Lukis keindahan musim panas dengan nuansa warna merah muda yang lembut, hembusan angin laut, dan momen yang damai di Yello Hotel Manggarai, Jakarta Pusat. Ciptakan mahakarya musim panas Anda sendiri dalam suasana yang menyenangkan!\n\nTanggal: 12 Juli 2026\nWaktu: 13.00 - 16.00 WIB\nLokasi: Yello Hotel Manggarai, Jakarta Pusat\n\nInvestasi Early Bird hanya berlaku sampai 7 Juli 2026.",
          description_en: "Paint the beauty of summer with soft pink color tones, ocean breeze, and peaceful moments at Yello Hotel Manggarai, Central Jakarta. Create your own summer masterpiece in a fun atmosphere!\n\nDate: July 12, 2026\nTime: 1:00 PM - 4:00 PM WIB\nLocation: Yello Hotel Manggarai, Central Jakarta\n\nEarly Bird investment is only valid until July 7, 2026.",
          specs_id: "Kanvas 30x40 cm (bisa dibawa pulang), Alat & Bahan Lukis Disediakan, Free Makanan Ringan & Minuman, E-Sertifikat",
          specs_en: "Canvas 30x40 cm (can be taken home), Painting Tools & Materials Provided, Free Light Snacks & Drinks, E-Certificate",
          link: "https://bit.ly/berseniart"
        },
        {
          id: "prod-9",
          title_id: "Tweet your Heart - Workshop Melukis Cat Akrilik",
          title_en: "Tweet your Heart - Acrylic Painting Workshop",
          category: "offline",
          price: 400000,
          originalPrice: 550000,
          image: "/offline-tweet-your-heart.png",
          description_id: "Lukis sepasang burung cinta (love bird) yang penuh warna dan bawa pulang karya agung yang penuh cinta serta energi positif di The Veranda Resort Residence, Jakarta Selatan. Dipandu langkah demi langkah oleh seniman profesional.\n\nTanggal: 5 Juli 2026\nWaktu: 15.00 - 18.00 WIB\nLokasi: The Veranda Resort Residence, Jakarta Selatan\n\nInvestasi Early Bird hanya berlaku sampai 2 Juli 2026.",
          description_en: "Paint a colorful pair of love birds and bring home a masterpiece full of love and positive energy at The Veranda Resort Residence, South Jakarta. Guided step-by-step by professional artists.\n\nDate: July 5, 2026\nTime: 3:00 PM - 6:00 PM WIB\nLocation: The Veranda Resort Residence, South Jakarta\n\nEarly Bird investment is only valid until July 2, 2026.",
          specs_id: "Kanvas 30x40 cm (bisa dibawa pulang), Alat & Bahan Lukis Disediakan, Free Makanan Ringan & Minuman, E-Sertifikat",
          specs_en: "Canvas 30x40 cm (can be taken home), Painting Tools & Materials Provided, Free Light Snacks & Drinks, E-Certificate",
          link: "https://bit.ly/berseniart"
        }
      ],
      posts: [
        {
          slug: "melukis-menyenangkan-dan-menghasilkan",
          title_id: "Melukis : Menyenangkan dan Menghasilkan",
          title_en: "Painting : Fun and Profitable",
          date: "05/03/2026",
          image: "https://berseni.id/wp-content/uploads/2026/02/Example-A-Roll-Image-scaled-1-1024x793.jpg",
          excerpt_id: "Melukis adalah salah satu hobi yang memiliki banyak manfaat. Selain menjadi media untuk mengekspresikan ide, melukis juga dapat menghasilkan ekonomi...",
          excerpt_en: "Painting is one of the hobbies that has many benefits. In addition to being a medium to express ideas, painting can also generate economic value...",
          content_id: "Melukis adalah salah satu hobi yang memiliki banyak manfaat. Selain menjadi media untuk mengekspresikan ide, melukis juga dapat membantu mengurangi stres, meningkatkan konsentrasi, serta mengasah kepekaan estetika.\n\nLebih dari sekadar hobi, melukis kini juga dapat menjadi aktivitas yang menghasilkan secara ekonomi. Banyak seniman mandiri yang memulai karir mereka dari hobi melukis di rumah hingga akhirnya memamerkan karya mereka di galeri nasional dan internasional.",
          content_en: "Painting is a hobby with numerous benefits. Apart from being a medium to express ideas, painting can help reduce stress, improve concentration, and sharpen aesthetic sensitivity.\n\nMore than just a hobby, painting has now also become an economically productive activity. Many independent artists started their careers from home painting hobbies before eventually exhibiting their works in national and international galleries."
        },
        {
          slug: "lukisan-sebagai-sumber-sejarah",
          title_id: "Lukisan sebagai Sumber Sejarah",
          title_en: "Paintings as Historical Sources",
          date: "05/03/2026",
          image: "https://berseni.id/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-13-at-9.18.01-AM.jpeg",
          excerpt_id: "Melalui banyak medium seperti film atau bahkan kisah-kisah romansa, pelukis tampak sebagai sosok yang mendokumentasikan masa lalu...",
          excerpt_en: "Through many mediums such as films or even romance stories, painters appear as figures documenting the past...",
          content_id: "Melalui banyak medium seperti film atau bahkan kisah-kisah romansa, pelukis tampak sebagai sosok yang berdiam diri di studio untuk menghasilkan karya estetik.\n\nNamun sejarah mencatat bahwa lukisan memiliki peran yang jauh lebih besar daripada sekadar hiasan dinding. Sebelum fotografi ditemukan, lukisan adalah media dokumentasi visual utama yang merekam peristiwa penting, adat istiadat, dan kondisi sosial masyarakat di masa lampau.",
          content_en: "Through many mediums like movies or romance stories, painters are often depicted as figures quietly working in their studios to produce aesthetic pieces.\n\nHowever, history records that paintings have a much grander role than mere wall decorations. Before photography was invented, paintings were the primary visual documentation medium recording key events, traditions, and the social conditions of historical societies."
        },
        {
          slug: "menemukan-kedamaian-lewat-seni-lukis-ekspresif",
          title_id: "Menemukan Kedamaian Lewat Seni Lukis Ekspresif",
          title_en: "Finding Peace Through Expressive Painting",
          date: "12/03/2026",
          image: "/activity-outdoor.webp",
          excerpt_id: "Melukis bukan hanya memindahkan bentuk ke kanvas. Ia adalah proses meditasi visual untuk melepaskan beban pikiran dan menemukan ketenangan jiwa...",
          excerpt_en: "Painting is not just transferring shapes to canvas. It is a visual meditation process to release mental burdens and find peace of mind...",
          content_id: "Di dunia yang serba cepat, kecemasan sering kali menumpuk. Terapi seni (*art therapy*), khususnya melukis ekspresif, terbukti mampu menurunkan kadar kortisol dan membantu meredakan stres.\n\nMelukis ekspresif membebaskan Anda mengekspresikan emosi mentah tanpa tuntutan kemiripan bentuk fisik. Sapuan kuas yang bebas dan pemilihan warna yang intuitif membantu merilis ketegangan mental.",
          content_en: "In a fast-paced world, anxiety often accumulates. Art therapy, specifically expressive painting, has been proven to lower cortisol levels and help alleviate stress.\n\nExpressive painting frees you to express raw emotions without demanding physical representation. Free brushstrokes and intuitive color choices help release mental tension."
        },
        {
          slug: "memilih-kuas-dan-jenis-cat-bagi-pemula",
          title_id: "Pentingnya Memilih Kuas dan Jenis Cat bagi Pemula",
          title_en: "The Importance of Choosing Brushes and Paint Types for Beginners",
          date: "15/03/2026",
          image: "/collage-1.jpg",
          excerpt_id: "Bagi pemula, melangkah ke toko alat tulis seni bisa terasa mengintimidasi. Simak panduan praktis memilih jenis kuas dan cat yang tepat untuk memulai hobi baru...",
          excerpt_en: "For a beginner, stepping into an art supply store can feel intimidating. Read our practical guide to choosing the right brushes and paint types to start your new hobby...",
          content_id: "Memulai hobi melukis sering kali diawali dengan kebingungan memilih peralatan. Apakah harus memakai cat air, akrilik, atau cat minyak?\n\nUntuk pemula, cat akrilik sangat direkomendasikan karena cepat kering, mudah diencerkan dengan air, dan memiliki warna yang pekat. Kuas jenis flat dan bulat ukuran medium juga menjadi bekal yang cukup untuk memulai goresan pertama Anda di atas kanvas.",
          content_en: "Starting a painting hobby often begins with confusion over equipment selection. Should you use watercolor, acrylic, or oil paint?\n\nFor beginners, acrylic paint is highly recommended because it dries quickly, is easily diluted with water, and has high color opacity. Flat and round brush types in medium sizes are a sufficient kit to start your first strokes on canvas."
        }
      ],
      admin_password: process.env.ADMIN_PASSWORD || 'admin123',
      seo_pages: {
        home: {
          title_id: "Berseni - A World of Art For Everyone",
          title_en: "Berseni - A World of Art For Everyone",
          description_id: "Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni terbaik langsung dari para maestro.",
          description_en: "A platform connecting the public and Indonesian artists. Discover online painting classes, offline workshops, and the best artwork directly from the maestros.",
          keywords_id: "seni, lukis, kelas online, workshop offline, lukisan indonesia, belajar melukis, berseni, shopee, lynk.id",
          keywords_en: "art, painting, online classes, offline workshops, indonesian painting, learn painting, berseni, shopee, lynk.id",
          geo_region: "ID-JK",
          geo_placename: "Jakarta",
          geo_position: "-6.2088;106.8456",
          geo_icbm: "-6.2088, 106.8456"
        },
        about: {
          title_id: "Tentang Kami - Berseni",
          title_en: "About Us - Berseni",
          description_id: "Temukan kisah kami, visi misi, dan komitmen Berseni dalam menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.",
          description_en: "Discover our story, vision, mission, and commitment in becoming the primary global bridge between the general public and local Indonesian artists.",
          keywords_id: "tentang kami, berseni, visi misi, komunitas seni, indonesia, melukis",
          keywords_en: "about us, berseni, vision mission, art community, indonesia, painting",
          geo_region: "ID-JK",
          geo_placename: "Jakarta",
          geo_position: "-6.2088;106.8456",
          geo_icbm: "-6.2088, 106.8456"
        },
        collaboration: {
          title_id: "Kolaborasi Kemitraan - Berseni",
          title_en: "Partnership Collaboration - Berseni",
          description_id: "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.",
          description_en: "Open creative collaboration opportunities with Berseni. We are open for brands, communities, and venue partners to bring the best art experiences.",
          keywords_id: "kolaborasi, kerjasama, venue partner, brand collaboration, berseni, event seni",
          keywords_en: "collaboration, partnership, venue partner, brand collaboration, berseni, art event",
          geo_region: "ID-JK",
          geo_placename: "Jakarta",
          geo_position: "-6.2088;106.8456",
          geo_icbm: "-6.2088, 106.8456"
        },
        store: {
          title_id: "Galeri & Kelas Seni - Berseni Art Market",
          title_en: "Gallery & Art Classes - Berseni Art Market",
          description_id: "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.",
          description_en: "Explore the entire collection of original Indonesian artworks, online painting classes (e-courses), and offline intimate workshop registrations from Berseni.",
          keywords_id: "marketplace seni, karya seni, lukisan, kelas online, workshop offline, belajar melukis, berseni, indonesia",
          keywords_en: "art marketplace, artwork, painting, online class, offline workshop, learn painting, berseni, indonesia",
          geo_region: "ID-JK",
          geo_placename: "Jakarta",
          geo_position: "-6.2088;106.8456",
          geo_icbm: "-6.2088, 106.8456"
        },
        blog: {
          title_id: "Artikel & Catatan Seni - Berseni Blog",
          title_en: "Articles & Art Notes - Berseni Blog",
          description_id: "Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.",
          description_en: "Insights around painting techniques, art history, and creative processes of Indonesian artists.",
          keywords_id: "blog seni, teknik melukis, sejarah seni, proses kreatif, seniman indonesia, cat air, akrilik",
          keywords_en: "art blog, painting techniques, art history, creative process, indonesian artists, watercolor, acrylic",
          geo_region: "ID-JK",
          geo_placename: "Jakarta",
          geo_position: "-6.2088;106.8456",
          geo_icbm: "-6.2088, 106.8456"
        },
        classes: {
          title_id: "Kelas & Akademi Seni - Berseni Art Academy",
          title_en: "Art & Painting Classes - Berseni Art Academy",
          description_id: "Daftar kelas melukis online (e-course) dan intimate workshop offline dari Berseni. Belajar langsung dari maestro pelukis Nusantara.",
          description_en: "Register for online painting classes (e-courses) and offline intimate workshops from Berseni. Learn directly from Nusantara painting maestros.",
          keywords_id: "kelas seni, kelas melukis, workshop offline, belajar melukis, e-course melukis, berseni, indonesia",
          keywords_en: "art classes, painting class, offline workshop, learn painting, painting e-course, berseni, indonesia",
          geo_region: "ID-JK",
          geo_placename: "Jakarta",
          geo_position: "-6.2088;106.8456",
          geo_icbm: "-6.2088, 106.8456"
        }
      }
    };
    fs.writeFileSync(localDbPath, JSON.stringify(seedData, null, 2), 'utf-8');
  } else {
    // Jalankan migrasi jika file lokal sudah ada agar keys baru seo_pages & admin_password terisi
    try {
      const fileData = fs.readFileSync(localDbPath, 'utf-8');
      const data = JSON.parse(fileData);
      let updated = false;
      if (data.content && !data.content.partners) {
        data.content.partners = [
          "/support/1.png",
          "/support/2.png",
          "/support/3.png",
          "/support/4.png",
          "/support/5.png",
          "/support/6.png",
          "/support/7.png",
          "/support/8.png"
        ];
        updated = true;
      }
      if (data.content && !data.content.blogAboutTitle_id) {
        data.content.blogAboutTitle_id = "Tentang Berseni";
        data.content.blogAboutTitle_en = "About Berseni";
        data.content.blogAboutDesc_id = "Berseni adalah platform kolaboratif dan komunitas seni rupa terbesar di Indonesia, menjembatani seniman lokal dan masyarakat umum untuk saling belajar, berkarya, dan mengapresiasi keindahan seni bersama-sama.";
        data.content.blogAboutDesc_en = "Berseni is a collaborative platform and the largest visual art community in Indonesia, bridging local artists and the general public to learn, create, and appreciate the beauty of art together.";
        updated = true;
      }
      if (data.content && !data.content.testimonials) {
        data.content.testimonials = [
          {
            id: "testi-1",
            name: "Ahmad Fauzi",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Kelas Basic Oil Realism sangat direkomendasikan! Penjelasan Mas Srinthil mudah dipahami bahkan untuk saya yang baru mulai melukis.",
            comment_en: "Basic Oil Realism class is highly recommended! Mas Srinthil's explanation is easy to understand even for me who just started painting.",
            borderColor: "var(--color-tosca)"
          },
          {
            id: "testi-2",
            name: "Riana Lestari",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Puas banget ikutan workshop Meowna Lisa kemarin! Mentornya sabar, vibes studionya asyik, dan bisa bawa pulang lukisan kucing buatan sendiri.",
            comment_en: "Extremely satisfied with the Meowna Lisa workshop! The mentor was patient, the studio vibe was fun, and I could bring home my own cat painting.",
            borderColor: "var(--color-maroon)"
          },
          {
            id: "testi-3",
            name: "Budi Santoso",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Karya lukis orisinalnya sangat indah dan bersertifikat COA resmi. Dipajang di ruang tamu langsung bikin suasana rumah jadi lebih estetik.",
            comment_en: "The original paintings are stunning and come with an official COA. Hanging it in the living room instantly makes the house look aesthetic.",
            borderColor: "var(--color-kunyit)"
          },
          {
            id: "testi-4",
            name: "Siti Rahma",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
            rating: 4,
            comment_id: "Pendaftaran kelas online sangat mudah via Lynk.id. Video pembelajarannya HD dan aksesnya seumur hidup. Sangat worth it!",
            comment_en: "Registering for the online class was very easy via Lynk.id. The instructional videos are HD with lifetime access. Highly worth it!",
            borderColor: "var(--color-tosca)"
          },
          {
            id: "testi-5",
            name: "Dewi Kartika",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Workshop Summer in Pink di Yello Hotel kemarin seru banget! Dapet snack enak, alat lukis lengkap, dan dapet kenalan baru sesama pencinta seni.",
            comment_en: "The Summer in Pink workshop at Yello Hotel was so much fun! Got delicious snacks, complete painting tools, and met new friends who love art.",
            borderColor: "var(--color-maroon)"
          },
          {
            id: "testi-6",
            name: "Hendra Wijaya",
            avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Lukisan 'It's OK Offline' yang saya beli kualitas cat dan detail kanvasnya luar biasa. Pengirimannya aman menggunakan packing kayu.",
            comment_en: "The quality of the paint and canvas detail on the 'It's OK Offline' painting I bought is amazing. Shipping was safe using a wooden crate.",
            borderColor: "var(--color-kunyit)"
          },
          {
            id: "testi-7",
            name: "Linda Permata",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
            rating: 4,
            comment_id: "Baru pertama kali melukis di workshop Tweet your Heart, ternyata menyenangkan sekali. Step-by-step-nya dipandu telaten oleh seniman.",
            comment_en: "First time painting at the Tweet your Heart workshop, and it turned out to be super fun. The artist guided us step-by-step with patience.",
            borderColor: "var(--color-tosca)"
          },
          {
            id: "testi-8",
            name: "Rico Pratama",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
            rating: 5,
            comment_id: "Suka sekali dengan konsep komunitas Berseni. Bisa sharing progress lukisan di grup WhatsApp dan dapet arahan langsung dari tutor profesional.",
            comment_en: "Love the concept of the Berseni community. We can share painting progress in the WhatsApp group and get direct feedback from professional tutors.",
            borderColor: "var(--color-maroon)"
          }
        ];
        updated = true;
      }
      if (data.content && !data.content.heroBtn1Link) {
        data.content.heroBtn1Link = "#products";
        data.content.heroBtn1Status = "active";
        data.content.heroBtn2Link = "/about";
        data.content.heroBtn2Status = "active";
        data.content.prog1Link = "/classes?type=offline";
        data.content.prog1Status = "active";
        data.content.prog2Link = "/classes?type=online";
        data.content.prog2Status = "active";
        data.content.prog3Link = "/store";
        data.content.prog3Status = "active";
        data.content.galleryBtnLink = "/store";
        data.content.galleryBtnStatus = "active";
        data.content.blogBtnLink = "/blog";
        data.content.blogBtnStatus = "active";
        data.content.ctaBtnLink = "https://wa.me/6281234567890?text=Halo%20Berseni%21%20Saya%20tertarik%20untuk%20bergabung%20sebagai%20early%20supporter%20dan%20ingin%20mendapatkan%20info%20terbaru%20mengenai%20karya%20seni%20dan%20workshop.";
        data.content.ctaBtnStatus = "active";
        data.content.aboutCommitBtnLink = "/#products";
        data.content.aboutCommitBtnStatus = "active";
        data.content.aboutCtaBtn1Link = "/#products";
        data.content.aboutCtaBtn1Status = "active";
        data.content.aboutCtaBtn2Link = "/#programs";
        data.content.aboutCtaBtn2Status = "active";
        data.content.collabBrandBtnLink = "https://wa.me/6281234567890?text=Halo%20Berseni%21%20Brand%2FPerusahaan%20kami%20tertarik%20untuk%20berkolaborasi%20kreatif%20dengan%20Berseni.";
        data.content.collabBrandBtnStatus = "active";
        data.content.collabVenueBtnLink = "https://wa.me/6281234567890?text=Halo%20Berseni%21%20Saya%20memiliki%20venue%2Ftempat%20yang%20tertarik%20untuk%20berkolaborasi%20dengan%20komunitas%20Berseni.";
        data.content.collabVenueBtnStatus = "active";
        updated = true;
      }
      if (data.content && !data.content.defaultLanguage) {
        data.content.defaultLanguage = "id";
        updated = true;
      }
      if (data.content && data.content.heroCardOpacity === undefined) {
        data.content.heroCardOpacity = "0.85";
        updated = true;
      }
      if (data.content && data.content.heroBirdsTop === undefined) {
        data.content.heroBirdsTop = "10%";
        updated = true;
      }
      if (data.content && data.content.navLayout === undefined) {
        data.content.navLayout = "floating";
        updated = true;
      }
      if (data.content && data.content.classesTitle_id === undefined) {
        data.content.classesTitle_id = "Kelas & Akademi Seni Berseni.";
        data.content.classesTitle_en = "Berseni Art Classes & Academy.";
        data.content.classesSubtitle_id = "Ikuti workshop offline dan kelas online interaktif kami bersama maestro pelukis Nusantara.";
        data.content.classesSubtitle_en = "Join our offline workshops and interactive online classes with Indonesian maestros.";
        data.content.classesSearchPlaceholder_id = "Cari kelas atau workshop...";
        data.content.classesSearchPlaceholder_en = "Search classes or workshops...";
        data.content.resultsCountClasses_id = "Menampilkan {count} kelas / workshop seni";
        data.content.resultsCountClasses_en = "Showing {count} art classes / workshops";
        data.content.emptyClassesTitle_id = "Tidak ada kelas yang cocok";
        data.content.emptyClassesTitle_en = "No matching classes";
        data.content.emptyClassesDesc_id = "Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.";
        data.content.emptyClassesDesc_en = "Try using other search keywords or choose a different category.";
        data.content.showAllClasses_id = "Tampilkan Semua Kelas";
        data.content.showAllClasses_en = "Show All Classes";
        updated = true;
      }
      if (data.content && data.content.navOpacity === undefined) {
        data.content.navOpacity = "0.65";
        updated = true;
      }
      if (data.content && data.content.testimonials) {
        let testiUpdated = false;
        data.content.testimonials = data.content.testimonials.map(t => {
          let singleUpdated = false;
          if (t.videoThumbnail === undefined) {
            t.videoThumbnail = "";
            singleUpdated = true;
          }
          if (t.videoLink === undefined) {
            t.videoLink = "";
            singleUpdated = true;
          }
          // Seed the first testimonial if empty
          if (t.id === "testi-1" && !t.videoThumbnail) {
            t.videoThumbnail = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600";
            t.videoLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            singleUpdated = true;
          }
          if (singleUpdated) {
            testiUpdated = true;
          }
          return t;
        });
        if (testiUpdated) {
          updated = true;
        }
      }
      if (!data.admin_password) {
        data.admin_password = process.env.ADMIN_PASSWORD || 'admin123';
        updated = true;
      }
      if (!data.seo_pages) {
        data.seo_pages = {
          home: {
            title_id: "Berseni - A World of Art For Everyone",
            title_en: "Berseni - A World of Art For Everyone",
            description_id: "Platform penghubung publik dan seniman Indonesia. Temukan kelas melukis online, workshop offline, dan karya seni terbaik langsung dari para maestro.",
            description_en: "A platform connecting the public and Indonesian artists. Discover online painting classes, offline workshops, and the best artwork directly from the maestros.",
            keywords_id: "seni, lukis, kelas online, workshop offline, lukisan indonesia, belajar melukis, berseni, shopee, lynk.id",
            keywords_en: "art, painting, online classes, offline workshops, indonesian painting, learn painting, berseni, shopee, lynk.id",
            geo_region: "ID-JK",
            geo_placename: "Jakarta",
            geo_position: "-6.2088;106.8456",
            geo_icbm: "-6.2088, 106.8456"
          },
          about: {
            title_id: "Tentang Kami - Berseni",
            title_en: "About Us - Berseni",
            description_id: "Temukan kisah kami, visi misi, dan komitmen Berseni dalam menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia.",
            description_en: "Discover our story, vision, mission, and commitment in becoming the primary global bridge between the general public and local Indonesian artists.",
            keywords_id: "tentang kami, berseni, visi misi, komunitas seni, indonesia, melukis",
            keywords_en: "about us, berseni, vision mission, art community, indonesia, painting",
            geo_region: "ID-JK",
            geo_placename: "Jakarta",
            geo_position: "-6.2088;106.8456",
            geo_icbm: "-6.2088, 106.8456"
          },
          collaboration: {
            title_id: "Kolaborasi Kemitraan - Berseni",
            title_en: "Partnership Collaboration - Berseni",
            description_id: "Buka peluang kolaborasi kreatif bersama Berseni. Kami terbuka untuk brand, komunitas, dan partner venue untuk menghadirkan pengalaman seni terbaik.",
            description_en: "Open creative collaboration opportunities with Berseni. We are open for brands, communities, and venue partners to bring the best art experiences.",
            keywords_id: "kolaborasi, kerjasama, venue partner, brand collaboration, berseni, event seni",
            keywords_en: "collaboration, partnership, venue partner, brand collaboration, berseni, art event",
            geo_region: "ID-JK",
            geo_placename: "Jakarta",
            geo_position: "-6.2088;106.8456",
            geo_icbm: "-6.2088, 106.8456"
          },
          store: {
            title_id: "Galeri & Kelas Seni - Berseni Art Market",
            title_en: "Gallery & Art Classes - Berseni Art Market",
            description_id: "Jelajahi seluruh koleksi karya seni orisinal Indonesia, kelas melukis online (e-course), dan pendaftaran intimate workshop offline dari Berseni.",
            description_en: "Explore the entire collection of original Indonesian artworks, online painting classes (e-courses), and offline intimate workshop registrations from Berseni.",
            keywords_id: "marketplace seni, karya seni, lukisan, kelas online, workshop offline, belajar melukis, berseni, indonesia",
            keywords_en: "art marketplace, artwork, painting, online class, offline workshop, learn painting, berseni, indonesia",
            geo_region: "ID-JK",
            geo_placename: "Jakarta",
            geo_position: "-6.2088;106.8456",
            geo_icbm: "-6.2088, 106.8456"
          },
          blog: {
            title_id: "Artikel & Catatan Seni - Berseni Blog",
            title_en: "Articles & Art Notes - Berseni Blog",
            description_id: "Wawasan seputar teknik melukis, sejarah seni rupa, dan proses kreatif dari para seniman Indonesia.",
            description_en: "Insights around painting techniques, art history, and creative processes of Indonesian artists.",
            keywords_id: "blog seni, teknik melukis, sejarah seni, proses kreatif, seniman indonesia, cat air, akrilik",
            keywords_en: "art blog, painting techniques, art history, creative process, indonesian artists, watercolor, acrylic",
            geo_region: "ID-JK",
            geo_placename: "Jakarta",
            geo_position: "-6.2088;106.8456",
            geo_icbm: "-6.2088, 106.8456"
          },
          classes: {
            title_id: "Kelas & Akademi Seni - Berseni Art Academy",
            title_en: "Art & Painting Classes - Berseni Art Academy",
            description_id: "Daftar kelas melukis online (e-course) dan intimate workshop offline dari Berseni. Belajar langsung dari maestro pelukis Nusantara.",
            description_en: "Register for online painting classes (e-courses) and offline intimate workshops from Berseni. Learn directly from Nusantara painting maestros.",
            keywords_id: "kelas seni, kelas melukis, workshop offline, belajar melukis, e-course melukis, berseni, indonesia",
            keywords_en: "art classes, painting class, offline workshop, learn painting, painting e-course, berseni, indonesia",
            geo_region: "ID-JK",
            geo_placename: "Jakarta",
            geo_position: "-6.2088;106.8456",
            geo_icbm: "-6.2088, 106.8456"
          }
        };
        updated = true;
      }
      if (data.seo_pages && !data.seo_pages.classes) {
        data.seo_pages.classes = {
          title_id: "Kelas & Akademi Seni - Berseni Art Academy",
          title_en: "Art & Painting Classes - Berseni Art Academy",
          description_id: "Daftar kelas melukis online (e-course) dan intimate workshop offline dari Berseni. Belajar langsung dari maestro pelukis Nusantara.",
          description_en: "Register for online painting classes (e-courses) and offline intimate workshops from Berseni. Learn directly from Nusantara painting maestros.",
          keywords_id: "kelas seni, kelas melukis, workshop offline, belajar melukis, e-course melukis, berseni, indonesia",
          keywords_en: "art classes, painting class, offline workshop, learn painting, painting e-course, berseni, indonesia",
          geo_region: "ID-JK",
          geo_placename: "Jakarta",
          geo_position: "-6.2088;106.8456",
          geo_icbm: "-6.2088, 106.8456"
        };
        updated = true;
      }
      if (data.content && data.content.bg_navbar === undefined) {
        data.content.bg_navbar = "#FAF5EB";
        data.content.bg_home_hero = "#FAF5EB";
        data.content.bg_home_partners = "#FFFFFF";
        data.content.bg_home_programs = "#0B132B";
        data.content.bg_home_gallery = "#FFFFFF";
        data.content.bg_home_testimonials = "#FAF5EB";
        data.content.bg_home_blog = "#FFFFFF";
        data.content.bg_home_cta = "#14789B";
        data.content.bg_about_hero = "#FAF5EB";
        data.content.bg_about_feature = "#FFFFFF";
        data.content.bg_about_empower = "#FAF5EB";
        data.content.bg_about_pillars = "#FFFFFF";
        data.content.bg_about_stats = "#0B132B";
        data.content.bg_about_cta = "#FAF5EB";
        data.content.bg_collab_hero = "#FAF5EB";
        data.content.bg_collab_brand = "#FFFFFF";
        data.content.bg_collab_venue = "#FAF5EB";
        data.content.bg_store_main = "#FAF5EB";
        data.content.bg_classes_main = "#FAF5EB";
        data.content.bg_blog_header = "#FAF5EB";
        data.content.bg_blog_content = "#FFFFFF";
        data.content.bg_blog_detail_main = "#FFFFFF";
        data.content.bg_blog_detail_cta = "#FAF5EB";
        updated = true;
      }
      if (updated) {
        fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error("Gagal migrasi database lokal:", e);
    }
  }
}

export const db = {
  async get(key) {
    if (isLocal) {
      initLocalDb();
      try {
        const fileData = fs.readFileSync(localDbPath, 'utf-8');
        const data = JSON.parse(fileData);
        return data[key] || null;
      } catch (err) {
        console.error("Local DB get error:", err);
        return null;
      }
    } else {
      try {
        const val = await kv.get(`berseni:${key}`);
        if (!val) {
          // Jika di Vercel KV masih kosong, seed dengan data lokal default
          initLocalDb();
          const fileData = fs.readFileSync(localDbPath, 'utf-8');
          const data = JSON.parse(fileData);
          if (data[key]) {
            await kv.set(`berseni:${key}`, data[key]);
            return data[key];
          }
        }
        return val;
      } catch (err) {
        console.error("Vercel KV get error:", err);
        return null;
      }
    }
  },

  async set(key, value) {
    if (isLocal) {
      initLocalDb();
      try {
        const fileData = fs.readFileSync(localDbPath, 'utf-8');
        const data = JSON.parse(fileData);
        data[key] = value;
        fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
      } catch (err) {
        console.error("Local DB set error:", err);
        return false;
      }
    } else {
      try {
        await kv.set(`berseni:${key}`, value);
        return true;
      } catch (err) {
        console.error("Vercel KV set error:", err);
        return false;
      }
    }
  }
};
