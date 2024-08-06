# Deskripsi
Data grid merupakan component yang digunakan untuk menyajikan data dalam bentuk table. Component ini umumya memuat fitur-fitur yang mendukung untuk mengelola data-data tersebut. 

# Motivasi
Data grid component selalu unik, namun tidak untuk semua kasus. Terdapat kasus penggunaan dimana component digunakan secara berulang diberbagai tempat pada aplikasi dengan style (theme) dan fungsionalitas (fitur) yang sama. Perbedaan utama nya hanya terletak pada bentuk column dan data yang diteruskan pada component tersebut.

Karena pendefinisian component yang tidak mudah (memerlukan banyak konfigurasi) dan perlu diterapkan secara berulang, ini dapat menghambat pengembangan aplikasi. Untuk menghindari masalah ini, diperlukan component data grid yang lebih modular. Proses ini juga dapat disebut sebagai DRY (Don't Repeat Yourself).

# Pendekatan (Methodology)
Component dapat disusun dengan pengklasifikasian berdasarkan tujuan, design, atau nama vendor. Untuk proses pembangunannya, ini terdiri dari 3 langkah utama : 

1. Mengidentifikasi fitur atau bagian pada table.
2. Memecah component menjadi beberapa component presentational (low-level).
3. Menyusun template component dari low-level component (high-level).

Contoh penerapan dalam bentuk struktur folder : 

```plaintext
.
└── nama-component/
    ├── index.tsx
    ├── template.tsx
    ├── template.test.tsx
    ├── parts.tsx
    ├── theme.ts
    ├── context.ts
    ├── preview.png
    ├── preview-detail.png
    └── docs.md

```

- `index.tsx` (required)
  Digunakan sebagai pintu utama pengimporan & ekspor component-component data grid.

- `template.tsx` (required) 
  Digunakan untuk menyusun component template (high-level).

- `template.test.tsx` (required) 
  Digunakan untuk integration testing pada component template.

- `parts.tsx` (optional)
  Digunakan untuk menyusun component presentational (low-level). File ini dapat diganti menjadi file-file yang lebih kecil. Tujuan utama dari file-file ini hanyalah agar dapat digunakan didalam file `template.tsx`.

- `theme.ts` (optional)
  Digunakan untuk mendefinsikan style tema component. Umumnya diterapkan dengan tailwind-variants.

- `context.ts` (optional)
  Digunakan untuk mendefiniskan context component. Ini dilakukan jika component data grid besar dan memerlukan state management dengan context / third-party library.

- `preview` (required)
  Gambar yang digunakan untuk tampilan awal component. ini dapat digunakan sebagai tambahan dokumentasi.

- `docs.md` (required)
  File dokumentasi secara detail.