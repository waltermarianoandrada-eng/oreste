// ==========================================================================
// Oreste Comello Art Gallery - App Logic
// ==========================================================================

// Initial Mock Artworks (displayed if localStorage is empty)
const INITIAL_ARTWORKS = [
    {
        id: "artwork-federal",
        title: "Forjadores de la Historia",
        year: 2009,
        category: "oleo",
        medium: "Óleo sobre lienzo",
        size: "1.10 m × 0.90 m",
        author: "O. J. Comello (Noviembre, 2009)",
        description: "Esta pintura rinde homenaje a nuestras raíces riojanas. Utilizando como fondo los colores de la bandera de la provincia de La Rioja, el autor dibuja el mapa provincial y dentro de él entrelaza los rostros de los protagonistas de nuestra historia. La obra invita a reflexionar sobre el pasado, mostrando la unión de los pueblos originarios, la época colonial y la impronta de los caudillos federales que forjaron la identidad y la autonomía de nuestra tierra.",
        image: "/obra-federal.png"
    },
    {
        id: "artwork-playa",
        title: "Caminata al Atardecer",
        year: 2026,
        category: "oleo",
        medium: "Óleo sobre lienzo",
        size: "80 x 60 cm",
        author: "O. J. Comello",
        date: "19 de mayo de 2026",
        origin: "Colección privada, La Rioja, Argentina",
        description: "Obra realizada por especial encargo y dedicada a un reconocido empresario del sector de la cafetería de La Rioja (MONACO), una figura profundamente valorada y querida por el artista. La pintura captura un momento de íntima serenidad: una pareja caminando de la mano a la orilla del mar, de espaldas al espectador, avanzando hacia un horizonte custodiado por montañas bajo un cielo de nubes expresivas. Lejos del ritmo urbano y comercial, el cuadro evoca el descanso, el compañerismo y la complicidad del afecto sincero. Una pieza que fusiona el arte con la gratitud y la amistad entrañable que une al pintor con su destinatario.",
        image: "/obra-playa.jpg"
    },
    {
        id: "artwork-soldado",
        title: "Retrato del General",
        year: 2026,
        category: "dibujo",
        medium: "Óleo monocromático sobre lienzo",
        size: "0.90 m × 0.70 m",
        author: "O. J. Comello (Junio, 2026)",
        origin: "Colección particular, La Rioja, Argentina",
        description: "Este retrato ecuestre/militar en busto fue pintado a pedido para un empresario riojano. Con una paleta estrictamente monocroma que emula la estética de la fotografía histórica en blanco y negro, el autor retrata al General Videla portando la gorra de gala con el escudo nacional. La atmósfera difuminada del fondo contrasta con la claridad del texto inferior, una máxima que actúa como declaración de principios del personaje y del contexto representado. La obra fusiona el arte del retrato por encargo con la memoria política e institucional del siglo XX argentino.",
        image: "/obra-soldado.jpg"
    },
    {
        id: "artwork-victoria",
        title: "Victoria Romero",
        year: 2018,
        category: "dibujo",
        medium: "Dibujo monocromático",
        size: "70 x 50 cm",
        author: "O. J. Comello",
        tribute: "Victoria Romero ('La Chacha')",
        origin: "Patrimonio escolar · Barrio Nueva Rioja",
        description: "Este retrato rinde homenaje a una de las máximas heroínas de la historia riojana: Victoria Romero, quien luchó codo a codo junto a su esposo, el General Ángel Vicente \"Chacho\" Peñaloza. La obra utiliza pinceladas enérgicas y un estilo en blanco y negro que evoca el pasado histórico de la provincia, destacando su rostro envuelto en un manto oscuro que resalta la solemnidad del personaje. Al haber sido donado directamente por el pintor O. J. Comello a esta comunidad educativa del barrio Nueva Rioja, el cuadro se convierte en un valioso recurso pedagógico que invita a alumnos y docentes a reflexionar sobre el rol de la mujer en la construcción de nuestra patria chica.",
        image: "/obra-victoria.jpg"
    },
    {
        id: "artwork-pamela",
        title: "Retrato de Dama con Pamela",
        year: 2026,
        category: "oleo",
        medium: "Óleo sobre soporte (texturizado)",
        size: "30 x 20 cm",
        author: "O. J. Comello",
        description: "Este delicado retrato de formato vertical captura la esencia de la elegancia clásica a través de una paleta cromática sutil y una textura táctil muy particular. La obra presenta la silueta de perfil de una mujer noble o de la alta sociedad, ataviada con una imponente pamela (sombrero de ala ancha) decorada con detalles florales en relieve, un elemento característico de la moda de finales del siglo XIX y principios del XX. El artista utiliza una técnica de empaste sutil, donde las pinceladas visibles y el relieve texturizado del fondo aportan volumen, dinamismo y una cualidad casi escultórica a la superficie pictórica.",
        image: "/obra-pamela.png"
    },
    {
        id: "artwork-flores",
        title: "Flores en Florero Azul",
        year: 2026,
        category: "oleo",
        medium: "Óleo sobre lienzo",
        size: "60 x 80 cm",
        author: "O. J. Comello",
        description: "En este bodegón, el autor explora el color y la textura a través de un florero clásico. El protagonismo se divide entre el azul profundo del jarrón, trabajado con visibles trazos de espátula o pincel cargado, y la delicadeza del ramo superior, donde conviven calas blancas y espigas de flores azuladas que buscan la verticalidad. El fondo texturado en tonos cálidos envuelve la escena, dándole una atmósfera acogedora y luminosa, ideal para el entorno de encuentro y tradición que caracteriza a El Topón.",
        image: "/obra-flores.png"
    }
];

// App State
let artworks = [];
let isAdmin = false;
let currentFilter = "all";
let activeLightboxIndex = -1;
let uploadImageBase64 = ""; // Holds base64 data URL for uploaded files
let deferredInstallPrompt = null;

// DOM Elements
const galleryGrid = document.getElementById("galleryGrid");
const emptyGalleryState = document.getElementById("emptyGalleryState");
const adminAccessBtn = document.getElementById("adminAccessBtn");
const adminBadge = document.getElementById("adminBadge");
const logoutBtn = document.getElementById("logoutBtn");
const installPwaBtn = document.getElementById("installPwaBtn");

// Modals
const loginModal = document.getElementById("loginModal");
const adminPanelModal = document.getElementById("adminPanelModal");
const lightboxModal = document.getElementById("lightboxModal");

// Close buttons
const closeLoginBtn = document.getElementById("closeLoginBtn");
const closeAdminPanelBtn = document.getElementById("closeAdminPanelBtn");
const closeLightboxBtn = document.getElementById("closeLightboxBtn");

// Forms & Inputs
const loginForm = document.getElementById("loginForm");
const adminPasswordInput = document.getElementById("adminPassword");
const loginErrorMsg = document.getElementById("loginErrorMsg");
const addArtworkForm = document.getElementById("addArtworkForm");

// File upload/dropzone elements
const imageDropzone = document.getElementById("imageDropzone");
const artFileInput = document.getElementById("artFile");
const artUrlInput = document.getElementById("artUrl");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");
const removePreviewBtn = document.getElementById("removePreviewBtn");
const uploadTabs = document.querySelectorAll(".tab-upload-btn");

// Lightbox elements
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxYear = document.getElementById("lightboxYear");
const lightboxMedium = document.getElementById("lightboxMedium");
const lightboxSize = document.getElementById("lightboxSize");
const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
const lightboxNextBtn = document.getElementById("lightboxNextBtn");

// Filter buttons
const filterButtons = document.querySelectorAll(".filter-btn");

// Toast Container
const toastContainer = document.getElementById("toastContainer");

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupEventListeners();
    registerServiceWorker();
    checkAdminSession();
});


// Load artworks from localStorage or use defaults
function loadState() {
    const storedArt = localStorage.getItem("oreste_artworks");
    if (storedArt) {
        try {
            artworks = JSON.parse(storedArt);
            // Si el almacenamiento contiene las obras de prueba antiguas de Unsplash, las reemplazamos por las reales locales
            const hasOldMocks = artworks.some(art => art.id.startsWith("mock-"));
            if (hasOldMocks) {
                artworks = [...INITIAL_ARTWORKS];
                saveState();
            } else {
                let updated = false;
                // Asegurar que todas las obras iniciales estén agregadas si no existen
                // Y sincronizar los campos de las que ya existen (para reflejar cambios del servidor)
                INITIAL_ARTWORKS.forEach(initArt => {
                    const existingIndex = artworks.findIndex(art => art.id === initArt.id);
                    if (existingIndex === -1) {
                        // Obra nueva: agregarla
                        artworks.unshift(initArt);
                        updated = true;
                    } else {
                        // Obra existente: sincronizar campos editables (title, medium, size, author, description, image estática)
                        const existing = artworks[existingIndex];
                        const fieldsToSync = ["title", "year", "medium", "size", "author", "date", "origin", "tribute", "description"];
                        fieldsToSync.forEach(field => {
                            if (initArt[field] !== undefined && existing[field] !== initArt[field]) {
                                existing[field] = initArt[field];
                                updated = true;
                            }
                        });
                        // Sincronizar imagen solo si es una ruta estática (no base64 del usuario)
                        if (initArt.image && !initArt.image.startsWith("data:") && existing.image !== initArt.image) {
                            existing.image = initArt.image;
                            updated = true;
                        }
                    }
                });
                
                // Corrección dinámica de rutas para Vite
                artworks = artworks.map(art => {
                    if (art.image && !art.image.startsWith("/") && !art.image.startsWith("http") && !art.image.startsWith("data:")) {
                        art.image = "/" + art.image;
                        updated = true;
                    }
                    return art;
                });
                if (updated) {
                    saveState();
                }
            }
        } catch (e) {
            console.error("Error parsing localStorage artworks, resetting to defaults", e);
            artworks = [...INITIAL_ARTWORKS];
            saveState();
        }
    } else {
        artworks = [...INITIAL_ARTWORKS];
        saveState();
    }
    renderGallery();
}

function saveState() {
    localStorage.setItem("oreste_artworks", JSON.stringify(artworks));
}

function checkAdminSession() {
    const adminSession = sessionStorage.getItem("oreste_admin_active");
    if (adminSession === "true") {
        setAdminState(true);
    }
}

// ==========================================================================
// Service Worker Registration
// ==========================================================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
                .catch(err => console.error('Error al registrar Service Worker:', err));
        });
    }
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupEventListeners() {
    // Admin Toggle/Access
    adminAccessBtn.addEventListener("click", () => {
        if (isAdmin) {
            openModal(adminPanelModal);
        } else {
            openModal(loginModal);
        }
    });

    logoutBtn.addEventListener("click", () => {
        setAdminState(false);
        showToast("Sesión de administrador cerrada", "info");
    });

    // Modal close triggers
    closeLoginBtn.addEventListener("click", () => closeModal(loginModal));
    closeAdminPanelBtn.addEventListener("click", () => closeModal(adminPanelModal));
    closeLightboxBtn.addEventListener("click", () => closeModal(lightboxModal));

    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
        backdrop.addEventListener("click", (e) => {
            closeModal(loginModal);
            closeModal(adminPanelModal);
            closeModal(lightboxModal);
        });
    });

    // Handle Auth Login Form
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pwd = adminPasswordInput.value;
        if (pwd === "admin123") {
            setAdminState(true);
            closeModal(loginModal);
            loginForm.reset();
            loginErrorMsg.classList.add("hidden");
            showToast("Acceso de administrador concedido", "success");
            
            // Auto open the panel
            setTimeout(() => openModal(adminPanelModal), 300);
        } else {
            loginErrorMsg.classList.remove("hidden");
            adminPasswordInput.focus();
        }
    });

    // Handle Upload Method Tabs (File vs URL)
    uploadTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            uploadTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const targetPaneId = tab.dataset.tab;
            document.querySelectorAll(".upload-tab-pane").forEach(pane => {
                pane.classList.remove("active");
            });
            document.getElementById(`pane-${targetPaneId}`).classList.add("active");
            
            // Clear inputs and previews when switching
            resetUploadInputs();
        });
    });

    // Setup Dropzone & File Input Events
    setupDropzone();

    // Handle Form submission for adding Artwork
    addArtworkForm.addEventListener("submit", handleAddArtwork);

    // Filter Controls
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });

    // Lightbox navigation (desktop side buttons)
    lightboxPrevBtn.addEventListener("click", navigateLightboxPrev);
    lightboxNextBtn.addEventListener("click", navigateLightboxNext);

    // Lightbox navigation (mobile bottom buttons)
    const lightboxMobilePrev = document.getElementById("lightboxMobilePrev");
    const lightboxMobileNext = document.getElementById("lightboxMobileNext");
    const lightboxMobileClose = document.getElementById("lightboxMobileClose");
    if (lightboxMobilePrev) lightboxMobilePrev.addEventListener("click", navigateLightboxPrev);
    if (lightboxMobileNext) lightboxMobileNext.addEventListener("click", navigateLightboxNext);
    if (lightboxMobileClose) lightboxMobileClose.addEventListener("click", () => closeModal(lightboxModal));

    // Touch / Swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;

    lightboxModal.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightboxModal.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                navigateLightboxNext(); // swipe left → siguiente
            } else {
                navigateLightboxPrev(); // swipe right → anterior
            }
        }
    }, { passive: true });

    // Keydown for Modal & Lightbox navigation
    document.addEventListener("keydown", (e) => {
        if (lightboxModal.classList.contains("active")) {
            if (e.key === "Escape") closeModal(lightboxModal);
            if (e.key === "ArrowLeft") navigateLightboxPrev();
            if (e.key === "ArrowRight") navigateLightboxNext();
        }
        if (loginModal.classList.contains("active") && e.key === "Escape") closeModal(loginModal);
        if (adminPanelModal.classList.contains("active") && e.key === "Escape") closeModal(adminPanelModal);
    });

    // PWA Install Prompt handling
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        installPwaBtn.classList.remove("hidden");
    });

    installPwaBtn.addEventListener("click", () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            deferredInstallPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    showToast("¡Gracias por instalar la galería de arte!", "success");
                }
                deferredInstallPrompt = null;
                installPwaBtn.classList.add("hidden");
            });
        }
    });

    // Scroll-to-top button
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add("visible");
            } else {
                scrollToTopBtn.classList.remove("visible");
            }
        }, { passive: true });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Reset preview button
    removePreviewBtn.addEventListener("click", resetUploadInputs);
}

// ==========================================================================
// Admin UI State Helper
// ==========================================================================
function setAdminState(active) {
    isAdmin = active;
    if (active) {
        sessionStorage.setItem("oreste_admin_active", "true");
        adminAccessBtn.innerHTML = `<i class="fa-solid fa-sliders"></i> <span class="btn-text">Panel Admin</span>`;
        adminBadge.classList.remove("hidden");
    } else {
        sessionStorage.removeItem("oreste_admin_active");
        adminAccessBtn.innerHTML = `<i class="fa-solid fa-key"></i> <span class="btn-text">Admin</span>`;
        adminBadge.classList.add("hidden");
    }
    renderGallery();
}

// ==========================================================================
// Render Gallery Grid
// ==========================================================================
function renderGallery() {
    galleryGrid.innerHTML = "";
    
    // Filter artworks
    const filtered = artworks.filter(art => {
        if (currentFilter === "all") return true;
        return art.category === currentFilter;
    });

    if (filtered.length === 0) {
        emptyGalleryState.classList.remove("hidden");
        return;
    } else {
        emptyGalleryState.classList.add("hidden");
    }

    filtered.forEach((art, index) => {
        const card = document.createElement("div");
        card.className = "art-card";
        
        // Find index in main artworks array for lightbox syncing
        const mainIndex = artworks.findIndex(a => a.id === art.id);

        card.innerHTML = `
            <div class="art-image-container">
                <img src="${art.image}" alt="${art.title}" class="art-image" loading="lazy">
                <div class="art-overlay">
                    <button class="btn-view-details"><i class="fa-solid fa-magnifying-glass-plus"></i> Detalles</button>
                </div>
            </div>
            <div class="art-info">
                <div class="art-meta-top">
                    <span class="art-tech-badge">${art.category}</span>
                    <span class="art-year-text">${art.year}</span>
                </div>
                <h3 class="art-title-text">${art.title}</h3>
                <p class="art-desc-text">${art.medium || ''} ${art.size ? `• ${art.size}` : ''}</p>
                ${isAdmin ? `
                    <div class="art-admin-actions">
                        <button class="btn-delete-artwork" data-id="${art.id}">
                            <i class="fa-solid fa-trash-can"></i> Eliminar
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        // Click to view image in Lightbox
        card.querySelector(".art-image-container").addEventListener("click", () => {
            openLightbox(mainIndex);
        });

        // Click to Delete (only if Admin)
        if (isAdmin) {
            card.querySelector(".btn-delete-artwork").addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent opening lightbox
                deleteArtwork(art.id);
            });
        }

        galleryGrid.appendChild(card);
    });
}

// ==========================================================================
// Admin Action: Delete Artwork
// ==========================================================================
function deleteArtwork(id) {
    const art = artworks.find(a => a.id === id);
    if (!art) return;

    if (confirm(`¿Está seguro de que desea eliminar la obra "${art.title}"?`)) {
        artworks = artworks.filter(a => a.id !== id);
        saveState();
        renderGallery();
        showToast("Obra eliminada del catálogo", "info");
    }
}

// ==========================================================================
// Admin Action: Add Artwork & Base64 Converter
// ==========================================================================
function setupDropzone() {
    // Click zone triggers hidden input file select
    imageDropzone.addEventListener("click", () => artFileInput.click());

    // File selection event
    artFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    });

    // Drag-over styling
    imageDropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        imageDropzone.classList.add("dragover");
    });

    imageDropzone.addEventListener("dragleave", () => {
        imageDropzone.classList.remove("dragover");
    });

    // Drop file event
    imageDropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        imageDropzone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    });
}

function handleFileSelect(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast("Por favor seleccione únicamente archivos de imagen.", "error");
        return;
    }

    // Limit base64 storage to 1.5MB to stay within ~5MB localStorage
    if (file.size > 1.5 * 1024 * 1024) {
        showToast("La imagen supera el límite de 1.5MB. Reduzca el tamaño o use una URL.", "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        uploadImageBase64 = e.target.result;
        imagePreview.src = uploadImageBase64;
        imagePreviewContainer.classList.remove("hidden");
        imageDropzone.classList.add("hidden");
    };
    reader.onerror = () => {
        showToast("Error al leer el archivo local.", "error");
    };
    reader.readAsDataURL(file);
}

function resetUploadInputs() {
    artFileInput.value = "";
    artUrlInput.value = "";
    uploadImageBase64 = "";
    imagePreview.src = "";
    imagePreviewContainer.classList.add("hidden");
    imageDropzone.classList.remove("hidden");
}

function handleAddArtwork(e) {
    e.preventDefault();

    const title = document.getElementById("artTitle").value.trim();
    const year = parseInt(document.getElementById("artYear").value);
    const category = document.getElementById("artCategory").value;
    const medium = document.getElementById("artMedium").value.trim();
    const size = document.getElementById("artSize").value.trim();

    // Determine image source
    let finalImageUrl = "";
    const activeTabBtn = document.querySelector(".tab-upload-btn.active");
    const mode = activeTabBtn.dataset.tab;

    if (mode === "upload-file") {
        if (!uploadImageBase64) {
            showToast("Seleccione o arrastre una imagen local.", "error");
            return;
        }
        finalImageUrl = uploadImageBase64;
    } else {
        const urlValue = artUrlInput.value.trim();
        if (!urlValue) {
            showToast("Ingrese una URL de imagen válida.", "error");
            return;
        }
        finalImageUrl = urlValue;
    }

    const author = document.getElementById("artAuthor") ? document.getElementById("artAuthor").value.trim() : "";
    const description = document.getElementById("artDescription") ? document.getElementById("artDescription").value.trim() : "";

    // Create new artwork object
    const newArt = {
        id: `artwork-${Date.now()}`,
        title,
        year,
        category,
        medium,
        size,
        author,
        description,
        image: finalImageUrl
    };

    // Store state
    artworks.unshift(newArt); // Add to beginning of catalog
    saveState();
    renderGallery();

    // Reset and Close
    addArtworkForm.reset();
    resetUploadInputs();
    closeModal(adminPanelModal);
    showToast(`"${title}" añadida con éxito`, "success");
}

// ==========================================================================
// Lightbox Viewer Logic
// ==========================================================================
function openLightbox(index) {
    if (index < 0 || index >= artworks.length) return;
    activeLightboxIndex = index;
    
    const art = artworks[index];
    
    lightboxImage.src = art.image;
    lightboxTitle.textContent = art.title;
    lightboxYear.textContent = art.year;
    lightboxCategory.textContent = art.category.toUpperCase();
    lightboxMedium.innerHTML = art.medium ? `<i class="fa-solid fa-palette"></i> ${art.medium}` : '';
    lightboxSize.innerHTML = art.size ? `<i class="fa-solid fa-ruler-combined"></i> ${art.size}` : '';

    // Tribute/Homenaje field
    const lightboxTribute = document.getElementById("lightboxTribute");
    const lightboxTributeBlock = document.getElementById("lightboxTributeBlock");
    if (lightboxTribute) {
        if (art.tribute) {
            lightboxTribute.innerHTML = `<i class="fa-solid fa-star"></i> Homenaje a: <em>${art.tribute}</em>`;
            lightboxTributeBlock.style.display = "";
        } else {
            lightboxTribute.innerHTML = "";
            lightboxTributeBlock.style.display = "none";
        }
    }

    // Author field
    const lightboxAuthor = document.getElementById("lightboxAuthor");
    if (lightboxAuthor) {
        if (art.author) {
            lightboxAuthor.innerHTML = `<i class="fa-solid fa-user-pen"></i> ${art.author}`;
            lightboxAuthor.style.display = "";
        } else {
            lightboxAuthor.innerHTML = "";
            lightboxAuthor.style.display = "none";
        }
    }

    // Date field
    const lightboxDate = document.getElementById("lightboxDate");
    if (lightboxDate) {
        if (art.date) {
            lightboxDate.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${art.date}`;
            lightboxDate.style.display = "";
        } else {
            lightboxDate.innerHTML = "";
            lightboxDate.style.display = "none";
        }
    }

    // Description field
    const lightboxDescription = document.getElementById("lightboxDescription");
    if (lightboxDescription) {
        if (art.description) {
            lightboxDescription.textContent = art.description;
            lightboxDescription.parentElement.style.display = "";
        } else {
            lightboxDescription.textContent = "";
            lightboxDescription.parentElement.style.display = "none";
        }
    }

    // Origin/Collection field
    const lightboxOrigin = document.getElementById("lightboxOrigin");
    if (lightboxOrigin) {
        if (art.origin) {
            lightboxOrigin.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${art.origin}`;
            lightboxOrigin.style.display = "";
        } else {
            lightboxOrigin.innerHTML = "";
            lightboxOrigin.style.display = "none";
        }
    }

    openModal(lightboxModal);
}

function navigateLightboxPrev() {
    if (activeLightboxIndex > 0) {
        openLightbox(activeLightboxIndex - 1);
    } else {
        openLightbox(artworks.length - 1); // Loop to end
    }
}

function navigateLightboxNext() {
    if (activeLightboxIndex < artworks.length - 1) {
        openLightbox(activeLightboxIndex + 1);
    } else {
        openLightbox(0); // Loop to start
    }
}

// ==========================================================================
// Modal Window Helpers
// ==========================================================================
function openModal(modal) {
    modal.classList.add("active");
    if (modal.classList.contains("lightbox")) {
        // El lightbox necesita scroll propio — no bloqueamos el body scroll
        document.body.classList.add("lightbox-open");
    } else {
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modal) {
    modal.classList.remove("active");
    document.body.classList.remove("lightbox-open");
    document.body.style.overflow = "";
    // Volver al tope del lightbox para la próxima vez
    if (modal.classList.contains("lightbox")) {
        modal.scrollTop = 0;
    }
}

// ==========================================================================
// Custom Notifications Toast System
// ==========================================================================
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fa-solid fa-circle-info"></i>';
    if (type === "success") {
        icon = '<i class="fa-solid fa-circle-check"></i>';
    } else if (type === "error") {
        icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    }
    
    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto slide-out and remove
    setTimeout(() => {
        toast.style.animation = "toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}
