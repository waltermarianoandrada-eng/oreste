// ==========================================================================
// Oreste Comello Art Gallery - App Logic
// ==========================================================================

// Initial Mock Artworks (displayed if localStorage is empty)
const INITIAL_ARTWORKS = [
    {
        id: "artwork-playa",
        title: "Caminata al Atardecer",
        year: 2026,
        category: "oleo",
        medium: "Óleo sobre lienzo",
        size: "80 x 60 cm",
        image: "/obra-playa.jpg"
    },
    {
        id: "artwork-soldado",
        title: "Retrato del General",
        year: 2025,
        category: "dibujo",
        medium: "Óleo monocromático sobre lienzo",
        size: "70 x 50 cm",
        image: "/obra-soldado.jpg"
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
                // Corrección dinámica de rutas para Vite
                let updated = false;
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

    // Lightbox navigation
    lightboxPrevBtn.addEventListener("click", navigateLightboxPrev);
    lightboxNextBtn.addEventListener("click", navigateLightboxNext);

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

    // Create new artwork object
    const newArt = {
        id: `artwork-${Date.now()}`,
        title,
        year,
        category,
        medium,
        size,
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
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable background scroll
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
