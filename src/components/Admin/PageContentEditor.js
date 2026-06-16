'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import styles from '@/styles/Admin.module.css';

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
    e.preventDefault();
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

  // Definisikan struktur sections per page agar render-nya dinamis dan rapi
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
            { name: 'heroDescription_en', label: 'Hero Description (EN)', type: 'textarea' }
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
            { name: 'aboutHeroDesc_en', label: 'Hero Description (EN)', type: 'textarea' }
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
            { name: 'aboutDescription_en', label: 'Story Description (EN - gunakan double enter \\n\\n untuk paragraf baru)', type: 'textarea' }
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
            { name: 'collabBrandBtn_en', label: 'Button Text (EN)', type: 'text' }
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
                <div key={field.name} className={field.type === 'textarea' ? styles.formGridFull : ''}>
                  <label className={styles.adminLabel}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={form[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder || `Masukkan teks ${field.label}...`}
                      className={styles.adminTextarea}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={form[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder || `Masukkan ${field.label}...`}
                      className={styles.adminInput}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Custom render for Visi & Misi list */}
            {currentPageConfig.sections[activeSection].customRender === 'visimisi_list' && (
              <MisiListSection />
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
