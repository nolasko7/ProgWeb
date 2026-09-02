const products = [
    // --- Bebidas ---
    {
        id: 1,
        category: "Bebidas",
        name: "Whisky Jack Daniels Honey 750ml",
        price: 19900,
        image: "https://cdn.awsli.com.br/2500x2500/2148/2148460/produto/137280811/42ceca746f.jpg",
        description: "Un verdaderamente fabuloso licor de whisky Jack Daniel's. Hecho con una mezcla de ricas especias y suave miel tersa. Delicioso sobre hielo o café.\nAroma de caramelo, roble carbonizado y vainilla.\nBoca cremosa con notas de roble tostado y miel."
    },
    {
        id: 2,
        category: "Bebidas",
        name: "Vino Malbec Reserva 750ml",
        price: 8500,
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
        description: "Vino tinto Malbec de gran cuerpo y estructura. Notas a frutos rojos maduros, ciruela y un toque sutil de vainilla aportado por su paso por barrica de roble."
    },
    {
        id: 3,
        category: "Bebidas",
        name: "Gin Premium Artesanal 700ml",
        price: 14200,
        image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=80",
        description: "Destilado con una cuidada selección de 10 botánicos naturales. Ideal para preparar el mejor Gin Tonic con toques cítricos y refrescantes."
    },

    // --- Electronica ---
    {
        id: 4,
        category: "Electronica",
        name: "Notebook Lenovo ThinkPad 14\"",
        price: 249999,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
        description: "Potente notebook orientada a productividad y rendimiento. Cuenta con procesador de última generación, 16GB de memoria RAM y disco SSD ultra rápido de 512GB."
    },
    {
        id: 5,
        category: "Electronica",
        name: "Smart TV Samsung 55\" 4K UHD",
        price: 189999,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
        description: "Disfruta de colores vibrantes y detalles asombrosos con resolución 4K. Compatible con las principales plataformas de streaming y control por voz."
    },
    {
        id: 6,
        category: "Electronica",
        name: "Smartphone Xiaomi Redmi 128GB",
        price: 99999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        description: "Excelente rendimiento y autonomía gracias a su batería de 5000mAh. Cámara triple con sensor principal de alta resolución y pantalla fluida de 90Hz."
    },
    {
        id: 7,
        category: "Electronica",
        name: "Auriculares Inalámbricos Bluetooth",
        price: 34500,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        description: "Cancelación activa de ruido, sonido de alta fidelidad y hasta 30 horas de batería con estuche de carga rápida. Almohadillas ergonómicas ultra cómodas."
    },

    // --- Alimentos ---
    {
        id: 8,
        category: "Alimentos",
        name: "Café de Especialidad en Grano 500g",
        price: 6800,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
        description: "Granos seleccionados 100% arábica de origen colombiano. Tueste medio con notas a chocolate, caramelo y sutil acidez cítrica."
    },
    {
        id: 9,
        category: "Alimentos",
        name: "Chocolate Amargo 70% Cacao 100g",
        price: 3200,
        image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80",
        description: "Tableta de chocolate amargo gourmet elaborado con granos de cacao fino de aroma. Textura suave y sabor intenso."
    },
    {
        id: 10,
        category: "Alimentos",
        name: "Aceite de Oliva Extra Virgen 500ml",
        price: 5400,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
        description: "Primera prensada en frío. Sabor frutado equilibrado con ligero picor final, ideal para ensaladas y preparaciones mediterráneas."
    },

    // --- Automotor ---
    {
        id: 11,
        category: "Automotor",
        name: "Kit de Limpieza y Cuidado Automotriz",
        price: 15900,
        image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&auto=format&fit=crop&q=80",
        description: "Incluye shampoo siliconado, cera líquida protectora, limpiador de interiores, revividor de neumáticos y paño de microfibra de alta densidad."
    },
    {
        id: 12,
        category: "Automotor",
        name: "Compresor de Aire Portátil 12V",
        price: 21500,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80",
        description: "Inflador digital portátil con conexión para encendedor de auto. Pantalla LCD con medición de presión en PSI y apagado automático."
    },

    // --- Hogar ---
    {
        id: 13,
        category: "Hogar",
        name: "Cafetera Espresso Automática",
        price: 89000,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
        description: "Bomba de 15 bares de presión para un café con crema perfecta. Vaporizador integrado para espumar leche y preparar cappuccinos irresistibles."
    },
    {
        id: 14,
        category: "Hogar",
        name: "Lámpara de Escritorio LED Inteligente",
        price: 12400,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
        description: "Regulación de temperatura de color y brillo táctil. Brazo articulado flexible y puerto de carga USB integrado en la base."
    },

    // --- Indumentaria ---
    {
        id: 15,
        category: "Indumentaria",
        name: "Zapatillas Deportivas Urbanas",
        price: 45900,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        description: "Diseño ergonómico y liviano para máximo confort diario. Suela de amortiguación reforzada y tela respirable."
    },
    {
        id: 16,
        category: "Indumentaria",
        name: "Buzo Hoodie Algodón Oversize",
        price: 22000,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
        description: "Confeccionado en 100% algodón frizado de máxima suavidad y abrigo. Capucha amplia con cordones ajustables y bolsillo canguro."
    },

    // --- Juegos ---
    {
        id: 17,
        category: "Juegos",
        name: "Consola de Videojuegos Next-Gen",
        price: 380000,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
        description: "Experimenta tiempos de carga ultrarrápidos con su disco SSD de alta velocidad, gráficos en 4K hasta 120 FPS y audio 3D inmersivo."
    },
    {
        id: 18,
        category: "Juegos",
        name: "Joystick Inalámbrico Ergonómico",
        price: 32000,
        image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80",
        description: "Gatillos adaptativos y retroalimentación háptica precisa. Compatible con PC, consolas y dispositivos móviles vía Bluetooth."
    },

    // --- Otros ---
    {
        id: 19,
        category: "Otros",
        name: "Mochila Antirrobo Impermeable",
        price: 18700,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        description: "Compartimento acolchado para notebook de hasta 15.6 pulgadas, cierres ocultos de seguridad y puerto exterior USB para batería portátil."
    },
    {
        id: 20,
        category: "Otros",
        name: "Termo de Acero Inoxidable 1L",
        price: 24500,
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
        description: "Doble pared con aislamiento al vacío para mantener bebidas frías o calientes durante más de 24 horas. Pico cebador de precisión."
    }
];

module.exports = products;