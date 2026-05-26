package com.looteria.controller;

import com.looteria.dto.ListingDetailDTO;
import com.looteria.dto.ReviewDTO;
import com.looteria.entity.User;
import com.looteria.service.ListingAdminService;
import com.looteria.service.PointsService;
import com.looteria.service.ReviewService;
import com.looteria.service.UserService;
import com.looteria.entity.ListingPost;
import com.looteria.repository.ListingPostRepository;
import com.looteria.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/perfil")
public class ProfileController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ListingAdminService listingAdminService;
    
    @Autowired
    private ListingPostRepository listingPostRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private PointsService pointsService;
    
    /**
     * GET /perfil/datos/{userId} - Obtener datos del perfil del usuario
     */
    @GetMapping("/datos/{userId}")
    public ResponseEntity<Map<String, Object>> getProfileData(@PathVariable Long userId) {
        try {
            User usuario = userService.getUserById(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("idUsuario", usuario.getIdUsuario());
            response.put("email", usuario.getEmail());
            response.put("nombreUsuario", usuario.getNombreUsuario());
            response.put("ubicacion", usuario.getUbicacion());
            response.put("rol", usuario.getRol().toString());
            response.put("puntosAcumulados", usuario.getPuntosAcumulados());
            response.put("reputacionMedia", usuario.getReputacionMedia());
            response.put("verificadoIdentidad", usuario.getVerificadoIdentidad());
            response.put("fechaRegistro", usuario.getFechaRegistro());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    /**
     * PUT /perfil/actualizar/{userId} - Actualizar perfil del usuario
     */
    @PutMapping("/actualizar/{userId}")
    public ResponseEntity<Map<String, Object>> updateProfile(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            User usuario = userService.getUserById(userId);
            
            if (request.containsKey("nombreUsuario") && !request.get("nombreUsuario").isEmpty()) {
                usuario.setNombreUsuario(request.get("nombreUsuario"));
            }
            if (request.containsKey("ubicacion") && !request.get("ubicacion").isEmpty()) {
                usuario.setUbicacion(request.get("ubicacion"));
            }
            
            User updated = userService.updateUser(usuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "ÉXITO");
            response.put("mensaje", "Perfil actualizado correctamente");
            response.put("idUsuario", updated.getIdUsuario());
            response.put("nombreUsuario", updated.getNombreUsuario());
            response.put("ubicacion", updated.getUbicacion());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * GET /perfil/mis-publicaciones/{userId} - Obtener publicaciones del usuario
     */
    @GetMapping("/mis-publicaciones/{userId}")
    public ResponseEntity<List<ListingDetailDTO>> getUserListings(@PathVariable Long userId) {
        try {
            List<ListingDetailDTO> listings = listingAdminService.getListingsByUserId(userId);
            return ResponseEntity.ok(listings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    /**
     * DELETE /perfil/publicaciones/{listingId} - Eliminar publicación del usuario
     */
    @DeleteMapping("/publicaciones/{listingId}")
    public ResponseEntity<Map<String, Object>> deleteListing(@PathVariable Long listingId) {
        try {
            listingAdminService.deleteListing(listingId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "ÉXITO");
            response.put("mensaje", "Publicación eliminada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * POST /perfil/canjear-puntos - Canjear puntos por un beneficio
     */
    @PostMapping("/canjear-puntos")
    public ResponseEntity<Map<String, Object>> canjearPuntos(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String tipoCanje = request.get("tipoCanje").toString();
            Map<String, Object> result = pointsService.canjearPuntos(userId, tipoCanje);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * GET /perfil/resenas-recibidas/{userId} - Reseñas recibidas por el usuario
     */
    @GetMapping("/resenas-recibidas/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReceivedReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReceivedReviews(userId));
    }

    /**
     * PUT /perfil/publicaciones/{listingId} - Actualizar estado de publicación
     */
    @Transactional
    @PutMapping("/publicaciones/{listingId}")
    public ResponseEntity<?> updateListing(@PathVariable Long listingId, @RequestBody Map<String, String> request) {
        try {
            Optional<ListingPost> optListing = listingPostRepository.findById(listingId);
            if (optListing.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("status", "ERROR");
                error.put("message", "Publicación no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            ListingPost listing = optListing.get();

            if (request.containsKey("titulo") && request.get("titulo") != null && !request.get("titulo").isEmpty()) {
                listing.setTitulo(request.get("titulo"));
            }
            if (request.containsKey("descripcionEstado")) {
                listing.setDescripcionEstado(request.get("descripcionEstado"));
            }
            if (request.containsKey("precio") && request.get("precio") != null && !request.get("precio").isEmpty()) {
                listing.setPrecio(new java.math.BigDecimal(request.get("precio")));
            }
            if (request.containsKey("tipoTransaccion") && request.get("tipoTransaccion") != null && !request.get("tipoTransaccion").isEmpty()) {
                listing.setTipoTransaccion(
                    com.looteria.entity.ListingPost.TransactionType.valueOf(request.get("tipoTransaccion"))
                );
            }
            if (request.containsKey("estadoArticulo") && request.get("estadoArticulo") != null && !request.get("estadoArticulo").isEmpty()) {
                categoryRepository.findFirstByNombreAndTipo(request.get("estadoArticulo"), "ESTADO_ARTICULO")
                        .ifPresent(listing::setEstadoArticulo);
            }
            if (request.containsKey("idioma") && request.get("idioma") != null && !request.get("idioma").isEmpty()) {
                categoryRepository.findFirstByNombreAndTipo(request.get("idioma"), "IDIOMA")
                        .ifPresent(listing::setIdioma);
            }
            if (request.containsKey("region") && request.get("region") != null && !request.get("region").isEmpty()) {
                categoryRepository.findFirstByNombreAndTipo(request.get("region"), "REGION")
                        .ifPresent(listing::setRegion);
            }
            if (request.containsKey("estadoPublicacion") && request.get("estadoPublicacion") != null && !request.get("estadoPublicacion").isEmpty()) {
                listing.setEstadoPublicacion(
                    com.looteria.entity.ListingPost.PublicationStatus.valueOf(request.get("estadoPublicacion"))
                );
            }
            
            listingPostRepository.save(listing);
            ListingDetailDTO updatedDTO = listingAdminService.getListingById(listing.getIdPublicacion());
            return ResponseEntity.ok(updatedDTO);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
