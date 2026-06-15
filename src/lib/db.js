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
        heroTitle: "Experience Art. Feel Indonesia.",
        heroSubtitle: "Learn. Create. Experience.",
        heroDescription: "Belajar langsung dari seniman profesional Indonesia melalui kelas online interaktif, workshop intim, dan festival seni imersif. Selami warisan budaya lokal yang kaya dan kembangkan kreativitas kontemporer Anda.",
        aboutTitle: "When passion meets arts",
        aboutSubtitle: "Gerbang Utama Anda Menuju Dunia Seniman",
        aboutDescription: "Berseni lahir dari kesadaran sederhana bahwa banyak orang ingin lebih dekat dengan dunia seni rupa, tetapi bingung harus mulai dari mana. Akses ke seniman profesional seringkali terasa eksklusif dan berjarak.\n\nKami memutuskan untuk membuka jalan itu. Di Berseni, Anda tidak hanya belajar teknik melukis dasar, tetapi juga berinteraksi langsung dengan seniman praktisi. Memahami proses kreatif, cerita, serta perjalanan karya mereka.\n\nKami percaya seni tidak hanya milik segelintir orang. Seni adalah ruang inklusif untuk semua orang belajar, tumbuh, dan terhubung satu sama lain.",
        visiTitle: "Visi Kami",
        visiDescription: "Menjadi jembatan global utama antara masyarakat umum dan seniman lokal Indonesia, menumbuhkan ekosistem ekonomi seni yang berkelanjutan dan apresiasi seni yang bermakna.",
        misiTitle: "Misi Kami",
        misiList: [
          "Membuka akses langsung bagi publik untuk berinteraksi dan belajar dari seniman profesional.",
          "Mendukung pemberdayaan ekonomi seniman lokal melalui eksposur, kolaborasi, dan apresiasi karya.",
          "Membina komunitas pecinta seni yang inklusif, suportif, dan berkelanjutan di seluruh Indonesia."
        ],
        statsUsers: "20k+",
        statsDescription: "Pengguna Berseni"
      },
      products: [
        {
          id: "prod-1",
          title: "It's OK Offline (Acrylic Painting)",
          category: "artwork",
          price: 2500000,
          image: "https://berseni.id/wp-content/uploads/2026/02/batik-rb.png",
          description: "Sebuah karya lukisan akrilik orisinal yang mengajak kita jeda sejenak dari kebisingan dunia digital. Menampilkan perpaduan motif flora tradisional dengan sentuhan abstrak modern.",
          specs: "Acrylic on Canvas, 75 x 55 cm, Custom Wood Frame, Certificate of Authenticity (COA) Included",
          link: "https://lynk.id/berseni.id"
        },
        {
          id: "prod-2",
          title: "Batik Painting Intimate Workshop",
          category: "offline",
          price: 350000,
          image: "https://berseni.id/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-13-at-9.18.01-AM.jpeg",
          description: "Rasakan pengalaman membatik tulis klasik menggunakan canting dan lilin malam tradisional. Dipandu langsung oleh maestro batik lokal di studio kami yang asri.",
          specs: "3 Hours Session, All Materials (Cloth, Wax, Dyes) Provided, Take Home Your Handcrafted Batik",
          link: "https://lynk.id/berseni.id"
        },
        {
          id: "prod-3",
          title: "Mastering Watercolors Online E-Course",
          category: "online",
          price: 150000,
          image: "https://berseni.id/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-13-at-9.19.52-AM.jpeg",
          description: "Kuasai teknik dasar cat air, blending warna, membuat gradasi langit, hingga melukis lanskap alam indah dari rumah Anda. Belajar dengan modul video HD yang dapat diputar kapan saja.",
          specs: "10 HD Video Lessons, Lifetime Online Access, PDF Handbook & Reference Materials",
          link: "https://lynk.id/berseni.id"
        }
      ],
      posts: [
        {
          slug: "melukis-menyenangkan-dan-menghasilkan",
          title: "Melukis : Menyenangkan dan Menghasilkan",
          date: "05/03/2026",
          image: "https://berseni.id/wp-content/uploads/2026/02/Example-A-Roll-Image-scaled-1-1024x793.jpg",
          excerpt: "Melukis adalah salah satu hobi yang memiliki banyak manfaat. Selain menjadi media untuk mengekspresikan ide, melukis juga dapat menghasilkan ekonomi...",
          content: "Melukis adalah salah satu hobi yang memiliki banyak manfaat. Selain menjadi media untuk mengekspresikan ide, melukis juga dapat membantu mengurangi stres, meningkatkan konsentrasi, serta mengasah kepekaan estetika.\n\nLebih dari sekadar hobi, melukis kini juga dapat menjadi aktivitas yang menghasilkan secara ekonomi. Banyak seniman mandiri yang memulai karir mereka dari hobi melukis di rumah hingga akhirnya memamerkan karya mereka di galeri nasional dan internasional."
        },
        {
          slug: "lukisan-sebagai-sumber-sejarah",
          title: "Lukisan sebagai Sumber Sejarah",
          date: "05/03/2026",
          image: "https://berseni.id/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-13-at-9.18.01-AM.jpeg",
          excerpt: "Melalui banyak medium seperti film atau bahkan kisah-kisah romansa, pelukis tampak sebagai sosok yang mendokumentasikan masa lalu...",
          content: "Melalui banyak medium seperti film atau bahkan kisah-kisah romansa, pelukis tampak sebagai sosok yang berdiam diri di studio untuk menghasilkan karya estetik.\n\nNamun sejarah mencatat bahwa lukisan memiliki peran yang jauh lebih besar daripada sekadar hiasan dinding. Sebelum fotografi ditemukan, lukisan adalah media dokumentasi visual utama yang merekam peristiwa penting, adat istiadat, dan kondisi sosial masyarakat di masa lampau."
        }
      ]
    };
    fs.writeFileSync(localDbPath, JSON.stringify(seedData, null, 2), 'utf-8');
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
