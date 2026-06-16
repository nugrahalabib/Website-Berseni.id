'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Admin.module.css';

// Component for uploading and editing media URLs / files
const MediaUploadInput = ({ label, name, value, type, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(name, data.url);
      } else {
        alert('Gagal mengunggah file.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengunggah file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1.25rem', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', background: '#F8FAFC', width: '100%' }}>
      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>{label}</label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {value ? (
          <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2E8F0', flexShrink: 0 }}>
            {type === 'video' ? (
              <video 
                src={value} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                muted 
                onClick={() => window.open(value, '_blank')}
                title="Klik untuk lihat video penuh (Preview)"
              />
            ) : (
              <img 
                src={value} 
                alt={label} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                onClick={() => window.open(value, '_blank')}
                title="Klik untuk lihat gambar penuh (Preview)"
              />
            )}
            <button
              type="button"
              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer', padding: 0 }}
              onClick={() => onChange(name, '')}
              title="Hapus Media"
            >
              ✕
            </button>
          </div>
        ) : (
          <div style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.75rem', textAlign: 'center', padding: '5px', flexShrink: 0 }}>
            No Media
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            className={styles.adminInput}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={`Masukkan URL ${type === 'video' ? 'video' : 'gambar'} atau unggah file...`}
            style={{ marginBottom: '0.5rem' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-block', margin: 0 }}>
              {uploading ? 'Mengunggah...' : `Unggah ${type === 'video' ? 'Video' : 'Gambar'}`}
              <input
                type="file"
                accept={type === 'video' ? 'video/*' : 'image/*'}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {value && (
              <a
                href={value}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', textDecoration: 'none', color: 'var(--color-tosca)', borderColor: 'var(--color-tosca)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', height: 'auto', background: 'transparent' }}
              >
                📥 Unduh File Asli
              </a>
            )}
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Format: {type === 'video' ? 'MP4' : 'PNG, JPG, WEBP'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PageContentEditor({ showToast }) {
  const { refreshContent } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');

  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        }
      } catch (err) {
        console.error("Gagal memuat konten:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMisiChange = (index, lang, value) => {
    const fieldName = `misiList_${lang}`;
    const list = [...(form[fieldName] || [])];
    list[index] = value;
    setForm(prev => ({ ...prev, [fieldName]: list }));
  };

  const addMisiItem = (newMisiId, newMisiEn, clearInputs) => {
    if (!newMisiId.trim() || !newMisiEn.trim()) {
      alert('Isian Misi (ID & EN) wajib diisi keduanya!');
      return;
    }
    setForm(prev => ({
      ...prev,
      misiList_id: [...(prev.misiList_id || []), newMisiId.trim()],
      misiList_en: [...(prev.misiList_en || []), newMisiEn.trim()]
    }));
    clearInputs();
  };

  const removeMisiItem = (index) => {
    const listId = (form.misiList_id || []).filter((_, idx) => idx !== index);
    const listEn = (form.misiList_en || []).filter((_, idx) => idx !== index);
    setForm(prev => ({ ...prev, misiList_id: listId, misiList_en: listEn }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        showToast('Konten halaman berhasil disimpan!');
        if (refreshContent) {
          refreshContent();
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menyimpan konten.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.editorCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ color: 'var(--color-tosca)', fontWeight: 'bold' }}>Memuat data editor...</div>
      </div>
    );
  }

  // Configuration of fields and sections for each page
  const pagesConfig = {
    home: {
      title: 'Halaman Utama (Landing Page)',
      sections: {
        hero: {
          title: 'Hero Banner Utama',
          fields: [
            { name: 'heroSubtitle_id', label: 'Hero Subtitle (ID)', type: 'text', placeholder: 'Belajar. Melukis. Berseni.' },
            { name: 'heroSubtitle_en', label: 'Hero Subtitle (EN)', type: 'text', placeholder: 'Learn. Paint. Experience.' },
            { name: 'heroTitle_id', label: 'Hero Title (ID - gunakan titik "." untuk teks cursive)', type: 'text', placeholder: 'Experience Art. Feel Indonesia.' },
            { name: 'heroTitle_en', label: 'Hero Title (EN - gunakan titik "." untuk teks cursive)', type: 'text', placeholder: 'Experience Art. Feel Indonesia.' },
            { name: 'heroDescription_id', label: 'Hero Description (ID)', type: 'textarea' },
            { name: 'heroDescription_en', label: 'Hero Description (EN)', type: 'textarea' },
            { name: 'heroVideo', label: 'Video Intro (MP4)', type: 'video' },
            { name: 'heroLogo', label: 'Logo Tengah Video (PNG)', type: 'image' },
            { name: 'heroCornerTl', label: 'Bingkai Pojok Kiri Atas (PNG)', type: 'image' },
            { name: 'heroCornerTr', label: 'Bingkai Pojok Kanan Atas (PNG)', type: 'image' },
            { name: 'heroCornerBl', label: 'Bingkai Pojok Kiri Bawah (PNG)', type: 'image' },
            { name: 'heroCornerBr', label: 'Bingkai Pojok Kanan Bawah (PNG)', type: 'image' }
          ]
        },
        programs: {
          title: 'Section Program Kami (3 Pilar)',
          fields: [
            { name: 'ourPrograms_id', label: 'Pilar Title (ID)', type: 'text', placeholder: 'Program Kami' },
            { name: 'ourPrograms_en', label: 'Pilar Title (EN)', type: 'text', placeholder: 'Our Programs' },
            { name: 'programsSubtitle_id', label: 'Pilar Subtitle (ID)', type: 'textarea' },
            { name: 'programsSubtitle_en', label: 'Pilar Subtitle (EN)', type: 'textarea' },
            // Program 1
            { name: 'prog1Title_id', label: 'Program 1 Title (ID)', type: 'text' },
            { name: 'prog1Title_en', label: 'Program 1 Title (EN)', type: 'text' },
            { name: 'prog1Desc_id', label: 'Program 1 Description (ID)', type: 'textarea' },
            { name: 'prog1Desc_en', label: 'Program 1 Description (EN)', type: 'textarea' },
            { name: 'prog1Btn_id', label: 'Program 1 Button Text (ID)', type: 'text' },
            { name: 'prog1Btn_en', label: 'Program 1 Button Text (EN)', type: 'text' },
            // Program 2
            { name: 'prog2Title_id', label: 'Program 2 Title (ID)', type: 'text' },
            { name: 'prog2Title_en', label: 'Program 2 Title (EN)', type: 'text' },
            { name: 'prog2Desc_id', label: 'Program 2 Description (ID)', type: 'textarea' },
            { name: 'prog2Desc_en', label: 'Program 2 Description (EN)', type: 'textarea' },
            { name: 'prog2Btn_id', label: 'Program 2 Button Text (ID)', type: 'text' },
            { name: 'prog2Btn_en', label: 'Program 2 Button Text (EN)', type: 'text' },
            // Program 3
            { name: 'prog3Title_id', label: 'Program 3 Title (ID)', type: 'text' },
            { name: 'prog3Title_en', label: 'Program 3 Title (EN)', type: 'text' },
            { name: 'prog3Desc_id', label: 'Program 3 Description (ID)', type: 'textarea' },
            { name: 'prog3Desc_en', label: 'Program 3 Description (EN)', type: 'textarea' },
            { name: 'prog3Btn_id', label: 'Program 3 Button Text (ID)', type: 'text' },
            { name: 'prog3Btn_en', label: 'Program 3 Button Text (EN)', type: 'text' }
          ]
        },
        gallery_header: {
          title: 'Header Koleksi & Kelas Seni',
          fields: [
            { name: 'galleryTitle_id', label: 'Gallery Section Title (ID)', type: 'text' },
            { name: 'galleryTitle_en', label: 'Gallery Section Title (EN)', type: 'text' },
            { name: 'gallerySubtitle_id', label: 'Gallery Section Subtitle (ID)', type: 'textarea' },
            { name: 'gallerySubtitle_en', label: 'Gallery Section Subtitle (EN)', type: 'textarea' }
          ]
        },
        promo: {
          title: 'Banner Promo / Countdown',
          fields: [
            { name: 'promoTitle_id', label: 'Promo Title (ID)', type: 'text' },
            { name: 'promoTitle_en', label: 'Promo Title (EN)', type: 'text' },
            { name: 'promoSubtitle_id', label: 'Promo Subtitle (ID)', type: 'textarea' },
            { name: 'promoSubtitle_en', label: 'Promo Subtitle (EN)', type: 'textarea' },
            { name: 'promoEnds_id', label: 'Promo Ends label (ID)', type: 'text', placeholder: 'Berakhir Dalam:' },
            { name: 'promoEnds_en', label: 'Promo Ends label (EN)', type: 'text', placeholder: 'Ends In:' }
          ]
        },
        testimonials: {
          title: 'Header Testimonial',
          fields: [
            { name: 'testimonialsTitle_id', label: 'Testimonials Title (ID)', type: 'text' },
            { name: 'testimonialsTitle_en', label: 'Testimonials Title (EN)', type: 'text' },
            { name: 'testimonialsSubtitle_id', label: 'Testimonials Subtitle (ID)', type: 'textarea' },
            { name: 'testimonialsSubtitle_en', label: 'Testimonials Subtitle (EN)', type: 'textarea' }
          ]
        },
        cta: {
          title: 'CTA Section WhatsApp',
          fields: [
            { name: 'ctaTitle_id', label: 'CTA Title (ID)', type: 'text' },
            { name: 'ctaTitle_en', label: 'CTA Title (EN)', type: 'text' },
            { name: 'ctaSubtitle_id', label: 'CTA Subtitle (ID)', type: 'textarea' },
            { name: 'ctaSubtitle_en', label: 'CTA Subtitle (EN)', type: 'textarea' },
            { name: 'ctaBtn_id', label: 'CTA Button Text (ID)', type: 'text' },
            { name: 'ctaBtn_en', label: 'CTA Button Text (EN)', type: 'text' }
          ]
        },
        activities: {
          title: 'Kelola Carousel Aktivitas',
          fields: [],
          customRender: 'activities_editor'
        },
        partners: {
          title: 'Kelola Logo Partner (Dipercaya Oleh)',
          fields: [],
          customRender: 'partners_editor'
        }
      }
    },
    about: {
      title: 'Halaman Tentang Kami (About Us)',
      sections: {
        hero: {
          title: 'Hero Header Section',
          fields: [
            { name: 'aboutHeroLabel_id', label: 'Label Atas (ID)', type: 'text' },
            { name: 'aboutHeroLabel_en', label: 'Label Atas (EN)', type: 'text' },
            { name: 'aboutHeroTitle_id', label: 'Hero Title (ID)', type: 'text' },
            { name: 'aboutHeroTitle_en', label: 'Hero Title (EN)', type: 'text' },
            { name: 'aboutHeroTitleSpan_id', label: 'Title Highlighted Word (ID)', type: 'text' },
            { name: 'aboutHeroTitleSpan_en', label: 'Title Highlighted Word (EN)', type: 'text' },
            { name: 'aboutHeroDesc_id', label: 'Hero Description (ID)', type: 'textarea' },
            { name: 'aboutHeroDesc_en', label: 'Hero Description (EN)', type: 'textarea' },
            { name: 'aboutCollage1', label: 'Kolase Gambar 1 (Outdoor)', type: 'image' },
            { name: 'aboutCollage2', label: 'Kolase Gambar 2 (Batik)', type: 'image' },
            { name: 'aboutCollage3', label: 'Kolase Gambar 3 (Talkshow)', type: 'image' },
            { name: 'aboutCollage4', label: 'Kolase Gambar 4 (Inclusion)', type: 'image' }
          ]
        },
        story: {
          title: 'Story Section (Tentang Kami)',
          fields: [
            { name: 'aboutTitle_id', label: 'Story Title (ID)', type: 'text' },
            { name: 'aboutTitle_en', label: 'Story Title (EN)', type: 'text' },
            { name: 'aboutSubtitle_id', label: 'Story Subtitle (ID)', type: 'text' },
            { name: 'aboutSubtitle_en', label: 'Story Subtitle (EN)', type: 'text' },
            { name: 'aboutDescription_id', label: 'Story Description (ID - gunakan double enter \\n\\n untuk paragraf baru)', type: 'textarea' },
            { name: 'aboutDescription_en', label: 'Story Description (EN - gunakan double enter \\n\\n untuk paragraf baru)', type: 'textarea' },
            { name: 'aboutStudioImg', label: 'Gambar Studio Ubud', type: 'image' }
          ]
        },
        visimisi: {
          title: 'Visi & Misi',
          fields: [
            { name: 'visiTitle_id', label: 'Visi Title (ID)', type: 'text' },
            { name: 'visiTitle_en', label: 'Visi Title (EN)', type: 'text' },
            { name: 'visiDescription_id', label: 'Visi Description (ID)', type: 'textarea' },
            { name: 'visiDescription_en', label: 'Visi Description (EN)', type: 'textarea' },
            { name: 'misiTitle_id', label: 'Misi Title (ID)', type: 'text' },
            { name: 'misiTitle_en', label: 'Misi Title (EN)', type: 'text' }
          ],
          customRender: 'visimisi_list'
        },
        pillars: {
          title: 'Three Pillars Section',
          fields: [
            { name: 'aboutPillarsTitle_id', label: 'Pillar Main Title (ID)', type: 'text' },
            { name: 'aboutPillarsTitle_en', label: 'Pillar Main Title (EN)', type: 'text' },
            { name: 'aboutPillarsTitleSpan_id', label: 'Pillar Title Highlight (ID)', type: 'text' },
            { name: 'aboutPillarsTitleSpan_en', label: 'Pillar Title Highlight (EN)', type: 'text' },
            { name: 'aboutPillarsSubtitle_id', label: 'Pillar Subtitle (ID)', type: 'textarea' },
            { name: 'aboutPillarsSubtitle_en', label: 'Pillar Subtitle (EN)', type: 'textarea' },
            // Pillar 1
            { name: 'aboutPillar1Title_id', label: 'Pillar 1 Title (ID)', type: 'text' },
            { name: 'aboutPillar1Title_en', label: 'Pillar 1 Title (EN)', type: 'text' },
            { name: 'aboutPillar1Desc_id', label: 'Pillar 1 Desc (ID)', type: 'textarea' },
            { name: 'aboutPillar1Desc_en', label: 'Pillar 1 Desc (EN)', type: 'textarea' },
            // Pillar 2
            { name: 'aboutPillar2Title_id', label: 'Pillar 2 Title (ID)', type: 'text' },
            { name: 'aboutPillar2Title_en', label: 'Pillar 2 Title (EN)', type: 'text' },
            { name: 'aboutPillar2Desc_id', label: 'Pillar 2 Desc (ID)', type: 'textarea' },
            { name: 'aboutPillar2Desc_en', label: 'Pillar 2 Desc (EN)', type: 'textarea' },
            // Pillar 3
            { name: 'aboutPillar3Title_id', label: 'Pillar 3 Title (ID)', type: 'text' },
            { name: 'aboutPillar3Title_en', label: 'Pillar 3 Title (EN)', type: 'text' },
            { name: 'aboutPillar3Desc_id', label: 'Pillar 3 Desc (ID)', type: 'textarea' },
            { name: 'aboutPillar3Desc_en', label: 'Pillar 3 Desc (EN)', type: 'textarea' }
          ]
        },
        commitment: {
          title: 'Commitment Section',
          fields: [
            { name: 'aboutCommitmentLabel_id', label: 'Commitment Label (ID)', type: 'text' },
            { name: 'aboutCommitmentLabel_en', label: 'Commitment Label (EN)', type: 'text' },
            { name: 'aboutCommitmentTitle_id', label: 'Commitment Title (ID)', type: 'text' },
            { name: 'aboutCommitmentTitle_en', label: 'Commitment Title (EN)', type: 'text' },
            { name: 'aboutCommitmentDesc_id', label: 'Commitment Description (ID)', type: 'textarea' },
            { name: 'aboutCommitmentDesc_en', label: 'Commitment Description (EN)', type: 'textarea' },
            { name: 'aboutCommitBtn_id', label: 'Commitment Button Text (ID)', type: 'text' },
            { name: 'aboutCommitBtn_en', label: 'Commitment Button Text (EN)', type: 'text' },
            // Commit Point 1
            { name: 'aboutCommit1Title_id', label: 'Commit Point 1 Title (ID)', type: 'text' },
            { name: 'aboutCommit1Title_en', label: 'Commit Point 1 Title (EN)', type: 'text' },
            { name: 'aboutCommit1Desc_id', label: 'Commit Point 1 Desc (ID)', type: 'textarea' },
            { name: 'aboutCommit1Desc_en', label: 'Commit Point 1 Desc (EN)', type: 'textarea' },
            // Commit Point 2
            { name: 'aboutCommit2Title_id', label: 'Commit Point 2 Title (ID)', type: 'text' },
            { name: 'aboutCommit2Title_en', label: 'Commit Point 2 Title (EN)', type: 'text' },
            { name: 'aboutCommit2Desc_id', label: 'Commit Point 2 Desc (ID)', type: 'textarea' },
            { name: 'aboutCommit2Desc_en', label: 'Commit Point 2 Desc (EN)', type: 'textarea' },
            // Commit Point 3
            { name: 'aboutCommit3Title_id', label: 'Commit Point 3 Title (ID)', type: 'text' },
            { name: 'aboutCommit3Title_en', label: 'Commit Point 3 Title (EN)', type: 'text' },
            { name: 'aboutCommit3Desc_id', label: 'Commit Point 3 Desc (ID)', type: 'textarea' },
            { name: 'aboutCommit3Desc_en', label: 'Commit Point 3 Desc (EN)', type: 'textarea' }
          ]
        },
        quote: {
          title: 'Quote / Testimoni Ubud Studio',
          fields: [
            { name: 'aboutQuote_id', label: 'Teks Quote (ID)', type: 'textarea' },
            { name: 'aboutQuote_en', label: 'Teks Quote (EN)', type: 'textarea' },
            { name: 'aboutQuoteAuthor_id', label: 'Author Quote (ID)', type: 'text' },
            { name: 'aboutQuoteAuthor_en', label: 'Author Quote (EN)', type: 'text' },
            { name: 'aboutQuoteLocation_id', label: 'Lokasi Quote (ID)', type: 'text' },
            { name: 'aboutQuoteLocation_en', label: 'Lokasi Quote (EN)', type: 'text' }
          ]
        },
        statistics_labels: {
          title: 'Statistics Section Labels',
          fields: [
            { name: 'statsUsers', label: 'Unified Stats Number (Unified)', type: 'text' },
            { name: 'aboutStats1Label_id', label: 'Stats 1 Label - User (ID)', type: 'text' },
            { name: 'aboutStats1Label_en', label: 'Stats 1 Label - User (EN)', type: 'text' },
            { name: 'aboutStats2Label_id', label: 'Stats 2 Label - Karya (ID)', type: 'text' },
            { name: 'aboutStats2Label_en', label: 'Stats 2 Label - Karya (EN)', type: 'text' },
            { name: 'aboutStats3Label_id', label: 'Stats 3 Label - Maestro (ID)', type: 'text' },
            { name: 'aboutStats3Label_en', label: 'Stats 3 Label - Maestro (EN)', type: 'text' },
            { name: 'aboutStats4Label_id', label: 'Stats 4 Label - Aktivitas (ID)', type: 'text' },
            { name: 'aboutStats4Label_en', label: 'Stats 4 Label - Aktivitas (EN)', type: 'text' }
          ]
        },
        cta_about: {
          title: 'CTA Section (Tengah/Bawah)',
          fields: [
            { name: 'aboutCtaTitle_id', label: 'CTA Title (ID)', type: 'text' },
            { name: 'aboutCtaTitle_en', label: 'CTA Title (EN)', type: 'text' },
            { name: 'aboutCtaDesc_id', label: 'CTA Description (ID)', type: 'textarea' },
            { name: 'aboutCtaDesc_en', label: 'CTA Description (EN)', type: 'textarea' },
            { name: 'aboutCtaBtn1_id', label: 'CTA Button 1 Text (ID)', type: 'text' },
            { name: 'aboutCtaBtn1_en', label: 'CTA Button 1 Text (EN)', type: 'text' },
            { name: 'aboutCtaBtn2_id', label: 'CTA Button 2 Text (ID)', type: 'text' },
            { name: 'aboutCtaBtn2_en', label: 'CTA Button 2 Text (EN)', type: 'text' }
          ]
        }
      }
    },
    collaboration: {
      title: 'Halaman Kolaborasi (Collaboration)',
      sections: {
        hero: {
          title: 'Hero Header Section',
          fields: [
            { name: 'collabHeroSubtitle_id', label: 'Hero Subtitle (ID)', type: 'text' },
            { name: 'collabHeroSubtitle_en', label: 'Hero Subtitle (EN)', type: 'text' },
            { name: 'collabHeroTitle_id', label: 'Hero Title (ID)', type: 'text' },
            { name: 'collabHeroTitle_en', label: 'Hero Title (EN)', type: 'text' },
            { name: 'collabHeroDesc_id', label: 'Hero Description (ID)', type: 'textarea' },
            { name: 'collabHeroDesc_en', label: 'Hero Description (EN)', type: 'textarea' }
          ]
        },
        brand: {
          title: 'Section Brand & Corporate',
          fields: [
            { name: 'collabBrandBadge_id', label: 'Badge (ID)', type: 'text' },
            { name: 'collabBrandBadge_en', label: 'Badge (EN)', type: 'text' },
            { name: 'collabBrandTitle_id', label: 'Brand Title (ID)', type: 'text' },
            { name: 'collabBrandTitle_en', label: 'Brand Title (EN)', type: 'text' },
            { name: 'collabBrandIntro_id', label: 'Brand Intro (ID)', type: 'textarea' },
            { name: 'collabBrandIntro_en', label: 'Brand Intro (EN)', type: 'textarea' },
            // Feat 1
            { name: 'collabBrandFeat1Title_id', label: 'Feature 1 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat1Title_en', label: 'Feature 1 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat1Desc_id', label: 'Feature 1 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat1Desc_en', label: 'Feature 1 Desc (EN)', type: 'textarea' },
            // Feat 2
            { name: 'collabBrandFeat2Title_id', label: 'Feature 2 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat2Title_en', label: 'Feature 2 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat2Desc_id', label: 'Feature 2 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat2Desc_en', label: 'Feature 2 Desc (EN)', type: 'textarea' },
            // Feat 3
            { name: 'collabBrandFeat3Title_id', label: 'Feature 3 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat3Title_en', label: 'Feature 3 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat3Desc_id', label: 'Feature 3 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat3Desc_en', label: 'Feature 3 Desc (EN)', type: 'textarea' },
            // Feat 4
            { name: 'collabBrandFeat4Title_id', label: 'Feature 4 Title (ID)', type: 'text' },
            { name: 'collabBrandFeat4Title_en', label: 'Feature 4 Title (EN)', type: 'text' },
            { name: 'collabBrandFeat4Desc_id', label: 'Feature 4 Desc (ID)', type: 'textarea' },
            { name: 'collabBrandFeat4Desc_en', label: 'Feature 4 Desc (EN)', type: 'textarea' },
            // Callout
            { name: 'collabBrandCallout_id', label: 'Callout Text (ID)', type: 'text' },
            { name: 'collabBrandCallout_en', label: 'Callout Text (EN)', type: 'text' },
            // Button
            { name: 'collabBrandBtn_id', label: 'Button Text (ID)', type: 'text' },
            { name: 'collabBrandBtn_en', label: 'Button Text (EN)', type: 'text' },
            { name: 'collabCanvasImg', label: 'Latar Belakang Poster Canvas', type: 'image' }
          ]
        },
        venue: {
          title: 'Section Host & Space Partners (Venue)',
          fields: [
            { name: 'collabVenueBadge_id', label: 'Badge (ID)', type: 'text' },
            { name: 'collabVenueBadge_en', label: 'Badge (EN)', type: 'text' },
            { name: 'collabVenueTitle_id', label: 'Venue Title (ID)', type: 'text' },
            { name: 'collabVenueTitle_en', label: 'Venue Title (EN)', type: 'text' },
            { name: 'collabVenueSub_id', label: 'Venue Subtitle (ID)', type: 'textarea' },
            { name: 'collabVenueSub_en', label: 'Venue Subtitle (EN)', type: 'textarea' },
            // Feat 1
            { name: 'collabVenueFeat1Title_id', label: 'Feature 1 Title (ID)', type: 'text' },
            { name: 'collabVenueFeat1Title_en', label: 'Feature 1 Title (EN)', type: 'text' },
            { name: 'collabVenueFeat1Desc_id', label: 'Feature 1 Desc (ID)', type: 'textarea' },
            { name: 'collabVenueFeat1Desc_en', label: 'Feature 1 Desc (EN)', type: 'textarea' },
            // Feat 2
            { name: 'collabVenueFeat2Title_id', label: 'Feature 2 Title (ID)', type: 'text' },
            { name: 'collabVenueFeat2Title_en', label: 'Feature 2 Title (EN)', type: 'text' },
            { name: 'collabVenueFeat2Desc_id', label: 'Feature 2 Desc (ID)', type: 'textarea' },
            { name: 'collabVenueFeat2Desc_en', label: 'Feature 2 Desc (EN)', type: 'textarea' },
            // Feat 3
            { name: 'collabVenueFeat3Title_id', label: 'Feature 3 Title (ID)', type: 'text' },
            { name: 'collabVenueFeat3Title_en', label: 'Feature 3 Title (EN)', type: 'text' },
            { name: 'collabVenueFeat3Desc_id', label: 'Feature 3 Desc (ID)', type: 'textarea' },
            { name: 'collabVenueFeat3Desc_en', label: 'Feature 3 Desc (EN)', type: 'textarea' },
            // Cta Callout Title & Desc
            { name: 'collabVenueCtaTitle_id', label: 'CTA Callout Title (ID)', type: 'text' },
            { name: 'collabVenueCtaTitle_en', label: 'CTA Callout Title (EN)', type: 'text' },
            { name: 'collabVenueCtaDesc_id', label: 'CTA Callout Desc (ID)', type: 'textarea' },
            { name: 'collabVenueCtaDesc_en', label: 'CTA Callout Desc (EN)', type: 'textarea' },
            // Button
            { name: 'collabVenueBtn_id', label: 'Button Text (ID)', type: 'text' },
            { name: 'collabVenueBtn_en', label: 'Button Text (EN)', type: 'text' }
          ]
        }
      }
    },
    store: {
      title: 'Halaman Art Market (Store)',
      sections: {
        header: {
          title: 'Store Headings & Labels',
          fields: [
            { name: 'storeTitle_id', label: 'Store Main Title (ID)', type: 'text' },
            { name: 'storeTitle_en', label: 'Store Main Title (EN)', type: 'text' },
            { name: 'storeSearchPlaceholder_id', label: 'Search Input Placeholder (ID)', type: 'text' },
            { name: 'storeSearchPlaceholder_en', label: 'Search Input Placeholder (EN)', type: 'text' },
            { name: 'sortByLabel_id', label: 'Sort Dropdown Label (ID)', type: 'text' },
            { name: 'sortByLabel_en', label: 'Sort Dropdown Label (EN)', type: 'text' },
            { name: 'sortLatest_id', label: 'Sort Option "Latest" (ID)', type: 'text' },
            { name: 'sortLatest_en', label: 'Sort Option "Latest" (EN)', type: 'text' },
            { name: 'sortPriceAsc_id', label: 'Sort Option "Price Low-High" (ID)', type: 'text' },
            { name: 'sortPriceAsc_en', label: 'Sort Option "Price Low-High" (EN)', type: 'text' },
            { name: 'sortPriceDesc_id', label: 'Sort Option "Price High-Low" (ID)', type: 'text' },
            { name: 'sortPriceDesc_en', label: 'Sort Option "Price High-Low" (EN)', type: 'text' },
            { name: 'resultsCount_id', label: 'Results Count text (ID - gunakan {count})', type: 'text' },
            { name: 'resultsCount_en', label: 'Results Count text (EN - gunakan {count})', type: 'text' },
            { name: 'resetFilters_id', label: 'Reset Filter Button (ID)', type: 'text' },
            { name: 'resetFilters_en', label: 'Reset Filter Button (EN)', type: 'text' },
            { name: 'emptyStoreTitle_id', label: 'Empty Results Title (ID)', type: 'text' },
            { name: 'emptyStoreTitle_en', label: 'Empty Results Title (EN)', type: 'text' },
            { name: 'emptyStoreDesc_id', label: 'Empty Results Description (ID)', type: 'textarea' },
            { name: 'emptyStoreDesc_en', label: 'Empty Results Description (EN)', type: 'textarea' },
            { name: 'showAllProducts_id', label: 'Show All Button text (ID)', type: 'text' },
            { name: 'showAllProducts_en', label: 'Show All Button text (EN)', type: 'text' }
          ]
        }
      }
    },
    blog: {
      title: 'Halaman Kumpulan Blog',
      sections: {
        header: {
          title: 'Blog Page Headings',
          fields: [
            { name: 'blogHeaderTitleText_id', label: 'Header Title Text (ID)', type: 'text' },
            { name: 'blogHeaderTitleText_en', label: 'Header Title Text (EN)', type: 'text' },
            { name: 'blogHeaderTitleSpan_id', label: 'Header Title Highlighted (ID)', type: 'text' },
            { name: 'blogHeaderTitleSpan_en', label: 'Header Title Highlighted (EN)', type: 'text' },
            { name: 'blogHeaderDesc_id', label: 'Header Description (ID)', type: 'textarea' },
            { name: 'blogHeaderDesc_en', label: 'Header Description (EN)', type: 'textarea' },
            { name: 'blogFeaturedTag_id', label: 'Featured Article Tag (ID)', type: 'text' },
            { name: 'blogFeaturedTag_en', label: 'Featured Article Tag (EN)', type: 'text' },
            { name: 'blogLatestTitle_id', label: 'Latest Section Header (ID)', type: 'text' },
            { name: 'blogLatestTitle_en', label: 'Latest Section Header (EN)', type: 'text' },
            { name: 'blogReadFullBtn_id', label: 'Read Full Article Button (ID)', type: 'text' },
            { name: 'blogReadFullBtn_en', label: 'Read Full Article Button (EN)', type: 'text' },
            { name: 'blogEmpty_id', label: 'Empty Blog Warning (ID)', type: 'textarea' },
            { name: 'blogEmpty_en', label: 'Empty Blog Warning (EN)', type: 'textarea' }
          ]
        }
      }
    }
  };

  // Helper Custom Visi Misi List
  const MisiListSection = () => {
    const [newMisiId, setNewMisiId] = useState('');
    const [newMisiEn, setNewMisiEn] = useState('');

    const currentMisiId = form.misiList_id || [];
    const currentMisiEn = form.misiList_en || [];

    return (
      <div style={{ marginTop: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1rem' }}>
        <label className={styles.adminLabel} style={{ marginBottom: '1rem' }}>Daftar Misi Komunitas (Bilingual)</label>
        
        {currentMisiId.map((misi, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 42px', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              className={styles.adminInput}
              value={misi}
              onChange={(e) => handleMisiChange(index, 'id', e.target.value)}
              placeholder={`Misi ${index + 1} (Indonesian)`}
              required
            />
            <input
              type="text"
              className={styles.adminInput}
              value={currentMisiEn[index] || ''}
              onChange={(e) => handleMisiChange(index, 'en', e.target.value)}
              placeholder={`Mission ${index + 1} (English)`}
              required
            />
            <button
              type="button"
              className={styles.misiRemoveBtn}
              onClick={() => removeMisiItem(index)}
              title="Hapus misi ini"
            >
              ✕
            </button>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginTop: '1rem' }}>
          <input
            type="text"
            className={styles.adminInput}
            value={newMisiId}
            onChange={(e) => setNewMisiId(e.target.value)}
            placeholder="Tambah Misi Baru (ID)..."
          />
          <input
            type="text"
            className={styles.adminInput}
            value={newMisiEn}
            onChange={(e) => setNewMisiEn(e.target.value)}
            placeholder="Add New Mission (EN)..."
          />
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0 1.5rem', borderRadius: '10px', height: '100%', whiteSpace: 'nowrap' }}
            onClick={() => addMisiItem(newMisiId, newMisiEn, () => { setNewMisiId(''); setNewMisiEn(''); })}
          >
            + Tambah
          </button>
        </div>
      </div>
    );
  };

  // Helper Custom Activities Carousel Editor
  const ActivitiesEditorSection = () => {
    const [editingIndex, setEditingIndex] = useState(null); // index or 'new'
    const [actForm, setActForm] = useState({
      id: '',
      title_id: '',
      title_en: '',
      category: 'workshop',
      image: '',
      summary_id: '',
      summary_en: '',
      description_id: '',
      description_en: '',
      details_id: '',
      details_en: '',
      link: ''
    });

    const activities = form.activities || [];

    const handleEdit = (idx) => {
      setEditingIndex(idx);
      setActForm({
        id: activities[idx].id || `act-${Date.now()}`,
        title_id: activities[idx].title_id || '',
        title_en: activities[idx].title_en || '',
        category: activities[idx].category || 'workshop',
        image: activities[idx].image || '',
        summary_id: activities[idx].summary_id || '',
        summary_en: activities[idx].summary_en || '',
        description_id: activities[idx].description_id || '',
        description_en: activities[idx].description_en || '',
        details_id: activities[idx].details_id || '',
        details_en: activities[idx].details_en || '',
        link: activities[idx].link || 'https://lynk.id/berseni.id'
      });
    };

    const handleAddNew = () => {
      setEditingIndex('new');
      setActForm({
        id: `act-${Date.now()}`,
        title_id: '',
        title_en: '',
        category: 'workshop',
        image: '',
        summary_id: '',
        summary_en: '',
        description_id: '',
        description_en: '',
        details_id: '',
        details_en: '',
        link: 'https://lynk.id/berseni.id'
      });
    };

    const handleDelete = (idx) => {
      if (confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
        const updated = activities.filter((_, i) => i !== idx);
        setForm(prev => ({ ...prev, activities: updated }));
      }
    };

    const handleSave = () => {
      if (!actForm.title_id || !actForm.title_en) {
        alert('Judul Aktivitas (ID & EN) wajib diisi keduanya!');
        return;
      }
      
      let updated = [...activities];
      if (editingIndex === 'new') {
        updated.push(actForm);
      } else {
        updated[editingIndex] = actForm;
      }
      
      setForm(prev => ({ ...prev, activities: updated }));
      setEditingIndex(null);
    };

    const handleActFormChange = (e) => {
      const { name, value } = e.target;
      setActForm(prev => ({ ...prev, [name]: value }));
    };

    const handleActImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          setActForm(prev => ({ ...prev, image: data.url }));
        } else {
          alert('Gagal mengunggah gambar.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat mengunggah.');
      }
    };

    if (editingIndex !== null) {
      return (
        <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '1rem' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '1.25rem', color: 'var(--color-tosca)', fontSize: '1rem' }}>
            {editingIndex === 'new' ? 'Tambah Aktivitas Baru' : 'Sunting Aktivitas'}
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Judul Aktivitas (ID)</label>
              <input
                type="text"
                name="title_id"
                value={actForm.title_id}
                onChange={handleActFormChange}
                className={styles.adminInput}
                required
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Judul Aktivitas (EN)</label>
              <input
                type="text"
                name="title_en"
                value={actForm.title_en}
                onChange={handleActFormChange}
                className={styles.adminInput}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Kategori</label>
              <select
                name="category"
                value={actForm.category}
                onChange={handleActFormChange}
                className={styles.adminSelect}
              >
                <option value="workshop">Workshop</option>
                <option value="exhibition">Exhibition</option>
                <option value="social">Kegiatan Komunitas</option>
              </select>
            </div>
            <div>
              <label className={styles.adminLabel}>Link URL Detail / Lynk.id</label>
              <input
                type="text"
                name="link"
                value={actForm.link}
                onChange={handleActFormChange}
                className={styles.adminInput}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className={styles.adminLabel}>Gambar Aktivitas</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {actForm.image ? (
                <img 
                  src={actForm.image} 
                  alt="Preview" 
                  style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1', cursor: 'pointer' }} 
                  onClick={() => window.open(actForm.image, '_blank')}
                  title="Klik untuk lihat gambar penuh (Preview)"
                />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.75rem', textAlign: 'center' }}>No Image</div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="image"
                  value={actForm.image}
                  onChange={handleActFormChange}
                  className={styles.adminInput}
                  placeholder="URL gambar..."
                  style={{ marginBottom: '0.5rem' }}
                />
                <label className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-block', margin: 0 }}>
                  Unggah Gambar
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleActImageUpload}
                  />
                </label>
                {actForm.image && (
                  <a
                    href={actForm.image}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', textDecoration: 'none', color: 'var(--color-tosca)', borderColor: 'var(--color-tosca)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', height: 'auto', background: 'transparent', marginLeft: '0.5rem' }}
                  >
                    📥 Unduh Gambar Asli
                  </a>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Ringkasan Singkat (ID)</label>
              <input
                type="text"
                name="summary_id"
                value={actForm.summary_id}
                onChange={handleActFormChange}
                className={styles.adminInput}
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Ringkasan Singkat (EN)</label>
              <input
                type="text"
                name="summary_en"
                value={actForm.summary_en}
                onChange={handleActFormChange}
                className={styles.adminInput}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className={styles.adminLabel}>Deskripsi Lengkap (ID)</label>
              <textarea
                name="description_id"
                value={actForm.description_id}
                onChange={handleActFormChange}
                className={styles.adminTextarea}
                rows={3}
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Deskripsi Lengkap (EN)</label>
              <textarea
                name="description_en"
                value={actForm.description_en}
                onChange={handleActFormChange}
                className={styles.adminTextarea}
                rows={3}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label className={styles.adminLabel}>Detail Aktivitas (ID)</label>
              <input
                type="text"
                name="details_id"
                value={actForm.details_id}
                onChange={handleActFormChange}
                className={styles.adminInput}
                placeholder="misal: Durasi: 3 Jam | Lokasi: Ubud"
              />
            </div>
            <div>
              <label className={styles.adminLabel}>Detail Aktivitas (EN)</label>
              <input
                type="text"
                name="details_en"
                value={actForm.details_en}
                onChange={handleActFormChange}
                className={styles.adminInput}
                placeholder="e.g. Duration: 3 Hours | Location: Ubud"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }} onClick={() => setEditingIndex(null)}>
              Batal
            </button>
            <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={handleSave}>
              Simpan Aktivitas
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label className={styles.adminLabel} style={{ marginBottom: 0 }}>Daftar Aktivitas Carousel</label>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={handleAddNew}>
            + Tambah Aktivitas
          </button>
        </div>

        {activities.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
            Belum ada aktivitas. Silakan klik tombol "+ Tambah Aktivitas" untuk menambahkan.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.map((act, idx) => (
              <div key={act.id || idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#FFFFFF' }}>
                <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
                  <img 
                    src={act.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150'} 
                    alt="" 
                    style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer', display: 'block' }} 
                    onClick={() => window.open(act.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150', '_blank')}
                    title="Klik untuk lihat gambar penuh (Preview)"
                  />
                  {act.image && (
                    <a
                      href={act.image}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        background: 'rgba(20, 120, 155, 0.85)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                      title="Unduh Gambar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📥
                    </a>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{act.title_id || 'Tanpa Judul'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'capitalize' }}>
                    Kategori: {act.category} | Detail: {act.details_id || '-'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => handleEdit(idx)}>
                    Sunting
                  </button>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', color: '#EF4444', borderColor: '#FCA5A5' }} onClick={() => handleDelete(idx)}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper Custom Partners List Editor
  const PartnersEditorSection = () => {
    const [newLogoUrl, setNewLogoUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const partners = form.partners || [];

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          // Add to partners list immediately
          setForm(prev => ({
            ...prev,
            partners: [...(prev.partners || []), data.url]
          }));
        } else {
          alert('Gagal mengunggah gambar.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat mengunggah gambar.');
      } finally {
        setUploading(false);
      }
    };

    const handleAddUrl = () => {
      if (!newLogoUrl.trim()) return;
      setForm(prev => ({
        ...prev,
        partners: [...(prev.partners || []), newLogoUrl.trim()]
      }));
      setNewLogoUrl('');
    };

    const handleDelete = (idx) => {
      if (confirm('Apakah Anda yakin ingin menghapus logo partner ini?')) {
        const updated = partners.filter((_, i) => i !== idx);
        setForm(prev => ({ ...prev, partners: updated }));
      }
    };

    const moveItem = (idx, direction) => {
      const updated = [...partners];
      if (direction === 'up' && idx > 0) {
        const temp = updated[idx];
        updated[idx] = updated[idx - 1];
        updated[idx - 1] = temp;
      } else if (direction === 'down' && idx < updated.length - 1) {
        const temp = updated[idx];
        updated[idx] = updated[idx + 1];
        updated[idx + 1] = temp;
      }
      setForm(prev => ({ ...prev, partners: updated }));
    };

    return (
      <div style={{ marginTop: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label className={styles.adminLabel} style={{ marginBottom: 0 }}>Daftar Logo Partner (Dipercaya Oleh)</label>
        </div>
        
        {/* Tambah Partner Baru */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#64748B' }}>Unggah File Logo Baru</label>
            <label className="btn btn-secondary" style={{ display: 'inline-block', padding: '0.4rem 1rem', cursor: 'pointer', margin: 0, fontSize: '0.8rem', borderRadius: '8px' }}>
              {uploading ? 'Mengunggah...' : 'Pilih File Gambar'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          <div style={{ flex: 2, minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#64748B' }}>Atau Masukkan URL Gambar</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className={styles.adminInput}
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                style={{ margin: 0, height: '36px', fontSize: '0.85rem' }}
              />
              <button type="button" className="btn btn-primary" onClick={handleAddUrl} style={{ padding: '0.4rem 1.25rem', backgroundColor: 'var(--color-tosca)', color: 'white', borderRadius: '8px', fontSize: '0.8rem', height: '36px' }}>Tambah</button>
            </div>
          </div>
        </div>

        {/* List of Partners */}
        {partners.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
            Belum ada logo partner yang ditambahkan. Silakan unggah di atas.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {partners.map((url, idx) => (
              <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '5px', left: '10px', fontSize: '0.7rem', fontWeight: 'bold', color: '#94A3B8' }}>#{idx + 1}</span>
                
                {/* Logo Image Preview */}
                <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '4px', cursor: 'pointer', marginBottom: '0.75rem', overflow: 'hidden' }} onClick={() => window.open(url, '_blank')} title="Klik untuk preview ukuran penuh">
                  <img src={url} alt={`Partner ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.25rem', width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.7rem', height: 'auto', background: 'transparent' }} onClick={() => moveItem(idx, 'up')} disabled={idx === 0} title="Geser Kiri">←</button>
                  <button type="button" className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.7rem', height: 'auto', background: 'transparent' }} onClick={() => moveItem(idx, 'down')} disabled={idx === partners.length - 1} title="Geser Kanan">→</button>
                </div>
                
                <div style={{ display: 'flex', gap: '0.25rem', width: '100%', justifyContent: 'center' }}>
                  <a href={url} download target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '3px 6px', fontSize: '0.65rem', textDecoration: 'none', color: 'var(--color-tosca)', borderColor: 'var(--color-tosca)', display: 'inline-flex', alignItems: 'center', height: 'auto', background: 'transparent' }} title="Unduh gambar asli">
                    📥
                  </a>
                  <button type="button" className="btn btn-outline" style={{ padding: '3px 6px', fontSize: '0.65rem', color: '#EF4444', borderColor: '#FCA5A5', height: 'auto', background: 'transparent' }} onClick={() => handleDelete(idx)} title="Hapus Partner">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const currentPageConfig = pagesConfig[selectedPage];

  return (
    <div className={styles.editorCard}>
      <h2 className={styles.editorTitle}>Rombak & Sunting Konten Halaman Web</h2>

      {/* Dropdown Page Selector */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>PILIH HALAMAN:</span>
        <select
          value={selectedPage}
          onChange={(e) => { setSelectedPage(e.target.value); setActiveSection(Object.keys(pagesConfig[e.target.value].sections)[0]); }}
          className={styles.adminSelect}
          style={{ maxWidth: '300px', fontWeight: 'bold' }}
        >
          {Object.keys(pagesConfig).map(p => (
            <option key={p} value={p}>{pagesConfig[p].title}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', marginTop: '1rem' }}>
        {/* Section Tabs inside selected page */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid #E2E8F0', paddingRight: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sections</span>
          {Object.keys(currentPageConfig.sections).map(secKey => (
            <button
              key={secKey}
              type="button"
              className={`${styles.menuItem} ${activeSection === secKey ? styles.menuItemActive : ''}`}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                justifyContent: 'flex-start',
                fontSize: '0.85rem'
              }}
              onClick={() => setActiveSection(secKey)}
            >
              {currentPageConfig.sections[secKey].title}
            </button>
          ))}
        </aside>

        {/* Section Editor Form */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-tosca)', marginBottom: '1.5rem', borderBottom: '1px dashed #E2E8F0', paddingBottom: '0.5rem' }}>
            {currentPageConfig.sections[activeSection].title}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {currentPageConfig.sections[activeSection].fields.map(field => (
                <div key={field.name} className={(field.type === 'textarea' || field.type === 'image' || field.type === 'video') ? styles.formGridFull : ''}>
                  {field.type === 'image' || field.type === 'video' ? (
                    <MediaUploadInput
                      label={field.label}
                      name={field.name}
                      value={form[field.name] || ''}
                      type={field.type}
                      onChange={(name, val) => setForm(prev => ({ ...prev, [name]: val }))}
                    />
                  ) : field.type === 'textarea' ? (
                    <>
                      <label className={styles.adminLabel}>{field.label}</label>
                      <textarea
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || `Masukkan teks ${field.label}...`}
                        className={styles.adminTextarea}
                      />
                    </>
                  ) : (
                    <>
                      <label className={styles.adminLabel}>{field.label}</label>
                      <input
                        type="text"
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || `Masukkan ${field.label}...`}
                        className={styles.adminInput}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Custom render for Visi & Misi list */}
            {currentPageConfig.sections[activeSection].customRender === 'visimisi_list' && (
              <MisiListSection />
            )}

            {/* Custom render for Activities list */}
            {currentPageConfig.sections[activeSection].customRender === 'activities_editor' && (
              <ActivitiesEditorSection />
            )}

            {/* Custom render for Partners list */}
            {currentPageConfig.sections[activeSection].customRender === 'partners_editor' && (
              <PartnersEditorSection />
            )}

            <div className={styles.formActions} style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ minWidth: '150px' }}
              >
                {saving ? 'Menyimpan...' : 'Simpan Section'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
