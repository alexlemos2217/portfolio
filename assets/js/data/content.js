export const PROFILE = {
  name: 'Alexander Lemos',
  role: {
    es: 'Backend & Full-Stack Software Developer',
    en: 'Backend & Full-Stack Software Developer'
  },
  location: 'Montevideo, Uruguay',
  timezone: 'America/Montevideo',
  email: 'alexlemos2297@gmail.com',
  github: 'https://github.com/alexlemos2217',
  linkedin: 'https://www.linkedin.com/in/alexlemos22',
  repoUrl: 'https://github.com/alexlemos2217/portfolio'
};

export const RBAC_ROLES = {
  ADMIN: {
    token: 'jwt:rs256 · scope:all',
    rules: [
      { endpoint: 'GET /api/v1/work-orders', state: 'allow', status: '200 OK' },
      { endpoint: 'POST /api/v1/reports/export', state: 'allow', status: '201 OK' },
      { endpoint: 'DELETE /api/v1/users/{id}', state: 'allow', status: '204 OK' }
    ]
  },
  STAFF: {
    token: 'jwt:rs256 · scope:ops',
    rules: [
      { endpoint: 'GET /api/v1/work-orders', state: 'allow', status: '200 OK' },
      { endpoint: 'POST /api/v1/reports/export', state: 'allow', status: '201 OK' },
      { endpoint: 'DELETE /api/v1/users/{id}', state: 'deny', status: '403 DENY' }
    ]
  },
  USER: {
    token: 'jwt:rs256 · scope:read',
    rules: [
      { endpoint: 'GET /api/v1/work-orders', state: 'allow', status: '200 OK' },
      { endpoint: 'POST /api/v1/reports/export', state: 'deny', status: '403 DENY' },
      { endpoint: 'DELETE /api/v1/users/{id}', state: 'deny', status: '403 DENY' }
    ]
  }
};

export const CASE_STUDIES = {
  'bios-work': {
    accent: '#34d399',
    kicker: { es: '01 · BACKEND & SEGURIDAD', en: '01 · BACKEND & SECURITY' },
    title: 'BIOS Work',
    subtitle: {
      es: 'Sistema web de gestión laboral y operativa con autenticación robusta, control de acceso basado en roles (RBAC) y persistencia relacional.',
      en: 'Work and operations management backend featuring robust authentication, role-based access control (RBAC) and relational persistence.'
    },
    meta: {
      role: { es: 'Backend & Arquitectura', en: 'Backend & Architecture' },
      context: { es: 'Proyecto Técnico · BIOS', en: 'Technical Project · BIOS' },
      focus: { es: 'Seguridad · RBAC · SQL', en: 'Security · RBAC · SQL' }
    },
    problem: {
      es: 'Centralizar flujos de gestión con distintos perfiles de usuario exigía evitar lógica de permisos dispersa en controladores y garantizar integridad de datos en operaciones concurrentes.',
      en: 'Centralizing management workflows across multiple user profiles required eliminating scattered authorization checks in controllers and preserving data integrity under concurrent operations.'
    },
    decisions: {
      es: [
        'Arquitectura en capas limpias (Controller → Service → Repository) para aislar reglas de negocio de la persistencia.',
        'Autenticación y autorización centralizada mediante Spring Security con filtros de seguridad, hashing de credenciales y matriz de permisos por rol.',
        'Modelado relacional normalizado en SQL con restricciones de integridad referencial, validaciones de dominio y manejo consistente de errores HTTP.'
      ],
      en: [
        'Clean layered architecture (Controller → Service → Repository) to decouple business rules from data persistence.',
        'Centralized authentication and authorization with Spring Security filter chains, password hashing and role-based permission matrices.',
        'Normalized relational SQL schema enforcing referential integrity, domain validation and consistent HTTP error contracts.'
      ]
    },
    architecture: `[Client / UI]
      │  HTTPS Request + Credentials / Token
      ▼
[Spring Security FilterChain]  ──▶  RBAC Guard (ADMIN / STAFF / USER)
      │
      ▼
[Service Layer]                ──▶  Business Rules & Transactional Boundaries
      │
      ▼
[JPA / SQL Repository]         ──▶  Relational DB (Normalized Schema + Indexes)`,
    stack: ['Java', 'Spring Boot', 'Spring Security', 'SQL', 'JPA / Hibernate', 'REST / MVC'],
    impact: {
      es: 'Consolidó patrones clave de ingeniería backend aplicable a entornos productivos: separación estricta de responsabilidades, seguridad por defecto y contratos predecibles.',
      en: 'Consolidated production-grade backend patterns: strict separation of concerns, secure-by-default authorization and predictable service contracts.'
    },
    ndaNote: null
  },

  'bios-fitness': {
    accent: '#3b82f6',
    kicker: { es: '02 · MOBILE ARCHITECTURE', en: '02 · MOBILE ARCHITECTURE' },
    title: 'BIOS Fitness',
    subtitle: {
      es: 'Aplicación móvil offline-first para organizar rutinas de entrenamiento, comidas y métricas diarias con arquitectura reactiva BLoC y SQLite.',
      en: 'Offline-first mobile application to organize workouts, nutrition plans and daily progress metrics built with BLoC reactive state management and SQLite.'
    },
    meta: {
      role: { es: 'Mobile & Estado Local', en: 'Mobile & Local Data' },
      context: { es: 'Proyecto Académico · BIOS', en: 'Academic Project · BIOS' },
      focus: { es: 'Flutter · BLoC · Offline-first', en: 'Flutter · BLoC · Offline-first' }
    },
    problem: {
      es: 'Las apps de seguimiento diario fallan cuando mezclan lógica de estado dentro de la UI o dependen de conexión constante. Se necesitaba una arquitectura predecible, fluida y 100% utilizable sin red.',
      en: 'Daily tracking apps degrade quickly when state logic leaks into UI widgets or depends on constant connectivity. The goal was a predictable, fluid architecture working reliably offline.'
    },
    decisions: {
      es: [
        'Gestión de estado unidireccional con patrón BLoC (Events → BLoC → Immutable States) separando completamente presentación de reglas de negocio.',
        'Persistencia local estructurada en SQLite con repositorios dedicados para rutinas, registros de comidas e historial de cumplimiento.',
        'Componentes reutilizables en Flutter orientados a feedback inmediato (anillos de progreso, métricas semanales y navegación sin fricción).'
      ],
      en: [
        'Unidirectional state management using the BLoC pattern (Events → BLoC → Immutable States) to completely separate presentation from business logic.',
        'Structured local persistence on SQLite with dedicated repositories for workouts, meal logs and completion history.',
        'Reusable Flutter widgets crafted for instant visual feedback (progress rings, weekly adherence bars and frictionless navigation).'
      ]
    },
    architecture: `[Flutter UI Widgets]
      │  User Events (LogWorkout, ToggleMeal)
      ▼
[BLoC State Layer]             ──▶  Deterministic Immutable States
      │
      ▼
[Local Repositories]           ──▶  Data Mappers & Validation
      │
      ▼
[SQLite Engine]                ──▶  Offline-First Relational Storage`,
    stack: ['Flutter', 'Dart', 'BLoC Pattern', 'SQLite', 'Offline-First', 'Mobile UX'],
    impact: {
      es: 'Demostró transferencia real de principios de arquitectura limpia al ecosistema mobile: estado testeable, flujo unidireccional y persistencia confiable.',
      en: 'Demonstrated clean architecture transfer into mobile engineering: testable state transitions, unidirectional data flow and dependable local storage.'
    },
    ndaNote: null
  },

  'ops-systems': {
    accent: '#a78bfa',
    kicker: { es: '03 · SISTEMAS PRIVADOS · NDA', en: '03 · PRIVATE SYSTEMS · NDA' },
    title: {
      es: 'Sistemas de Gestión Operativa & Datos',
      en: 'Operational & Data Management Systems'
    },
    subtitle: {
      es: 'Conjunto de plataformas web internas (incluyendo REGCRIM, Secretaría y PADO Gestión) diseñadas para centralizar registros, permisos, auditoría y análisis SQL.',
      en: 'Suite of internal web platforms (including REGCRIM, Secretariat and PADO Gestión) engineered to centralize structured records, role permissions, auditing and SQL reporting.'
    },
    meta: {
      role: { es: 'Full-Stack / Backend', en: 'Full-Stack / Backend' },
      context: { es: 'Producción · Institucional', en: 'Production · Institutional' },
      focus: { es: 'PHP · MariaDB · Consultas SQL', en: 'PHP · MariaDB · SQL Queries' }
    },
    problem: {
      es: 'Múltiples procesos administrativos y operativos dependían de planillas aisladas y búsquedas manuales lentas, dificultando la trazabilidad, el control por perfil y la generación de reportes confiables.',
      en: 'Critical administrative and operational workflows relied on disconnected spreadsheets and slow manual lookups, hindering traceability, role-based access control and reliable reporting.'
    },
    decisions: {
      es: [
        'Diseño de esquemas relacionales en MariaDB/MySQL con claves foráneas, índices compuestos para filtros multicriterio y trazabilidad de cambios.',
        'Separación de capa de presentación, servicios PHP con consultas preparadas (prevención de SQL Injection) y validación de permisos por sesión/rol.',
        'Módulos de consulta avanzada, tableros operativos y exportación estructurada optimizados para reducir tiempos de búsqueda y carga administrativa.'
      ],
      en: [
        'Relational schema modeling in MariaDB/MySQL using foreign keys, composite indexes for multi-criteria filtering and audit trails.',
        'Clear separation between UI views, PHP service logic with prepared statements (SQL injection prevention) and session/role authorization.',
        'Advanced search modules, operational dashboards and structured exports engineered to cut lookup latency and manual overhead.'
      ]
    },
    architecture: `[Operational Web UI]           ──▶  Role-Scoped Views & Filters
      │  Authenticated Requests
      ▼
[PHP Application Layer]        ──▶  Access Control + Input Validation
      │  Prepared Statements
      ▼
[Query & Reporting Engine]     ──▶  Aggregations, Joins & Audit Logs
      │
      ▼
[MariaDB / MySQL]              ──▶  Indexed Relational Tables`,
    stack: ['PHP', 'MariaDB', 'MySQL', 'SQL', 'JavaScript', 'HTML / CSS', 'RBAC'],
    impact: {
      es: 'Ordenó la operación diaria en un único entorno auditable, reduciendo errores de carga manual y acelerando la consulta de información estructurada.',
      en: 'Unified daily operations into a single auditable platform, reducing manual data-entry errors and accelerating structured record retrieval.'
    },
    ndaNote: {
      es: 'Nota de confidencialidad: por acuerdos NDA no se publican capturas, código fuente ni datos operativos reales.',
      en: 'Confidentiality note: due to NDA agreements, screenshots, source code and real operational data are not disclosed.'
    }
  },

  'hogwarts-campus': {
    accent: '#60a5fa',
    kicker: { es: 'ARCHIVE · PLATAFORMA EDUCATIVA', en: 'ARCHIVE · EDUCATIONAL PLATFORM' },
    title: 'Hogwarts Institute Campus',
    subtitle: {
      es: 'Campus web para instituto educativo con perfiles de docentes y estudiantes, gestión de tareas, entregas, correcciones y notificaciones.',
      en: 'Web campus for an educational institute featuring teacher and student roles, assignments, submissions, grading and notifications.'
    },
    meta: {
      role: { es: 'Full-Stack Developer', en: 'Full-Stack Developer' },
      context: { es: 'Proyecto para Cliente', en: 'Client Project' },
      focus: { es: 'Roles · SQL · Web App', en: 'Roles · SQL · Web App' }
    },
    problem: {
      es: 'El instituto necesitaba un espacio digital centralizado y adaptable a móvil para reemplazar el intercambio informal de materiales y tareas.',
      en: 'The institute needed a centralized, mobile-friendly web space to replace scattered messaging for learning materials and homework.'
    },
    decisions: {
      es: [
        'Separación de vistas y permisos diferenciados para docentes y estudiantes respaldados por políticas SQL en Supabase.',
        'Flujo completo de publicación de tareas, seguimiento de entregas, correcciones y asistencia.'
      ],
      en: [
        'Role-separated views and permissions for teachers and students backed by SQL policies on Supabase.',
        'End-to-end workflow covering assignments, submissions, grading and attendance tracking.'
      ]
    },
    architecture: `[Responsive Web Client] ──▶ [Auth & Role Policies] ──▶ [Supabase / PostgreSQL]`,
    stack: ['JavaScript', 'Supabase', 'SQL', 'HTML / CSS'],
    impact: {
      es: 'Centralizó la comunicación académica diaria en una interfaz limpia accesible desde celular y escritorio.',
      en: 'Centralized daily academic communication in a clean interface accessible across mobile and desktop.'
    },
    ndaNote: {
      es: 'Sistema privado desarrollado para cliente; el repositorio no es público.',
      en: 'Private client system; source repository is not public.'
    }
  },

  'airport-system': {
    accent: '#38bdf8',
    kicker: { es: 'ARCHIVE · C# / .NET + SQL SERVER', en: 'ARCHIVE · C# / .NET + SQL SERVER' },
    title: {
      es: 'Sistema de Gestión Aeroportuaria',
      en: 'Airport Operations System'
    },
    subtitle: {
      es: 'Aplicación web en C# / .NET y SQL Server para administrar aeropuertos, vuelos, clientes y venta de pasajes con procedimientos almacenados.',
      en: 'C# / .NET and SQL Server web application managing airports, flights, customers and ticket sales powered by stored procedures.'
    },
    meta: {
      role: { es: 'Backend & SQL Server', en: 'Backend & SQL Server' },
      context: { es: 'Proyecto Académico', en: 'Academic Project' },
      focus: { es: 'C# · .NET · Stored Procedures', en: 'C# · .NET · Stored Procedures' }
    },
    problem: {
      es: 'Garantizar consistencia en reservas, disponibilidad de asientos y validaciones de rutas aéreas mediante reglas estrictas en negocio y base de datos.',
      en: 'Ensuring consistency across ticket reservations, seat capacity and route validation through strict business and database rules.'
    },
    decisions: {
      es: [
        'Capa de acceso a datos desacoplada comunicándose con procedimientos almacenados transaccionales en SQL Server.',
        'Validaciones de negocio en C# para horarios, aeropuertos válidos y emisión controlada de pasajes.'
      ],
      en: [
        'Decoupled data-access layer executing transactional stored procedures on SQL Server.',
        'Domain validations in C# covering schedules, valid airports and controlled ticket issuance.'
      ]
    },
    architecture: `[ASP.NET UI] ──▶ [C# Business Logic] ──▶ [DAL] ──▶ [SQL Server Stored Procedures]`,
    stack: ['C#', '.NET', 'ASP.NET', 'SQL Server', 'Stored Procedures'],
    impact: {
      es: 'Base sólida en el ecosistema Microsoft (.NET + SQL Server) y manejo transaccional de reglas complejas.',
      en: 'Strong foundation in the Microsoft stack (.NET + SQL Server) and transactional domain logic.'
    },
    ndaNote: null
  },

  rumbo: {
    accent: '#34d399',
    kicker: { es: 'ARCHIVE · PRODUCTO EN DESARROLLO', en: 'ARCHIVE · IN DEVELOPMENT' },
    title: 'Rumbo',
    subtitle: {
      es: 'Plataforma digital en desarrollo para explorar destinos, lugares y experiencias en Uruguay con enfoque territorial.',
      en: 'Digital platform currently in development to discover destinations, places and experiences across Uruguay.'
    },
    meta: {
      role: { es: 'Product & Engineering', en: 'Product & Engineering' },
      context: { es: 'Proyecto Propio', en: 'Personal Product' },
      focus: { es: 'Web App · Cartografía', en: 'Web App · Cartography' }
    },
    problem: {
      es: 'Reunir información geográfica y recomendaciones locales de Uruguay en una experiencia rápida, clara y estructurada.',
      en: 'Bringing geographic discovery and local recommendations across Uruguay into one fast, structured web experience.'
    },
    decisions: {
      es: [
        'Prototipo cartográfico iterativo sobre datos abiertos de OpenStreetMap y arquitectura preparada para integrar APIs de rutas y lugares.'
      ],
      en: [
        'Iterative cartographic prototype over OpenStreetMap open data with an architecture prepared for route and place APIs.'
      ]
    },
    architecture: `[Web Client] ──▶ [Geo Layer / OSM] ──▶ [Planned Places & Routes API]`,
    stack: ['JavaScript', 'OpenStreetMap', 'Product Design'],
    impact: {
      es: 'Laboratorio activo de diseño de producto, arquitectura geográfica y evolución iterativa.',
      en: 'Active product engineering sandbox exploring geographic UX and iterative architecture.'
    },
    ndaNote: null
  },

  'dotnet-api-next': {
    accent: '#5b8cff',
    kicker: { es: 'ARCHIVE · PRÓXIMO REPO OPEN-SOURCE', en: 'ARCHIVE · UPCOMING OPEN-SOURCE REPO' },
    title: {
      es: 'Clean Architecture .NET 8 Web API',
      en: 'Clean Architecture .NET 8 Web API'
    },
    subtitle: {
      es: 'Espacio reservado para mi próximo repositorio público de referencia en C# / .NET: API REST con Clean Architecture, EF Core, JWT, tests automatizados y Docker.',
      en: 'Dedicated slot for my upcoming public C# / .NET reference repository: REST API featuring Clean Architecture, EF Core, JWT auth, automated tests and Docker.'
    },
    meta: {
      role: { es: 'Backend Author', en: 'Backend Author' },
      context: { es: 'En preparación · GitHub', en: 'In Progress · GitHub' },
      focus: { es: 'C# · .NET · EF Core · Docker', en: 'C# · .NET · EF Core · Docker' }
    },
    problem: {
      es: 'Demostrar de forma pública y verificable en GitHub prácticas de ingeniería backend modernas en el ecosistema .NET.',
      en: 'Publicly demonstrating modern backend engineering standards in the .NET ecosystem on GitHub.'
    },
    decisions: {
      es: [
        'Separación en capas Domain / Application / Infrastructure / API.',
        'Autenticación JWT, migraciones con Entity Framework Core sobre SQL Server, documentación OpenAPI/Swagger y contenedorización con Docker.'
      ],
      en: [
        'Clean separation across Domain / Application / Infrastructure / API layers.',
        'JWT authentication, Entity Framework Core migrations on SQL Server, OpenAPI/Swagger docs and Docker containerization.'
      ]
    },
    architecture: `[ASP.NET Core API] ──▶ [Application Use Cases] ──▶ [Domain] ──▶ [EF Core / SQL Server]`,
    stack: ['C#', '.NET 8', 'ASP.NET Core', 'EF Core', 'SQL Server', 'Docker', 'xUnit'],
    impact: {
      es: 'Próximamente disponible públicamente en github.com/alexlemos2217.',
      en: 'Publishing soon at github.com/alexlemos2217.'
    },
    ndaNote: null,
    externalUrl: 'https://github.com/alexlemos2217',
    externalLabel: { es: 'Seguir en GitHub ↗', en: 'Follow on GitHub ↗' }
  }
};

export const ARCHIVE_PREVIEWS = {
  'hogwarts-campus': {
    accent: '#60a5fa',
    type: { es: 'Plataforma Educativa · Privado', en: 'Educational Platform · Private' },
    title: 'Hogwarts Institute Campus',
    desc: {
      es: 'Perfiles docentes/estudiantes, entregas, correcciones y políticas SQL en Supabase.',
      en: 'Teacher/student roles, assignments, grading and SQL policies on Supabase.'
    },
    stack: 'JavaScript · Supabase · SQL'
  },
  'airport-system': {
    accent: '#38bdf8',
    type: { es: 'Backend & SQL Server · Académico', en: 'Backend & SQL Server · Academic' },
    title: { es: 'Gestión Aeroportuaria', en: 'Airport Management' },
    desc: {
      es: 'Gestión de aeropuertos, vuelos, clientes y pasajes con stored procedures en SQL Server.',
      en: 'Airports, flights, customers and ticket sales backed by SQL Server stored procedures.'
    },
    stack: 'C# · ASP.NET · SQL Server'
  },
  rumbo: {
    accent: '#34d399',
    type: { es: 'Web App · En desarrollo', en: 'Web App · In development' },
    title: 'Rumbo',
    desc: {
      es: 'Descubrimiento territorial de destinos y experiencias en Uruguay.',
      en: 'Territory-focused platform to discover destinations across Uruguay.'
    },
    stack: 'JavaScript · OpenStreetMap · UX'
  },
  'pixel-rush': {
    accent: '#f472b6',
    type: { es: 'Repositorio Público · GitHub', en: 'Public Repository · GitHub' },
    title: 'Pixel Rush',
    desc: {
      es: 'Juego arcade con game loop a 60fps, colisiones y renderizado nativo en Canvas 2D.',
      en: 'Arcade game featuring a 60fps loop, collision detection and native Canvas 2D rendering.'
    },
    stack: 'JavaScript · Canvas 2D'
  },
  'faro-09': {
    accent: '#fbbf24',
    type: { es: 'Repositorio Público · GitHub', en: 'Public Repository · GitHub' },
    title: 'FARO:09',
    desc: {
      es: 'Experiencia narrativa interactiva enfocada en atmósfera, ritmo y tipografía web.',
      en: 'Interactive narrative web piece focused on atmosphere, pacing and typography.'
    },
    stack: 'HTML5 · CSS3 · JavaScript'
  },
  pokedex: {
    accent: '#fb7185',
    type: { es: 'Demo Publicada · Netlify', en: 'Live Demo · Netlify' },
    title: 'Pokédex',
    desc: {
      es: 'Consumo asincrónico de PokeAPI, búsqueda dinámica y fichas detalladas.',
      en: 'Async PokeAPI integration with dynamic search and detailed stat sheets.'
    },
    stack: 'Public REST API · JavaScript'
  },
  'dotnet-api-next': {
    accent: '#5b8cff',
    type: { es: 'Próximo Open-Source · .NET', en: 'Upcoming Open-Source · .NET' },
    title: 'Clean Architecture .NET API',
    desc: {
      es: 'API REST pública de referencia en C# / .NET, EF Core, JWT, tests y Docker.',
      en: 'Public reference REST API in C# / .NET, EF Core, JWT auth, tests and Docker.'
    },
    stack: 'C# · .NET · SQL Server · Docker'
  }
};

export const API_ENDPOINTS = {
  '/api/v1/alex': {
    es: {
      name: 'Alexander Lemos',
      role: 'Backend & Full-Stack Software Developer',
      location: 'Montevideo, Uruguay (UYT)',
      education: 'Licenciatura en Sistemas — Universidad ORT Uruguay',
      availability: 'open_to_it_opportunities',
      focus: ['Backend APIs', 'Relational SQL Modeling', 'Clean Architecture', 'Full-Stack Web']
    },
    en: {
      name: 'Alexander Lemos',
      role: 'Backend & Full-Stack Software Developer',
      location: 'Montevideo, Uruguay (UYT)',
      education: 'B.S. in Information Systems — Universidad ORT Uruguay',
      availability: 'open_to_it_opportunities',
      focus: ['Backend APIs', 'Relational SQL Modeling', 'Clean Architecture', 'Full-Stack Web']
    }
  },
  '/api/v1/stack': {
    es: {
      backend: ['C#', '.NET / ASP.NET Core', 'Java', 'Spring Boot', 'Spring Security', 'PHP'],
      databases: ['SQL Server', 'MySQL', 'MariaDB', 'SQLite'],
      frontend_mobile: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Flutter / Dart'],
      tooling: ['Git', 'GitHub', 'Docker', 'Linux', 'REST APIs']
    },
    en: {
      backend: ['C#', '.NET / ASP.NET Core', 'Java', 'Spring Boot', 'Spring Security', 'PHP'],
      databases: ['SQL Server', 'MySQL', 'MariaDB', 'SQLite'],
      frontend_mobile: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Flutter / Dart'],
      tooling: ['Git', 'GitHub', 'Docker', 'Linux', 'REST APIs']
    }
  },
  '/api/v1/projects': {
    es: {
      total_featured: 3,
      featured: [
        { id: 'bios-work', stack: ['Java', 'Spring Boot', 'Spring Security', 'SQL'], type: 'backend_rbac' },
        { id: 'bios-fitness', stack: ['Flutter', 'Dart', 'BLoC', 'SQLite'], type: 'mobile_offline_first' },
        { id: 'ops-systems', stack: ['PHP', 'MariaDB', 'MySQL', 'SQL'], visibility: 'private_nda' }
      ],
      public_demos: ['pixel-rush', 'faro-09', 'pokedex']
    },
    en: {
      total_featured: 3,
      featured: [
        { id: 'bios-work', stack: ['Java', 'Spring Boot', 'Spring Security', 'SQL'], type: 'backend_rbac' },
        { id: 'bios-fitness', stack: ['Flutter', 'Dart', 'BLoC', 'SQLite'], type: 'mobile_offline_first' },
        { id: 'ops-systems', stack: ['PHP', 'MariaDB', 'MySQL', 'SQL'], visibility: 'private_nda' }
      ],
      public_demos: ['pixel-rush', 'faro-09', 'pokedex']
    }
  },
  '/api/v1/contact': {
    es: {
      email: 'alexlemos2297@gmail.com',
      github: 'https://github.com/alexlemos2217',
      linkedin: 'https://www.linkedin.com/in/alexlemos22',
      response_sla: '< 24h',
      languages: ['Español (Nativo)', 'Portugués', 'Inglés']
    },
    en: {
      email: 'alexlemos2297@gmail.com',
      github: 'https://github.com/alexlemos2217',
      linkedin: 'https://www.linkedin.com/in/alexlemos22',
      response_sla: '< 24h',
      languages: ['Spanish (Native)', 'Portuguese', 'English']
    }
  }
};

export const ARCH_SCENARIOS = {
  miss: {
    status: '200 OK · 18.4ms',
    mode: 'miss',
    steps: {
      es: [
        { node: 0, deltaMs: 0, text: 'Client → GET /api/v1/records?status=active (TLS 1.3)' },
        { node: 1, deltaMs: 2, text: 'Auth & Cache → JWT RS256 OK · Redis CACHE MISS', tone: 'warn' },
        { node: 2, deltaMs: 5, text: '.NET / Spring → Service layer + DTO validation OK' },
        { node: 3, deltaMs: 16, text: 'SQL Server → Index Seek (idx_records_status) · 11.2ms' },
        { node: 1, deltaMs: 17, text: 'Auth & Cache → Cache write-back (TTL 120s)' },
        { node: 0, deltaMs: 18, text: 'Response → 200 OK · 24 registros (18.4ms · MISS)', tone: 'ok' }
      ],
      en: [
        { node: 0, deltaMs: 0, text: 'Client → GET /api/v1/records?status=active (TLS 1.3)' },
        { node: 1, deltaMs: 2, text: 'Auth & Cache → JWT RS256 OK · Redis CACHE MISS', tone: 'warn' },
        { node: 2, deltaMs: 5, text: '.NET / Spring → Service layer + DTO validation OK' },
        { node: 3, deltaMs: 16, text: 'SQL Server → Index Seek (idx_records_status) · 11.2ms' },
        { node: 1, deltaMs: 17, text: 'Auth & Cache → Cache write-back (TTL 120s)' },
        { node: 0, deltaMs: 18, text: 'Response → 200 OK · 24 records (18.4ms · MISS)', tone: 'ok' }
      ]
    }
  },
  hit: {
    status: '200 OK · 1.9ms',
    mode: 'hit',
    steps: {
      es: [
        { node: 0, deltaMs: 0, text: 'Client → GET /api/v1/records?status=active (TLS 1.3)' },
        { node: 1, deltaMs: 1, text: 'Auth & Cache → JWT OK · CACHE HIT (0.6ms · SQL bypassed)', tone: 'ok' },
        { node: 0, deltaMs: 2, text: 'Response → 200 OK · Served from edge cache (1.9ms · HIT)', tone: 'ok' }
      ],
      en: [
        { node: 0, deltaMs: 0, text: 'Client → GET /api/v1/records?status=active (TLS 1.3)' },
        { node: 1, deltaMs: 1, text: 'Auth & Cache → JWT OK · CACHE HIT (0.6ms · SQL bypassed)', tone: 'ok' },
        { node: 0, deltaMs: 2, text: 'Response → 200 OK · Served from edge cache (1.9ms · HIT)', tone: 'ok' }
      ]
    }
  },
  unauth: {
    status: '401 UNAUTHORIZED · 3.1ms',
    mode: 'error',
    steps: {
      es: [
        { node: 0, deltaMs: 0, text: 'Client → POST /api/v1/admin/export (Bearer expired)' },
        { node: 1, deltaMs: 2, text: 'Auth & Security → JWT signature expired · Blocked at Guard', tone: 'err' },
        { node: 0, deltaMs: 3, text: 'Response → 401 Unauthorized · Downstream API & SQL protected', tone: 'err' }
      ],
      en: [
        { node: 0, deltaMs: 0, text: 'Client → POST /api/v1/admin/export (Bearer expired)' },
        { node: 1, deltaMs: 2, text: 'Auth & Security → JWT signature expired · Blocked at Guard', tone: 'err' },
        { node: 0, deltaMs: 3, text: 'Response → 401 Unauthorized · Downstream API & SQL protected', tone: 'err' }
      ]
    }
  }
};
