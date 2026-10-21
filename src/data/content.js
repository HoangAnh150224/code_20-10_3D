// Toàn bộ nội dung có thể thay ở đây.
// Ảnh thật: điền `image: '/photos/me.jpg'` (đặt file trong /public/photos).
// Khi `image` trống, khung sẽ hiển thị một tác phẩm hoa vẽ bằng SVG tương ứng.

export const honorees = [
  {
    name: 'Mẹ',
    role: 'Người sinh thành',
    quote: 'Người dạy con yêu thương trước khi dạy con nói.',
    image: '',
    flower: { label: 'Hoa sen', shape: 'pointed', count: 8, layers: 3, len: 190, width: 70, petal: ['#e98ea6', '#FFF7F0'], bg: ['#2a0812', '#771C32'], center: '#D9B77A' },
  },
  {
    name: 'Bà',
    role: 'Người giữ lửa',
    quote: 'Mái tóc bạc là cả một đời vun vén cho con cháu.',
    image: '',
    flower: { label: 'Hoa cúc', shape: 'thin', count: 22, layers: 3, len: 200, width: 24, petal: ['#b88a4a', '#fff1d6'], bg: ['#170E1B', '#4a2338'], center: '#c98f2e' },
  },
  {
    name: 'Cô giáo',
    role: 'Người gieo chữ',
    quote: 'Gieo chữ, gieo cả những ước mơ đầu đời.',
    image: '',
    flower: { label: 'Hoa mai', shape: 'round', count: 5, layers: 2, len: 170, width: 82, petal: ['#d9a12c', '#fff3c4'], bg: ['#2b0d18', '#771C32'], center: '#a8541d' },
  },
  {
    name: 'Chị',
    role: 'Người đồng hành',
    quote: 'Bờ vai vững vàng của những ngày chông chênh.',
    image: '',
    flower: { label: 'Hoa đào', shape: 'round', count: 5, layers: 2, len: 176, width: 88, petal: ['#d9607f', '#ffe3ea'], bg: ['#1d0f1f', '#5a1a33'], center: '#771C32' },
  },
  {
    name: 'Em',
    role: 'Người thương',
    quote: 'Dịu dàng là cách em làm thế giới đẹp hơn.',
    image: '',
    flower: { label: 'Hoa hồng', shape: 'round', count: 7, layers: 4, len: 200, width: 92, petal: ['#771C32', '#F4B8C7'], bg: ['#120910', '#3a1020'], center: '#D9B77A' },
  },
  {
    name: 'Đồng nghiệp',
    role: 'Người cộng sự',
    quote: 'Bản lĩnh, tận tâm và luôn rạng rỡ.',
    image: '',
    flower: { label: 'Hoa lan', shape: 'pointed', count: 6, layers: 2, len: 200, width: 62, petal: ['#9a6bb3', '#f6e9ff'], bg: ['#170E1B', '#40204a'], center: '#F4B8C7' },
  },
]

export const story = [
  {
    key: 'st-1',
    numeral: 'I',
    eyebrow: 'Sự dịu dàng',
    title: 'Mềm như dải lụa',
    body: 'Họ ôm lấy những ngày bình yên bằng tình yêu thương không ồn ào — nhưng ở lại mãi.',
  },
  {
    key: 'st-2',
    numeral: 'II',
    eyebrow: 'Sự mạnh mẽ',
    title: 'Vững như tre',
    body: 'Bản lĩnh gánh vác, kiên cường bước qua giông bão — và vẫn mỉm cười.',
  },
  {
    key: 'st-3',
    numeral: 'III',
    eyebrow: 'Sự tỏa sáng',
    title: 'Rạng rỡ theo cách riêng',
    body: 'Mỗi người một sắc hương, cùng nhau làm nên mùa hoa của cuộc đời.',
  },
]

// Lời chúc chia theo từng dòng để reveal tuần tự.
export const wish = {
  heading: 'Gửi những người phụ nữ tuyệt vời,',
  top: ['Có những vẻ đẹp không nằm ở ánh hào quang,', 'mà nằm trong sự dịu dàng, bản lĩnh', 'và yêu thương mỗi ngày.'],
  bottom: [
    'Nhân ngày Phụ nữ Việt Nam 20/10,',
    'xin gửi những lời chúc tốt đẹp nhất',
    'đến những người phụ nữ tuyệt vời.',
    'Chúc một nửa thế giới luôn được yêu thương, trân trọng',
    'và tự tin tỏa sáng theo cách riêng của mình.',
  ],
  signature: '— Với tất cả yêu thương · 20.10',
}

export const chapters = [
  { label: 'Thức tỉnh', en: 'The Awakening', jump: 0 },
  { label: 'Vẻ đẹp', en: 'The Beauty Reveal', jump: 0.33 },
  { label: 'Câu chuyện', en: 'The Story of Her', jump: 0.47 },
  { label: 'Lời chúc', en: 'Words from the Heart', jump: 0.79 },
  { label: 'Vĩ thanh', en: 'The Grand Finale', jump: 0.995 },
]
