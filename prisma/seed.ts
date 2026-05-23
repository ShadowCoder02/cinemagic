import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@cinemagic.com';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN' },
    create: { email, passwordHash, role: 'ADMIN', name: 'Keerththikan' },
  });

  // Albums
  const weddingAlbum = await prisma.album.upsert({
    where: { slug: 'romantic-wedding-jaffna' },
    update: {},
    create: {
      title: 'Romantic Wedding – Jaffna',
      slug: 'romantic-wedding-jaffna',
      description: 'A breathtaking wedding captured across the ancient temples and golden beaches of Jaffna.',
      coverImage: '/images/portfolio/wedding-1.jpg',
      location: 'Jaffna, Sri Lanka',
      category: 'wedding',
      isFeatured: true,
      isPublic: true,
    },
  });

  const engagementAlbum = await prisma.album.upsert({
    where: { slug: 'nallur-engagement' },
    update: {},
    create: {
      title: 'Nallur Temple Engagement',
      slug: 'nallur-engagement',
      description: 'An intimate engagement story woven around the sacred grounds of Nallur Kandaswamy Temple.',
      coverImage: '/images/portfolio/engagement-1.jpg',
      location: 'Nallur, Jaffna',
      category: 'engagement',
      isFeatured: true,
      isPublic: true,
    },
  });

  const graduationAlbum = await prisma.album.upsert({
    where: { slug: 'university-of-jaffna-graduation' },
    update: {},
    create: {
      title: 'University of Jaffna – Graduation 2024',
      slug: 'university-of-jaffna-graduation',
      description: 'Celebrating the class of 2024 with cinematic portraits and candid moments.',
      coverImage: '/images/portfolio/graduation-1.jpg',
      location: 'University of Jaffna',
      category: 'graduation',
      isFeatured: false,
      isPublic: true,
    },
  });

  // Photos
  const weddingPhotos = [
    { url: '/images/portfolio/wedding-1.jpg', title: 'First Look', order: 0 },
    { url: '/images/portfolio/wedding-2.jpg', title: 'Ceremony Vows', order: 1 },
    { url: '/images/portfolio/wedding-3.jpg', title: 'Reception Dance', order: 2 },
    { url: '/images/albums/wedding-1.jpg', title: 'Bridal Portrait', order: 3, isFeatured: true },
    { url: '/images/albums/wedding-2.jpg', title: 'Couple Portrait', order: 4 },
  ];
  for (const p of weddingPhotos) {
    await prisma.photo.create({ data: { albumId: weddingAlbum.id, ...p } }).catch(() => {});
  }

  const engagementPhotos = [
    { url: '/images/portfolio/engagement-1.jpg', title: 'Ring Moment', order: 0, isFeatured: true },
    { url: '/images/portfolio/engagement-2.jpg', title: 'Sunset Walk', order: 1 },
    { url: '/images/portfolio/engagement-3.jpg', title: 'Temple Gates', order: 2 },
    { url: '/images/albums/engagement-1.jpg', title: 'Golden Hour', order: 3 },
  ];
  for (const p of engagementPhotos) {
    await prisma.photo.create({ data: { albumId: engagementAlbum.id, ...p } }).catch(() => {});
  }

  const graduationPhotos = [
    { url: '/images/portfolio/graduation-1.jpg', title: 'Cap Toss', order: 0, isFeatured: true },
    { url: '/images/portfolio/graduation-2.jpg', title: 'Diploma Moment', order: 1 },
    { url: '/images/portfolio/graduation-3.jpg', title: 'Family Portrait', order: 2 },
    { url: '/images/albums/graduation-1.jpg', title: 'Group Celebration', order: 3 },
  ];
  for (const p of graduationPhotos) {
    await prisma.photo.create({ data: { albumId: graduationAlbum.id, ...p } }).catch(() => {});
  }

  // Films
  const films = [
    {
      title: "Thiven & Nethra – Wedding Film",
      slug: 'thiven-nethra-wedding-film',
      description: 'A cinematic journey through their beautiful wedding day, capturing every emotion and detail.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'YOUTUBE' as const,
      posterUrl: '/images/portfolio/wedding-1.jpg',
      duration: '8:45',
      location: 'Jaffna, Sri Lanka',
      category: 'wedding',
      isFeatured: true,
      views: 12340,
      tags: ['traditional', 'outdoor', 'ceremony'],
    },
    {
      title: 'University of Jaffna – Graduation 2024',
      slug: 'uoj-graduation-2024',
      description: 'Capturing the joy and achievement of graduation day at University of Jaffna.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'YOUTUBE' as const,
      posterUrl: '/images/portfolio/graduation-1.jpg',
      duration: '5:30',
      location: 'University of Jaffna',
      category: 'graduation',
      isFeatured: true,
      views: 8900,
      tags: ['graduation', 'celebration', 'academic'],
    },
    {
      title: 'Aarav & Maya – Engagement Story',
      slug: 'aarav-maya-engagement-story',
      description: 'A beautiful engagement story told through cinematic storytelling at Nallur Temple.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'YOUTUBE' as const,
      posterUrl: '/images/portfolio/engagement-1.jpg',
      duration: '6:15',
      location: 'Nallur Temple, Jaffna',
      category: 'engagement',
      isFeatured: true,
      views: 15600,
      tags: ['romantic', 'temple', 'engagement'],
    },
    {
      title: 'Traditional Wedding Ceremony – Colombo',
      slug: 'traditional-wedding-colombo',
      description: 'A grand traditional wedding ceremony captured with artistic excellence in Colombo.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'YOUTUBE' as const,
      posterUrl: '/images/portfolio/wedding-2.jpg',
      duration: '12:20',
      location: 'Colombo, Sri Lanka',
      category: 'wedding',
      isFeatured: false,
      views: 18900,
      tags: ['traditional', 'indoor', 'ceremony'],
    },
    {
      title: 'Medical School Graduation – Jaffna',
      slug: 'medical-school-graduation-jaffna',
      description: 'Celebrating the achievement of medical school graduation with heartfelt moments.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'YOUTUBE' as const,
      posterUrl: '/images/portfolio/graduation-2.jpg',
      duration: '4:45',
      location: 'Jaffna Medical College',
      category: 'graduation',
      isFeatured: false,
      views: 11200,
      tags: ['medical', 'graduation', 'achievement'],
    },
  ];
  for (const f of films) {
    await prisma.film.upsert({
      where: { slug: f.slug },
      update: {},
      create: { ...f, tags: f.tags },
    });
  }

  // Blog posts
  const posts = [
    {
      title: '10 Tips for a Perfect Wedding Photography Session',
      slug: 'tips-for-perfect-wedding-photography',
      excerpt: 'From golden hour timing to candid moments — here are our top tips to ensure your wedding photos are truly extraordinary.',
      content: `## Setting the Stage

Wedding photography is as much about preparation as it is about the moment itself. Here are our top 10 tips from years of experience capturing love stories across Sri Lanka.

### 1. Choose the Right Time of Day
Golden hour — the hour after sunrise and before sunset — produces the most flattering, cinematic light. Schedule your portraits around these windows.

### 2. Scout Your Location
Visit your ceremony and reception venues before the big day. Identify the best angles, natural light sources, and hidden spots for intimate portraits.

### 3. Communicate Your Vision
Share inspiration boards and key moments with your photographer. The more they understand your aesthetic, the better they can capture it.

### 4. Plan for Candid Moments
The most treasured photos are often unplanned — a laugh, a tear, a quiet glance. Give your photographer the freedom to move around and capture these.

### 5. Trust the Process
Relax and be present. The best expressions come when you're not thinking about the camera.

### 6. Include Detail Shots
Rings, flowers, invitations, and table settings tell the full story of your day.

### 7. Keep the Timeline Flexible
Build buffer time into your schedule. Rushed photography shows.

### 8. Consider a Second Shooter
Two photographers means no moment is missed, especially during the ceremony and reception.

### 9. Print Your Favourites
Digital files are wonderful, but printed photos on your walls become family heirlooms.

### 10. Choose Experience Over Price
Your wedding photos are the one thing that lasts forever. Invest in a photographer whose work genuinely moves you.`,
      featuredImage: '/images/blog/wedding-tips.jpg',
      tags: ['wedding', 'photography', 'tips'],
      category: 'Wedding Tips',
      author: 'Keerththikan',
      readTime: 5,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-11-15'),
      views: 2340,
    },
    {
      title: 'Behind the Lens: Capturing Candid Love Stories',
      slug: 'behind-the-lens-candid-love-stories',
      excerpt: 'Candid photography is the art of capturing genuine emotion without the subject knowing they are being photographed.',
      content: `## The Philosophy of Candid Photography

At Cine Magic Creations, we believe the most powerful images are those where the subjects have forgotten the camera exists entirely.

### What Makes a Photo "Candid"?

A candid photograph captures a genuine, unposed moment. It's the quiet glance between partners during vows, the grandmother wiping a tear, the children stealing sweets from the dessert table.

### Our Approach

We use longer focal lengths to photograph from a distance, allowing couples and families to be completely natural. We become part of the furniture — moving quietly, anticipating moments before they happen.

### The Technical Side

Candid photography in low light (reception halls, evening ceremonies) requires fast lenses with wide apertures. We use f/1.4 and f/1.8 lenses to gather maximum light while maintaining beautiful background blur.

### Why Candid Matters

Decades from now, when you look back at your wedding album, the posed portraits will remind you how you looked. The candid moments will remind you how you *felt*.`,
      featuredImage: '/images/blog/candid-photography.jpg',
      tags: ['photography', 'candid', 'behind-the-scenes'],
      category: 'Behind the Scenes',
      author: 'Keerththikan',
      readTime: 4,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-10-22'),
      views: 1890,
    },
    {
      title: 'Why Cinematic Wedding Films Are Worth Every Rupee',
      slug: 'why-cinematic-wedding-films-worth-it',
      excerpt: 'A wedding film does what no photograph can — it captures movement, voice, music, and emotion in real time.',
      content: `## More Than Moving Pictures

When couples ask us whether they should add a wedding film to their package, our answer is always the same: yes, absolutely.

### What a Film Captures That Photos Cannot

Photographs freeze a single moment beautifully. But a film captures your mother's voice as she blesses you. It captures the music that filled the room as you walked down the aisle. It captures the way your partner looked at you — not just their expression, but the emotion unfolding in real time.

### The Cinematic Difference

Not all wedding videos are created equal. Cinematic films use:
- **Colour grading** — giving your film a consistent, filmic aesthetic
- **Original music** — carefully selected to match the emotion of your story
- **Narrative structure** — telling your day as a cohesive story, not a chronological record
- **Drone footage** — sweeping aerials that put your celebration in context

### Investment and Return

A cinematic wedding film typically ranges from Rs. 50,000 to Rs. 200,000 depending on coverage and complexity. Compared to other wedding expenses, it's the one investment you'll return to again and again throughout your life.

### The Technology

We shoot in 4K with cinema-grade colour profiles, using gimbals for smooth movement and prime lenses for the sharpest, most beautiful images.`,
      featuredImage: '/images/portfolio/wedding-1.jpg',
      tags: ['wedding', 'cinematography', 'films'],
      category: 'Wedding Tips',
      author: 'Keerththikan',
      readTime: 6,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-09-10'),
      views: 3120,
    },
    {
      title: 'Graduation Photography: Capturing a Life Milestone',
      slug: 'graduation-photography-life-milestone',
      excerpt: 'Graduation marks the end of one chapter and the beginning of another. Here is how we ensure the photographs do justice to the moment.',
      content: `## Honouring Achievement

Graduation is one of life's most significant milestones — years of dedication, sacrifice, and hard work crystallised into a single ceremony.

### The Challenge of Graduation Photography

University graduation ceremonies move quickly and are often in challenging light conditions — bright midday sun outdoors, or dim auditorium lighting indoors. Experience and preparation make all the difference.

### What to Expect from a Graduation Session

A professional graduation session typically includes:
- Formal portraits in academic regalia
- Candid ceremony moments (procession, degree conferral, cap toss)
- Family group portraits
- Location portraits on campus

### Styling Tips for Graduates

- Wear your regalia pressed and properly sized
- Choose solid colours under your gown — patterns show through
- Coordinate (but don't match) with family for group photos
- Ladies: wear comfortable shoes you can stand in for 2+ hours

### Making It Yours

Beyond the standard portraits, think about what made your university experience unique. A favourite study spot, a professor who changed your trajectory, your closest friends — these details make for photographs with real meaning.`,
      featuredImage: '/images/portfolio/graduation-1.jpg',
      tags: ['graduation', 'photography', 'milestone'],
      category: 'Photography',
      author: 'Keerththikan',
      readTime: 4,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-08-05'),
      views: 1560,
    },
    {
      title: 'Engagement Photography Locations in Jaffna',
      slug: 'engagement-photography-locations-jaffna',
      excerpt: 'Jaffna offers some of the most dramatic and culturally rich backdrops for engagement photography in Sri Lanka.',
      content: `## Jaffna's Hidden Photography Gems

Jaffna is a city of contrasts — ancient temples beside colonial fortresses, emerald lagoons beside ochre earth. For engagement photography, it offers backdrops that are impossible to replicate anywhere else in Sri Lanka.

### Our Top Locations

**Nallur Kandaswamy Temple**
The golden gopuram against a blue sky creates an instantly iconic image. Golden hour here is extraordinary.

**Jaffna Fort**
Dutch colonial architecture with sweeping lagoon views. Perfect for couples who want a dramatic, historical setting.

**Casuarina Beach**
The northernmost beach in Sri Lanka — shallow turquoise water and white sand with almost no crowds.

**Point Pedro Lighthouse**
The northernmost point of Sri Lanka. Windswept and romantic, with incredible ocean views.

**Jaffna Library Gardens**
A more intimate location with lush greenery and elegant architecture.

### Planning Your Session

We recommend scheduling engagement sessions 2–3 months before the wedding. This gives you time to:
- Build comfort in front of the camera
- Use the images for wedding invitations and save-the-dates
- Experience working with your photographer before the wedding day`,
      featuredImage: '/images/portfolio/engagement-1.jpg',
      tags: ['engagement', 'jaffna', 'locations'],
      category: 'Photography',
      author: 'Keerththikan',
      readTime: 5,
      status: 'DRAFT' as const,
      publishedAt: null,
      views: 0,
    },
  ];
  for (const p of posts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, tags: p.tags },
    });
  }

  // Testimonials
  const testimonials = [
    {
      clientName: 'Thiven & Nethra',
      eventType: 'Destination Wedding',
      quote: 'Every frame felt like a dream. The cinematic storytelling left us speechless. Keerththikan captured emotions we didn\'t even know we were feeling.',
      rating: 5,
      location: 'Jaffna, Sri Lanka',
      isFeatured: true,
    },
    {
      clientName: 'Aarav & Maya',
      eventType: 'Engagement Session',
      quote: 'From the direction to the lighting — pure artistry. Our families are obsessed with the photos. Worth every single rupee.',
      rating: 5,
      location: 'Nallur Temple',
      isFeatured: true,
    },
    {
      clientName: 'Kavitha & Raj',
      eventType: 'Traditional Wedding',
      quote: 'The wedding film made us cry all over again. It captured moments we didn\'t even notice on the day. Absolutely magical work.',
      rating: 5,
      location: 'Colombo',
      isFeatured: true,
    },
    {
      clientName: 'Niroshan Krishnamoorthy',
      eventType: 'Graduation Photography',
      quote: 'My parents were moved to tears looking at the graduation portraits. Professional, patient, and incredibly talented.',
      rating: 5,
      location: 'University of Jaffna',
      isFeatured: true,
    },
  ];
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { clientName: t.clientName } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  // Site settings
  const settings = [
    { key: 'site_name', value: 'Cine Magic Creations' },
    { key: 'site_tagline', value: 'Capturing Love, Stories, and Moments in Jaffna & Beyond' },
    { key: 'business_phone', value: '+94 77 621 6556' },
    { key: 'business_email', value: 'info@cinemagiccreations.com' },
    { key: 'business_address', value: 'Jaffna, Sri Lanka' },
    { key: 'instagram_url', value: 'https://instagram.com/cine_magic_creations' },
    { key: 'facebook_url', value: '' },
    { key: 'whatsapp_number', value: '+94776216556' },
    { key: 'booking_open', value: true },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value as string | boolean },
    });
  }

  console.log('✅ Seed complete');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
