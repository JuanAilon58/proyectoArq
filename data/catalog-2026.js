/* Revisión editorial: 2026-10-09. Fuentes oficiales por ficha; precios GTQ pendientes.
 * Las gamas son una clasificación editorial de uso, nunca un ranking por precio.
 * El catálogo académico original conserva sus IDs y su condición de referencia. */
(function (DB) {
  "use strict";
  var labels = {
    procesadores: "CPU de escritorio",
    graficas: "GPU de escritorio",
    ram: "Memoria DDR5",
    almacenamiento: "SSD NVMe interno",
    motherboards: "Tarjetas madre",
    fuentes: "Fuentes ATX",
    refrigeracion: "Refrigeración",
    gabinetes: "Gabinetes",
    monitores: "Monitores",
    smartphones: "Smartphones",
    audifonos: "Audífonos de diadema",
    tecnologia: "Dispositivos",
  };
  DB.PRODUCTS.forEach(function (p) {
    p.range = p.range || "media";
    p.comparisonGroup = p.category;
    p.comparisonLabel =
      labels[p.category] ||
      DB.CATEGORIES.filter(function (c) {
        return c.id === p.category;
      })[0].label;
    p.dataStatus = "reference";
    p.priceStatus = "reference";
    p.verifiedAt = null;
    p.releaseYear = null;
    p.sources = [];
    p.imageKind = "illustrative";
    p.lifecycle = "reference";
  });
  // Grupos explícitos: impiden mezclar funciones diferentes dentro de una subcategoría.
  function group(ids, key, label, range) {
    ids.forEach(function (id) {
      var p = DB.PRODUCTS.filter(function (item) {
        return item.id === id;
      })[0];
      if (p) {
        p.comparisonGroup = key;
        p.comparisonLabel = label;
        if (range) p.range = range;
      }
    });
  }
  group([1, 3], "desktop-cpu", "CPU de escritorio", "media");
  group([2, 4], "desktop-cpu", "CPU de escritorio", "alta");
  group([5, 7], "desktop-gpu", "GPU de escritorio", "media");
  group([6, 8], "desktop-gpu", "GPU de escritorio", "alta");
  group([9], "ddr5-kit", "Memoria DDR5", "media");
  group([10, 12], "ddr5-kit", "Memoria DDR5", "alta");
  group([11], "ddr4-kit", "Memoria DDR4", "media");
  group([13, 14], "nvme-ssd", "SSD NVMe interno", "alta");
  group([15], "sata-ssd", "SSD SATA interno", "media");
  group([16, 166], "desktop-hdd", "Discos HDD internos", "media");
  group([165], "portable-ssd", "SSD portátil", "alta");
  group([18], "intel-lga1700-board", "Placas LGA1700", "media");
  group([17, 20], "amd-am5-board", "Placas AM5", "alta");
  group([19], "amd-am4-board", "Placas AM4", "media");
  group([25], "tower-air-cooler", "Disipadores por aire", "media");
  group([26, 27], "aio-liquid-cooler", "Refrigeración líquida AIO", "alta");
  group([48, 49], "usb-microphone", "Micrófonos USB", "media");
  group([160], "xlr-microphone", "Micrófonos XLR", "alta");
  group([159], "lavalier-microphone", "Micrófonos de solapa", "baja");
  group(
    [50, 52, 53],
    "portable-speaker",
    "Bocinas Bluetooth portátiles",
    "media",
  );
  group([51, 161], "desktop-speakers", "Bocinas de escritorio", "media");
  group([162], "soundbar", "Barras de sonido", "media");
  group([54], "anc-overear", "Diadema con cancelación de ruido", "alta");
  group([55], "wireless-on-ear", "Diadema inalámbrica", "baja");
  group([56], "gaming-headset", "Headsets para gaming", "media");
  group([57], "anc-earbuds", "Auriculares con cancelación", "alta");
  group([58, 59], "smartphone", "Smartphones", "baja");
  group([60, 61], "smartphone", "Smartphones", "media");
  group([62, 63], "smartphone", "Smartphones", "alta");
  group([64], "hdmi-cable", "Cables HDMI", "media");
  group([65, 164], "usb-c-charge-cable", "Cables USB-C de carga", "media");
  group([66], "dp-cable", "Cables DisplayPort", "media");
  group([67, 163], "ethernet-cable", "Cables Ethernet", "media");
  group([68], "lightning-cable", "Cables Lightning", "media");
  group([69], "sata-cable", "Cables SATA", "media");
  group([70], "smartwatch", "Relojes inteligentes", "media");
  group([71], "tablet", "Tablets", "baja");
  group([72], "powerbank", "Baterías portátiles", "media");
  group([73], "router", "Routers Wi-Fi", "media");
  group([74], "usb-memory", "Memorias USB", "media");
  group([75], "micro-sd", "Tarjetas microSD", "media");
  group([76], "analog-mixer", "Mezcladoras analógicas", "media");
  group([77], "audio-interface", "Interfaces de audio", "alta");
  group([78], "podcast-mixer", "Mezcladoras para podcast", "media");
  group([79], "usb-dac", "DAC USB", "alta");
  group([80], "pcie-sound", "Tarjetas de sonido PCIe", "media");
  group([84], "usb-hub", "Hubs USB-C", "media");
  group([85, 86], "video-adapter", "Adaptadores de video", "media");
  group([87], "ethernet-adapter", "Adaptadores Ethernet", "media");
  group([88], "mesh-router", "Routers mesh", "media");
  group([89], "ethernet-switch", "Switches Ethernet", "media");
  group([90], "wifi-extender", "Extensores Wi-Fi", "media");
  group([91], "wifi-access-point", "Puntos de acceso", "alta");
  group([92], "nas", "NAS", "media");
  group([93], "server", "Servidores", "alta");
  group([94], "mirrorless-camera", "Cámaras sin espejo", "media");
  group([95], "compact-camera", "Cámaras compactas", "media");
  group([96], "dslr-camera", "Cámaras réflex", "media");
  group([102], "phone-gimbal", "Estabilizadores para teléfono", "media");
  group([103], "camera-gimbal", "Estabilizadores para cámara", "alta");
  group([111], "laser-printer", "Impresoras láser", "media");
  group([112, 113], "tank-printer", "Impresoras de tanque", "media");
  group([116], "smart-bulb", "Bombillas inteligentes", "media");
  group([117], "led-strip", "Tiras LED", "media");
  group([118], "desk-light", "Lámparas de escritorio", "media");
  group([126], "ac-ups", "UPS para equipos", "media");
  group([127], "rechargeable-batteries", "Pilas recargables", "media");
  group([128], "dc-ups", "UPS DC para red", "media");
  group([135], "micro-sd", "Tarjetas microSD", "media");
  group([136], "sd-card", "Tarjetas SD", "media");
  group([137], "memory-stick", "Memory Stick", "media");
  group([143], "camera-glasses", "Lentes con cámara", "alta");
  group([144], "display-glasses", "Lentes con pantalla", "alta");
  group([145, 147], "standalone-vr", "Visores VR autónomos", "media");
  group([146], "console-vr", "Visores VR para consola", "alta");
  group([150, 152], "home-console", "Consolas de sobremesa", "media");
  group([151], "hybrid-console", "Consolas híbridas", "media");
  group([153], "educational-robot", "Robots educativos", "media");
  group([154], "robot-vacuum", "Aspiradoras robot", "media");
  group([155], "toy-robot", "Robots de juguete", "media");
  group([156], "dvd-media", "Discos DVD", "baja");
  group([157], "bluray-media", "Discos Blu-ray", "media");
  group([158], "optical-reader", "Lectores ópticos", "media");
  DB.CATEGORIES.push(
    {
      id: "laptops",
      label: "Laptops",
      group: "Computación portátil",
      desc: "Equipos portátiles: plataforma, pantalla, memoria y conectividad.",
    },
    {
      id: "tablets",
      label: "Tablets",
      group: "Computación portátil",
      desc: "Tablets para apuntes, dibujo, lectura y trabajo móvil.",
    },
  );
  var SOURCE = {
    samsungA: "https://www.samsung.com/us/support/answer/ANS10010489/",
    samsungS:
      "https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2026_1Q_Interim_Report.pdf",
    pixel: "https://support.google.com/pixelphone/answer/7158570?hl=es",
    redmi: "https://www.mi.com/mx/product/redmi-15c/specs/",
    iphoneE:
      "https://www.apple.com/newsroom/2026/03/apple-introduces-iphone-17e/",
    iphonePro: "https://support.apple.com/en-us/125090",
    iphone18:
      "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/",
    watchApple:
      "https://www.apple.com/newsroom/2026/09/introducing-apple-watch-series-12-with-the-all-new-health-sensing-system/",
    watchSamsung:
      "https://news.samsung.com/us/samsung-whats-new-galaxy-watch9/",
    amdCPU: "https://www.amd.com/en/products/processors/desktops/ryzen.html",
    amd2026:
      "https://newsroom.amd.com/news/amd-expands-ai-leadership-across-client-graphics/",
    intel:
      "https://www.intel.com/content/www/us/en/newsroom/news/client-computing/intel-announces-new-intel-core-ultra-200s-plus-series-desktop-processors.html",
    intelSpecs:
      "https://cdrdv2-public.intel.com/844360/Intel-Core-Desktop-Boxed-Processors-HD-GFX-List.pdf",
    nvidia5070:
      "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/",
    nvidia5060:
      "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/",
    radeon9070:
      "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html",
    radeon9060:
      "https://www.amd.com/content/dam/amd/en/documents/products/processors/consumer/radeon-rx-9060-xt-graphics-hts-competitive.pdf",
    mac: "https://www.apple.com/newsroom/2026/03/apple-introduces-the-new-macbook-air-with-m5/",
    asus: "https://www.asus.com/laptops/for-home/zenbook/asus-zenbook-a16-ux3607/techspec/",
    ipad: "https://www.apple.com/newsroom/2026/03/apple-introduces-the-new-ipad-air-powered-by-m4/",
    tab: "https://www.samsung.com/latin/tablets/galaxy-tab-s/galaxy-tab-s11-gray-128gb-sm-x730nzaagto/",
    sony: "https://www.sony.com/electronics/support/wireless-headphones-bluetooth-headphones/wh-1000xm6/specifications",
    bose: "https://support.bose.com/s/article/product-specifications-bose-quietcomfort-ultra-headphones-2nd-gen",
  };
  function V(
    id,
    category,
    brand,
    model,
    range,
    year,
    sourceKeys,
    specs,
    notes,
    metrics,
    image,
    groupKey,
    groupLabel,
  ) {
    return {
      id: id,
      category: category,
      brand: brand,
      model: model,
      range: range,
      releaseYear: year,
      comparisonGroup: groupKey,
      comparisonLabel: groupLabel,
      price: null,
      currency: "GTQ",
      priceStatus: "pending",
      dataStatus: "verified",
      demo: false,
      verifiedAt: "2026-10-09",
      lifecycle: "current",
      imageKind: "illustrative",
      image: "assets/images/products/" + (image || 3766218) + ".jpg",
      specifications: specs,
      highlights: notes,
      metrics: metrics || {},
      sources: sourceKeys.map(function (key) {
        return { label: brand + " · documentación oficial", url: SOURCE[key] };
      }),
      reference:
        "Especificaciones seleccionadas contrastadas con documentación del fabricante. La disponibilidad y las variantes en Guatemala deben comprobarse por separado.",
      limitations: [
        "Precio y disponibilidad local pendientes de verificación.",
      ],
    };
  }
  var additions = [
    V(
      201,
      "smartphones",
      "Samsung",
      "Galaxy A17 5G · 4/128 GB",
      "baja",
      null,
      ["samsungA"],
      {
        Pantalla: "6.7 pulgadas · Super AMOLED",
        "Frecuencia de pantalla": "90 Hz",
        RAM: "4 GB",
        Almacenamiento: "128 GB",
        Batería: "5000 mAh",
        "Carga por cable": "25 W",
      },
      ["Pantalla AMOLED y expansión microSD."],
      { refreshHz: 90, storageGB: 128 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      202,
      "smartphones",
      "Xiaomi",
      "Redmi 15C · 4/128 GB",
      "baja",
      null,
      ["redmi"],
      {
        Pantalla: "6.9 pulgadas · 1600 × 720",
        "Frecuencia de pantalla": "Hasta 120 Hz",
        Procesador: "MediaTek Helio G81-Ultra",
        RAM: "4 GB",
        Almacenamiento: "128 GB",
        Batería: "6000 mAh",
        "Carga por cable": "33 W",
        "Red móvil": "4G",
      },
      ["Almacenamiento ampliable mediante microSD."],
      { refreshHz: 120, storageGB: 128 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      203,
      "smartphones",
      "Samsung",
      "Galaxy A37 5G · 8/256 GB",
      "media",
      2026,
      ["samsungA"],
      {
        Pantalla: "6.7 pulgadas · Super AMOLED",
        "Frecuencia de pantalla": "120 Hz",
        RAM: "8 GB",
        Almacenamiento: "256 GB",
        Batería: "5000 mAh",
        "Carga por cable": "45 W",
      },
      ["Video 4K a 30 fps; sin expansión microSD."],
      { refreshHz: 120, storageGB: 256 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      204,
      "smartphones",
      "Samsung",
      "Galaxy A57 5G · 8/256 GB",
      "media",
      2026,
      ["samsungA"],
      {
        Pantalla: "6.7 pulgadas · Super AMOLED Plus",
        "Frecuencia de pantalla": "120 Hz",
        RAM: "8 GB",
        Almacenamiento: "256 GB",
        Batería: "5000 mAh",
        "Carga por cable": "45 W",
      },
      ["Cámara ultra gran angular; sin expansión microSD."],
      { refreshHz: 120, storageGB: 256 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      205,
      "smartphones",
      "Google",
      "Pixel 10a · 8/256 GB",
      "media",
      2026,
      ["pixel"],
      {
        Pantalla: "6.3 pulgadas · POLED 1080 × 2424",
        "Frecuencia de pantalla": "60–120 Hz",
        Procesador: "Tensor G4",
        RAM: "8 GB",
        Almacenamiento: "256 GB",
        Batería: "5100 mAh típicos",
        Soporte: "7 años desde disponibilidad inicial",
        Resistencia: "IP68",
      },
      ["Actualizaciones de sistema, seguridad y Pixel Drops durante 7 años."],
      { refreshHz: 120, storageGB: 256 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      206,
      "smartphones",
      "Apple",
      "iPhone 17e · 256 GB",
      "media",
      2026,
      ["iphoneE"],
      {
        Pantalla: "6.1 pulgadas · Super Retina XDR",
        Procesador: "A19",
        Almacenamiento: "256 GB",
        "Cámara principal": "48 MP Fusion",
        "Carga inalámbrica": "MagSafe / Qi2 hasta 15 W",
        Sistema: "iOS 26",
      },
      ["MagSafe y almacenamiento base de 256 GB."],
      { storageGB: 256 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      207,
      "smartphones",
      "Samsung",
      "Galaxy S26 · 256 GB",
      "alta",
      2026,
      ["samsungS"],
      {
        Pantalla: "6.3 pulgadas · FHD+ 2340 × 1080",
        Almacenamiento: "256 GB",
        Procesador: "Snapdragon 8 Elite Gen 5 / Exynos 2600, según región",
        Sistema: "Android 16 · One UI 8.5",
        Peso: "167 g",
      },
      ["Formato compacto dentro de la familia S26."],
      { storageGB: 256, weightG: 167 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      208,
      "smartphones",
      "Samsung",
      "Galaxy S26 Ultra · 256 GB",
      "alta",
      2026,
      ["samsungS"],
      {
        Pantalla: "6.9 pulgadas · QHD+ 3120 × 1440",
        Almacenamiento: "256 GB",
        Sistema: "Android 16 · One UI 8.5",
        Peso: "214 g",
        Grosor: "7.9 mm",
        "Pantalla de privacidad": "Privacy Display",
      },
      ["Pantalla de mayor resolución y función de privacidad."],
      { storageGB: 256, weightG: 214 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      209,
      "smartphones",
      "Apple",
      "iPhone 17 Pro · 256 GB",
      "alta",
      2025,
      ["iphonePro"],
      {
        Pantalla: "6.3 pulgadas · Super Retina XDR",
        "Frecuencia de pantalla": "ProMotion hasta 120 Hz",
        Procesador: "A19 Pro",
        Almacenamiento: "256 GB",
        Puerto: "USB-C",
        "Sistema de cámaras": "Fusion de 48 MP",
      },
      ["Pantalla ProMotion y chip A19 Pro."],
      { refreshHz: 120, storageGB: 256 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      210,
      "procesadores",
      "Intel",
      "Core Ultra 5 250K Plus",
      "media",
      2026,
      ["intel", "intelSpecs"],
      {
        Núcleos: "18 (6 P + 12 E)",
        Hilos: "18",
        "Frecuencia turbo": "Hasta 5.3 GHz",
        Socket: "LGA1851",
        "Memoria compatible": "DDR5 hasta 7200 MT/s",
        "Potencia base": "125 W",
      },
      ["Requiere placa LGA1851 y memoria DDR5."],
      {},
      2105927,
      "desktop-cpu",
      "CPU de escritorio",
    ),
    V(
      211,
      "procesadores",
      "AMD",
      "Ryzen 5 9600X",
      "media",
      2024,
      ["amdCPU"],
      {
        Núcleos: "6",
        Hilos: "12",
        "Frecuencia turbo": "Hasta 5.4 GHz",
        Socket: "AM5",
        TDP: "65 W",
        Arquitectura: "Zen 5",
      },
      ["Plataforma AM5; disipador no incluido."],
      {},
      2105927,
      "desktop-cpu",
      "CPU de escritorio",
    ),
    V(
      212,
      "procesadores",
      "Intel",
      "Core Ultra 7 270K Plus",
      "alta",
      2026,
      ["intel", "intelSpecs"],
      {
        Núcleos: "24 (8 P + 16 E)",
        Hilos: "24",
        "Frecuencia turbo": "Hasta 5.5 GHz",
        Socket: "LGA1851",
        "Memoria compatible": "DDR5 hasta 7200 MT/s",
        "Potencia base": "125 W",
      },
      ["Configuración híbrida de núcleos P y E."],
      {},
      2105927,
      "desktop-cpu",
      "CPU de escritorio",
    ),
    V(
      213,
      "procesadores",
      "AMD",
      "Ryzen 7 9850X3D",
      "alta",
      2026,
      ["amd2026"],
      {
        Núcleos: "8",
        Hilos: "16",
        "Frecuencia turbo": "Hasta 5.6 GHz",
        "Caché total": "104 MB",
        TDP: "120 W",
        Familia: "Ryzen 9000X3D",
      },
      ["Caché 3D V-Cache; orientado a equipos de gaming."],
      {},
      2105927,
      "desktop-cpu",
      "CPU de escritorio",
    ),
    V(
      214,
      "procesadores",
      "AMD",
      "Ryzen 7 9700X",
      "alta",
      2024,
      ["amdCPU"],
      {
        Núcleos: "8",
        Hilos: "16",
        "Frecuencia turbo": "Hasta 5.5 GHz",
        Socket: "AM5",
        TDP: "65 W",
        Arquitectura: "Zen 5",
      },
      ["Plataforma AM5; disipador no incluido."],
      {},
      2105927,
      "desktop-cpu",
      "CPU de escritorio",
    ),
    V(
      215,
      "graficas",
      "NVIDIA",
      "GeForce RTX 5060 · 8 GB",
      "media",
      null,
      ["nvidia5060"],
      {
        VRAM: "8 GB",
        "Tipo de memoria": "GDDR7",
        "Interfaz de memoria": "128 bits",
        Arquitectura: "Blackwell",
        Codificación: "AV1",
        Bus: "PCIe 5.0",
      },
      ["Comprueba dimensiones y fuente del modelo ensamblado."],
      { vramGB: 8 },
      33798621,
      "desktop-gpu",
      "GPU de escritorio",
    ),
    V(
      216,
      "graficas",
      "AMD",
      "Radeon RX 9060 XT · 16 GB",
      "media",
      null,
      ["radeon9060"],
      { VRAM: "16 GB", "Tipo de memoria": "GDDR6", Arquitectura: "RDNA 4" },
      ["Variante de 16 GB; no confundir con la de 8 GB."],
      { vramGB: 16 },
      33798621,
      "desktop-gpu",
      "GPU de escritorio",
    ),
    V(
      217,
      "graficas",
      "NVIDIA",
      "GeForce RTX 5060 Ti · 16 GB",
      "media",
      null,
      ["nvidia5060"],
      {
        VRAM: "16 GB",
        "Tipo de memoria": "GDDR7",
        "Interfaz de memoria": "128 bits",
        Arquitectura: "Blackwell",
        Codificación: "AV1",
        Bus: "PCIe 5.0",
      },
      ["Variante de 16 GB; especificaciones físicas según ensamblador."],
      { vramGB: 16 },
      33798621,
      "desktop-gpu",
      "GPU de escritorio",
    ),
    V(
      218,
      "graficas",
      "NVIDIA",
      "GeForce RTX 5070 · 12 GB",
      "alta",
      null,
      ["nvidia5070"],
      {
        VRAM: "12 GB",
        "Tipo de memoria": "GDDR7",
        "Interfaz de memoria": "192 bits",
        Arquitectura: "Blackwell",
        Codificación: "AV1",
        Bus: "PCIe 5.0",
      },
      ["Compara FPS medidos con la misma configuración antes de elegir."],
      { vramGB: 12 },
      33798621,
      "desktop-gpu",
      "GPU de escritorio",
    ),
    V(
      219,
      "graficas",
      "AMD",
      "Radeon RX 9070 · 16 GB",
      "alta",
      null,
      ["radeon9070"],
      {
        VRAM: "16 GB",
        "Tipo de memoria": "GDDR6",
        "Interfaz de memoria": "256 bits",
        "Potencia de tarjeta": "220 W",
        "Fuente mínima recomendada": "650 W",
        Bus: "PCIe 5.0 x16",
      },
      ["AV1 por hardware y salidas DisplayPort 2.1a / HDMI 2.1b."],
      { vramGB: 16 },
      33798621,
      "desktop-gpu",
      "GPU de escritorio",
    ),
    V(
      220,
      "graficas",
      "NVIDIA",
      "GeForce RTX 5070 Ti · 16 GB",
      "alta",
      null,
      ["nvidia5070"],
      {
        VRAM: "16 GB",
        "Tipo de memoria": "GDDR7",
        "Interfaz de memoria": "256 bits",
        Arquitectura: "Blackwell",
        Codificación: "AV1",
        Bus: "PCIe 5.0",
      },
      ["Dimensiones, disipador y conexiones dependen del ensamblador."],
      { vramGB: 16 },
      33798621,
      "desktop-gpu",
      "GPU de escritorio",
    ),
    V(
      221,
      "laptops",
      "Apple",
      "MacBook Air M5 · 13 pulgadas",
      "alta",
      2026,
      ["mac"],
      {
        Pantalla: "13 pulgadas · Liquid Retina",
        Procesador: "Apple M5",
        "Almacenamiento base": "512 GB",
        Conectividad: "Wi-Fi 7 · Bluetooth 6",
        Puertos: "2 × Thunderbolt 4",
        Sistema: "macOS Tahoe",
      },
      [
        "Dos pantallas externas compatibles; configuración de memoria a confirmar.",
      ],
      {},
      12432703,
      "portable-laptop",
      "Laptops de productividad",
    ),
    V(
      222,
      "laptops",
      "ASUS",
      "Zenbook A16 · UX3607OA / X2E96100",
      "alta",
      2026,
      ["asus"],
      {
        Variante: "UX3607OA / X2E96100",
        Plataforma: "Windows en ARM",
        Pantalla: "16 pulgadas OLED",
        Procesador: "Snapdragon X2 Elite Extreme",
        Memoria: "48 GB LPDDR5X",
        Almacenamiento: "1 TB SSD",
      },
      [
        "Verifica la compatibilidad ARM de tus aplicaciones y la configuración regional.",
      ],
      {},
      12432703,
      "portable-laptop",
      "Laptops de productividad",
    ),
    V(
      223,
      "tablets",
      "Apple",
      "iPad Air M4 · 11 pulgadas Wi-Fi",
      "alta",
      2026,
      ["ipad"],
      {
        Pantalla: "11 pulgadas",
        Procesador: "Apple M4",
        "Memoria unificada": "12 GB",
        Conectividad: "Wi-Fi 7 · Bluetooth 6",
        Sistema: "iPadOS 26",
      },
      ["Comprueba accesorios compatibles y almacenamiento de la variante."],
      {},
      3766218,
      "tablet",
      "Tablets de productividad",
    ),
    V(
      224,
      "tablets",
      "Samsung",
      "Galaxy Tab S11 · Wi-Fi 128 GB",
      "alta",
      2025,
      ["tab"],
      {
        Pantalla: "11 pulgadas",
        Almacenamiento: "128 GB",
        Conectividad: "Wi-Fi",
        Lápiz: "Compatible con S Pen",
      },
      ["Verifica qué accesorios incluye el distribuidor local."],
      { storageGB: 128 },
      3766218,
      "tablet",
      "Tablets de productividad",
    ),
    V(
      225,
      "audifonos",
      "Sony",
      "WH-1000XM6",
      "alta",
      null,
      ["sony"],
      {
        Tipo: "Diadema over-ear",
        Conectividad: "Bluetooth 5.3 + cable",
        "Cancelación de ruido": "Activa",
        "Autonomía declarada": "Hasta 30 h con ANC",
        Códecs: "SBC, AAC, LDAC, LC3",
      },
      ["Conexión multipunto y funcionamiento pasivo por cable."],
      {},
      8412316,
      "anc-overear",
      "Diadema con cancelación de ruido",
    ),
    V(
      226,
      "audifonos",
      "Bose",
      "QuietComfort Ultra · 2.ª generación",
      "alta",
      2025,
      ["bose"],
      {
        Tipo: "Diadema over-ear",
        Conectividad: "Bluetooth 5.4",
        "Cancelación de ruido": "Activa",
        "Autonomía declarada": "Hasta 30 h (según modo de uso)",
        "Carga completa": "3 horas",
      },
      ["La duración cambia con las funciones de audio activas."],
      {},
      8412316,
      "anc-overear",
      "Diadema con cancelación de ruido",
    ),
    V(
      227,
      "smartphones",
      "Apple",
      "iPhone 18 Pro · 256 GB",
      "alta",
      2026,
      ["iphone18"],
      {
        Procesador: "A20 Pro",
        Almacenamiento: "256 GB",
        "Cámara principal": "48 MP Fusion con apertura variable",
        Sistema: "iOS 27",
        Refrigeración: "Cámara de vapor",
      },
      [
        "Apertura variable en la cámara principal; verifica disponibilidad regional de funciones.",
      ],
      { storageGB: 256 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      228,
      "smartphones",
      "Apple",
      "iPhone 18 Pro Max · 256 GB",
      "alta",
      2026,
      ["iphone18"],
      {
        Procesador: "A20 Pro",
        Almacenamiento: "256 GB",
        "Cámara principal": "48 MP Fusion con apertura variable",
        Sistema: "iOS 27",
        Refrigeración: "Cámara de vapor",
      },
      ["Compara tamaño y pruebas de autonomía con el Pro antes de elegir."],
      { storageGB: 256 },
      3766218,
      "smartphone",
      "Smartphones",
    ),
    V(
      229,
      "smartwatch",
      "Apple",
      "Watch Series 12 · aluminio",
      "alta",
      2026,
      ["watchApple"],
      {
        Procesador: "Apple S11",
        Sistema: "watchOS 27",
        "Material de caja": "Aluminio",
        Sensores: "Health Sensing System",
      },
      [
        "Comprueba requisitos del iPhone, tamaño de caja y variante GPS o Cellular.",
      ],
      {},
      3766218,
      "smartwatch",
      "Relojes inteligentes",
    ),
    V(
      230,
      "smartwatch",
      "Samsung",
      "Galaxy Watch9 · 40 mm",
      "alta",
      2026,
      ["watchSamsung"],
      {
        Caja: "40 mm",
        Procesador: "Snapdragon Wear Elite",
        Batería: "390 mAh",
        Funciones: "Vitals y Raise to Talk",
      },
      ["Verifica teléfono compatible y disponibilidad regional de funciones."],
      {},
      3766218,
      "smartwatch",
      "Relojes inteligentes",
    ),
  ];
  additions.filter(function (p) {
    return p.id === 209;
  })[0].lifecycle = "previous";
  // Las imágenes son fotografías editoriales del proyecto, no fotografías oficiales del modelo.
  additions.forEach(function (p) {
    DB.PRODUCTS.push(p);
  });
  var photos = [
    {
      id: 204,
      file: "galaxy-a57.jpg",
      author: "OGCWiki",
      source:
        "https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_A57_5G.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      id: 207,
      file: "galaxy-s26.jpg",
      author: "Kyu3a",
      source: "https://commons.wikimedia.org/wiki/File:Galaxy_S26.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    {
      id: 209,
      file: "iphone-17-pro.jpg",
      author: "AzureSaturn",
      source:
        "https://commons.wikimedia.org/wiki/File:IPhone_17_Pro_(Silver)_-_Backside.jpg",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  ];
  photos.forEach(function (photo) {
    var p = DB.PRODUCTS.filter(function (item) {
      return item.id === photo.id;
    })[0];
    p.image = "assets/images/verified/" + photo.file;
    p.imageKind = "exact";
    p.imageCredit = photo;
  });
  DB.IMAGE_CREDITS = photos;
  var laptopPhoto = {
    file: "laptop-editorial.jpg",
    author: "Lisa Fotios",
    source:
      "https://www.pexels.com/photo/laptop-computer-on-brown-wooden-desk-1263558/",
    license: "Pexels",
    licenseUrl: "https://www.pexels.com/license/",
  };
  [221, 222].forEach(function (id) {
    var p = DB.PRODUCTS.filter(function (item) {
      return item.id === id;
    })[0];
    p.image = "assets/images/verified/laptop-editorial.jpg";
    p.imageCredit = laptopPhoto;
  });
  DB.IMAGE_CREDITS.push(laptopPhoto);
  [229, 230].forEach(function (id) {
    DB.PRODUCTS.filter(function (p) {
      return p.id === id;
    })[0].image = DB.PRODUCTS.filter(function (p) {
      return p.id === 138;
    })[0].image;
  });
  DB.REVISION = {
    date: "2026-10-09",
    label: "Edición 2026",
    verifiedProducts: additions.length,
  };
})(window.TECHALBUM_DATA);
